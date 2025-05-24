import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  type ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CardProps {
  title?: string;
  description?: string;
  image?: ImageSourcePropType | null;
  animation?: string;
  width?: number;
  onPress: () => void;
}

const Card = ({ title, description, image, width, onPress }: CardProps) => {
  const [imageHeight, setImageHeight] = useState(200);
  const { theme } = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = width || screenWidth - 40;

  useEffect(() => {
    if (image && typeof image !== "number") {
      if ("uri" in image) {
        if (image.uri != null) {
          Image.getSize(
            image.uri,
            (width, height) => {
              const aspectRatio = width / height;
              setImageHeight(imageWidth / aspectRatio);
            },
            (error) => {
              console.log("Error loading image:", error);
            },
          );
        }
      }
    } else if (image) {
      const sourceImage = Image.resolveAssetSource(image);
      const aspectRatio = sourceImage.width / sourceImage.height;
      setImageHeight(imageWidth / aspectRatio);
    }
  }, [image, imageWidth]);

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 5,
        }}
      >
        {image && (
          <Image
            source={image}
            resizeMode="contain"
            style={{
              width: imageWidth,
              height: imageHeight,
              borderRadius: 10,
              backgroundColor: theme.card,
            }}
          />
        )}
        {title && (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 4,
              color: theme.foreground,
            }}
          >
            {title}
          </Text>
        )}
        {description && (
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={{
              fontSize: 14,
              color: theme.muted,
              fontWeight: "300",
              marginBottom: 8,
            }}
          >
            {description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Card;
