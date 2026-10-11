import { Check, LayoutGrid } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/components/common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import { LAYOUT_LEVELS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import { usePhotoLayout } from "@/hooks/services/photos/usePhotoLayout";

/** Page header action that picks the grid density without pinching. */
export const PhotoLayoutMenu = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { level, setLevel } = usePhotoLayout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton
          icon={<LayoutGrid size={20} color={theme.text} />}
          variant="link"
          accessibilityLabel={t("photos.layout.title")}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {LAYOUT_LEVELS.map((option) => (
          <DropdownMenuItem
            key={option}
            label={t(`photos.layout.${option}`)}
            icon={
              option === level ? (
                <Check size={16} color={theme.primary} />
              ) : undefined
            }
            onPress={() => setLevel(option)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
