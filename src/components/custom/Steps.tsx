import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

interface Step {
  title: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
}

function Steps({ steps, currentStep }: StepsProps) {
  const { theme } = useTheme();

  const isPreviousStep = (index: number) => index + 1 <= currentStep;

  return (
    <View className="flex-row items-start justify-between">
      {steps.map((step, index) => (
        <View key={step.title} className="items-center w-20">
          <View
            style={
              isPreviousStep(index)
                ? { backgroundColor: theme.primary }
                : { backgroundColor: theme.card }
            }
            className="rounded-full flex items-center justify-center relative h-10 w-10"
          >
            <Text
              className="text-center"
              color={isPreviousStep(index) ? "background" : "text"}
            >
              {index + 1}
            </Text>
            {index < steps.length - 1 && (
              <View
                style={
                  isPreviousStep(index + 1)
                    ? { backgroundColor: theme.primary }
                    : { backgroundColor: theme.card }
                }
                className="absolute -z-10 left-[1.25rem] top-[0.625rem] w-[5rem] h-5"
              />
            )}
          </View>
          <Text className="text-center">{step.title}</Text>
        </View>
      ))}
    </View>
  );
}

export default Steps;
