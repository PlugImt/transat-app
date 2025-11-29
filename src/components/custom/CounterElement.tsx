import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/common/Text";

interface CounterProps {
  displayed_number: number;
  direction?: "up" | "down";
  height?: number;
  width?: number;
  variant?: TextVariant;
  label?: string;
  labelVariant?: TextVariant;
}
type TextVariant = "h1" | "h2" | "h3" | "lg" | "default" | "sm";

function CounterElement({
  displayed_number,
  direction = "up",
  height = 50,
  width = 50,
  variant = "h2",
  label = "sec",
  labelVariant = "h2",
}: CounterProps) {
  if (displayed_number < 0 || displayed_number > 99) displayed_number = 0;

  const [lastNumber, setLastNumber] = useState(displayed_number);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (displayed_number !== lastNumber) {
      setIsAnimating(true);
      setTimeout(() => {
        setLastNumber(displayed_number);
        setIsAnimating(false);
      }, 300);
    }
  }, [displayed_number, lastNumber]);

  return (
    <View className="items-center justify-center">
      <View
        className="relative rounded-md border-2 border-gray-500 "
        style={{
          overflow: "hidden",
          height,
          width,
        }}
      >
        <MotiView
          animate={{
            opacity: isAnimating ? 0 : 1,
            translateY: isAnimating
              ? direction === "up"
                ? -height
                : height
              : 0,
          }}
          transition={{
            type: "timing",
            duration: isAnimating ? 300 : 0,
          }}
          style={{ position: "absolute" }}
          className="flex-row items-center justify-center w-full h-full"
        >
          <View className="flex-row items-center w-full h-full justify-center">
            <Text variant={variant} color="primary">
              {lastNumber.toString().padStart(2, "0")}
            </Text>
          </View>
        </MotiView>
        <MotiView
          animate={{
            opacity: isAnimating ? 1 : 0,
            translateY: isAnimating ? 0 : direction === "up" ? height : -height,
          }}
          transition={{
            type: "timing",
            duration: isAnimating ? 300 : 0,
          }}
          style={{ position: "absolute" }}
          className="flex-row items-center justify-center w-full h-full"
        >
          <View className="flex-row items-center">
            <Text variant={variant} color="primary">
              {displayed_number.toString().padStart(2, "0")}
            </Text>
          </View>
        </MotiView>
      </View>
      <Text variant={labelVariant} className="mb-2 opacity-70">
        {label}
      </Text>
    </View>
  );
}

export { CounterElement };
