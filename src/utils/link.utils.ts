import type { TFunction } from "i18next";

export const linkToDomain = (link: string, t: TFunction) => {
  return (
    link
      .replace(/^(?:https?:\/\/)?(?:www\.)?/, "")
      .split("/")[0]
      .split(".")[0]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || String(t("common.link"))
  );
};
