import { useDefaultStyles } from "react-native-ui-datepicker";
import { useTheme } from "@/contexts/ThemeContext";

export const useDateTimePickerStyle = () => {
  const { theme } = useTheme();
  const defaultStyles = useDefaultStyles();

  return {
    ...defaultStyles,
    day: {
      borderRadius: 10,
    },
    day_label: {
      color: theme.text,
    },
    today: {
      backgroundColor: theme.background,
    },
    today_label: {
      color: theme.text,
    },
    selected: { backgroundColor: theme.secondary },
    selected_label: { color: theme.secondaryText },
    range_start_label: { color: theme.secondaryText },
    range_end_label: { color: theme.secondaryText },
    range_fill: { backgroundColor: `${theme.secondary}40`, borderRadius: 10 },
    range_middle_label: { color: theme.secondary },
  };
};
