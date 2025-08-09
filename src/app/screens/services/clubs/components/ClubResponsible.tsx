import { useTranslation } from "react-i18next";
import CardGroup from "@/components/common/CardGroup";
import { UserCard } from "@/components/custom/card/UserCard";
import type { ClubDetails } from "@/dto/club";

interface ClubResponsibleProps {
  club: ClubDetails;
}

export const ClubResponsible = ({ club }: ClubResponsibleProps) => {
  const { t } = useTranslation();

  if (!club?.responsible) {
    return null;
  }

  return (
    <CardGroup title={t("services.clubs.responsible")}>
      <UserCard user={club.responsible} />
    </CardGroup>
  );
};
