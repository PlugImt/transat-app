import { Image as ExpoImage } from "expo-image";
import { ImageOff } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2.5;
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 900;

type ZoomableImageProps = {
  photoId: string;
  width: number;
  height: number;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  fallbackUrl: string | null;
  /** Sharper rendition, requested only once the user has zoomed in. */
  hiResUrl: string | null;
  /** Only the page being looked at keeps its zoom; neighbours reset. */
  active: boolean;
  /** 1 when the viewer is fully opaque, down to 0 while dragging it away. */
  backdrop: SharedValue<number>;
  onZoomChange: (photoId: string, zoomed: boolean) => void;
  onTap: () => void;
  onDismiss: () => void;
};

const clampTranslation = (t: number, scale: number, size: number) => {
  "worklet";
  const max = Math.max(0, (size * scale - size) / 2);
  return Math.min(max, Math.max(-max, t));
};

export const ZoomableImage = ({
  photoId,
  width,
  height,
  thumbnailUrl,
  previewUrl,
  fallbackUrl,
  hiResUrl,
  active,
  backdrop,
  onZoomChange,
  onTap,
  onDismiss,
}: ZoomableImageProps) => {
  const [zoomed, setZoomed] = useState(false);
  const [failed, setFailed] = useState<0 | 1 | 2>(0);

  const scale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const dragY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const updateZoom = useCallback(
    (value: boolean) => {
      setZoomed(value);
      onZoomChange(photoId, value);
    },
    [photoId, onZoomChange],
  );

  useEffect(() => {
    if (active) return;
    scale.value = withTiming(1);
    tx.value = withTiming(0);
    ty.value = withTiming(0);
    setZoomed(false);
  }, [active, scale, tx, ty]);

  const gesture = useMemo(() => {
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .maxDuration(260)
      .onEnd((e, success) => {
        if (!success) return;
        if (scale.value > 1.05) {
          scale.value = withTiming(1);
          tx.value = withTiming(0);
          ty.value = withTiming(0);
          runOnJS(updateZoom)(false);
          return;
        }
        // Zoom around the tapped point.
        const fx = e.x - width / 2;
        const fy = e.y - height / 2;
        const ratio = DOUBLE_TAP_SCALE / scale.value;
        scale.value = withTiming(DOUBLE_TAP_SCALE);
        tx.value = withTiming(
          clampTranslation(
            fx - (fx - tx.value) * ratio,
            DOUBLE_TAP_SCALE,
            width,
          ),
        );
        ty.value = withTiming(
          clampTranslation(
            fy - (fy - ty.value) * ratio,
            DOUBLE_TAP_SCALE,
            height,
          ),
        );
        runOnJS(updateZoom)(true);
      });

    const singleTap = Gesture.Tap()
      .numberOfTaps(1)
      .maxDuration(260)
      .onEnd((_e, success) => {
        if (success) runOnJS(onTap)();
      });

    const pinch = Gesture.Pinch()
      .onStart((e) => {
        savedScale.value = scale.value;
        savedTx.value = tx.value;
        savedTy.value = ty.value;
        focalX.value = e.focalX - width / 2;
        focalY.value = e.focalY - height / 2;
      })
      .onUpdate((e) => {
        const next = Math.min(
          MAX_SCALE * 1.2,
          Math.max(0.8, savedScale.value * e.scale),
        );
        const ratio = next / savedScale.value;
        scale.value = next;
        // Keep the pinched point under the fingers.
        tx.value = focalX.value - (focalX.value - savedTx.value) * ratio;
        ty.value = focalY.value - (focalY.value - savedTy.value) * ratio;
      })
      .onEnd(() => {
        const settled = Math.min(MAX_SCALE, Math.max(1, scale.value));
        if (settled <= 1.02) {
          scale.value = withSpring(1);
          tx.value = withSpring(0);
          ty.value = withSpring(0);
          runOnJS(updateZoom)(false);
          return;
        }
        scale.value = withSpring(settled);
        tx.value = withSpring(clampTranslation(tx.value, settled, width));
        ty.value = withSpring(clampTranslation(ty.value, settled, height));
        runOnJS(updateZoom)(true);
      });

    // Moves the zoomed image. Off while at 1x so horizontal swipes reach the pager.
    const move = Gesture.Pan()
      .enabled(zoomed)
      .maxPointers(1)
      .onStart(() => {
        savedTx.value = tx.value;
        savedTy.value = ty.value;
      })
      .onUpdate((e) => {
        tx.value = clampTranslation(
          savedTx.value + e.translationX,
          scale.value,
          width,
        );
        ty.value = clampTranslation(
          savedTy.value + e.translationY,
          scale.value,
          height,
        );
      })
      .onEnd((e) => {
        const maxX = Math.max(0, (width * scale.value - width) / 2);
        const maxY = Math.max(0, (height * scale.value - height) / 2);
        tx.value = withDecay({ velocity: e.velocityX, clamp: [-maxX, maxX] });
        ty.value = withDecay({ velocity: e.velocityY, clamp: [-maxY, maxY] });
      });

    // Vertical drag at 1x closes the viewer. Fails on horizontal movement so the pager keeps swiping.
    const dismiss = Gesture.Pan()
      .enabled(!zoomed)
      .maxPointers(1)
      .activeOffsetY([-12, 12])
      .failOffsetX([-12, 12])
      .onUpdate((e) => {
        dragY.value = e.translationY;
        backdrop.value =
          1 - Math.min(1, Math.abs(e.translationY) / (height * 0.45));
      })
      .onEnd((e) => {
        const far = Math.abs(e.translationY) > DISMISS_DISTANCE;
        const fast = Math.abs(e.velocityY) > DISMISS_VELOCITY;
        if (far || fast) {
          const direction = e.translationY >= 0 ? 1 : -1;
          dragY.value = withTiming(
            direction * height,
            { duration: 180 },
            (done) => {
              if (done) runOnJS(onDismiss)();
            },
          );
          backdrop.value = withTiming(0, { duration: 180 });
        } else {
          dragY.value = withSpring(0);
          backdrop.value = withTiming(1);
        }
      });

    return Gesture.Simultaneous(
      Gesture.Exclusive(doubleTap, singleTap),
      pinch,
      move,
      dismiss,
    );
  }, [
    width,
    height,
    zoomed,
    scale,
    tx,
    ty,
    dragY,
    savedScale,
    savedTx,
    savedTy,
    focalX,
    focalY,
    backdrop,
    updateZoom,
    onTap,
    onDismiss,
  ]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value + dragY.value },
      {
        scale:
          scale.value *
          (1 - Math.min(0.15, Math.abs(dragY.value) / (height * 3))),
      },
    ],
  }));

  const uri =
    failed === 0
      ? zoomed && hiResUrl
        ? hiResUrl
        : previewUrl
      : failed === 1
        ? fallbackUrl
        : null;

  if (!uri) {
    return (
      <Pressable
        onPress={() => setFailed(0)}
        accessibilityRole="button"
        style={{
          width,
          height,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageOff size={48} color="#ffffff99" />
      </Pressable>
    );
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ width, height }, imageStyle]}>
        <ExpoImage
          source={{ uri }}
          // The grid thumbnail is already cached: it shows instantly while the sharper image streams in.
          placeholder={
            thumbnailUrl
              ? {
                  uri:
                    failed === 0 && zoomed && previewUrl
                      ? previewUrl
                      : thumbnailUrl,
                }
              : undefined
          }
          placeholderContentFit="contain"
          style={{ width, height }}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
          transition={220}
          onError={() => setFailed((f) => (f === 0 ? 1 : 2))}
        />
      </Animated.View>
    </GestureDetector>
  );
};
