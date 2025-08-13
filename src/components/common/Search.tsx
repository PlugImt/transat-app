import { Search } from "lucide-react-native";
import Input, { type InputStandaloneProps } from "@/components/common/Input";
import { useTheme } from "@/contexts/ThemeContext";

interface SearchProps extends Omit<InputStandaloneProps, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput = ({
  value,
  onChange,
  className,
  placeholder,
  ...props
}: SearchProps) => {
  const { theme } = useTheme();
  return (
    <Input
      icon={<Search color={theme.muted} />}
      placeholder={placeholder ?? "common.search"}
      className={className ?? "flex-1"}
      value={value}
      onChangeText={onChange}
      {...props}
    />
  );
};

export default SearchInput;
