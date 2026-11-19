import { Image } from 'expo-image'
import { useContext, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { RecordingDay } from '@/api/handleApiFetchDays'
import ThemedText from '@/components/themed-text'
import { URL } from '@/constants/api'
import { ContextImageRotation } from '@/context/ContextImageRotation'
import { useThemeColor } from '@/hooks/use-theme-color'
import { formatDay } from '@/utils/formatDay'

const errorImageSource = require('./../assets/images/error.webp')

type DayGridItemProps = {
    day: RecordingDay
    handleSelectDay: (date: string) => void
    index: number
    isLastRow: boolean
    userToken: string
}

const DayGridItem = ({
    day,
    handleSelectDay,
    index,
    isLastRow,
    userToken,
}: DayGridItemProps) => {
    const contextImageRotation = useContext(ContextImageRotation)
    if (!contextImageRotation) {
        throw new Error(
            'DayGridItem must be used within a ContextImageRotation.Provider'
        )
    }
    const { imageRotation } = contextImageRotation

    const backgroundColor = useThemeColor({}, 'background')
    const borderColor = useThemeColor({}, 'border')
    const highlightColor = useThemeColor({}, 'highlight')

    const [imageLoadFailed, setImageLoadFailed] = useState<boolean>(false)

    const label = formatDay(day.date)
    const recordings = `${day.count} Recording${day.count === 1 ? '' : 's'}`

    const imageSource = imageLoadFailed
        ? errorImageSource
        : {
              uri: `${URL}${encodeURI(day.thumbnail)}`,
              headers: { Authorization: `Bearer ${userToken}` },
          }

    const styles = StyleSheet.create({
        card: {
            backgroundColor,
            borderColor,
            borderRadius: 12,
            borderWidth: 2,
            overflow: 'hidden',
        },
        image: {
            aspectRatio: 16 / 9,
            backgroundColor: highlightColor,
            transform: [{ rotate: `${imageRotation}deg` }],
            width: '100%',
        },
        text: {
            paddingHorizontal: 8,
            paddingVertical: 4,
        },
        wrapper: {
            marginBottom: isLastRow ? 0 : 16,
            width: '50%',
        },
    })

    return (
        <View
            style={[
                styles.wrapper,
                index % 2 === 0 ? { paddingRight: 8 } : { paddingLeft: 8 },
            ]}
        >
            <Pressable
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Show Recordings of ${label}, ${recordings}`}
                onPress={() => handleSelectDay(day.date)}
                style={({ pressed }) => [
                    styles.card,
                    { opacity: pressed ? 0.75 : 1 },
                ]}
            >
                <Image
                    alt={label}
                    source={imageSource}
                    style={styles.image}
                    contentFit="cover"
                    onError={() => setImageLoadFailed(true)}
                />
                <View style={styles.text}>
                    <ThemedText center>{label}</ThemedText>
                    <ThemedText center type="error">
                        {recordings}
                    </ThemedText>
                </View>
            </Pressable>
        </View>
    )
}

export default DayGridItem
