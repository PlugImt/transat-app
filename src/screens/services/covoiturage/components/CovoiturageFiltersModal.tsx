import React, { useState } from "react";
import { View, Modal, Pressable, Platform } from "react-native";
import { X, ShoppingCart, Sun, CalendarRange, Car } from "lucide-react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

export type DateFilterType = Date | null;

type FiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onSelectCategories: (categories: string[]) => void;
  dateFilter: DateFilterType;
  onChangeDateFilter: (filter: DateFilterType) => void;
  t: (key: string, defaultValue?: string) => string;
};

export const CovoiturageFiltersModal = ({
  isOpen,
  onClose,
  selectedCategories,
  onSelectCategories,
  dateFilter,
  onChangeDateFilter,
  t,
}: FiltersModalProps) => {
  const { theme } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    
    if (event.type === "set" && selectedDate) {
      onChangeDateFilter(selectedDate);
    } else if (event.type === "dismissed" && dateFilter === null) {
      onChangeDateFilter(null);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onSelectCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onSelectCategories([...selectedCategories, categoryId]);
    }
  };

  const getDateLabel = () => {
    if (dateFilter instanceof Date) {
      return dateFilter.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
    }
    return t("services.covoit.filters.chooseDate");
  };

  return (
    <Modal visible={isOpen} transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="absolute inset-0" onPress={onClose} />
        
        <View className="p-6 rounded-t-[32px] border-t gap-6 pb-8" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          
          <View className="flex-row items-center justify-between mb-2">
            <Text variant="h2" className="font-bold">{t("services.covoit.filters.title")}</Text>
            <Pressable onPress={onClose} className="p-2 rounded-full bg-muted/10 active:bg-muted/20">
              <X size={20} color={theme.text} />
            </Pressable>
          </View>

          <View className="gap-3">
            <Text variant="xs" color="muted" className="font-bold uppercase tracking-widest text-[9px]">
              {t("services.covoit.filters.tripType")}
            </Text>
            <View className="flex-row gap-3 flex-wrap">
              {[
                { id: "SHOPPING", label: t("services.covoit.tags.shopping"), icon: <ShoppingCart size={15} /> },
                { id: "LONG_TRIP", label: t("services.covoit.tags.long_trip"), icon: <Sun size={15} /> },
                { id: "OTHER", label: t("services.covoit.tags.other"), icon: <Car size={15} /> }
              ].map((cat) => {
                const isSelected = selectedCategories.includes(cat.id); // Vérification dans le tableau
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => handleCategoryPress(cat.id)}
                    className="flex-row items-center gap-2 px-5 py-3 rounded-full border"
                    style={{
                      backgroundColor: isSelected ? theme.primary : "transparent",
                      borderColor: isSelected ? theme.primary : theme.border,
                    }}
                  >
                    {React.cloneElement(cat.icon, { color: isSelected ? "#fff" : theme.muted })}
                    <Text variant="sm" className="font-semibold" style={{ color: isSelected ? "#fff" : theme.text }}>
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="gap-3 mb-4">
            <Text variant="xs" color="muted" className="font-bold uppercase tracking-widest text-[9px]">
              {t("services.covoit.filters.departureDate")}
            </Text>
            <View className="flex-row gap-3 flex-wrap">
              <Pressable
                onPress={() => {
                  onChangeDateFilter(null);
                  setShowDatePicker(false);
                }}
                className="flex-row items-center gap-2 px-5 py-3 rounded-full border"
                style={{
                  backgroundColor: dateFilter === null ? theme.primary : "transparent",
                  borderColor: dateFilter === null ? theme.primary : theme.border,
                }}
              >
                <CalendarRange size={15} color={dateFilter === null ? "#fff" : theme.muted} />
                <Text variant="sm" className="font-semibold" style={{ color: dateFilter === null ? "#fff" : theme.text }}>
                  {t("services.covoit.filters.allDates")}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (dateFilter === null) {
                    onChangeDateFilter(new Date());
                  }
                  setShowDatePicker(true);
                }}
                className="flex-row items-center gap-2 px-5 py-3 rounded-full border flex-1"
                style={{
                  backgroundColor: dateFilter !== null ? theme.primary : "transparent",
                  borderColor: dateFilter !== null ? theme.primary : theme.border,
                }}
              >
                <CalendarRange size={15} color={dateFilter !== null ? "#fff" : theme.muted} />
                <Text variant="sm" className="font-semibold" style={{ color: dateFilter !== null ? "#fff" : theme.text }} numberOfLines={1}>
                  {getDateLabel()}
                </Text>
              </Pressable>
            </View>
          </View>

          {showDatePicker && dateFilter !== null && Platform.OS === "ios" && (
            <View 
              className="items-center justify-center p-2 rounded-2xl border mb-2" 
              style={{ 
                borderColor: theme.border,
                backgroundColor: theme.dark ? "#000000" : "#FFFFFF"
              }}
            >
              <DateTimePicker
                value={dateFilter instanceof Date ? dateFilter : new Date()}
                mode="date"
                display="inline"
                onChange={handleDateChange}
                minimumDate={new Date()}
                themeVariant={theme.dark ? "dark" : "light"}
                accentColor={theme.primary}
              />
            </View>
          )}

          {showDatePicker && dateFilter !== null && Platform.OS === "android" && (
            <DateTimePicker
              value={dateFilter instanceof Date ? dateFilter : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

        </View>
      </View>
    </Modal>
  );
};