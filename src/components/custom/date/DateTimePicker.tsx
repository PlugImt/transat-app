import NativeDateTimePicker from "@react-native-community/datetimepicker";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "lucide-react-native";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Controller, type UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import CalendarPicker, { type DateType } from "react-native-ui-datepicker";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
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
  const { theme } = useTheme();
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

      // Combine date and time
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
    if (!date) return "Sélectionner une date";

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

  return (
    <View className="gap-2">
      <View className="flex-row items-center">
        <View className="gap-1.5 flex-1">
          <Text variant="sm" color="muted">
            {label}
          </Text>
          <Dialog>
            <DialogContent
              title={t("services.events.add.schedules.title")}
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
              <TouchableOpacity
                className="px-4 rounded-lg h-12 flex-row items-center gap-2"
                style={{
                  backgroundColor: theme.input,
                }}
              >
                <Calendar size={16} color={theme.muted} />
                <Text variant="sm" color="muted">
                  {range.startDate
                    ? `${formatDate(range.startDate)} - ${formatDate(range.endDate)}`
                    : "Sélectionner une date"}
                </Text>
              </TouchableOpacity>
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
                onChange={(_, selectedDate) => {
                  if (selectedDate) {
                    setStartTime(selectedDate);
                    const isoString = createDateTimeISO(
                      range.startDate,
                      selectedDate,
                    );
                    onChange(isoString);
                  }
                }}
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
                onChange={(_, selectedDate) => {
                  if (selectedDate) {
                    setEndTime(selectedDate);
                    const isoString = createDateTimeISO(
                      range.endDate,
                      selectedDate,
                    );
                    onChange(isoString);
                  }
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
