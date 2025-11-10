import { Accordion } from "heroui-native";
import { SquareArrowOutUpRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Linking, View } from "react-native";
import Card from "@/components/common/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";

const Help = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const openWhatsApp = () => {
    Linking.openURL("https://chat.whatsapp.com/EJ2tv8M59kC4Dkgs3AvQBu");
  };

  const faqs = [
    {
      question: t("settings.help.faq1Question"),
      answer: t("settings.help.faq1Answer"),
    },
    {
      question: t("settings.help.faq2Question"),
      answer: t("settings.help.faq2Answer"),
    },
    {
      question: t("settings.help.faq3Question"),
      answer: t("settings.help.faq3Answer"),
    },
    {
      question: t("settings.help.faq4Question"),
      answer: t("settings.help.faq4Answer"),
    },
  ];

  return (
    <Page title={t("settings.help.title")}>
      <Text className="mx-4 mb-2" color="muted">
        {t("settings.help.description")}
      </Text>

      <Tabs defaultValue="faq">
        <TabsList>
          <TabsTrigger title={t("settings.help.faq")} value="faq" />
          <TabsTrigger title={t("settings.help.contactUs")} value="contact" />
        </TabsList>

        <TabsContent value="faq">
          <Card className="px-3 py-2">
            <Accordion selectionMode="single" isDividerVisible={false}>
              {faqs.map((item) => (
                <Accordion.Item
                  key={item.question}
                  value={item.question}
                  className="rounded-lg bg-card"
                  style={{ backgroundColor: theme.card }}
                >
                  <Accordion.Trigger
                    className="gap-2"
                    style={{ backgroundColor: theme.card }}
                  >
                    <Text className="flex-1">{item.question}</Text>
                    <Accordion.Indicator iconProps={{ color: theme.text }} />
                  </Accordion.Trigger>
                  <Accordion.Content style={{ backgroundColor: theme.card }}>
                    <Text color="muted">{item.answer}</Text>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="gap-4">
          <Card onPress={openWhatsApp}>
            <View className="flex-row items-center gap-3">
              <SquareArrowOutUpRight size={22} color={theme.text} />
              <View className="ml-2.5 max-w-[80%]">
                <Text>{t("settings.help.whatsapp.title")}</Text>
                <Text className="wrap-break-word" color="muted" variant="sm">
                  {t("settings.help.whatsapp.description")}
                </Text>
              </View>
            </View>
          </Card>
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default Help;
