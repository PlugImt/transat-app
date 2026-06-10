import { SearchX } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View } from "react-native";
import Animated from "react-native-reanimated";
import SearchInput from "@/components/common/SearchInput";
import AssociationCard, { AssociationCardSkeleton } from "@/components/custom/card/AssociationCard";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import type { Association } from "@/dto/association";
import { useAnimatedHeader } from "@/hooks/common";
import { useFilteredAssociations } from "@/hooks/services/association/useAssociation";

interface SelectAssociationButtonProps {
  onSelect: (associationId: number) => void;
  title?: string;
  selectedAssociationId?: number;
  children: React.ReactElement<{
    onPress?: () => void;
    label?: string;
    value?: string;
  }>;
}

export const SelectAssociationButton = ({
  onSelect,
  title,
  selectedAssociationId,
  children,
}: SelectAssociationButtonProps) => {
  const [visible, setVisible] = useState(false);
  const { data: associations, isPending } = useFilteredAssociations("");

  const selectedAssociation =
    selectedAssociationId && associations
      ? associations.find((association) => association.id === selectedAssociationId)
      : null;

  if (selectedAssociationId && isPending) {
    return <View className="h-12 bg-muted rounded-lg animate-pulse" />;
  }

  return (
    <>
      {React.isValidElement(children) &&
        React.cloneElement(children, {
          onPress: () => setVisible(true),
          value: selectedAssociation?.name,
        })}
      <SelectAssociationModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={onSelect}
        title={title}
      />
    </>
  );
};

interface SelectAssociationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (associationId: number) => void;
  title?: string;
}

const SelectAssociationModal = ({
  visible,
  onClose,
  onSelect,
  title,
}: SelectAssociationModalProps) => {
  const { t } = useTranslation();
  const { scrollHandler } = useAnimatedHeader();
  const [searchValue, setSearchValue] = useState("");
  const {
    data: associations,
    isPending,
    refetch,
    isError,
    error,
  } = useFilteredAssociations(searchValue);

  useEffect(() => {
    if (visible) {
      setSearchValue("");
    }
  }, [visible]);

  const handleClose = () => {
    setSearchValue("");
    onClose();
  };

  const handleSelectAssociation = (association: Association) => {
    onSelect(association.id);
    handleClose();
  };

  if (isPending) {
    return (
      <SelectAssociationSkeleton
        visible={visible}
        handleClose={handleClose}
        title={title || t("services.associations.selectAssociation")}
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
          title={title || t("services.associations.selectAssociation")}
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
        title={title || t("services.associations.selectAssociation")}
        onRefresh={refetch}
        refreshing={isPending}
        onBack={handleClose}
        className="gap-2"
        asChildren
      >
        <Animated.FlatList
          data={associations}
          renderItem={({ item }) => (
            <AssociationCard
              association={item}
              size="sm"
              onPress={() => handleSelectAssociation(item)}
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
              title={t("services.associations.errors.empty")}
              description={t("services.associations.errors.emptyDescription")}
            />
          }
        />
      </Page>
    </Modal>
  );
};

export default SelectAssociationModal;

interface SelectAssociationSkeletonProps {
  visible: boolean;
  handleClose: () => void;
  title: string;
}

export const SelectAssociationSkeleton = ({
  visible,
  handleClose,
  title,
}: SelectAssociationSkeletonProps) => {
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
        title={title || t("services.associations.selectAssociation")}
        onBack={handleClose}
        className="gap-2"
        asChildren
      >
        <Animated.FlatList
          data={Array.from({ length: 10 })}
          renderItem={() => <AssociationCardSkeleton size="sm" />}
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
