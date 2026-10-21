import { Check, EllipsisVertical, SquareCheck } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { IconButton } from "@/components/common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import { Text } from "@/components/common/Text";
import { LAYOUT_LEVELS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import { usePhotoLayout } from "@/hooks/services/photos/usePhotoLayout";
import type { PhotoSelectionStore } from "@/hooks/services/photos/usePhotoSelection";

/** Page header actions of the photo views: start selecting (otherwise only a long press does) and the grid density. */
export const PhotoMenu = ({
  selection,
}: {
  selection: PhotoSelectionStore;
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { level, setLevel } = usePhotoLayout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton
          icon={<EllipsisVertical size={20} color={theme.text} />}
          variant="link"
          accessibilityLabel={t("photos.menu.title")}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          label={t("photos.selection.select")}
          icon={<SquareCheck size={16} color={theme.text} />}
          onPress={() => selection.enter()}
        />
        <View className="h-px" style={{ backgroundColor: theme.border }} />
        <Text variant="sm" color="muted" className="px-4 pb-1 pt-3">
          {t("photos.layout.title")}
        </Text>
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
