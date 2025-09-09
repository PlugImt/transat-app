import { useNavigation } from "@react-navigation/native";
import { CheckCircle, Circle } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { Homework } from "@/dto";
import { useHomeworkDate } from "@/hooks/services/homework";
import type { BottomTabNavigation } from "@/types/navigation";

interface Props {
  homework: Homework;
}

export default function HomeworkCard({ homework }: Props) {
  const { theme } = useTheme();
  const { formatDeadline, getDeadlineStatus } = useHomeworkDate();
  const navigation = useNavigation<BottomTabNavigation>();
  const [isDone, setIsDone] = useState(homework.done);

  const toggleDone = () => {
    setIsDone(!isDone);
  };

  const deadline = formatDeadline(new Date(homework.deadline));
  const deadlineStatus = getDeadlineStatus(new Date(homework.deadline));

  const now = new Date();
  const _isLate = !homework.done && new Date(homework.deadline) < now;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("HomeworkDetails", { homework })}
      activeOpacity={0.8}
    >
      <View
        className="flex-row rounded-xl overflow-hidden"
        style={{ backgroundColor: theme.card }}
      >
        <View
          style={{
            width: 4,
            backgroundColor: theme.text,
          }}
        />
        <View className="flex-1 p-4 gap-2">
          <View className="flex-row justify-between items-center">
            <Text className="font-semibold flex-1">
              {homework.course_name} — {homework.title}
            </Text>

            <TouchableOpacity
              onPress={toggleDone}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View className="px-2 py-1 rounded-full flex items-center justify-center">
                {isDone ? (
                  <CheckCircle color={theme.primary} size={22} />
                ) : (
                  <Circle color={theme.text} size={22} />
                )}
              </View>
            </TouchableOpacity>
          </View>

          <Text className="text-sm" style={{ color: theme.text }}>
            {homework.description}
          </Text>

          <View className="flex flex-row justify-between items-center mt-2">
            <Text className="text-sm italic" style={{ color: theme.primary }}>
              📅 {deadline}
            </Text>
            {deadlineStatus.isOverdue && (
              <Text className="text-sm font-bold text-red-500">
                ⚠️ {deadlineStatus.text}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
