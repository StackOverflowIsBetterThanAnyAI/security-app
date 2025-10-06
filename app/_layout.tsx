import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View } from 'react-native'
import 'react-native-reanimated'

import { ContextError } from '@/context/ContextError'
import { ContextUser, UserRoleType } from '@/context/ContextUser'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useState } from 'react'

export const unstable_settings = {
    anchor: '(tabs)',
}

const RootLayout = () => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [retryFn, setRetryFn] = useState<(() => void) | null>(null)
    const [userName, setUserName] = useState<string>('')
    const [userRole, setUserRole] = useState<UserRoleType>('user')
    const [userToken, setUserToken] = useState<string>('')

    const colorScheme = useColorScheme()

    const [fontsLoaded] = useFonts({
        ...MaterialCommunityIcons.font,
    })

    if (!fontsLoaded) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            <ContextError.Provider
                value={{ error, retryFn, setError, setRetryFn }}
            >
                <ContextUser.Provider
                    value={{
                        isUserLoggedIn,
                        setIsUserLoggedIn,
                        userName,
                        setUserName,
                        userRole,
                        setUserRole,
                        userToken,
                        setUserToken,
                    }}
                >
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                    </Stack>
                    <StatusBar style="auto" />
                </ContextUser.Provider>
            </ContextError.Provider>
        </ThemeProvider>
    )
}

export default RootLayout
