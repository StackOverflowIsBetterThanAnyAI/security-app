import { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet } from 'react-native'

import IconSymbol from '@/components/icon-symbol'
import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'

type MoveToTopProps = {
    isVisible: boolean
}

const MoveToTop = ({ isVisible }: MoveToTopProps) => {
    const backgroundColor = useThemeColor({}, 'background')
    const borderColor = useThemeColor({}, 'border')
    const color = useThemeColor({}, 'tint')

    const opacity = useRef(new Animated.Value(0)).current

    const handlePress = () => {
        /* TODO */
    }

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: isVisible ? 1 : 0,
            duration: 150,
            useNativeDriver: true,
        }).start()
    }, [isVisible])

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
            marginHorizontal: 'auto',
            marginTop: 8,
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
                <ThemedText style={{ fontSize: 12 }}>Top</ThemedText>
            </Pressable>
        </Animated.View>
    )
}

export default MoveToTop
