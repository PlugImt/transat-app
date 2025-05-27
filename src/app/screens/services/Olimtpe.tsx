import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import { useTheme } from "@/contexts/ThemeContext";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View, TouchableOpacity, Linking } from "react-native";
import { Phone, Shield, Heart } from "lucide-react-native";

export const Olimtpe = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const referents = [
    {
      name: t("services.olimtpe.referent1Name"),
      phone: t("services.olimtpe.referent1Phone"),
    },
    {
      name: t("services.olimtpe.referent2Name"),
      phone: t("services.olimtpe.referent2Phone"),
    },
    {
      name: t("services.olimtpe.referent3Name"),
      phone: t("services.olimtpe.referent3Phone"),
    },
    {
      name: t("services.olimtpe.referent4Name"),
      phone: t("services.olimtpe.referent4Phone"),
    },
  ];

  const handlePhoneCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <Page
      goBack
      title={t("services.olimtpe.title")}
      about={
        <AboutModal
          title={t("services.olimtpe.title")}
          description={t("services.olimtpe.about")}
          additionalInfo={t("services.olimtpe.additionalInfo")}
        />
      }
    >
      <View className="flex-1 p-4">
        {/* Header Section */}
        <View className="items-center gap-4 mb-6">
          <Image
            source={require("@/assets/images/Logos/olimtpe.png")}
            className="w-32 h-32"
            resizeMode="contain"
          />
          
          <View className="gap-2">
            <Text className="h2 text-center" style={{ color: theme.text }}>
              {t("services.olimtpe.welcome")}
            </Text>
            
            <Text className="body text-center text-muted-foreground px-4">
              {t("services.olimtpe.description")}
            </Text>
          </View>
        </View>

        {/* Actions Section */}
        <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
          <View className="flex-row items-center justify-center gap-2 mb-3">
            <Shield size={20} color={theme.text} />
            <Text className="h3" style={{ color: theme.text }}>
              {t("services.olimtpe.services")}
            </Text>
          </View>
          <View className="gap-2">
            <Text className="body" style={{ color: theme.text }}>
              • {t("services.olimtpe.service1")}
            </Text>
            <Text className="body" style={{ color: theme.text }}>
              • {t("services.olimtpe.service2")}
            </Text>
            <Text className="body" style={{ color: theme.text }}>
              • {t("services.olimtpe.service3")}
            </Text>
            <Text className="body" style={{ color: theme.text }}>
              • {t("services.olimtpe.service4")}
            </Text>
          </View>
        </View>

        {/* Referents Section */}
        <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <View className="flex-row items-center justify-center gap-2 mb-3">
            <Heart size={20} color={theme.text} />
            <Text className="h3" style={{ color: theme.text }}>
              {t("services.olimtpe.referents")}
            </Text>
          </View>
          
          <Text className="body text-center mb-4 text-muted-foreground">
            {t("services.olimtpe.referentsDescription")}
          </Text>

          <View className="gap-3">
            {referents.map((referent, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePhoneCall(referent.phone)}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg flex-row items-center justify-between shadow-sm"
                style={{ borderColor: theme.border, borderWidth: 1 }}
              >
                <View className="flex-row items-center gap-3">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: theme.primary + '20' }}
                  >
                    <Text className="text-lg font-bold" style={{ color: theme.primary }}>
                      {referent.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  
                  <View>
                    <Text className="font-semibold" style={{ color: theme.text }}>
                      {referent.name}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {t("services.olimtpe.confidential")}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm" style={{ color: theme.text }}>
                    {referent.phone}
                  </Text>
                  <Phone size={16} color={theme.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Contact */}
        <View className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
          <Text className="h3 text-center mb-2" style={{ color: theme.text }}>
            {t("services.olimtpe.contact")}
          </Text>
          <Text className="body text-center" style={{ color: theme.text }}>
            {t("services.olimtpe.contactInfo")}
          </Text>
          <View className="flex-row justify-center mt-3 gap-4">
            <TouchableOpacity
              onPress={() => handlePhoneCall("3919")}
              className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
            >
              <Phone size={16} color="white" />
              <Text className="text-white font-semibold">3919</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePhoneCall("112")}
              className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
            >
              <Phone size={16} color="white" />
              <Text className="text-white font-semibold">112</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Page>
  );
}; 