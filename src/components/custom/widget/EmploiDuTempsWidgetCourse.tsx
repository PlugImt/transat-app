import { useTheme } from "@/contexts/ThemeContext";
import type { Course } from "@/types/emploiDuTemps";
import { Text, View } from "react-native";

export function EmploiDuTempsWidgetCourse({ course }: { course: Course }) {
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
        {course.titre}
      </Text>
      <View className="flex flex-row items-center gap-2">
        <Text
          className="text-sm ml-4"
          style={{ color: theme.text }}
          ellipsizeMode="tail"
        >
          {course.heure_debut} - {course.heure_fin}
        </Text>
        <View>
          <Text
            className="pl-1 pr-1 rounded-md text-base ml-4"
            style={{
              backgroundColor: theme.primary,
              color: theme.background,
            }}
            ellipsizeMode="tail"
          >
            {course.salles}
          </Text>
        </View>
      </View>
    </View>
  );
}
