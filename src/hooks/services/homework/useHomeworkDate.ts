import { useTranslation } from "react-i18next";

export const useHomeworkDate = () => {
  const { t } = useTranslation();

  const formatDeadline = (date: Date) => {
    return t("common.homework.deadline", { date });
  };

  const formatCreatedAt = (date: Date) => {
    return t("common.homework.createdAt", { date });
  };

  const formatUpdatedAt = (date: Date) => {
    return t("common.homework.updatedAt", { date });
  };

  const formatDueIn = (date: Date) => {
    return t("common.homework.dueIn", { date });
  };

  const formatOverdue = (date: Date) => {
    return t("common.homework.overdue", { date });
  };

  const getDeadlineStatus = (deadline: Date) => {
    const now = new Date();
    const isOverdue = deadline < now;

    if (isOverdue) {
      return {
        isOverdue: true,
        text: formatOverdue(deadline),
        color: "red" as const,
      };
    }

    return {
      isOverdue: false,
      text: formatDueIn(deadline),
      color: "primary" as const,
    };
  };

  return {
    formatDeadline,
    formatCreatedAt,
    formatUpdatedAt,
    formatDueIn,
    formatOverdue,
    getDeadlineStatus,
  };
};
