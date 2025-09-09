import { t } from "i18next";
import type { ReactNode } from "react";
import { Linking, View } from "react-native";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { AvatarSkeleton, TextSkeleton } from "@/components/Skeleton";
import type { User } from "@/dto";
import { useAuth } from "@/hooks/account";
import { getStudentYear } from "@/utils/student.utils";

interface ActionButtonProps {
  user: User;
}

const ActionButton = ({ user }: ActionButtonProps) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  if (user.email === currentUser?.email || !user.phone_number) {
    return null;
  }

  const handleContact = async () => {
    const phoneNumber = user.phone_number?.replace(/\s/g, "");
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
  };

  return (
    <Button label={t("user.contact")} variant="ghost" onPress={handleContact} />
  );
};

interface UserCardProps {
  user?: User;
  action?: ReactNode;
}

export const UserCard = ({ user, action }: UserCardProps) => {
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
          {user.graduation_year ? (
            <Text color="muted" variant="sm" numberOfLines={1}>
              {getStudentYear(user.graduation_year)}
            </Text>
          ) : null}
        </View>
        {action ? action : <ActionButton user={user} />}
      </View>
    </Card>
  );
};

export const UserCardSkeleton = () => {
  return (
    <Card>
      <View className="flex-row items-center gap-2">
        <AvatarSkeleton size={48} />
        <View className="flex-1">
          <TextSkeleton variant="sm" lastLineWidth={200} />
          <TextSkeleton variant="sm" lastLineWidth={125} />
        </View>
      </View>
    </Card>
  );
};
