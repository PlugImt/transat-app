import { t } from "i18next";

/**
 * Calculates the current study year based on the graduation year
 */
export const getStudentYear = (graduationYear: number) => {
  const maxStudyYears = 3;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const academicYear = currentMonth >= 8 ? currentYear + 1 : currentYear;
  const yearsLeft = graduationYear - academicYear;
  const currentStudyYear = maxStudyYears - yearsLeft;
  const studyLevel = [
    t("account.firstYear"),
    t("account.secondYear"),
    t("account.thirdYear"),
  ];

  if (currentStudyYear > maxStudyYears || currentStudyYear <= 0) {
    return `${t("account.promotion")} ${graduationYear}`;
  }

  return studyLevel[currentStudyYear - 1];
};