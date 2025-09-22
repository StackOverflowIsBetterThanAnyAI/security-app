import { useThemeColor } from '@/hooks/use-theme-color'
import { ReactNode } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type MainViewProps = {
    children: ReactNode
}

const MainView = ({ children }: MainViewProps) => {
    const backgroundColor = useThemeColor({}, 'background')

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {children}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        padding: 2,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
    },
})

export default MainView
