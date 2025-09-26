import { MaterialCommunityIcons } from '@expo/vector-icons'

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
