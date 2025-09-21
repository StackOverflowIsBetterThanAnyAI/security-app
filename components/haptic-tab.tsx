import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { PlatformPressable } from '@react-navigation/elements'

const HapticTab = (props: BottomTabBarButtonProps) => {
    return (
        <PlatformPressable
            {...props}
            onPressIn={(ev) => {
                props.onPressIn?.(ev)
            }}
        />
    )
}

export default HapticTab
