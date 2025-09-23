import { Platform } from 'react-native'

const tintColorLight = '#0A7EA4'
const tintColorDark = '#F7F3F3'

export const Colors = {
    light: {
        background: '#F7F4F7',
        border: '#353D42',
        buttonActive: '#F5F3FF',
        buttonInactive: '#3F3B3F',
        icon: '#687076',
        red: '#A71111',
        redInactive: '#E0C9C9',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
        text: '#11181C',
        tint: tintColorLight,
    },
    dark: {
        background: '#151718',
        border: '#D3D3D4',
        buttonActive: '#ECEDEE',
        buttonInactive: '#313432',
        icon: '#9BA1A6',
        red: '#D7110F',
        redInactive: '#DFB8B8',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,
        text: '#ECEDEE',
        tint: tintColorDark,
    },
}

export const Fonts = Platform.select({
    default: {
        sans: 'normal',
        serif: 'serif',
        rounded: 'normal',
        mono: 'monospace',
    },
    web: {
        sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        serif: "Georgia, 'Times New Roman', serif",
        rounded:
            "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
        mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
})
