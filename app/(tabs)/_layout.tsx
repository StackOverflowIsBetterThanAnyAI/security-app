import { Tabs } from 'expo-router'

import HapticTab from '@/components/haptic-tab'
import IconSymbol, { IconMapping } from '@/components/icon-symbol'
import { Colors } from '@/constants/theme'
import { ContextIsLoggedIn } from '@/context/ContextLogin'
import { ContextIsLoginFailed } from '@/context/ContextLoginFailed'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useContext } from 'react'

const TabLayout = () => {
    const contextIsLoggedIn = useContext(ContextIsLoggedIn)
    if (!contextIsLoggedIn) {
        throw new Error(
            'TabLayout must be used within a ContextIsLoggedIn.Provider'
        )
    }
    const [isLoggedIn, _setIsLoggedIn] = contextIsLoggedIn

    const contextIsLoginFailed = useContext(ContextIsLoginFailed)
    if (!contextIsLoginFailed) {
        throw new Error(
            'TabLayout must be used within a ContextIsLoginFailed.Provider'
        )
    }
    const [isLoginFailed, _setIsLoginFailed] = contextIsLoginFailed

    const colorScheme = useColorScheme()

    const getTabIcon =
        (name: IconMapping) =>
        ({ color, focused }: { color: string; focused: boolean }) =>
            <IconSymbol size={focused ? 32 : 28} name={name} color={color} />

    return (
        <Tabs
            initialRouteName={isLoggedIn ? 'index' : 'login'}
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: { height: 96 },
                tabBarLabelStyle: { margin: 2 },
            }}
        >
            <Tabs.Screen
                name="error"
                options={{
                    title: 'Error',
                    tabBarIcon: getTabIcon('error'),
                    href: isLoginFailed ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: getTabIcon('home'),
                    href: isLoggedIn && !isLoginFailed ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="login"
                options={{
                    title: 'Login',
                    tabBarIcon: getTabIcon('login'),
                    href: !isLoggedIn && !isLoginFailed ? undefined : null,
                }}
            />
        </Tabs>
    )
}

export default TabLayout
