import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import { Linking, View } from "react-native";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import type { User } from "@/dto";
import { useAuth } from "@/hooks/account";
import type { AccountNavigation } from "@/types";
import { getStudentYear } from "@/utils/student.utils";

const ActionButton = ({ user }: { user: User }) => {
  const navigation = useNavigation<AccountNavigation>();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  if (user?.email === currentUser?.email) {
    return (
      <Button
        label={t("common.edit")}
        variant="ghost"
        onPress={() => navigation.navigate("EditProfile")}
      />
    );
  }

  const handleContact = async () => {
    if (user?.phone_number) {
      const phoneNumber = user.phone_number.replace(/\s/g, "");
      const url = `sms:${phoneNumber}`;

      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          const telUrl = `tel:${phoneNumber}`;
          await Linking.openURL(telUrl);
        }
      } catch (_) {
        toast(t("user.errors.contact"), "destructive");
      }
    }
  };

  return (
    <Button label={t("user.contact")} variant="ghost" onPress={handleContact} />
  );
};

interface UserCardProps {
  user?: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  if (!user) {
    return null;
  }

  return (
    <Card>
      <View className="flex-row items-center gap-2">
        <Avatar user={user} size={48} />
        <View className="flex-1">
          <Text
            className="font-bold"
            numberOfLines={1}
          >{`${user.first_name} ${user.last_name}`}</Text>
          {user.graduation_year && (
            <Text color="muted" variant="sm" numberOfLines={1}>
              {getStudentYear(user.graduation_year)}
            </Text>
          )}
        </View>
        <ActionButton user={user} />
      </View>
    </Card>
  );
};
