import NativeDateTimePicker from "@react-native-community/datetimepicker";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "lucide-react-native";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
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
import { InputButton } from "../InputButton";
import { useDateTimePickerStyle } from "./DateTimePicker.style";

interface DateTimePickerProps {
  control: any;
  errors: any;
  onChange: UseFormSetValue<any>;
  startDateField: string;
  endDateField: string;
  label?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  control,
  errors,
  onChange,
  startDateField,
  endDateField,
  label = "Date",
}) => {
  const { theme, actualTheme } = useTheme();
  const { t } = useTranslation();
  const calendarStyles = useDateTimePickerStyle();

  const [range, setRange] = useState<{
    startDate: DateType;
    endDate: DateType;
  }>({ startDate: undefined, endDate: undefined });

  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const createDateTimeISO = useCallback(
    (date: DateType, time: Date): string => {
      if (!date) return new Date().toISOString();

      let dateObj: Date;
      if (typeof date === "string") {
        dateObj = parseISO(date);
      } else if (typeof date === "number") {
        dateObj = new Date(date);
      } else if (date && typeof date === "object" && "toDate" in date) {
        dateObj = date.toDate();
      } else {
        dateObj = date as Date;
      }

      const combinedDate = new Date(dateObj);
      combinedDate.setHours(time.getHours());
      combinedDate.setMinutes(time.getMinutes());
      combinedDate.setSeconds(0);
      combinedDate.setMilliseconds(0);

      return combinedDate.toISOString();
    },
    [],
  );

  const formatDate = (date: DateType) => {
    if (!date) return t("services.events.add.date.placeholder");

    let dateObj: Date;
    if (typeof date === "string") {
      dateObj = parseISO(date);
    } else if (typeof date === "number") {
      dateObj = new Date(date);
    } else if (date && typeof date === "object" && "toDate" in date) {
      dateObj = date.toDate();
    } else {
      dateObj = date as Date;
    }

    return format(dateObj, "dd MMMM", { locale: fr });
  };

  useEffect(() => {
    if (range.startDate) {
      const startISO = createDateTimeISO(range.startDate, startTime);
      onChange(startDateField, startISO);
    }
    if (range.endDate) {
      const endISO = createDateTimeISO(range.endDate, endTime);
      onChange(endDateField, endISO);
    }
  }, [
    range,
    startTime,
    endTime,
    onChange,
    startDateField,
    endDateField,
    createDateTimeISO,
  ]);

  const onEndTimeChange = (
    date: Date | undefined,
    onChange: (...event: any[]) => void,
  ) => {
    if (!date) {
      return;
    }

    setEndTime(date);
    const isoString = createDateTimeISO(range.endDate, date);
    onChange(endDateField, isoString);
  };

  const onStartTimeChange = (
    date: Date | undefined,
    onChange: (...event: any[]) => void,
  ) => {
    if (!date) {
      return;
    }

    setStartTime(date);
    const isoString = createDateTimeISO(range.startDate, date);
    onChange(startDateField, isoString);
  };

  const rangeText = range.startDate
    ? `${formatDate(range.startDate)} - ${formatDate(range.endDate)}`
    : undefined;

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
                mode="range"
                startDate={range.startDate}
                endDate={range.endDate}
                minDate={new Date()}
                onChange={(params) => {
                  setRange(params);
                }}
                styles={calendarStyles}
              />
            </DialogContent>
            <DialogTrigger>
              <InputButton
                Icon={Calendar}
                placeholder={t("services.events.add.date.placeholder")}
                value={rangeText}
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
            render={({ field: { onChange } }) => (
              <NativeDateTimePicker
                value={startTime}
                mode="time"
                accentColor={theme.primary}
                textColor={theme.text}
                themeVariant={actualTheme}
                onChange={(_, selectedDate) =>
                  onStartTimeChange(selectedDate, onChange)
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
            render={({ field: { onChange } }) => (
              <NativeDateTimePicker
                value={endTime}
                mode="time"
                textColor={theme.text}
                accentColor={theme.primary}
                themeVariant={actualTheme}
                onChange={(_, selectedDate) => {
                  onEndTimeChange(selectedDate, onChange);
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
