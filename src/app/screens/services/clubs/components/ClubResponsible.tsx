import { useTranslation } from "react-i18next";
import CardGroup from "@/components/common/CardGroup";
import { UserCard } from "@/components/custom/card/UserCard";
import type { User } from "@/dto";

interface ClubResponsibleProps {
  responsibles?: User[];
}

export const ClubResponsible = ({ responsibles }: ClubResponsibleProps) => {
  const { t } = useTranslation();

  if (!responsibles || responsibles.length === 0) {
    return null;
  }

  return (
    <CardGroup title={t("services.clubs.responsible")}>
      {responsibles.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </CardGroup>
  );
};
