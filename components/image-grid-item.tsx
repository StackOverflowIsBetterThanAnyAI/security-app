import { useState } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

const errorImageSource = require('./../assets/images/error.webp')

type ImageGridItemProps = {
    item: string
    index: number
    url: string
    userToken: string
    setImageHighlighted: React.Dispatch<React.SetStateAction<string | null>>
    bottomRowIndices: number[]
}

const ImageGridItem = ({
    item,
    index,
    url,
    userToken,
    setImageHighlighted,
    bottomRowIndices,
}: ImageGridItemProps) => {
    const [imageLoadFailed, setImageLoadFailed] = useState(false)
    const backgroundColor = useThemeColor({}, 'highlight')

    const safeItem = encodeURI(item)
    const fullUriWithToken = `${url}${safeItem}?token=${userToken}`

    const imageSource = imageLoadFailed
        ? errorImageSource
        : { uri: fullUriWithToken }

    const styles = StyleSheet.create({
        image: {
            height: '100%',
            width: '100%',
        },
        imageWrapper: {
            backgroundColor,
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
                !bottomRowIndices.includes(index) ? { marginBottom: 16 } : {},
            ]}
        >
            <Pressable
                accessible={true}
                accessibilityRole="button"
                onPress={() => setImageHighlighted(fullUriWithToken)}
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
                    onError={() => setImageLoadFailed(true)}
                />
            </Pressable>
        </View>
    )
}

export default ImageGridItem
