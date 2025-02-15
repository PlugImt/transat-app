import axios from "axios";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

interface VerificationCodeModalProps {
  isVisible: boolean;
  email: string;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

const CELL_COUNT = 6;

export const VerificationCodeModal: React.FC<VerificationCodeModalProps> = ({
  isVisible,
  email,
  onClose,
  onSuccess,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { t } = useTranslation();

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

  // Auto-submit when code is complete
  useEffect(() => {
    if (value.length === CELL_COUNT) {
      handleVerify().then((r) => r);
    }
  }, [value]);

  const handleVerify = async () => {
    if (value.length !== CELL_COUNT) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://transat.destimt.fr/api/auth/verify-account",
        {
          email,
          verification_code: value,
        },
      );

      if (response.status === 200 && response.data.token) {
        onSuccess(response.data.token);
      }
    } catch (err) {
      // @ts-ignore
      setError(t("common.verificationFailed"));
      // setValue('');
    } finally {
      setIsLoading(false);
    }
  };

  const requestNewCode = async () => {
    setIsResending(true);
    setError(null);

    try {
      await axios.post(
        "https://transat.destimt.fr/api/auth/verification-code",
        { email },
      );
      setError(t("auth.errors.codeSent"));
    } catch (err) {
      setError(t("auth.errors.errorSendingCode"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-5/6 items-center rounded-lg bg-[#181010] p-5">
          <Text className="h1">{t("auth.verificationCode")}</Text>
          <Text className="mb-5 text-center text-l p-2 text-[#ffe6cc]">
            {t("auth.enterVerificationCode")}
          </Text>

          {error && (
            <View className="mb-4 w-full rounded-md bg-[#3D1414] p-2.5">
              <Text className="text-center text-[#FF9494]">{error}</Text>
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
                className={`mx-1 flex h-[50px] w-[40px] items-center justify-center rounded-md border bg-[#282020] ${
                  isFocused ? "border-[#ec7f32]" : "border-gray-700"
                }`}
                onLayout={getCellOnLayoutHandler(index)}
              >
                <Text className="text-center text-2xl text-[#ffe6cc]">
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
                <ActivityIndicator size="small" color="#ec7f32" />
              ) : (
                <Text className="text-l text-[#ec7f32] mt-4">
                  {t("auth.resendCode")}
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex w-full flex-row justify-between">
              <TouchableOpacity onPress={onClose} className="p-2">
                <Text className="text-base text-[#ec7f32]">
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleVerify}
                disabled={value.length !== CELL_COUNT || isLoading}
                className={`rounded-md bg-[#ec7f32] px-5 py-2 ${
                  value.length !== CELL_COUNT || isLoading ? "opacity-50" : ""
                }`}
              >
                {isLoading ? (
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
