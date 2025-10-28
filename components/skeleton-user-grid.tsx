import SkeletonUserGridItem from '@/components/skeleton-user-grid-item'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useEffect, useRef } from 'react'
import { Animated, FlatList, StyleSheet } from 'react-native'

const SkeletonUserGrid = () => {
    const fadeAnim = useRef(new Animated.Value(0.6)).current

    const backgroundColor = useThemeColor({}, 'background')
    const borderColor = useThemeColor({}, 'border')

    const users = Array.from({ length: 3 }, (_, i) => i)

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0.85,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.6,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start()
    }, [fadeAnim])

    const styles = StyleSheet.create({
        button: {
            backgroundColor,
            borderColor,
            borderRadius: 12,
            borderWidth: 2,
            height: 48,
            marginHorizontal: 'auto',
            marginTop: 8,
            paddingVertical: 8,
            paddingHorizontal: 24,
            width: 144,
        },
    })

    return (
        <>
            <Animated.View style={[styles.button, { opacity: fadeAnim }]} />
            <FlatList
                data={users}
                keyExtractor={(item) => item.toString()}
                scrollEnabled={false}
                style={{
                    marginHorizontal: 8,
                }}
                renderItem={() => <SkeletonUserGridItem opacity={fadeAnim} />}
            />
        </>
    )
}

export default SkeletonUserGrid
