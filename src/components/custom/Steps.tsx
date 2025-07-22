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

  return (
    <View
      className={`shrink-0 flex-row items-start justify-between w-[${2.5 * (steps.length * 2 - 1)}rem]`}
    >
      {steps.map((step, index) => (
        <View
          key={step.title}
          className={`flex flex-col items-center w-[${5}rem]`}
        >
          <View
            style={
              index + 1 <= currentStep ? {} : { backgroundColor: theme.card }
            }
            className={`rounded-full flex items-center justify-center relative ${index + 1 <= currentStep ? "bg-primary" : ""} h-10 w-10`}
          >
            <Text className="text-center text-white">{index + 1}</Text>
            {index < steps.length - 1 && (
              <View
                style={
                  index + 1 < currentStep ? {} : { backgroundColor: theme.card }
                }
                className={`absolute -z-10 left-[1.25rem] top-[0.625rem] w-[5rem] h-5 ${index + 1 < currentStep ? "bg-primary" : ""}`}
              />
            )}
          </View>
          <Text className="text-center text-white">{step.title}</Text>
        </View>
      ))}
    </View>
  );
}

export default Steps;
