import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";

export const LoadingState = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
	  <Page
		  goBack
		  title={t('services.timetable.title')}
		  about={
			<AboutModal
				title={t('services.timetable.title')}
				description={t('services.timetable.about')}
				additionalInfo={t('services.timetable.additionalInfo')}
			/>
		  }
	  >
		<View className="flex-col">
		  <Text className="text-center" style={{ color: theme.text }}>
			{t('services.timetable.loading')}
		  </Text>
		</View>
	  </Page>
  );
};