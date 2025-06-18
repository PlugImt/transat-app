import { Course } from '@/types/emploiDuTemps';
import { Text, View } from 'react-native';
import TagSalleCours from '@/components/custom/TagSalleCours';
import { useTheme } from '@/contexts/ThemeContext';

export function Cours(props: { course: Course }) {
  const { theme } = useTheme();
  return <View className="flex content-center w-[90%] ml-5">
    <View style={{ backgroundColor: theme.card, borderColor: theme.text }}
          className="flex-col justify-center items-center rounded-br-2xl rounded-tr-2xl p-2 border-l-2">
      <Text style={{ color: theme.text }} className="h2">{props.course.titre}</Text>
      <View>
        <Text style={{ color: theme.text }}
              className="">{props.course.heure_debut} - {props.course.heure_fin}</Text>
        <TagSalleCours salles={props.course.salles} />
      </View>
      <Text style={{ color: theme.text }} className="">{props.course.profs}</Text>
    </View>
  </View>;
}