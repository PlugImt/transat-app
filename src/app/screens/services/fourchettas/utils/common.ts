export const phoneWithoutSpaces = (phoneNumber: string | undefined) => {
    if (phoneNumber) {
      return phoneNumber.replace(/\s/g, "");
    }
    return "";
  }