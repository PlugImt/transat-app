import { Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export interface TagSalleCoursProps {
  salles?: string;
}

export function TagSalleCours({salles} : TagSalleCoursProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  return (
    <View>
      <Text
        className="px-2 rounded-md text-base ml-4 text-center w-fit"
        style={{
          backgroundColor: theme.primary,
          color: theme.background,
        }}
        ellipsizeMode="tail"
      >
        {salles ?? t("services.emploiDuTemps.title")}
      </Text>
    </View>
  );
}

export default TagSalleCours;