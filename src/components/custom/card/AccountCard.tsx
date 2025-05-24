import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import { useTheme } from "@/contexts/ThemeContext";
import type { AccountNavigation } from "@/services/storage/types";
import type { User } from "@/types/user";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import { Text, View } from "react-native";

interface Props {
  user?: User;
}

export const AccountCard = ({ user }: Props) => {
  const navigation = useNavigation<AccountNavigation>();
  const { theme } = useTheme();

  if (!user) {
    return null;
  }

  return (
    <View style={{ backgroundColor: theme.card }} className="rounded-lg p-4">
      <View className="flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage source={{ uri: user.profile_picture }} />
          <AvatarFallback>
            {user.first_name.charAt(0)}
            {user.last_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <View className="flex-1">
          <Text className="h3" style={{ color: theme.foreground }}>
            {`${user.first_name} ${user.last_name}`}
          </Text>
          <Text style={{ color: theme.foreground + "B3" }}>{user.email}</Text>
        </View>
        <Button
          label={t("common.edit")}
          variant="ghost"
          size="sm"
          onPress={() => navigation.navigate("EditProfile")}
        />
      </View>
    </View>
  );
};
