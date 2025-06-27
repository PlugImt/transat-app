import { Course } from '@/types/timetable';
import { Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { TagCourseRoom } from '@/components/custom/TagCourseRoom';

export function Cours(props: { course: Course, isOver: boolean }) {
  const { theme } = useTheme();
  return (
    <View
      style={{ backgroundColor: theme.card, borderColor: theme.text }}
      className={`flex-col justify-center items-center rounded-br-xl rounded-tr-2xl p-1 border-l-2 h-full ${props.isOver ? 'opacity-60' : ''}`}>
      <Text style={{ color: theme.text }} className="font-bold">
        {props.course.title}
      </Text>
      <View className="flex-row gap-1">
        <Text style={{ color: theme.text }}>
          {props.course.start_time} - {props.course.end_time}
        </Text>
        <TagCourseRoom rooms={props.course.room} />
      </View>
      <Text style={{ color: theme.text }} className="text-center">{props.course.teacher}</Text>
    </View>
  );
}