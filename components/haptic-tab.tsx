import { PlatformPressable } from 'expo-router/react-navigation'
import { BottomTabBarButtonProps } from 'expo-router/tabs'

const HapticTab = (props: BottomTabBarButtonProps) => {
    return (
        <PlatformPressable
            {...props}
            android_ripple={{ borderless: false }}
            onPressIn={(ev) => {
                props.onPressIn?.(ev)
            }}
        />
    )
}

export default HapticTab
