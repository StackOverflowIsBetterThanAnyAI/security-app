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

import { useColorScheme } from '@/hooks/use-color-scheme'

export const unstable_settings = {
    anchor: '(tabs)',
}

const RootLayout = () => {
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
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="modal"
                    options={{ presentation: 'modal', title: 'Modal' }}
                />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    )
}

export default RootLayout
