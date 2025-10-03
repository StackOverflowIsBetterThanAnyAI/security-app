import { Tabs, usePathname, useRouter } from 'expo-router'
import { useContext, useEffect } from 'react'

import HapticTab from '@/components/haptic-tab'
import IconSymbol, { IconMapping } from '@/components/icon-symbol'
import { Colors } from '@/constants/theme'
import { ContextLoginError } from '@/context/ContextLoginError'
import { ContextUser } from '@/context/ContextUser'
import { useColorScheme } from '@/hooks/use-color-scheme'

const TabLayout = () => {
    const contextLoginError = useContext(ContextLoginError)
    if (!contextLoginError) {
        throw new Error(
            'TabLayout must be used within a ContextLoginError.Provider'
        )
    }
    const [loginError, _setLoginError] = contextLoginError

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('TabLayout must be used within a ContextUser.Provider')
    }
    const { isUserLoggedIn, userName } = contextUser

    const colorScheme = useColorScheme()
    const router = useRouter()
    const pathname = usePathname()

    // TODO
    useEffect(() => {
        if (loginError.length > 0 && pathname !== '/error') {
            router.replace('/error')
        } else if (isUserLoggedIn && pathname !== '/home') {
            router.replace('/home')
        } else if (
            !isUserLoggedIn &&
            loginError.length === 0 &&
            pathname !== '/login'
        ) {
            router.replace('/login')
        }
    }, [isUserLoggedIn, loginError, pathname])

    const getTabIcon =
        (name: IconMapping) =>
        ({ color, focused }: { color: string; focused: boolean }) =>
            <IconSymbol size={focused ? 30 : 28} name={name} color={color} />

    return (
        <Tabs
            initialRouteName={isUserLoggedIn ? 'home' : 'login'}
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
                    href: loginError.length > 0 ? undefined : null,
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: getTabIcon('home'),
                    href:
                        isUserLoggedIn && loginError.length === 0
                            ? undefined
                            : null,
                }}
            />
            <Tabs.Screen
                name="login"
                options={{
                    title: 'Login',
                    tabBarIcon: getTabIcon('login'),
                    href:
                        !isUserLoggedIn && loginError.length === 0
                            ? undefined
                            : null,
                }}
            />
            <Tabs.Screen
                name="user"
                options={{
                    title: userName ?? 'Profile',
                    tabBarIcon: getTabIcon('person'),
                    href:
                        isUserLoggedIn && loginError.length === 0
                            ? undefined
                            : null,
                }}
            />
        </Tabs>
    )
}

export default TabLayout
