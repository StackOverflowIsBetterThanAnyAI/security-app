import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native'

type ImageGridProps = {
    // TODO: maybe adjust any type
    images: any[]
    setImageHighlighted: React.Dispatch<React.SetStateAction<string>>
}

const ImageGrid = ({ images, setImageHighlighted }: ImageGridProps) => {
    return (
        <FlatList
            data={images}
            keyExtractor={(_, index) => index.toString()}
            numColumns={2}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
                <View
                    style={[
                        styles.imageWrapper,
                        index % 2 === 0
                            ? { paddingRight: 8 }
                            : { paddingLeft: 8 },
                        // TODO: 18, 19 hardcoded
                        ![18, 19].includes(index) ? { paddingBottom: 16 } : {},
                    ]}
                >
                    <Pressable
                        accessible={true}
                        accessibilityRole="button"
                        onPress={() => setImageHighlighted(item)}
                        style={({ pressed }) => [
                            { opacity: pressed ? 0.75 : 1 },
                        ]}
                    >
                        <Image
                            alt={item}
                            source={{ uri: item }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </Pressable>
                </View>
            )}
        />
    )
}

const styles = StyleSheet.create({
    image: {
        height: '100%',
        width: '100%',
    },
    imageWrapper: {
        aspectRatio: 16 / 9,
        flex: 1,
    },
})

export default ImageGrid
