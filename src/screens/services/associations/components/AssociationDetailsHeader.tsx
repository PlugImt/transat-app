import { useNavigation, useRoute } from "expo-router";
import type { NativeStackNavigationProp } from "expo-router/build/react-navigation/native-stack";
import { Bell, BellOff, ExternalLink, MapPin } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Linking, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { UserStack, UserStackSkeleton } from "@/components/custom";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { User } from "@/dto";
import type { AssociationDetails } from "@/dto/association";
import {
  useJoinAssociationMutation,
  useLeaveAssociationMutation,
} from "@/hooks/services/association/useAssociation";
import { linkToDomain } from "@/utils/";
import type { AssociationDetailsRouteProp } from "../AssociationDetails";

interface NotificationButtonProps {
  isMember: boolean;
  disabled?: boolean;
}

const NotificationButton = ({
  isMember,
  disabled,
}: NotificationButtonProps) => {
  const { t } = useTranslation();
  const route = useRoute<AssociationDetailsRouteProp>();
  const { id } = route.params;

  const { mutate: joinAssociation, isPending: isJoining } = useJoinAssociationMutation(id);
  const { mutate: leaveAssociation, isPending: isLeaving } = useLeaveAssociationMutation(id);

  if (isMember) {
    return (
      <Button
        label={t("user.notInterested")}
        onPress={() => leaveAssociation()}
        icon={<BellOff />}
        className="flex-1"
        disabled={disabled}
        isUpdating={isJoining || isLeaving}
      />
    );
  }
  return (
    <Button
      label={t("user.interested")}
      onPress={() => joinAssociation()}
      icon={<Bell />}
      className="flex-1"
      disabled={disabled}
      isUpdating={isJoining || isLeaving}
    />
  );
};

type NavigationProp = NativeStackNavigationProp<{
  AssociationMemberList: { id: number };
}>;

interface AssociationDetailsHeaderProps {
  association: AssociationDetails;
}

export const AssociationDetailsHeader = ({ association }: AssociationDetailsHeaderProps) => {
  const {
    name: title,
    description,
    member_photos,
    member_count,
    location,
    link,
  } = association;

  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const label = link?.toLowerCase().includes("whatsapp")
    ? "WhatsApp"
    : link
      ? linkToDomain(link, t)
      : String(t("common.link"));

  const handleMemberListPress = () => {
    navigation.navigate("AssociationMemberList", { id: association.id });
  };

  return (
    <View className="gap-4">
      <View>
        <View className="flex-row items-center gap-1">
          <MapPin color={theme.text} size={12} />
          <Text variant="sm">{location}</Text>
        </View>
        <Text variant="h2">{title}</Text>
        <Text color="muted">{description}</Text>
      </View>
      <UserStack
        users={
          member_photos?.map((photo) => ({
            profile_picture: photo,
            first_name: "",
            last_name: "",
          })) as User[]
        }
        count={member_count}
        onPress={handleMemberListPress}
        moreText="services.associations.interested"
      />
      <View className="flex-row items-center gap-2">
        {link && link.length > 0 && (
          <Button
            label={label}
            icon={<ExternalLink />}
            variant="secondary"
            onPress={() => Linking.openURL(link)}
            className="flex-1"
          />
        )}
        <NotificationButton isMember={association.has_joined} />
      </View>
    </View>
  );
};

export default AssociationDetailsHeader;

export const AssociationDetailsHeaderSkeleton = () => {
  const { t } = useTranslation();

  return (
    <View className="gap-4">
      <View>
        <TextSkeleton variant="sm" lastLineWidth={50} />
        <TextSkeleton variant="h2" lastLineWidth={200} />
        <TextSkeleton lines={2} />
      </View>
      <UserStackSkeleton moreText />
      <View className="flex-row items-center gap-2">
        <Button
          label={String(t("common.link"))}
          icon={<ExternalLink />}
          variant="secondary"
          className="flex-1"
          disabled
        />
        <NotificationButton isMember={false} disabled />
      </View>
    </View>
  );
};
