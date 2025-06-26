import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { AppStackParamList } from "@/services/storage/types";
import type { Homework } from "@/types/homework";

interface Props {
  homework: Homework;
}

export default function HomeworkCard({ homework }: Props) {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

  const locale = i18n.language === "fr" ? fr : enUS;
  const deadline = format(new Date(homework.deadline), "PPP '—' p", {
    locale,
  });

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("HomeworkDetails", { homework })}
      activeOpacity={0.8}
    >
      <View
        className="flex-row rounded-xl overflow-hidden"
        style={{ backgroundColor: theme.card }}
      >
        {/* Petite barre blanche à gauche, dans la card */}
        <View style={{ width: 4, backgroundColor: theme.text }} />

        {/* Contenu principal de la card */}
        <View className="flex-1 p-4 gap-2">
          <Text
            className="text-base font-semibold"
            style={{ color: theme.text }}
          >
            {homework.course_name} — {homework.title}
          </Text>

          <Text className="text-sm" style={{ color: theme.text }}>
            {homework.description}
          </Text>

          <View className="flex flex-row justify-between items-center mt-2">
            <Text className="text-xs italic" style={{ color: theme.primary }}>
              📅 Deadline : {deadline}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
