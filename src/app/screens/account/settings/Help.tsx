import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  SquareArrowOutUpRight,
} from "lucide-react-native";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, TouchableOpacity, View } from "react-native";
import { Divider } from "@/components/common/Divider";
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
  const faqId = useId();
  const contactId = useId();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

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
    <Page goBack className="gap-6" title={t("settings.help.title")}>
      <Text className="mx-4 mb-2" color="muted">
        {t("settings.help.description")}
      </Text>

      <Tabs defaultValue={faqId}>
        <TabsList>
          <TabsTrigger id={faqId} title={t("settings.help.faq")} value="faq" />
          <TabsTrigger
            id={contactId}
            title={t("settings.help.contactUs")}
            value="contact"
          />
        </TabsList>

        <TabsContent value="faq">
          <View
            className="rounded-lg p-2"
            style={{ backgroundColor: theme.card }}
          >
            {faqs.map((faq, index) => (
              <View key={faq.question} className="px-4 py-2">
                <TouchableOpacity
                  onPress={() => toggleFaq(index)}
                  className="flex-row justify-between items-center py-3"
                >
                  <View className="flex-row items-center gap-2 flex-1 max-w-[80%]">
                    <HelpCircle size={20} color={theme.text} />
                    <Text>{faq.question}</Text>
                  </View>
                  {expandedFaq === index ? (
                    <ChevronUp size={18} color={theme.muted} />
                  ) : (
                    <ChevronDown size={18} color={theme.muted} />
                  )}
                </TouchableOpacity>

                {expandedFaq === index && (
                  <View className="pl-8 pr-4 pb-2">
                    <Text color="muted">{faq.answer}</Text>
                  </View>
                )}
                {index < faqs.length - 1 && expandedFaq !== index && (
                  <View className="ml-8 mr-4">
                    <Divider />
                  </View>
                )}
              </View>
            ))}
          </View>
        </TabsContent>

        <TabsContent value="contact" className="gap-4">
          <View className="gap-2">
            <View
              className="rounded-lg px-4 py-2"
              style={{ backgroundColor: theme.card }}
            >
              <TouchableOpacity
                className="flex-row justify-between items-center py-4"
                onPress={openWhatsApp}
              >
                <View className="flex-row items-center gap-3">
                  <SquareArrowOutUpRight size={22} color={theme.text} />
                  <View className="ml-2.5 max-w-[80%]">
                    <Text>{t("settings.help.joinWhatsApp")}</Text>
                    <Text className="break-words" color="muted" variant="sm">
                      {t("settings.help.joinCommunity")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default Help;
