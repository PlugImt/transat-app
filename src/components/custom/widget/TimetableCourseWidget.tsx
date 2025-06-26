import { useTheme } from '@/contexts/ThemeContext';
import type { Course } from '@/types/Timetable';
import { Text, View } from 'react-native';
import { TagCourseRoom } from '@/components/custom/TagCourseRoom';

export const TimetableCourseWidget = ({ course }: { course: Course }) => {
  const { theme } = useTheme();

  return (
    <View
      className="flex flex-col rounded-lg gap-1.5 py-2"
      style={{ backgroundColor: theme.card }}
    >
      <Text
        className="text-base ml-4"
        style={{ color: theme.text }}
        ellipsizeMode="tail"
      >
        {course.title}
      </Text>
      <View className="flex flex-row items-center gap-2">
        <Text
          className="text-sm ml-4"
          style={{ color: theme.text }}
          ellipsizeMode="tail"
        >
          {course.start_time} - {course.end_time}
        </Text>
        <TagCourseRoom rooms={course.room} />
      </View>
    </View>
  );
};
