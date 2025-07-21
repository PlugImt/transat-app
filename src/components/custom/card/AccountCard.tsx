import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import { View } from "react-native";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import type { User } from "@/dto";
import type { AccountNavigation } from "@/types";

interface AccountCardProps {
  user?: User;
}

export const AccountCard = ({ user }: AccountCardProps) => {
  const navigation = useNavigation<AccountNavigation>();

  if (!user) {
    return null;
  }

  return (
    <Card>
      <View className="flex-row items-center gap-4">
        <Avatar user={user} />
        <View className="flex-1">
          <Text variant="h3">{`${user.first_name} ${user.last_name}`}</Text>
          <Text color="muted">{user.email}</Text>
        </View>
        <Button
          label={t("common.edit")}
          variant="ghost"
          size="sm"
          onPress={() => navigation.navigate("EditProfile")}
        />
      </View>
    </Card>
  );
};
