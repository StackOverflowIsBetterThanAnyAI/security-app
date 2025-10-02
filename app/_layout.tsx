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

import { ContextIsLoggedIn } from '@/context/ContextIsLoggedIn'
import { ContextLoginError } from '@/context/ContextLoginError'
import { ContextUserName } from '@/context/ContextUserName'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useState } from 'react'

export const unstable_settings = {
    anchor: '(tabs)',
}

const RootLayout = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(false)
    const [loginError, setLoginError] = useState<string>('')
    const [userName, setUserName] = useState<string>('')

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
            <ContextIsLoggedIn.Provider value={[isLoggedIn, setIsLoggedIn]}>
                <ContextLoginError.Provider value={[loginError, setLoginError]}>
                    <ContextUserName.Provider value={[userName, setUserName]}>
                        <Stack>
                            <Stack.Screen
                                name="(tabs)"
                                options={{ headerShown: false }}
                            />
                        </Stack>
                        <StatusBar style="auto" />
                    </ContextUserName.Provider>
                </ContextLoginError.Provider>
            </ContextIsLoggedIn.Provider>
        </ThemeProvider>
    )
}

export default RootLayout
