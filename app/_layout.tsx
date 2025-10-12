import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import 'react-native-reanimated'

import { ContextError } from '@/context/ContextError'
import { ContextUser, UserRoleType } from '@/context/ContextUser'
import { loadData } from '@/helper/storeData'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useThemeColor } from '@/hooks/use-theme-color'

export const unstable_settings = {
    anchor: '(tabs)',
}

const RootLayout = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [retryFn, setRetryFn] = useState<(() => void) | null>(null)
    const [userName, setUserName] = useState<string>('')
    const [userRole, setUserRole] = useState<UserRoleType>('user')
    const [userToken, setUserToken] = useState<string>('')

    const colorScheme = useColorScheme()
    const activityColor = useThemeColor({}, 'text')
    const backgroundColor = useThemeColor({}, 'background')
    const router = useRouter()

    useEffect(() => {
        const autoLogin = async () => {
            const data = await loadData(['authName', 'authRole', 'authToken'])
            if (data?.authToken && data?.authName && data?.authRole) {
                setIsUserLoggedIn(true)
                setUserName(data.authName)
                setUserRole(data.authRole as UserRoleType)
                setUserToken(data.authToken)
            }
            setIsLoading(false)
        }
        autoLogin()
    }, [])

    useEffect(() => {
        if (!isLoading && isUserLoggedIn) {
            router.replace(
                userRole === 'user' ? '/(tabs)/user' : '/(tabs)/home'
            )
        }
    }, [isLoading, isUserLoggedIn, router, userRole])

    const [fontsLoaded] = useFonts({
        ...MaterialCommunityIcons.font,
    })

    if (!fontsLoaded || isLoading) {
        return (
            <View
                style={{
                    alignItems: 'center',
                    backgroundColor,
                    flex: 1,
                    justifyContent: 'center',
                }}
            >
                <ActivityIndicator size="large" color={activityColor} />
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
