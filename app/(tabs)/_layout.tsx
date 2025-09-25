import { Tabs } from 'expo-router'

import HapticTab from '@/components/haptic-tab'
import IconSymbol, { IconMapping } from '@/components/icon-symbol'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

const TabLayout = () => {
    const colorScheme = useColorScheme()

    const getTabIcon =
        (name: IconMapping) =>
        ({ color, focused }: { color: string; focused: boolean }) =>
            <IconSymbol size={focused ? 32 : 28} name={name} color={color} />

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: { height: 96 },
                tabBarLabelStyle: { margin: 2 },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: getTabIcon('home'),
                }}
            />
            <Tabs.Screen
                name="login"
                options={{
                    title: 'Login',
                    tabBarIcon: getTabIcon('login'),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: getTabIcon('send'),
                }}
            />
        </Tabs>
    )
}

export default TabLayout
