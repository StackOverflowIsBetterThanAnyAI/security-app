import { useThemeColor } from '@/hooks/use-theme-color'
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native'

type ImageGridProps = {
    images: string[]
    setImageHighlighted: React.Dispatch<React.SetStateAction<string | null>>
    url: string
    userToken: string
}

const ImageGrid = ({
    images,
    setImageHighlighted,
    url,
    userToken,
}: ImageGridProps) => {
    const backgroundColor = useThemeColor({}, 'highlight')
    const bottomRowIndices: number[] = []
    bottomRowIndices.push(images.length - 1)
    if (images.length % 2 === 0) {
        bottomRowIndices.push(images.length - 2)
    }

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
        <FlatList
            data={images}
            keyExtractor={(_, index) => index.toString()}
            numColumns={2}
            scrollEnabled={false}
            renderItem={({ item, index }) => {
                const fullUriWithToken = `${url}${item}?token=${userToken}`

                return (
                    <View
                        style={[
                            styles.wrapper,
                            index % 2 === 0
                                ? { paddingRight: 8 }
                                : { paddingLeft: 8 },
                            !bottomRowIndices.includes(index)
                                ? { marginBottom: 16 }
                                : {},
                        ]}
                    >
                        <Pressable
                            accessible={true}
                            accessibilityRole="button"
                            onPress={() =>
                                setImageHighlighted(fullUriWithToken)
                            }
                            style={({ pressed }) => [
                                { opacity: pressed ? 0.75 : 1 },
                                styles.imageWrapper,
                            ]}
                        >
                            <Image
                                alt={item}
                                source={{ uri: fullUriWithToken }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </Pressable>
                    </View>
                )
            }}
        />
    )
}

export default ImageGrid
