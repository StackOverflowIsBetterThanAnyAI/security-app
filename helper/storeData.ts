import AsyncStorage from '@react-native-async-storage/async-storage'

export const saveData = async (data: Record<string, string>) => {
    try {
        const entries = Object.entries(data)
        await AsyncStorage.multiSet(entries)
    } catch (error: any) {
        console.error('Failed to save data', error)
    }
}

export const loadData = async (keys: string[]) => {
    try {
        const result = await AsyncStorage.multiGet(keys)
        return Object.fromEntries(result)
    } catch (error: any) {
        console.error('Failed to load data', error)
        return null
    }
}

export const clearData = async (keys: string[]) => {
    try {
        await AsyncStorage.multiRemove(keys)
    } catch (error: any) {
        console.error('Failed to clear data', error)
    }
}
