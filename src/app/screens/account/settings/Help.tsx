import { Button } from "@/components/common/Button";
import Divider from "@/components/common/Divider";
import Input from "@/components/common/Input";
import Page from "@/components/common/Page";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { useToast } from "@/components/common/Toast";
import { useTheme } from "@/themes/useThemeProvider";
import { useMutation } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  SquareArrowOutUpRight,
} from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Linking, Text, TouchableOpacity, View } from "react-native";

// Type pour le formulaire de contact
type ContactFormData = {
  subject: string;
  message: string;
  email?: string;
};

// API pour envoyer un message d'aide
const sendHelpMessage = async (data: ContactFormData) => {
  // Simuler un appel API - remplacer par votre vrai endpoint
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Pour simuler un appel API réel:
  // const response = await fetch('https://transat.destimt.fr/api/help', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error('Failed to send message');
  // return response.json();

  return { success: true };
};

/**
 * WIP
 */
const Help = () => {
  const theme = useTheme();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // État des sections FAQ (ouverte/fermée)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Ouvrir/fermer une section FAQ
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Configuration de react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    defaultValues: {
      subject: "",
      message: "",
      email: "",
    },
  });

  // Configuration de react-query pour la mutation
  const contactMutation = useMutation({
    mutationFn: sendHelpMessage,
    onSuccess: () => {
      toast(t("settings.help.messageSent"), "success");
      setIsFormOpen(false);
      reset();
    },
    onError: (error) => {
      toast(t("settings.help.messageSendError"), "destructive");
      console.error("Error sending help message:", error);
    },
  });

  // Fonction pour ouvrir un lien WhatsApp
  const openWhatsApp = () => {
    // Remplacer par le vrai lien du groupe WhatsApp
    Linking.openURL("https://chat.whatsapp.com/yourGroupInviteCode");
  };

  // Fonction pour envoyer un email
  const sendEmail = () => {
    Linking.openURL("mailto:support@transat.destimt.fr?subject=Aide%20Transat");
  };
  // /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}

  // Gérer la soumission du formulaire
  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  // Liste des FAQ
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
    <Page className="gap-6">
      <View>
        <Text className="h1 my-4">{t("settings.help.title")}</Text>
        <Text className="text-foreground/70 mb-4">
          {t("settings.help.description")}
        </Text>
      </View>

      <Tabs defaultValue="faq">
        <TabsList>
          <TabsTrigger id="faq" title={t("settings.help.faq")} value="faq" />
          <TabsTrigger
            id="contact"
            title={t("settings.help.contactUs")}
            value="contact"
          />
        </TabsList>
        <TabsContent value="faq">
          {faqs.map((faq, index) => (
            <View key={faq.question} className="p-4 gap-4">
              <TouchableOpacity
                onPress={() => toggleFaq(index)}
                className="flex-row justify-between items-center py-2 border-b border-border/50"
              >
                <View className="flex-row items-center gap-2 flex-1">
                  <Text className="text-foreground">{faq.question}</Text>
                </View>
                {expandedFaq === index ? (
                  <ChevronUp size={18} color={theme.muted} />
                ) : (
                  <ChevronDown size={18} color={theme.muted} />
                )}
              </TouchableOpacity>

              {expandedFaq === index && (
                <Text className="text-foreground/70">{faq.answer}</Text>
              )}
            </View>
          ))}
        </TabsContent>
        <TabsContent value="contact" className="gap-4">
          <Input
            label={t("settings.help.subject")}
            name="subject"
            placeholder={t("settings.help.subjectPlaceholder")}
            error={errors.subject?.message}
            control={control}
          />

          <Input
            name="message"
            label={t("settings.help.message")}
            placeholder={t("settings.help.messagePlaceholder")}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            error={errors.message?.message}
            control={control}
          />

          <Input
            label={t("auth.email")}
            name="email"
            placeholder={t("settings.help.emailPlaceholder")}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            control={control}
            autoComplete="email"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={contactMutation.isPending}
            label={t("common.send")}
          />

          <Divider label={t("common.or")} />

          <Button
            label={t("settings.help.joinWhatsApp")}
            variant="ghost"
            icon={<SquareArrowOutUpRight size="18" color={theme.foreground} />}
            onPress={openWhatsApp}
          />
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default Help;
