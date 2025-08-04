import { Search } from "lucide-react-native";
import Input, { type InputStandaloneProps } from "@/components/common/Input";
import { useTheme } from "@/contexts/ThemeContext";

interface SearchClubProps extends Omit<InputStandaloneProps, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const SearchClub = ({ value, onChange, ...props }: SearchClubProps) => {
  const { theme } = useTheme();

  return (
    <Input
      icon={<Search color={theme.muted} />}
      placeholder="Rechercher"
      className="flex-1"
      value={value}
      onChangeText={onChange}
      {...props}
    />
  );
};

export default SearchClub;
