import type {ImageSourcePropType} from 'react-native';
import {Dimensions, Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import {useEffect, useState} from 'react';

interface CardProps {
    title?: string;
    description?: string;
    image?: ImageSourcePropType | null;
    onPress: () => void;
}

const Card = ({title, description, image, onPress}: CardProps) => {
    const [imageHeight, setImageHeight] = useState(200);
    const screenWidth = Dimensions.get('window').width;
    const imageWidth = screenWidth - 40;

    useEffect(() => {
        if (image && typeof image !== 'number') {
            if ("uri" in image) {
                if (image.uri != null) {
                    Image.getSize(image.uri, (width, height) => {
                        // Calculate height based on screen width and aspect ratio
                        const aspectRatio = width / height;
                        setImageHeight(imageWidth / aspectRatio);
                    }, (error) => {
                        console.log('Error loading image:', error);
                    });
                }
            }
        } else if (image) {
            const sourceImage = Image.resolveAssetSource(image);
            const aspectRatio = sourceImage.width / sourceImage.height;
            setImageHeight(imageWidth / aspectRatio);
        }
    }, [image, imageWidth]);

    return (
        <TouchableWithoutFeedback onPress={onPress} accessible={true}>
            <View
                style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 10,
                    paddingBottom: 5,
                }}>
                {image && (
                    <Image
                        source={image}
                        resizeMode="contain"
                        style={{
                            width: imageWidth,
                            height: imageHeight,
                            borderRadius: 10,
                        }}
                    />
                )}

                {title && (
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            marginBottom: 4,
                            color: '#000'
                        }}>
                        {title}
                    </Text>
                )}

                {description && (
                    <Text
                        numberOfLines={3}
                        ellipsizeMode="tail"
                        style={{
                            fontSize: 14,
                            color: '#666',
                            fontWeight: '300',
                            marginBottom: 8
                        }}>
                        {description}
                    </Text>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Card;