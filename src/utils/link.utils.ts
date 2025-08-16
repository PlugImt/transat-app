import { useTranslation } from "react-i18next";

const { t } = useTranslation();

export const linkToDomain = (link: string): string => {
  return (
    link
      .replace(/^(?:https?:\/\/)?(?:www\.)?/, "")
      .split("/")[0]
      .split(".")[0]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || String(t("common.link"))
  );
};
