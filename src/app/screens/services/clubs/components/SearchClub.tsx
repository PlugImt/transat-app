import { Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Input, { type InputStandaloneProps } from "@/components/common/Input";
import { useTheme } from "@/contexts/ThemeContext";

interface SearchClubProps extends Omit<InputStandaloneProps, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const SearchClub = ({ value, onChange, ...props }: SearchClubProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Input
      icon={<Search color={theme.muted} />}
      placeholder={String(t("common.search"))}
      className="flex-1"
      value={value}
      onChangeText={onChange}
      {...props}
    />
  );
};

export default SearchClub;
