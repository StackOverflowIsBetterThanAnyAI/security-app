import { useRef, useState } from 'react'
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'

import ThemedText from '@/components/themed-text'
import { useHighlightImageSize } from '@/hooks/use-highlight-image-size'
import { useThemeColor } from '@/hooks/use-theme-color'

const errorImageSource = require('./../assets/images/error.webp')

type ImageGridProps = {
    imageHighlighted: string | null
    setImageHighlighted: React.Dispatch<React.SetStateAction<string | null>>
}

const HighlightImage = ({
    imageHighlighted,
    setImageHighlighted,
}: ImageGridProps) => {
    const { width, height } = Dimensions.get('window')

    const activityColor = useThemeColor({}, 'text')
    const backgroundColor = useThemeColor({}, 'background')
    const highlightColor = useThemeColor({}, 'highlight')

    const imageRef = useRef<Image>(null)
    const [imageHeight, setImageHeight] = useState<number>(256)
    const [imageIsLoaded, setImageIsLoaded] = useState<boolean>(false)
    const [imageIsLoadedSuccess, setImageIsLoadedSuccess] =
        useState<boolean>(false)

    const imageSource = imageIsLoadedSuccess
        ? { uri: imageHighlighted! }
        : errorImageSource

    const handleCloseImage = () => {
        setImageHighlighted(null)
    }

    const handleErrorImage = () => {
        setImageIsLoadedSuccess(false)
    }

    useHighlightImageSize({
        height,
        imageHighlighted,
        setImageHeight,
        setImageIsLoaded,
        setImageIsLoadedSuccess,
        width,
    })

    const styles = StyleSheet.create({
        activity: { backgroundColor, height: imageHeight },
        footer: {
            backgroundColor,
            paddingHorizontal: 16,
            paddingVertical: 8,
            width: '100%',
        },
        image: {
            backgroundColor,
            height: imageHeight,
        },
        wrapper: {
            backgroundColor: highlightColor,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: '100%',
            zIndex: 10,
        },
    })

    return (
        <Pressable
            accessible={true}
            accessibilityRole="button"
            onPress={handleCloseImage}
            style={[styles.wrapper]}
        >
            <Pressable onPress={() => {}}>
                {imageIsLoaded && imageIsLoadedSuccess && imageSource.uri && (
                    <>
                        <Image
                            ref={imageRef}
                            source={imageSource}
                            style={styles.image}
                            width={width}
                            resizeMode="contain"
                            onError={handleErrorImage}
                        />
                        <View style={styles.footer}>
                            <ThemedText>
                                {decodeURI(imageSource.uri)
                                    .split('/image/')[1]
                                    .replace(/\?.*$/, '')}
                            </ThemedText>
                        </View>
                    </>
                )}
                {imageIsLoaded && !imageIsLoadedSuccess && (
                    <Image
                        ref={imageRef}
                        source={imageSource}
                        style={styles.image}
                        width={width}
                        resizeMode="contain"
                        onError={handleErrorImage}
                    />
                )}
                {!imageIsLoaded && (
                    <ActivityIndicator
                        color={activityColor}
                        size="large"
                        style={styles.activity}
                    />
                )}
            </Pressable>
        </Pressable>
    )
}

export default HighlightImage
