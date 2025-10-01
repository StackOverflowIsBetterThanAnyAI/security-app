import { useRef } from 'react'
import { Dimensions, Image, Pressable, StyleSheet } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

type ImageGridProps = {
    imageHighlighted: string
    setImageHighlighted: React.Dispatch<React.SetStateAction<string>>
    // TODO: maybe adjust any type
    source: any
}

const HighlightImage = ({
    imageHighlighted,
    setImageHighlighted,
    source,
}: ImageGridProps) => {
    const { width } = Dimensions.get('window')
    const highlightColor = useThemeColor({}, 'highlight')
    const backgroundColor = useThemeColor({}, 'background')

    const imageRef = useRef<Image>(null)

    const styles = StyleSheet.create({
        image: { backgroundColor },
        wrapper: {
            backgroundColor: highlightColor,
            bottom: 0,
            display: imageHighlighted ? 'flex' : 'none',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: '100%',
            zIndex: 10,
        },
    })

    return (
        <Pressable
            onPress={() => setImageHighlighted('')}
            style={[styles.wrapper]}
        >
            <Pressable onPress={() => {}}>
                <Image
                    ref={imageRef}
                    source={source}
                    style={styles.image}
                    width={width}
                    resizeMode="contain"
                />
            </Pressable>
        </Pressable>
    )
}

export default HighlightImage
