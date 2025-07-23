import { MotiView } from "moti";
import { useState } from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

const NUM_BUBBLES = 20;

const Bubble = ({
  fixedY,
  width,
  delay,
}: {
  fixedY: number;
  width: number;
  delay: number;
}) => {
  const { theme } = useTheme();
  const scale = Math.random() * 0.5 + 0.5;
  const opacity = Math.random() * 0.3 + 0.2;
  const duration = Math.random() * 5000 + 7000;

  return (
    <MotiView
      from={{
        translateX: -20, // Commence hors composant à gauche
        translateY: fixedY,
        scale,
        opacity,
      }}
      animate={{
        translateX: width + 20, // Finit hors composant à droite
        translateY: fixedY,
        scale,
        opacity,
      }}
      transition={{
        type: "timing",
        duration,
        delay,
        loop: true,
        repeatReverse: false,
      }}
      style={{
        position: "absolute",
        width: 8,
        height: 8,
        borderRadius: 20,
        backgroundColor: theme.secondary,
      }}
    />
  );
};

const BubbleAnimation = () => {
  const [layout, setLayout] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Génère les positions verticales fixes en fonction de la hauteur du composant
  const bubbleYPositions = layout.height
    ? Array.from(
        { length: NUM_BUBBLES },
        (_, i) =>
          5 + i * ((layout.height - 10) / NUM_BUBBLES) + Math.random() * 5,
      )
    : [];

  // Calcule un délai progressif pour chaque bulle afin d'espacer les départs
  const baseDuration = 10000;

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        opacity: 0.3,
      }}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setLayout({ width, height });
      }}
    >
      {layout.width > 0 &&
        layout.height > 0 &&
        bubbleYPositions.map((fixedY, i) => (
          <Bubble
            key={fixedY.toString()}
            fixedY={fixedY}
            width={layout.width}
            delay={(i * baseDuration) / NUM_BUBBLES}
          />
        ))}
    </View>
  );
};

export default BubbleAnimation;
