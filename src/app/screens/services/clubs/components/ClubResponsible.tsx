import { useTranslation } from "react-i18next";
import CardGroup from "@/components/common/CardGroup";
import { UserCard } from "@/components/custom/card/UserCard";
import type { User } from "@/dto";

interface ClubResponsibleProps {
  responsible?: User;
}

export const ClubResponsible = ({ responsible }: ClubResponsibleProps) => {
  const { t } = useTranslation();

  if (!responsible) {
    return null;
  }

  return (
    <CardGroup title={t("services.clubs.responsible")}>
      <UserCard user={responsible} />
    </CardGroup>
  );
};
