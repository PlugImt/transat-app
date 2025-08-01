import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Modal, TouchableOpacity, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/account/useAuth";

interface VerificationCodeModalProps {
  isVisible: boolean;
  email: string;
  onClose: () => void;
}

const CELL_COUNT = 6;

export const VerificationCodeModal: React.FC<VerificationCodeModalProps> = ({
  isVisible,
  email,
  onClose,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { verifyCode, isVerifying, isResending, resendCode } = useAuth();

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (isVisible) {
      setValue("");
      setError(null);
    }
  }, [isVisible]);

  const handleVerify = useCallback(async () => {
    if (value.length !== CELL_COUNT) return;

    setError(null);
    const { success } = await verifyCode(email, value);
    if (!success) {
      setError(t("common.verificationFailed"));
    }
  }, [value, verifyCode, email, t]);

  // Auto-submit when code is complete
  useEffect(() => {
    if (value.length === CELL_COUNT) {
      handleVerify();
    }
  }, [value, handleVerify]);

  const requestNewCode = async () => {
    setError(null);
    resendCode(email);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.backdrop }}
      >
        <View
          className="w-5/6 items-center rounded-lg p-5"
          style={{ backgroundColor: theme.card }}
        >
          <Text variant="h1">{t("auth.verificationCode")}</Text>
          <Text className="mb-5 text-center p-2">
            {t("auth.enterVerificationCode")}
          </Text>

          {error && (
            <View
              className="mb-4 w-full rounded-md p-2.5"
              style={{ backgroundColor: theme.destructiveBackground }}
            >
              <Text className="text-center" color="destructive">
                {error}
              </Text>
            </View>
          )}

          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoFocus={true}
            renderCell={({ index, symbol, isFocused }) => (
              <View
                key={index}
                className="mx-1 flex h-[50px] w-[40px] items-center justify-center rounded-md border"
                style={{
                  backgroundColor: theme.input,
                  borderColor: isFocused ? theme.primary : theme.muted,
                }}
                onLayout={getCellOnLayoutHandler(index)}
              >
                <Text className="text-center text-2xl">
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />

          <View className="w-full items-center">
            <TouchableOpacity
              onPress={requestNewCode}
              disabled={isResending}
              className="mb-4 p-1"
            >
              {isResending ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <Text className="text-l mt-4" style={{ color: theme.primary }}>
                  {t("auth.resendCode")}
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex w-full flex-row justify-between">
              <TouchableOpacity onPress={onClose} className="p-2">
                <Text className="text-base" style={{ color: theme.primary }}>
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleVerify}
                disabled={value.length !== CELL_COUNT || isVerifying}
                className={`rounded-md px-5 py-2 ${
                  value.length !== CELL_COUNT || isVerifying ? "opacity-50" : ""
                }`}
                style={{ backgroundColor: theme.primary }}
              >
                {isVerifying ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-base text-white">
                    {t("common.verify")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
