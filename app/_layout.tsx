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

import { ContextIsLoggedIn } from '@/context/ContextLogin'
import { ContextIsLoginFailed } from '@/context/ContextLoginFailed'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useState } from 'react'

export const unstable_settings = {
    anchor: '(tabs)',
}

const RootLayout = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(false)
    const [isLoginFailed, setIsLoginFailed] = useState<boolean | undefined>(
        false
    )

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
                <ContextIsLoginFailed.Provider
                    value={[isLoginFailed, setIsLoginFailed]}
                >
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                    </Stack>
                    <StatusBar style="auto" />
                </ContextIsLoginFailed.Provider>
            </ContextIsLoggedIn.Provider>
        </ThemeProvider>
    )
}

export default RootLayout
