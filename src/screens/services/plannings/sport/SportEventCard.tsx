import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/common/Text';
import { useTheme } from '@/contexts/ThemeContext';
import type { PlanningSport } from '@/dto/plannings_sport';
import dayjs from 'dayjs';

interface SportEventCardProps {
  event: PlanningSport;
  isOver?: boolean;
}

export function SportEventCard({ event, isOver = false }: SportEventCardProps) {
  const { theme } = useTheme();

  const startLabel = dayjs(event.start_time).format('HH:mm');
  const endLabel = dayjs(event.end_time).format('HH:mm');

  return (
    <View
      className="flex-row items-stretch rounded-xl border-[0.5px] py-3 px-3.5 gap-3 mb-2.5"
      style={[
        {
          backgroundColor: isOver ? theme.card : theme.primary + '1A',
          borderLeftColor: isOver ? theme.muted : theme.primary,
          borderColor: isOver ? theme.border : theme.primary + '40',
          opacity: isOver ? 0.6 : 1,
        },
      ]}
    >
      <View className="items-center min-w-[44px] gap-1">
        <Text className="text-xs font-medium" style={{ color: theme.primary }}>
          {startLabel}
        </Text>
        <View className="flex-1 w-[1px] min-h-2" style={{ backgroundColor: theme.primary + '60' }} />
        <Text className="text-xs font-medium" style={{ color: theme.muted }}>
          {endLabel}
        </Text>
      </View>

      <View className="flex-1 gap-1 justify-center">
        <Text variant="h3" className="text-base font-semibold" style={{ color: isOver ? theme.overlay : theme.primary }}>
          {event.activity}
        </Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm" style={{ color: theme.muted }}>{event.place}</Text>
        </View>
      </View>
    </View>
  );
}