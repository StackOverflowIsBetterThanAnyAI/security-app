import { useRef, useState } from 'react'
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native'

import { useHighlightImageSize } from '@/hooks/use-highlight-image-size'
import { useThemeColor } from '@/hooks/use-theme-color'
import ThemedText from './themed-text'

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

    const backgroundColor = useThemeColor({}, 'background')
    const highlightColor = useThemeColor({}, 'highlight')

    const imageRef = useRef<Image>(null)
    const [imageHeight, setImageHeight] = useState<number | null>(null)
    const [imageIsLoadFailed, setImageIsLoadFailed] = useState<boolean>(false)
    const imageSource = imageIsLoadFailed
        ? errorImageSource
        : { uri: imageHighlighted! }

    const handleCloseImage = () => {
        setImageHighlighted(null)
    }

    const handleErrorImage = () => {
        setImageIsLoadFailed(true)
    }

    useHighlightImageSize({
        height,
        imageHighlighted,
        setImageHeight,
        setImageIsLoadFailed,
        width,
    })

    const styles = StyleSheet.create({
        footer: {
            backgroundColor,
            paddingHorizontal: 16,
            paddingVertical: 8,
            width: '100%',
        },
        image: {
            height: imageHeight || height * 0.5,
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
                <Image
                    ref={imageRef}
                    source={imageSource}
                    style={styles.image}
                    width={width}
                    resizeMode="contain"
                    onError={handleErrorImage}
                />
                {!imageIsLoadFailed && imageSource.uri && (
                    <View style={styles.footer}>
                        <ThemedText>
                            {imageSource.uri
                                .split('/image/')[1]
                                .replace(/\?.*$/, '')}
                        </ThemedText>
                    </View>
                )}
            </Pressable>
        </Pressable>
    )
}

export default HighlightImage
