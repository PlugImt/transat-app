import { Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Input, { type InputStandaloneProps } from "@/components/common/Input";
import { useTheme } from "@/contexts/ThemeContext";

interface SearchProps extends Omit<InputStandaloneProps, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchInput = ({
  value,
  onChange,
  className,
  placeholder,
  ...props
}: SearchProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <Input
      icon={<Search color={theme.muted} />}
      placeholder={placeholder ?? String(t("common.search"))}
      className={className ?? "flex-1"}
      value={value}
      onChangeText={onChange}
      {...props}
    />
  );
};

export default SearchInput;
