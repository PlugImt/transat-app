import { useTranslation } from "react-i18next";
import CardGroup from "@/components/common/CardGroup";
import { UserCard } from "@/components/custom/card/UserCard";
import type { User } from "@/dto";

interface AssociationResponsibleProps {
  responsible?: User;
}

export const AssociationResponsible = ({ responsible }: AssociationResponsibleProps) => {
  const { t } = useTranslation();

  if (!responsible) {
    return null;
  }

  return (
    <CardGroup title={t("services.associations.responsible")}>
      <UserCard user={responsible} />
    </CardGroup>
  );
};
