import { Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Input, { type InputStandaloneProps } from "@/components/common/Input";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";

interface SearchClubProps extends Omit<InputStandaloneProps, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchClub = ({
  value,
  onChange,
  className,
  ...props
}: SearchClubProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Input
      icon={<Search color={theme.muted} />}
      placeholder={String(t("common.search"))}
      className={cn("flex-1", className)}
      value={value}
      onChangeText={onChange}
      {...props}
    />
  );
};

export default SearchClub;
