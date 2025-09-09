import { useDefaultStyles } from "react-native-ui-datepicker";
import { useTheme } from "@/contexts/ThemeContext";

export const useDateTimePickerStyle = () => {
  const { theme } = useTheme();
  const defaultStyles = useDefaultStyles();

  return {
    ...defaultStyles,
    month_selector_label: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold" as const,
    },
    year_selector_label: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold" as const,
    },

    button_prev_image: { tintColor: theme.text },
    button_next_image: { tintColor: theme.text },

    year: { backgroundColor: theme.background, borderRadius: 10 },
    year_label: { color: theme.text },
    month: { backgroundColor: theme.background, borderRadius: 10 },

    day: { borderRadius: 10 },
    day_label: { color: theme.text },

    today: { backgroundColor: theme.background },
    today_label: { color: theme.text },

    selected: { backgroundColor: theme.secondary },
    selected_label: { color: theme.secondaryText },

    range_start_label: { color: theme.secondaryText },
    range_end_label: { color: theme.secondaryText },
    range_fill: { backgroundColor: `${theme.secondary}40`, borderRadius: 10 },
    range_middle_label: { color: theme.secondary },
  };
};
