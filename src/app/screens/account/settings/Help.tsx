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
import { RequestHistory } from "@/components/custom/widget/RequestHistory";
import {
  createSupportRequest,
  fetchSupportRequests,
  uploadSupportImage,
} from "@/lib/support";
import { useTheme } from "@/themes/useThemeProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  History,
  Image as ImageIcon,
  RefreshCw,
  SquareArrowOutUpRight,
  X,
} from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

// Type pour le formulaire de contact
type ContactFormData = {
  subject: string;
  message: string;
};

const Help = () => {
  const theme = useTheme();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const contactSchema = z.object({
    subject: z.string().min(1, t("settings.help.subjectRequired")),
    message: z.string().min(1, t("settings.help.messageRequired")),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  // Query for fetching request history
  const {
    data: requests,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["supportRequests"],
    queryFn: fetchSupportRequests,
    enabled: showHistory, // Only fetch when history is shown
  });

  const subject = watch("subject");
  const message = watch("message");

  const handleImageUpload = async () => {
    try {
      setIsUploadingImage(true);
      const url = await uploadSupportImage();
      if (url) {
        setImageUrl(url);
        toast(t("settings.help.imageSent"), "success");
      }
    } catch (error) {
      toast(t("settings.help.imageUploadFailed"), "destructive");
      console.error("Error uploading image:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return createSupportRequest({
        subject: data.subject,
        message: data.message,
        image_url: imageUrl,
      });
    },
    onSuccess: () => {
      toast(t("settings.help.messageSent"), "success");
      reset();
      setImageUrl(undefined);
      // Refetch requests after submitting a new one
      if (showHistory) refetch();
    },
    onError: (error) => {
      toast(t("settings.help.messageFailed"), "destructive");
      console.error("Error sending help message:", error);
    },
  });

  const isButtonDisabled =
    contactSchema.safeParse({ subject, message }).success === false ||
    contactMutation.isPending ||
    isUploadingImage;

  const openWhatsApp = () => {
    Linking.openURL("https://chat.whatsapp.com/EJ2tv8M59kC4Dkgs3AvQBu");
  };

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
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
      <Text className="text-foreground/70 mx-4 mb-2">
        {t("settings.help.description")}
      </Text>

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
          <View className="bg-card rounded-lg p-2">
            {faqs.map((faq, index) => (
              <View key={faq.question} className="px-4 py-2">
                <TouchableOpacity
                  onPress={() => toggleFaq(index)}
                  className="flex-row justify-between items-center py-3"
                >
                  <View className="flex-row items-center gap-2 flex-1">
                    <HelpCircle size={20} color={theme.foreground} />
                    <Text className="text-foreground font-medium">
                      {faq.question}
                    </Text>
                  </View>
                  {expandedFaq === index ? (
                    <ChevronUp size={18} color={theme.muted} />
                  ) : (
                    <ChevronDown size={18} color={theme.muted} />
                  )}
                </TouchableOpacity>

                {expandedFaq === index && (
                  <View className="pl-8 pr-4 pb-2">
                    <Text className="text-foreground/70">{faq.answer}</Text>
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
          {!showHistory ? (
            <>
              <View className="bg-card rounded-lg p-4 gap-4">
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

                {imageUrl ? (
                  <View className="mt-2">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-foreground/70 text-sm">
                        Screenshot:
                      </Text>
                      <TouchableOpacity
                        onPress={() => setImageUrl(undefined)}
                        className="p-1"
                      >
                        <X size={16} color={theme.destructive} />
                      </TouchableOpacity>
                    </View>
                    <Image
                      source={{ uri: imageUrl }}
                      className="w-full h-48 rounded-md"
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <Button
                    onPress={handleImageUpload}
                    label={t("settings.help.addImage")}
                    variant="outlined"
                    loading={isUploadingImage}
                    icon={<ImageIcon size={18} color={theme.foreground} />}
                  />
                )}

                <Button
                  onPress={handleSubmit(onSubmit)}
                  loading={contactMutation.isPending}
                  label={t("common.send")}
                  disabled={isButtonDisabled}
                />
              </View>

              <View className="gap-2">
                <Text className="h3 mx-4">{t("common.other")}</Text>
                <View className="bg-card rounded-lg px-4 py-2">
                  <TouchableOpacity
                    className="flex-row justify-between items-center py-4"
                    onPress={() => {
                      setShowHistory(true);
                      refetch();
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <History size={22} color={theme.foreground} />
                      <View className="ml-2.5">
                        <Text className="text-foreground">
                          {t("settings.help.previousRequests")}
                        </Text>
                        <Text className="text-sm break-words text-foreground/60">
                          {t("settings.help.requestsDescription")}
                        </Text>
                      </View>
                    </View>
                    <ChevronDown size={18} color={theme.muted} />
                  </TouchableOpacity>
                </View>

                <View className="bg-card rounded-lg px-4 py-2">
                  <TouchableOpacity
                    className="flex-row justify-between items-center py-4"
                    onPress={openWhatsApp}
                  >
                    <View className="flex-row items-center gap-3">
                      <SquareArrowOutUpRight
                        size={22}
                        color={theme.foreground}
                      />
                      <View className="ml-2.5">
                        <Text className="text-foreground">
                          {t("settings.help.joinWhatsApp")}
                        </Text>
                        <Text className="text-sm break-words text-foreground/60">
                          {t("settings.help.joinCommunity")}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <>
              <View className="bg-card rounded-lg mb-2">
                <View className="p-4 border-b border-border">
                  <TouchableOpacity
                    onPress={() => setShowHistory(false)}
                    className="flex-row items-center mb-2"
                  >
                    <ChevronUp size={18} color={theme.muted} className="mr-2" />
                    <Text className="text-foreground/60 text-sm">
                      {t("settings.help.contactUs")}
                    </Text>
                  </TouchableOpacity>

                  <View className="flex-row justify-between items-center">
                    <Text className="text-foreground font-medium">
                      {t("settings.help.previousRequests")}
                    </Text>
                    <TouchableOpacity onPress={() => refetch()}>
                      <RefreshCw size={18} color={theme.muted} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="p-4">
                  <RequestHistory
                    requests={requests || []}
                    isLoading={isLoading}
                    onRefresh={refetch}
                  />
                </View>
              </View>

              <Button
                onPress={() => setShowHistory(false)}
                label={t("settings.help.contactUs")}
                variant="outlined"
                size="sm"
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default Help;
