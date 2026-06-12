import { useTranslation } from "react-i18next";
import { View } from "react-native";
import CardGroup from "@/components/common/CardGroup";
import { UserCard } from "@/components/custom/card/UserCard";
import type { User } from "@/dto";

interface AssociationResponsibleProps {
  responsible?: User | User[];
}

export const AssociationResponsible = ({ responsible }: AssociationResponsibleProps) => {
  const { t } = useTranslation();

  if (!responsible) {
    return null;
  }

  const responsibleList = Array.isArray(responsible) ? responsible : [responsible];

  if (responsibleList.length === 0) {
    return null;
  }

  return (
      <CardGroup title={t("services.associations.responsible")}>
        <View className="gap-2">
          {responsibleList.map((manager) => (
              <UserCard key={manager.email} user={manager} />
          ))}
        </View>
      </CardGroup>
  );
};
