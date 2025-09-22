import { StyleSheet, Text, type TextProps } from 'react-native'

import { useThemeColor } from '@/hooks/use-theme-color'

export type ThemedTextProps = TextProps & {
    center?: boolean
    lightColor?: string
    darkColor?: string
    type?:
        | 'center'
        | 'default'
        | 'title'
        | 'defaultSemiBold'
        | 'subtitle'
        | 'link'
}

const ThemedText = ({
    center = false,
    style,
    lightColor,
    darkColor,
    type = 'default',
    ...rest
}: ThemedTextProps) => {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

    return (
        <Text
            style={[
                { color },
                center ? styles.center : undefined,
                type === 'default' ? styles.default : undefined,
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

const styles = StyleSheet.create({
    center: {
        textAlign: 'center',
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

export default ThemedText
