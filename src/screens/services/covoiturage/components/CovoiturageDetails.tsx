import React from "react";
import {
  type RouteProp,
  useNavigation,
  useRoute,
} from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import { View, Linking, Pressable, Alert } from "react-native";
import { MessageSquare, User, MoreVertical, CheckCircle, Trash2 } from "lucide-react-native"; 
import { IconButton } from "@/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import { Text } from "@/components/common/Text";
import { UserCard, UserCardSkeleton } from "@/components/custom";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/account";
import { 
  useCovoiturageDetails, 
  useUpdateCovoiturage, 
} from "@/hooks/services/covoiturage/useCovoiturage"; 
import type { AppNavigation } from "@/types";
import type { BottomTabParamList } from "@/types/navigation";
import type { Covoiturage } from "@/dto";
import { CovoiturageDetailsHeader, CovoiturageDetailsHeaderSkeleton } from "./CovoiturageDetailsHeader";

type NavigationProp = AppNavigation;

export type CovoiturageDetailsRouteProp = RouteProp<
  BottomTabParamList,
  "CovoiturageDetails"
>;

type CovoiturageActionsProps = {
  covoiturage: Covoiturage;
  refetch: () => void;
};

const CovoiturageActions = ({ covoiturage, refetch }: CovoiturageActionsProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const { mutate: updateCovoiturage, isPending: isUpdating } = useUpdateCovoiturage();

  const handleToggleFull = () => {
    const nextStatus = covoiturage.status === "FULL" ? "OPEN" : "FULL";
    updateCovoiturage(
      { id: covoiturage.id, status: nextStatus },
      { onSuccess: () => refetch() }
    );
  };

  const handleArchiveCovoit = () => {
    updateCovoiturage(
      { id: covoiturage.id, status: "ARCHIVED" },
      { 
        onSuccess: () => {
          refetch();
          navigation.goBack();
        } 
      }
    );
  };

  return (
    <>
      <DropdownMenuItem
        label={covoiturage.status === "FULL" ? t("services.covoit.actions.setAvailable") : t("services.covoit.actions.setFull")}
        onPress={handleToggleFull}
        disabled={isUpdating}
        icon={<CheckCircle size={16} color={theme.text} />}
      />

      <Dialog>
        <DialogTrigger>
          <DropdownMenuItem
            label={t("services.covoit.actions.archive")}
            onPress={() => {}}
            variant="destructive"
            icon={<Trash2 size={16} color={theme.destructive} />}
            preventClose
          />
        </DialogTrigger>
        <DialogContent
          title={t("services.covoit.archive.title")}
          cancelLabel={t("services.covoit.archive.cancel")}
          confirmLabel={t("services.covoit.archive.confirm")}
          onCancel={() => {}}
          onConfirm={handleArchiveCovoit}
          isPending={isUpdating}
          disableConfirm={isUpdating}
        >
          <Text>{t("services.covoit.archive.description")}</Text>
        </DialogContent>
      </Dialog>
    </>
  );
};

const CovoiturageDetails = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const route = useRoute<CovoiturageDetailsRouteProp>();
  const { id } = route.params;
  const { user } = useAuth();

  const {
    data: covoiturage,
    isPending,
    isError,
    error,
    refetch,
  } = useCovoiturageDetails(id);

  if (isError) {
    return (
      <ErrorPage
        error={error}
        title={t("services.covoit.title")}
        refetch={refetch}
        isRefetching={isPending}
      />
    );
  }

  if (isPending) {
    return <CovoiturageDetailsSkeleton />;
  }

  if (!covoiturage || covoiturage.status === "ARCHIVED") {
    return (
      <Page title={t("services.covoit.title")} refreshing={isPending} onRefresh={refetch}>
        <Empty
          title={t("services.covoit.errors.notFound")}
          description={t("services.covoit.errors.notFoundDescription")}
        />
      </Page>
    );
  }

  const isOwner = covoiturage.creator.email === user?.email;
  const isFull = covoiturage.status === "FULL";

  const handleContactWhatsApp = async () => {
    if (!covoiturage.contact_details) return;

    let formattedNumber = covoiturage.contact_details.replace(/[^\d+]/g, "");

    if (!formattedNumber.startsWith("+")) {
      formattedNumber = `+${formattedNumber}`;
    }
    
    const whatsappUrl = `whatsapp://send?phone=${formattedNumber}`;
    const cleanNumberForWeb = formattedNumber.replace("+", "");
    const webWhatsappUrl = `https://wa.me/${cleanNumberForWeb}`;

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(webWhatsappUrl);
      }
    } catch (err) {
      Alert.alert(t("common.error"), t("services.covoit.errors.whatsappError"));
    }
  };

  const covoitActions = (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton
          icon={<MoreVertical size={20} color={theme.text} />}
          variant="link"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <CovoiturageActions covoiturage={covoiturage} refetch={refetch} />
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Page
      title={t("services.covoit.title")}
      refreshing={isPending}
      onRefresh={refetch}
      header={isOwner && covoitActions}
    >
      <View className="flex-1 px-4 gap-y-8">
        <CovoiturageDetailsHeader covoiturage={covoiturage} />

        {covoiturage.description && (
          <View className="flex-row pl-2 pr-4">
            <View className="w-[3px] rounded-full mr-4" style={{ backgroundColor: theme.primary }} />
            <View className="flex-1 justify-center">
              <Text variant="body" color="muted" className="italic text-[15px] leading-6 tracking-wide">
                "{covoiturage.description}"
              </Text>
            </View>
          </View>
        )}

        <View className="gap-y-3 mt-6">
          <View className="flex-row items-center justify-between px-1 mb-1">
            <View className="flex-row items-center gap-2">
              <User size={15} color={theme.muted} />
              <Text variant="xs" color="muted" className="uppercase font-bold tracking-widest text-[11px]">
                {t("services.covoit.driver")}
              </Text>
            </View>

            {covoiturage.contact_details && (!isFull || isOwner) && (
              <Pressable 
                onPress={handleContactWhatsApp}
                className="flex-row items-center gap-2 px-4 py-2 rounded-full active:opacity-60 border"
                style={{ 
                  borderColor: theme.primary + '25', 
                  backgroundColor: theme.primary + '08' 
                }}
              >
                <MessageSquare size={14} color={theme.primary} />
                <Text className="font-bold text-[12px] tracking-wide" style={{ color: theme.primary }}>
                  {t("common.whatsApp")}
                </Text>
              </Pressable>
            )}
          </View>

          <UserCard user={covoiturage.creator} />
        </View>
      </View>
    </Page>
  );
};

export default CovoiturageDetails;

export const CovoiturageDetailsSkeleton = () => {
  return (
    <Page title="">
      <View className="flex-1 px-4 gap-y-8">
        <CovoiturageDetailsHeaderSkeleton />
        <View className="flex-row pl-2">
          <View className="w-[3px] h-12 rounded bg-muted/20 mr-4" />
          <View className="flex-1 gap-y-2">
            <View className="h-4 w-full bg-muted/20 rounded" />
            <View className="h-4 w-5/6 bg-muted/20 rounded" />
          </View>
        </View>
        <View className="gap-y-3 mt-6">
          <View className="h-4 w-24 bg-muted/20 rounded mx-1" />
          <UserCardSkeleton />
        </View>
      </View>
    </Page>
  );
};