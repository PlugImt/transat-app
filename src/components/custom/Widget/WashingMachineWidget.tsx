import { useWashingMachines } from "@/hooks/useWashingMachines";
import type { AppStackParamList } from "@/services/storage/types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { WashingMachineIcon, Wind } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export function WashingMachineWidget() {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();

  const { data, isPending, isError, error, refetch } = useWashingMachines();

  const [totalWashers, setTotalWashers] = useState<number>(0);
  const [totalDryers, setTotalDryers] = useState<number>(0);
  const [availableWashers, setAvailableWashers] = useState<number>(0);
  const [availableDryers, setAvailableDryers] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const washingMachines = data.filter(
        (machine) => machine.nom_type.trim() === "LAVE LINGE",
      );
      const dryers = data.filter(
        (machine) => machine.nom_type.trim() !== "LAVE LINGE",
      );

      setTotalWashers(washingMachines.length);
      setTotalDryers(dryers.length);

      setAvailableWashers(
        washingMachines.filter((machine) => machine.time_before_off === 0)
          .length,
      );
      setAvailableDryers(
        dryers.filter((machine) => machine.time_before_off === 0).length,
      );
    }
  }, [data]);

  if (isPending) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {(error as Error).message}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.subTitle}>{t("services.washing_machine.title")}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("WashingMachine")}
        accessible={true}
        activeOpacity={0.4}
      >
        <View
          style={{
            backgroundColor: "#181010",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ alignItems: "center", flex: 1 }}>
              <WashingMachineIcon
                size={40}
                color={availableWashers === 0 ? "#494949" : "#ec7f32"}
              />
              <Text
                style={{
                  color: "#ffe6cc",
                  fontSize: 16,
                  marginTop: 5,
                }}
              >
                {availableWashers}/{totalWashers}
              </Text>
              <Text
                style={{
                  color: "#ffe6cc",
                  fontSize: 12,
                }}
              >
                {t("services.washing_machine.available_machines")}
              </Text>
            </View>
            <View style={{ alignItems: "center", flex: 1 }}>
              <Wind
                size={40}
                color={availableDryers === 0 ? "#494949" : "#ec7f32"}
              />
              <Text
                style={{
                  color: "#ffe6cc",
                  fontSize: 16,
                  marginTop: 5,
                }}
              >
                {availableDryers}/{totalDryers}
              </Text>
              <Text
                style={{
                  color: "#ffe6cc",
                  fontSize: 12,
                }}
              >
                {t("services.washing_machine.available_dryers")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D0505",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  subTitle: {
    color: "#ffe6cc",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 5,
    marginTop: 5,
  },
});

export default WashingMachineWidget;
