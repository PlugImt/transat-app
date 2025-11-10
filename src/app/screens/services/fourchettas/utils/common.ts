export const phoneWithoutSpaces = (phoneNumber: string | undefined) => {
  return phoneNumber?.replace(/\s/g, "") || "";
};
