// import { Button } from "@/components/common/Button";
// import Page from "@/components/common/Page";
// import { useToast } from "@/components/common/Toast";
// import { useMutation } from "@tanstack/react-query";
// import {
//   ChevronDown,
//   ChevronRight,
//   ChevronUp,
//   HelpCircle,
//   Link,
//   Mail,
//   MessageSquare,
// } from "lucide-react-native";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useTranslation } from "react-i18next";
// import { Linking, Text, View } from "react-native";

// // Type pour le formulaire de contact
// type ContactFormData = {
//   subject: string;
//   message: string;
//   email?: string;
// };

// // API pour envoyer un message d'aide
// const sendHelpMessage = async (data: ContactFormData) => {
//   // Simuler un appel API - remplacer par votre vrai endpoint
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   // Pour simuler un appel API réel:
//   // const response = await fetch('https://transat.destimt.fr/api/help', {
//   //   method: 'POST',
//   //   headers: { 'Content-Type': 'application/json' },
//   //   body: JSON.stringify(data),
//   // });
//   // if (!response.ok) throw new Error('Failed to send message');
//   // return response.json();

//   return { success: true };
// };

// /**
//  * WIP
//  */
// const Help = () => {
//   const { toast } = useToast();
//   const { t } = useTranslation();
//   const [isFormOpen, setIsFormOpen] = useState(false);

//   // État des sections FAQ (ouverte/fermée)
//   const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

//   // Ouvrir/fermer une section FAQ
//   const toggleFaq = (index: number) => {
//     setExpandedFaq(expandedFaq === index ? null : index);
//   };

