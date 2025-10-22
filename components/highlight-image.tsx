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
import { downloadImage } from '@/utils/downloadImage'

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

    const formattedDate = () => {
        if (
            !/security_image_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.jpg/.test(
                imageSource.uri
            )
        ) {
            return ''
        }

        const date = decodeURI(imageSource.uri)
            .replace(/(.jpg.*)$/, '')
            .split(/security_image_/)[1]
            .split(/_/)

        const day = date[0]
        const time = date[1].replace(/-/g, ':')

        return `Recording of ${day} ${time}`
    }

    const handleCloseImage = () => {
        setImageHighlighted(null)
    }

    const handleErrorImage = () => {
        setImageIsLoadedSuccess(false)
    }

    const handlePress = () => {
        const imageName = decodeURI(imageSource.uri)
            .replace(/.*(?=security_image_)/, '')
            .replace(/\.jpg.*$/, '.jpg')
        downloadImage({ imageName, imageSource })
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
            paddingVertical: 12,
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
            <Pressable
                onPress={handlePress}
                style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
            >
                {imageIsLoaded && imageIsLoadedSuccess && imageSource.uri && (
                    <>
                        <Image
                            ref={imageRef}
                            alt={formattedDate() || 'Past Recording'}
                            source={imageSource}
                            style={styles.image}
                            width={width}
                            resizeMode="contain"
                            onError={handleErrorImage}
                        />
                        {formattedDate().length ? (
                            <View style={styles.footer}>
                                <ThemedText center>
                                    {formattedDate()}
                                </ThemedText>
                            </View>
                        ) : undefined}
                    </>
                )}
                {imageIsLoaded && !imageIsLoadedSuccess && (
                    <Image
                        ref={imageRef}
                        alt="Error Image"
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
