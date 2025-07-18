import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { CheckCircle, Circle } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { Homework } from "@/dto";
import type { AppStackParamList } from "@/types";

interface Props {
  homework: Homework;
}

export default function HomeworkCard({ homework }: Props) {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const [isDone, setIsDone] = useState(homework.done);

  const toggleDone = () => {
    setIsDone(!isDone);
  };

  const locale = i18n.language === "fr" ? fr : enUS;
  const deadline = format(new Date(homework.deadline), "PPP '—' p", {
    locale,
  });

  const now = new Date();
  const isLate = !homework.done && new Date(homework.deadline) < now;

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
              📅 Deadline : {deadline}
            </Text>
            {isLate && (
              <Text className="text-sm font-bold text-red-500">
                ⚠️ {t("services.homework.shortLate")}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
