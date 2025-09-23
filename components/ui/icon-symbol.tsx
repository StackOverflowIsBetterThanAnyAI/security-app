import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SymbolWeight } from 'expo-symbols'
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native'

type IconMapping = keyof typeof MAPPING

const MAPPING = {
    home: 'home',
    send: 'send',
    code: 'code',
    'chevron-right': 'chevron_right',
    favorite: 'favorite',
    notifications: 'notifications',
    login: 'login',
} as const

const IconSymbol = ({
    name,
    size = 24,
    color,
    style,
}: {
    name: IconMapping
    size?: number
    color: string | OpaqueColorValue
    style?: StyleProp<TextStyle>
    weight?: SymbolWeight
}) => {
    return <MaterialIcons color={color} size={size} name={name} style={style} />
}

export default IconSymbol
