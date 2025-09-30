import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SymbolWeight } from 'expo-symbols'
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native'

export type IconMapping = keyof typeof MAPPING

const MAPPING = {
    error: 'error',
    home: 'home',
    login: 'login',
    'expand-less': 'expand-less',
} as const

const IconSymbol = ({
    name,
    size,
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
