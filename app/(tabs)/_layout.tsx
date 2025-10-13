/* eslint-disable react/display-name */

import { Tabs } from 'expo-router'
import { useContext } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import HapticTab from '@/components/haptic-tab'
import IconSymbol, { IconMapping } from '@/components/icon-symbol'
import { ContextError } from '@/context/ContextError'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'

const TabLayout = () => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error('TabLayout must be used within a ContextError.Provider')
    }
    const { error } = contextError

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('TabLayout must be used within a ContextUser.Provider')
    }
    const { isUserLoggedIn, userName, userRole } = contextUser

    const tabBarActiveTintColor = useThemeColor({}, 'tint')
    const tabBarInactiveBackgroundColor = useThemeColor({}, 'background')
    const insets = useSafeAreaInsets()

    const getTabIcon =
        (name: IconMapping) =>
        ({ color, focused }: { color: string; focused: boolean }) =>
            <IconSymbol size={focused ? 30 : 28} name={name} color={color} />

    return (
        <Tabs
            initialRouteName="index"
            backBehavior="fullHistory"
            screenOptions={{
                tabBarActiveTintColor,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: { height: insets.bottom + 64 },
                tabBarLabelStyle: { margin: 2 },
                tabBarInactiveBackgroundColor,
            }}
        >
            <Tabs.Screen
                name="error"
                options={{
                    title: 'Error',
                    tabBarIcon: getTabIcon('error'),
                    href: error.length ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: getTabIcon('home'),
                    href:
                        isUserLoggedIn && !error.length && userRole !== 'user'
                            ? undefined
                            : null,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Login',
                    tabBarIcon: getTabIcon('login'),
                    href: !isUserLoggedIn && !error.length ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="user"
                options={{
                    title: userName ?? 'Profile',
                    tabBarIcon: getTabIcon('person'),
                    href:
                        isUserLoggedIn && !error.length && userRole !== 'admin'
                            ? undefined
                            : null,
                }}
            />
            <Tabs.Screen
                name="admin"
                options={{
                    title: userName ?? 'Profile',
                    tabBarIcon: getTabIcon('person'),
                    href:
                        isUserLoggedIn && !error.length && userRole === 'admin'
                            ? undefined
                            : null,
                }}
            />
        </Tabs>
    )
}

export default TabLayout
