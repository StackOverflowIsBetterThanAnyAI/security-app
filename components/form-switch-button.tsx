import { useThemeColor } from '@/hooks/use-theme-color'
import React, { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet } from 'react-native'

type FormSwitchProps = {
    handleClick: () => void
    isSigningUp: boolean
    isSignUpField?: boolean
    text: string
}

const FormSwitchButton = ({
    handleClick,
    isSignUpField = false,
    isSigningUp,
    text,
}: FormSwitchProps) => {
    const borderColor = useThemeColor({}, 'border')
    const backgroundColorActive = useThemeColor({}, 'red')
    const backgroundColorInactive = useThemeColor({}, 'redInactive')
    const textColorActive = useThemeColor({}, 'buttonActive')
    const textColorInactive = useThemeColor({}, 'buttonInactive')

    const animation = useRef(
        new Animated.Value(isSignUpField === isSigningUp ? 1 : 0)
    ).current

    useEffect(() => {
        Animated.timing(animation, {
            toValue: isSignUpField === isSigningUp ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start()
    }, [isSigningUp, isSignUpField])

    const backgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [backgroundColorInactive, backgroundColorActive],
    })

    const color = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [textColorInactive, textColorActive],
    })

    return (
        <Pressable
            accessible={true}
            accessibilityRole="button"
            style={({ pressed }) => [
                styles.button,
                isSignUpField ? styles.buttonSignup : styles.buttonLogin,
                pressed && styles.buttonPressed,
                { borderColor },
            ]}
            onPress={handleClick}
        >
            <Animated.View style={[styles.fill, { backgroundColor }]}>
                <Animated.Text style={[styles.text, { color }]}>
                    {text}
                </Animated.Text>
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 2,
        overflow: 'hidden',
    },
    fill: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonLogin: {
        borderBottomLeftRadius: 12,
        borderTopLeftRadius: 12,
        borderRightWidth: 0,
    },
    buttonSignup: {
        borderBottomRightRadius: 12,
        borderTopRightRadius: 12,
        borderLeftWidth: 0,
    },
    buttonPressed: {
        opacity: 0.75,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
})

export default FormSwitchButton
