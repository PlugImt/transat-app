import { Search } from "lucide-react-native";
import Input from "@/components/common/Input";
import { useTheme } from "@/contexts/ThemeContext";

const SearchClub = () => {
  const { theme } = useTheme();
  return (
    <Input
      icon={<Search color={theme.muted} />}
      placeholder="Rechercher"
      className="flex-1"
    />
  );
};

export default SearchClub;
