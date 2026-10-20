import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import CardGroup from "@/components/common/CardGroup";
import { Text } from "@/components/common/Text";
import { WidgetBoundary } from "@/components/query";
import type { Homework } from "@/dto";
import { useHomework } from "@/hooks/services/homework/useHomework";
import { paths } from "@/navigation/paths";
import { HomeworkWidgetItem } from "./HomeworkWidgetItem";
import { HomeworkWidgetLoading } from "./HomeworkWidgetLoading";

export const HomeworkWidget = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { upcomingHomeworks, isPending, isFetching, isError, error, refetch } =
    useHomework();

  const emptyContent = (
    <CardGroup title={t("services.homework.title")}>
      <Text className="ml-4 italic">{t("services.homework.noHomework")}</Text>
    </CardGroup>
  );

  return (
    <WidgetBoundary
      title={t("services.homework.title")}
      query={{
        isPending,
        isFetching,
        isError,
        error,
        refetch,
      }}
      loading={<HomeworkWidgetLoading />}
      isEmpty={!upcomingHomeworks?.length}
      empty={emptyContent}
    >
      <CardGroup title={t("services.homework.title")}>
        <TouchableOpacity
          onPress={() => router.push(paths.homework)}
          className="rounded-lg flex flex-col gap-3"
        >
          {upcomingHomeworks?.slice(0, 3).map((hw: Homework) => (
            <HomeworkWidgetItem key={hw.id} homework={hw} />
          ))}
        </TouchableOpacity>
      </CardGroup>
    </WidgetBoundary>
  );
};
