import { Animated, StyleSheet, View } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

type SkeletonUserGridItemProps = { opacity: Animated.Value }

const SkeletonUserGridItem = ({ opacity }: SkeletonUserGridItemProps) => {
    const backgroundColor = useThemeColor({}, 'backgroundSecondary')
    const textColor = useThemeColor({}, 'text')

    const styles = StyleSheet.create({
        button: {
            borderColor: textColor,
            borderRadius: 12,
            borderWidth: 2,
            height: 38,
            paddingVertical: 4,
            paddingHorizontal: 16,
            width: 144,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        name: {
            backgroundColor: textColor,
            borderRadius: 12,
            height: 28,
            width: 144,
        },
        textContainer: { alignItems: 'flex-end', flexDirection: 'row', gap: 2 },
        wrapper: {
            backgroundColor,
            borderRadius: 8,
            flexDirection: 'column',
            gap: 12,
            height: 96,
            justifyContent: 'space-between',
            marginBottom: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
        },
    })

    return (
        <Animated.View style={[styles.wrapper, { opacity: opacity }]}>
            <View style={styles.textContainer}>
                <View style={styles.name}></View>
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.button}></View>
                <View style={styles.button}></View>
            </View>
        </Animated.View>
    )
}

export default SkeletonUserGridItem
