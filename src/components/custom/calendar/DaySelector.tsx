import { useState } from "react";
import { ScrollView, View } from "react-native";
import { DayCard } from "@/components/custom/calendar/Day";

export const DaySelector = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState(today);

  const handlePress = (date: Date) => {
    console.log("Selected date:", date);
    setSelectedDate(date);
  };

  const days = Array.from({ length: 33 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View className="flex flex-row items-center gap-2 px-4 py-2">
        {days.map((day, index) => {
          const isSelected =
            day.getDate() === selectedDate.getDate() &&
            day.getMonth() === selectedDate.getMonth() &&
            day.getFullYear() === selectedDate.getFullYear();

          return (
            <DayCard
              key={index.toString()}
              date={day}
              selected={isSelected}
              onPress={() => handlePress(day)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};
