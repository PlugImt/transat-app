import NativeDateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Controller, type UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import CalendarPicker, { type DateType } from "react-native-ui-datepicker";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { useDate } from "@/hooks/common/useDate";
import {
  createDateTimeISO,
  parseDate,
  type DateType as UtilsDateType,
} from "@/utils/date.utils";
import { InputButton } from "../InputButton";
import { useDateTimePickerStyle } from "./DateTimePicker.style";

const HOUR_IN_MILLISECONDS = 60 * 60 * 1000;
interface DateTimePickerProps {
  control: any;
  errors: any;
  onChange: UseFormSetValue<any>;
  startDateField: string;
  endDateField: string;
  label?: string;
  initialStartDate?: string;
  initialEndDate?: string;
}

interface DateTimeState {
  date: DateType;
  time: Date;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  control,
  errors,
  onChange,
  startDateField,
  endDateField,
  label = "Date",
  initialStartDate,
  initialEndDate,
}) => {
  const { theme, actualTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { formatDate } = useDate();
  const calendarStyles = useDateTimePickerStyle();

  const initialStartDateTime = useMemo(() => {
    if (initialStartDate) {
      const date = parseDate(initialStartDate);
      return {
        date: date,
        time: date,
      };
    }
    return {
      date: new Date(),
      time: new Date(),
    };
  }, [initialStartDate]);

  const initialEndDateTime = useMemo(() => {
    if (initialEndDate) {
      const date = parseDate(initialEndDate);
      return {
        date: date,
        time: date,
      };
    }
    return {
      date: new Date(Date.now() + HOUR_IN_MILLISECONDS),
      time: new Date(Date.now() + HOUR_IN_MILLISECONDS),
    };
  }, [initialEndDate]);

  const [startDateTime, setStartDateTime] =
    useState<DateTimeState>(initialStartDateTime);
  const [endDateTime, setEndDateTime] =
    useState<DateTimeState>(initialEndDateTime);

  const formatDateDisplay = (date: DateType) => {
    if (!date) return t("services.events.add.date.placeholder");

    const dateObj = parseDate(date as UtilsDateType);
    return formatDate(dateObj, "short");
  };

  // Mettre à jour les valeurs du formulaire quand les dates/heures changent
  useEffect(() => {
    if (startDateTime.date) {
      const startISO = createDateTimeISO(
        startDateTime.date,
        startDateTime.time,
      );
      onChange(startDateField, startISO);
    }
  }, [startDateTime, onChange, startDateField]);

  useEffect(() => {
    if (endDateTime.date) {
      const endISO = createDateTimeISO(endDateTime.date, endDateTime.time);
      onChange(endDateField, endISO);
    } else {
      onChange(endDateField, undefined);
    }
  }, [endDateTime, onChange, endDateField]);

  const handleStartDateChange = (newDate: DateType) => {
    setStartDateTime((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  const handleEndDateChange = (newDate: DateType) => {
    setEndDateTime((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  const handleStartTimeChange = (newTime: Date | undefined) => {
    if (!newTime) return;

    setStartDateTime((prev) => ({
      ...prev,
      time: newTime,
    }));
  };

  const handleEndTimeChange = (newTime: Date | undefined) => {
    if (!newTime) return;

    setEndDateTime((prev) => ({
      ...prev,
      time: newTime,
    }));
  };

  const getRangeText = () => {
    if (startDateTime.date && endDateTime.date) {
      return `${formatDateDisplay(startDateTime.date)} - ${formatDateDisplay(endDateTime.date)}`;
    }
    if (startDateTime.date) {
      return formatDateDisplay(startDateTime.date);
    }
    return undefined;
  };

  return (
    <View className="gap-2">
      <View className="flex-row items-center">
        <View className="gap-1.5 flex-1">
          <Text variant="sm" color="muted">
            {label}
          </Text>
          <Dialog>
            <DialogContent
              title={t("services.events.add.date.title")}
              confirmLabel={t("common.confirm")}
            >
              <CalendarPicker
                locale={i18n.language}
                mode="range"
                startDate={startDateTime.date}
                endDate={endDateTime.date}
                minDate={new Date()}
                onChange={(params) => {
                  if (params.startDate !== undefined) {
                    handleStartDateChange(params.startDate);
                  }
                  if (params.endDate !== undefined) {
                    handleEndDateChange(params.endDate);
                  }
                }}
                styles={calendarStyles}
              />
            </DialogContent>
            <DialogTrigger>
              <InputButton
                Icon={Calendar}
                placeholder={t("services.events.add.date.placeholder")}
                value={getRangeText()}
                onPress={() => {}}
                error={errors[startDateField]?.message}
              />
            </DialogTrigger>
          </Dialog>
        </View>

        <View className="gap-1.5">
          <Text variant="sm" color="muted" className="ml-4">
            Début
          </Text>
          <Controller
            control={control}
            name={startDateField}
            render={() => (
              <NativeDateTimePicker
                value={startDateTime.time}
                mode="time"
                display="default"
                accentColor={theme.primary}
                textColor={theme.text}
                themeVariant={actualTheme}
                onChange={(_, selectedDate) =>
                  handleStartTimeChange(selectedDate)
                }
              />
            )}
          />
        </View>

        <View className="gap-1.5">
          <Text variant="sm" color="muted" className="ml-4">
            Fin
          </Text>
          <Controller
            control={control}
            name={endDateField}
            render={() => (
              <NativeDateTimePicker
                value={endDateTime.time}
                mode="time"
                display="default"
                textColor={theme.text}
                accentColor={theme.primary}
                themeVariant={actualTheme}
                onChange={(_, selectedDate) => {
                  handleEndTimeChange(selectedDate);
                }}
              />
            )}
          />
        </View>
      </View>

      {errors[startDateField] && (
        <Text color="destructive" variant="sm">
          {errors[startDateField].message}
        </Text>
      )}
      {errors[endDateField] && (
        <Text color="destructive" variant="sm">
          {errors[endDateField].message}
        </Text>
      )}
    </View>
  );
};
