import React from 'react'
import { FlatList, Image, StyleSheet, View } from 'react-native'

type ImageGridProps = {
    images: any[]
}

const ImageGrid = ({ images }: ImageGridProps) => {
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
                    <Image
                        source={item}
                        style={styles.image}
                        resizeMode="cover"
                    />
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
        aspectRatio: '16/9',
        flex: 1,
    },
})

export default ImageGrid
