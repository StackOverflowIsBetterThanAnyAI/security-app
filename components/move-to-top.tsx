import { useEffect, useRef } from 'react'
import { Animated, Pressable, ScrollView, StyleSheet } from 'react-native'

import IconSymbol from '@/components/icon-symbol'
import { useThemeColor } from '@/hooks/use-theme-color'

type MoveToTopProps = {
    isVisible: boolean
    scrollRef: React.RefObject<ScrollView | null>
}

const MoveToTop = ({ isVisible, scrollRef }: MoveToTopProps) => {
    const backgroundColor = useThemeColor({}, 'background')
    const borderColor = useThemeColor({}, 'border')
    const color = useThemeColor({}, 'text')

    const opacity = useRef(new Animated.Value(0)).current

    const handlePress = () => {
        scrollRef.current?.scrollTo({ y: 0, animated: true })
    }

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: isVisible ? 1 : 0,
            duration: 150,
            useNativeDriver: true,
        }).start()
    }, [isVisible, opacity])

    const styles = StyleSheet.create({
        wrapper: {
            alignItems: 'center',
            backgroundColor,
            borderColor,
            borderRadius: 32,
            borderWidth: 2,
            bottom: 16,
            height: 64,
            justifyContent: 'center',
            position: 'absolute',
            right: 16,
            width: 64,
        },
    })

    return (
        <Animated.View style={[styles.wrapper, { opacity }]}>
            <Pressable
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Move to the Top"
                style={({ pressed }) => [
                    pressed && {
                        opacity: 0.75,
                    },
                ]}
                onPress={handlePress}
            >
                <IconSymbol size={28} name={'expand-less'} color={color} />
            </Pressable>
        </Animated.View>
    )
}

export default MoveToTop
