import { View } from "react-native";
import { TagCourseRoom } from "@/app/screens/services/schedule/components/TagCourseRoom";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { Course } from "@/dto";

interface CoursProps {
  course: Course;
  isOver: boolean;
}

export const Cours = ({ course, isOver }: CoursProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={{ backgroundColor: theme.card, borderColor: theme.text }}
      className={`
        flex-col justify-center items-center rounded-br-xl rounded-tr-2xl p-1 border-l-2 h-full 
        ${isOver ? "opacity-60" : ""}
      `}
    >
      <Text className="font-bold">{course.title}</Text>
      <View className="flex-row gap-1">
        <Text>
          {course.start_time} - {course.end_time}
        </Text>
        <TagCourseRoom rooms={course.room} />
      </View>
      <Text className="text-center">{course.teacher}</Text>
    </View>
  );
};
