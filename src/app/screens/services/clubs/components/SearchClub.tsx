import { useTranslation } from "react-i18next";
import type { InputStandaloneProps } from "@/components/common/Input";
import Search from "@/components/common/Search";

interface SearchClubProps extends Omit<InputStandaloneProps, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const SearchClub = ({ value, onChange, ...props }: SearchClubProps) => {
  const { t } = useTranslation();

  return (
    <Search
      placeholder={String(t("common.search"))}
      className="flex-1"
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default SearchClub;
