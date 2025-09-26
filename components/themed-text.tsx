import { StyleSheet, Text, type TextProps } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

export type ThemedTextProps = TextProps & {
    center?: boolean
    darkColor?: string
    isDisabled?: boolean
    lightColor?: string
    type?:
        | 'default'
        | 'error'
        | 'title'
        | 'defaultSemiBold'
        | 'subtitle'
        | 'link'
}

const ThemedText = ({
    center = false,
    darkColor,
    isDisabled = false,
    lightColor,
    style,
    type = 'default',
    ...rest
}: ThemedTextProps) => {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
    const colorInactive = useThemeColor({}, 'textInactive')

    const styles = StyleSheet.create({
        center: {
            textAlign: 'center',
        },
        disabled: {
            color: colorInactive,
        },
        default: {
            fontSize: 16,
            lineHeight: 24,
        },
        defaultSemiBold: {
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '600',
        },
        error: {
            fontSize: 12,
            lineHeight: 20,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            lineHeight: 40,
        },
        subtitle: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        link: {
            lineHeight: 30,
            fontSize: 16,
            color: '#0a7ea4',
        },
    })

    return (
        <Text
            style={[
                { color },
                center ? styles.center : undefined,
                isDisabled ? styles.disabled : undefined,
                type === 'default' ? styles.default : undefined,
                type === 'error' ? styles.error : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                style,
            ]}
            {...rest}
        />
    )
}
export default ThemedText