//   // Configuration de react-hook-form
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<ContactFormData>({
//     defaultValues: {
//       subject: "",
//       message: "",
//       email: "",
//     },
//   });

//   // Configuration de react-query pour la mutation
//   const contactMutation = useMutation({
//     mutationFn: sendHelpMessage,
//     onSuccess: () => {
//       toast(t("settings.help.messageSent"), "success");
//       setIsFormOpen(false);
//       reset();
//     },
//     onError: (error) => {
//       toast(t("settings.help.messageSendError"), "destructive");
//       console.error("Error sending help message:", error);
//     },
//   });

//   // Fonction pour ouvrir un lien WhatsApp
//   const openWhatsApp = () => {
//     // Remplacer par le vrai lien du groupe WhatsApp
//     Linking.openURL("https://chat.whatsapp.com/yourGroupInviteCode");
//   };

//   // Fonction pour envoyer un email
//   const sendEmail = () => {
//     Linking.openURL("mailto:support@transat.destimt.fr?subject=Aide%20Transat");
//   };

//   // Gérer la soumission du formulaire
//   const onSubmit = (data: ContactFormData) => {
//     contactMutation.mutate(data);
//   };

//   // Liste des FAQ
//   const faqs = [
//     {
//       question: t("settings.help.faq1Question"),
//       answer: t("settings.help.faq1Answer"),
//     },
//     {
//       question: t("settings.help.faq2Question"),
//       answer: t("settings.help.faq2Answer"),
//     },
//     {
//       question: t("settings.help.faq3Question"),
//       answer: t("settings.help.faq3Answer"),
//     },
//     {
//       question: t("settings.help.faq4Question"),
//       answer: t("settings.help.faq4Answer"),
//     },
//   ];

//   return (
//     <Page className="mx-4">
//       <Text className="h1 my-4">{t("common.help")}</Text>

//       <View className="mb-6">
//         <Text className="text-foreground text-lg font-medium mb-3">
//           {t("settings.help.needHelp")}
//         </Text>
//         <Text className="text-foreground/70 mb-4">
//           {t("settings.help.description")}
//         </Text>
//       </View>

//       {/* Options de contact */}
//       <View className="bg-card rounded-xl overflow-hidden mb-6">
//         <View className="p-4 border-b border-foreground/10">
//           <Text className="text-foreground font-medium text-base mb-1">
//             {t("settings.help.contactOptions")}
//           </Text>
//           <Text className="text-foreground/60 text-sm">
//             {t("settings.help.chooseOption")}
//           </Text>
//         </View>

//         <Button
//           variant="ghost"
//           onPress={() => setIsFormOpen(true)}
//           className="flex-row justify-between items-center p-4 w-full"
//         >
//           <View className="flex-row items-center">
//             <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center mr-3">
//               <MessageSquare size={20} color="#ec7f32" />
//             </View>
//             <Text className="text-foreground">
//               {t("settings.help.sendMessage")}
//             </Text>
//           </View>
//           <ChevronRight size={18} color="#8A8A8A" />
//         </Button>

//         <Button
//           variant="ghost"
//           onPress={sendEmail}
//           className="flex-row justify-between items-center p-4 w-full"
//         >
//           <View className="flex-row items-center">
//             <View className="w-9 h-9 rounded-full bg-blue-500/10 items-center justify-center mr-3">
//               <Mail size={20} color="#3b82f6" />
//             </View>
//             <Text className="text-foreground">
//               {t("settings.help.sendEmail")}
//             </Text>
//           </View>
//           <ChevronRight size={18} color="#8A8A8A" />
//         </Button>

//         <Button
//           variant="ghost"
//           onPress={openWhatsApp}
//           className="flex-row justify-between items-center p-4 w-full"
//           label=""
//         >
//           <View className="flex-row items-center">
//             <View className="w-9 h-9 rounded-full bg-green-500/10 items-center justify-center mr-3">
//               {/* <WhatsappIcon size={20} color="#25D366" /> */}
//             </View>
//             <Text className="text-foreground">
//               {t("settings.help.joinGroup")}
//             </Text>
//           </View>
//           <ChevronRight size={18} color="#8A8A8A" />
//         </Button>
//       </View>

//       {/* FAQ Section */}
//       <View className="bg-card rounded-xl overflow-hidden mb-6">
//         <View className="p-4 border-b border-foreground/10">
//           <Text className="text-foreground font-medium text-base">
//             {t("settings.help.faq")}
//           </Text>
//         </View>

//         {faqs.map((faq, index) => (
//           <View
//             key={index}
//             className="border-b border-foreground/10 last:border-0"
//           >
//             <Button
//               variant="ghost"
//               onPress={() => toggleFaq(index)}
//               className="flex-row justify-between items-center p-4 w-full"
//             >
//               <View className="flex-row items-center flex-1">
//                 <View className="w-9 h-9 rounded-full bg-foreground/10 items-center justify-center mr-3">
//                   <HelpCircle size={18} color="#ec7f32" />
//                 </View>
//                 <Text className="text-foreground flex-1 mr-2">
//                   {faq.question}
//                 </Text>
//               </View>
//               {expandedFaq === index ? (
//                 <ChevronUp size={18} color="#8A8A8A" />
//               ) : (
//                 <ChevronDown size={18} color="#8A8A8A" />
//               )}
//             </Button>

//             {expandedFaq === index && (
//               <View className="p-4 pt-0 pl-16 bg-card/50">
//                 <Text className="text-foreground/70">{faq.answer}</Text>
//               </View>
//             )}
//           </View>
//         ))}
//       </View>

//       {/* Liens utiles */}
//       <View className="bg-card rounded-xl overflow-hidden mb-8">
//         <View className="p-4 border-b border-foreground/10">
//           <Text className="text-foreground font-medium text-base">
//             {t("settings.help.usefulLinks")}
//           </Text>
//         </View>

//         <Button
//           variant="ghost"
//           onPress={() => Linking.openURL("https://transat.destimt.fr/terms")}
//           className="flex-row justify-between items-center p-4 w-full"
//         >
//           <View className="flex-row items-center">
//             <View className="w-9 h-9 rounded-full bg-foreground/10 items-center justify-center mr-3">
//               <Link size={18} color="#8A8A8A" />
//             </View>
//             <Text className="text-foreground">
//               {t("settings.help.termsOfService")}
//             </Text>
//           </View>
//           <ChevronRight size={18} color="#8A8A8A" />
//         </Button>

//         <Button
//           variant="ghost"
//           onPress={() => Linking.openURL("https://transat.destimt.fr/privacy")}
//           className="flex-row justify-between items-center p-4 w-full"
//         >
//           <View className="flex-row items-center">
//             <View className="w-9 h-9 rounded-full bg-foreground/10 items-center justify-center mr-3">
//               <Link size={18} color="#8A8A8A" />
//             </View>
//             <Text className="text-foreground">
//               {t("settings.help.privacyPolicy")}
//             </Text>
//           </View>
//           <ChevronRight size={18} color="#8A8A8A" />
//         </Button>
//       </View>

//       {/* Formulaire de contact (ActionSheet) */}
//       {/* <Dialog
//         title={t("settings.help.sendMessage")}
//         description={t("settings.help.messageDescription")}
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           reset();
//         }}
//       >
//         <View className="px-4 py-6 gap-4">
//           <Controller
//             control={control}
//             rules={{
//               required: t("settings.help.subjectRequired"),
//               minLength: { value: 5, message: t("settings.help.subjectTooShort") },
//             }}
//             render={({ field: { onChange, onBlur, value } }) => (
//               <Input
//                 label={t("settings.help.subject")}
//                 value={value}
//                 onChangeText={onChange}
//                 onBlur={onBlur}
//                 placeholder={t("settings.help.subjectPlaceholder")}
//                 error={errors.subject?.message}
//               />
//             )}
//             name="subject"
//           />

//           <Controller
//             control={control}
//             rules={{
//               required: t("settings.help.messageRequired"),
//               minLength: { value: 10, message: t("settings.help.messageTooShort") },
//             }}
//             render={({ field: { onChange, onBlur, value } }) => (
//               <Input
//                 label={t("settings.help.message")}
//                 value={value}
//                 onChangeText={onChange}
//                 onBlur={onBlur}
//                 placeholder={t("settings.help.messagePlaceholder")}
//                 multiline
//                 numberOfLines={4}
//                 textAlignVertical="top"
//                 error={errors.message?.message}
//               />
//             )}
//             name="message"
//           />

//           <Controller
//             control={control}
//             rules={{
//               pattern: {
//                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                 message: t("settings.help.invalidEmail"),
//               },
//             }}
//             render={({ field: { onChange, onBlur, value } }) => (
//               <Input
//                 label={`${t("settings.help.email")} (${t("common.other")})`}
//                 value={value}
//                 onChangeText={onChange}
//                 onBlur={onBlur}
//                 placeholder={t("settings.help.emailPlaceholder")}
//                 error={errors.email?.message}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//             )}
//             name="email"
//           />

//           <View className="flex-row gap-4 mt-2">
//             <Button
//               variant="outline"
//               className="flex-1"
//               onPress={() => {
//                 setIsFormOpen(false);
//                 reset();
//               }}
//             >
//               {t("common.cancel")}
//             </Button>
//             <Button
//               className="flex-1"
//               onPress={handleSubmit(onSubmit)}
//               loading={contactMutation.isPending}
//             >
//               {t("settings.help.send")}
//             </Button>
//           </View>
//         </View>
//       </Dialog> */}
//     </Page>
//   );
// };

// export default Help;
