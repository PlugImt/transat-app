import UserNotifications

/// Attaches the image of a push notification (`richContent.image`) before it is shown.
///
/// The image is a bonus: whatever goes wrong (no link, not https, slow or failed download, too large, a format
/// iOS cannot show), the notification is delivered as the text it already is. The download is bounded in
/// size and time and stops as soon as it is known to exceed the limit.
class NotificationService: UNNotificationServiceExtension, URLSessionDownloadDelegate {
  /// Larger images are not downloaded; iOS itself refuses attachments above 10 MB.
  static let maxImageBytes: Int64 = 5 * 1024 * 1024
  /// The system gives an extension about 30 seconds in all.
  static let requestTimeout: TimeInterval = 20

  /// Where the download goes through; the tests replace it to serve canned responses.
  static var makeConfiguration: () -> URLSessionConfiguration = { .ephemeral }

  /// Formats UNNotificationAttachment can display, by the type the server announces.
  private static let fileExtensions = [
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
  ]

  private let state = DispatchQueue(label: "notification-service.state")
  private var contentHandler: ((UNNotificationContent) -> Void)?
  private var original: UNNotificationContent?
  private var bestAttempt: UNMutableNotificationContent?
  private var session: URLSession?
  private var finished = false

  override func didReceive(
    _ request: UNNotificationRequest,
    withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void
  ) {
    self.contentHandler = contentHandler
    original = request.content
    bestAttempt = request.content.mutableCopy() as? UNMutableNotificationContent

    guard let url = NotificationService.imageURL(in: request.content.userInfo) else {
      finish()
      return
    }

    let configuration = NotificationService.makeConfiguration()
    configuration.timeoutIntervalForRequest = NotificationService.requestTimeout
    configuration.timeoutIntervalForResource = NotificationService.requestTimeout
    let session = URLSession(configuration: configuration, delegate: self, delegateQueue: nil)
    state.sync { self.session = session }
    session.downloadTask(with: url).resume()
  }

  /// The system is about to stop the extension: deliver what there is.
  override func serviceExtensionTimeWillExpire() {
    finish()
  }

  // MARK: Payload

  /// Expo puts the data of the push under `body`, and sends the image as `richContent` next to it or inside it
  /// (as `_richContent`). Only an https link is followed.
  static func imageURL(in userInfo: [AnyHashable: Any]) -> URL? {
    var containers: [[AnyHashable: Any]] = [userInfo]
    if let body = userInfo["body"] as? [AnyHashable: Any] {
      containers.append(body)
    }
    for container in containers {
      for key in ["richContent", "_richContent"] {
        guard
          let rich = container[key] as? [String: Any],
          let link = rich["image"] as? String,
          let url = URL(string: link),
          url.scheme?.lowercased() == "https",
          url.host != nil
        else { continue }
        return url
      }
    }
    return nil
  }

  // MARK: Download

  func urlSession(
    _ session: URLSession,
    downloadTask: URLSessionDownloadTask,
    didWriteData bytesWritten: Int64,
    totalBytesWritten: Int64,
    totalBytesExpectedToWrite: Int64
  ) {
    // The size is known from the headers before the body is fetched, and checked again as it arrives.
    let announced = totalBytesExpectedToWrite > 0 ? totalBytesExpectedToWrite : 0
    if max(announced, totalBytesWritten) > NotificationService.maxImageBytes {
      downloadTask.cancel()
    }
  }

  func urlSession(
    _ session: URLSession,
    downloadTask: URLSessionDownloadTask,
    didFinishDownloadingTo location: URL
  ) {
    defer { finish() }

    guard
      let response = downloadTask.response as? HTTPURLResponse,
      (200..<300).contains(response.statusCode),
      let mime = response.mimeType?.lowercased(),
      let fileExtension = NotificationService.fileExtensions[mime]
    else { return }

    let attributes = try? FileManager.default.attributesOfItem(atPath: location.path)
    let size = (attributes?[.size] as? NSNumber)?.int64Value ?? 0
    guard size > 0, size <= NotificationService.maxImageBytes else { return }

    // The system needs the file extension to recognise the format, and takes the file over once attached.
    let target = URL(fileURLWithPath: NSTemporaryDirectory())
      .appendingPathComponent(UUID().uuidString)
      .appendingPathExtension(fileExtension)
    do {
      try FileManager.default.moveItem(at: location, to: target)
      let attachment = try UNNotificationAttachment(identifier: "image", url: target, options: nil)
      state.sync { bestAttempt?.attachments = [attachment] }
    } catch {
      // Leave the text notification as it is.
    }
  }

  func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
    if error != nil { finish() }
  }

  // MARK: Delivery

  /// Hands the notification to the system exactly once, with or without the image.
  private func finish() {
    state.sync {
      guard !finished else { return }
      finished = true
      session?.invalidateAndCancel()
      session = nil
      if let content = bestAttempt ?? original {
        contentHandler?(content)
      }
    }
  }
}
