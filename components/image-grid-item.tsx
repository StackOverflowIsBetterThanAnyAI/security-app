import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

const errorImageSource = require('./../assets/images/error.webp')

type ImageGridItemProps = {
    bottomRowIndices: number[]
    index: number
    item: string
    setImageHighlighted: React.Dispatch<React.SetStateAction<string | null>>
    userToken: string
    url: string
}

const ImageGridItem = ({
    item,
    index,
    url,
    userToken,
    setImageHighlighted,
    bottomRowIndices,
}: ImageGridItemProps) => {
    const [imageIsLoaded, setImageIsLoaded] = useState<boolean>(false)
    const [imageLoadFailed, setImageLoadFailed] = useState(false)

    const activityColor = useThemeColor({}, 'text')
    const backgroundColorPrimary = useThemeColor({}, 'highlight')
    const backgroundColorSecondary = useThemeColor({}, 'buttonInactive')

    const safeItem = encodeURI(item)
    const fullUriWithToken = `${url}${safeItem}?token=${userToken}`

    const imageSource = imageLoadFailed
        ? errorImageSource
        : { uri: fullUriWithToken }

    useEffect(() => {
        setImageIsLoaded(false)
        setImageLoadFailed(false)
    }, [item])

    const handlePress = () => {
        if (imageIsLoaded) {
            setImageHighlighted(fullUriWithToken)
        }
    }

    const styles = StyleSheet.create({
        imageWrapper: {
            backgroundColor: backgroundColorPrimary,
        },
        image: {
            height: '100%',
            opacity: imageIsLoaded ? 1 : 0,
            width: '100%',
        },
        loadingOverlay: {
            alignItems: 'center',
            backgroundColor: backgroundColorSecondary,
            bottom: 0,
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
        },
        wrapper: {
            aspectRatio: 16 / 9,
            width: '50%',
        },
    })

    return (
        <View
            style={[
                styles.wrapper,
                index % 2 === 0 ? { paddingRight: 8 } : { paddingLeft: 8 },
                !bottomRowIndices.includes(index)
                    ? { marginBottom: 16 }
                    : { marginBottom: 0 },
            ]}
        >
            <Pressable
                accessible={true}
                accessibilityRole="button"
                onPress={handlePress}
                style={({ pressed }) => [
                    { opacity: pressed ? 0.75 : 1 },
                    styles.imageWrapper,
                ]}
            >
                <Image
                    alt={item}
                    source={imageSource}
                    style={styles.image}
                    resizeMode="cover"
                    onError={() => {
                        setImageLoadFailed(true)
                        setImageIsLoaded(true)
                    }}
                    onLoad={() => setImageIsLoaded(true)}
                />
                {!imageIsLoaded && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator color={activityColor} size="large" />
                    </View>
                )}
            </Pressable>
        </View>
    )
}

export default ImageGridItem
