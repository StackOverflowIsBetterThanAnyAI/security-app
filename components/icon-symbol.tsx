import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SymbolWeight } from 'expo-symbols'
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native'

export type IconMapping = keyof typeof MAPPING

const MAPPING = {
    'chevron-left': 'chevron-elft',
    'chevron-right': 'chevron-right',
    error: 'error',
    'expand-less': 'expand-less',
    home: 'home',
    login: 'login',
    person: 'person',
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
