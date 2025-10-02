import AsyncStorage from '@react-native-async-storage/async-storage'

export const saveData = async (data: Record<string, string>) => {
    try {
        const entries = Object.entries(data)
        await AsyncStorage.multiSet(entries)
    } catch (error) {
        console.error('Failed to save data', error)
    }
}

// TODO: not implemented yet
export const loadData = async (keys: string[]) => {
    try {
        const result = await AsyncStorage.multiGet(keys)
        return Object.fromEntries(result)
    } catch (error) {
        console.error('Failed to load data', error)
        return null
    }
}

// TODO: not implemented yet
export const clearData = async (keys: string[]) => {
    try {
        await AsyncStorage.multiRemove(keys)
    } catch (error) {
        console.error('Failed to clear data', error)
    }
}
