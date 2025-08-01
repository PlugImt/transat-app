import { useTranslation } from "react-i18next";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

export interface TagCourseRoomProps {
  rooms?: string;
}

export const TagCourseRoom = ({ rooms }: TagCourseRoomProps) => {
  {
    const { t } = useTranslation();
    const { theme } = useTheme();
    return (
      <Text
        className="px-2 rounded-md ml-4 text-center w-fit"
        style={{
          backgroundColor: theme.primary,
          color: theme.background,
        }}
      >
        {rooms ?? t("services.notProvided")}
      </Text>
    );
  }
};
