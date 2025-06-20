import { Course } from '@/types/emploiDuTemps';
import { Text, View } from 'react-native';
import TagSalleCours from '@/components/custom/TagSalleCours';
import { useTheme } from '@/contexts/ThemeContext';

export function Cours(props: { course: Course }) {
  const { theme } = useTheme();
  return (
    <View
      style={{ backgroundColor: theme.card, borderColor: theme.text }}
      className="flex-col justify-center items-center rounded-br-xl rounded-tr-2xl p-1 border-l-2 h-full">
      <Text style={{ color: theme.text }} className="font-bold">
        {props.course.titre}
      </Text>
      <View className="flex-row gap-1">
        <Text style={{ color: theme.text }}>
          {props.course.heure_debut} - {props.course.heure_fin}
        </Text>
        <TagSalleCours salles={props.course.salles} />
      </View>
      <Text style={{ color: theme.text }}>{props.course.profs}</Text>
    </View>
  );
}