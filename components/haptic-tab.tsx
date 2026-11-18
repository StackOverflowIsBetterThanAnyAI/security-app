import { PlatformPressable } from 'expo-router/react-navigation'
import { BottomTabBarButtonProps } from 'expo-router/tabs'

const HapticTab = (props: BottomTabBarButtonProps) => {
    return (
        <PlatformPressable
            {...props}
            // expo-router uses a borderless ripple by default, which renders as an
            // oversized circle on Android that gets clipped by the tab bar
            android_ripple={{ borderless: false }}
            onPressIn={(ev) => {
                props.onPressIn?.(ev)
            }}
        />
    )
}

export default HapticTab
