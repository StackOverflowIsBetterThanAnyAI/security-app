import { MaterialCommunityIcons } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SymbolWeight } from 'expo-symbols'
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native'

type MAPPING = {
    'chevron-left': 'chevron-elft'
    'chevron-right': 'chevron-right'
    error: 'error'
    'expand-less': 'expand-less'
    home: 'home'
    login: 'login'
    person: 'person'
}

export type IconMapping = keyof MAPPING

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

export const showPassword = (colorInput: string) => (
    <MaterialCommunityIcons name="eye-outline" size={24} color={colorInput} />
)

export const hidePassword = (colorInput: string) => (
    <MaterialCommunityIcons
        name="eye-off-outline"
        size={24}
        color={colorInput}
    />
)

export const noConnection = (colorInput: string) => (
    <MaterialCommunityIcons name="wifi-off" size={48} color={colorInput} />
)

export const noFile = (colorInput: string) => (
    <MaterialCommunityIcons
        name="file-alert-outline"
        size={48}
        color={colorInput}
    />
)

export const noUsers = (colorInput: string) => (
    <MaterialCommunityIcons
        name="account-alert-outline"
        size={48}
        color={colorInput}
    />
)
