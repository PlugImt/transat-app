import { SearchX } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View } from "react-native";
import Animated from "react-native-reanimated";
import SearchInput from "@/components/common/SearchInput";
import ClubCard, { ClubCardSkeleton } from "@/components/custom/card/ClubCard";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import type { Club } from "@/dto/club";
import { useAnimatedHeader } from "@/hooks/common";
import { useFilteredClubs } from "@/hooks/services/club/useClub";

interface SelectClubButtonProps {
  onSelect: (clubId: number) => void;
  title?: string;
  selectedClubId?: number;
  children: React.ReactElement<{
    onPress?: () => void;
    label?: string;
    value?: string;
  }>;
}

export const SelectClubButton = ({
  onSelect,
  title,
  selectedClubId,
  children,
}: SelectClubButtonProps) => {
  const [visible, setVisible] = useState(false);
  const { data: clubs, isPending } = useFilteredClubs("");

  const selectedClub =
    selectedClubId && clubs
      ? clubs.find((club) => club.id === selectedClubId)
      : null;

  if (selectedClubId && isPending) {
    return <View className="h-12 bg-muted rounded-lg animate-pulse" />;
  }

  return (
    <>
      {React.isValidElement(children) &&
        React.cloneElement(children, {
          onPress: () => setVisible(true),
          value: selectedClub?.name,
        })}
      <SelectClubModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={onSelect}
        title={title}
      />
    </>
  );
};

interface SelectClubModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (clubId: number) => void;
  title?: string;
}

const SelectClubModal = ({
  visible,
  onClose,
  onSelect,
  title,
}: SelectClubModalProps) => {
  const { t } = useTranslation();
  const { scrollHandler } = useAnimatedHeader();
  const [searchValue, setSearchValue] = useState("");
  const {
    data: clubs,
    isPending,
    refetch,
    isError,
    error,
  } = useFilteredClubs(searchValue);

  useEffect(() => {
    if (visible) {
      setSearchValue("");
    }
  }, [visible]);

  const handleClose = () => {
    setSearchValue("");
    onClose();
  };

  const handleSelectClub = (club: Club) => {
    onSelect(club.id);
    handleClose();
  };

  if (isPending) {
    return (
      <SelectClubSkeleton
        visible={visible}
        handleClose={handleClose}
        title={title || t("services.clubs.selectClub")}
      />
    );
  }

  if (isError) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <ErrorPage
          error={error}
          title={title || t("services.clubs.selectClub")}
          refetch={refetch}
          isRefetching={isPending}
        />
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <Page
        title={title || t("services.clubs.selectClub")}
        onRefresh={refetch}
        refreshing={isPending}
        onBack={handleClose}
        className="gap-2"
        asChildren
      >
        <Animated.FlatList
          data={clubs}
          renderItem={({ item }) => (
            <ClubCard
              club={item}
              size="sm"
              onPress={() => handleSelectClub(item)}
            />
          )}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          ListHeaderComponent={
            <View className="flex-row items-center gap-2 mb-4">
              <SearchInput value={searchValue} onChange={setSearchValue} />
            </View>
          }
          ListEmptyComponent={
            <Empty
              icon={<SearchX />}
              title={t("services.clubs.errors.empty")}
              description={t("services.clubs.errors.emptyDescription")}
            />
          }
        />
      </Page>
    </Modal>
  );
};

export default SelectClubModal;

interface SelectClubSkeletonProps {
  visible: boolean;
  handleClose: () => void;
  title: string;
}

export const SelectClubSkeleton = ({
  visible,
  handleClose,
  title,
}: SelectClubSkeletonProps) => {
  const { t } = useTranslation();
  const { scrollHandler } = useAnimatedHeader();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <Page
        title={title || t("services.clubs.selectClub")}
        onBack={handleClose}
        className="gap-2"
        asChildren
      >
        <Animated.FlatList
          data={Array.from({ length: 10 })}
          renderItem={() => <ClubCardSkeleton size="sm" />}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          ListHeaderComponent={
            <SearchInput
              value={""}
              onChange={() => {}}
              disabled
              className="mb-4"
            />
          }
        />
      </Page>
    </Modal>
  );
};
