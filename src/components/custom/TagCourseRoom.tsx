import { Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export interface TagCourseRoomProps {
  rooms?: string;
}

export const TagCourseRoom = ({ rooms }: TagCourseRoomProps) => {
  {
    const { t } = useTranslation();
    const { theme } = useTheme();
    return (
      <Text
        className="px-2 rounded-md text-base ml-4 text-center w-fit"
        style={{
          backgroundColor: theme.primary,
          color: theme.background,
        }}
        ellipsizeMode="tail"
      >
        {rooms ?? t('services.notProvided')}
      </Text>
    );
  }
};
