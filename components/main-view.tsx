import { useThemeColor } from '@/hooks/use-theme-color'
import { ReactNode } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type MainViewProps = {
    children: ReactNode
}

const MainView = ({ children }: MainViewProps) => {
    const backgroundColor = useThemeColor({}, 'background')

    const styles = StyleSheet.create({
        safeArea: {
            backgroundColor,
            flex: 1,
        },
        scrollContainer: {
            flexGrow: 1,
            gap: 16,
            padding: 16,
        },
    })

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {children}
            </ScrollView>
        </SafeAreaView>
    )
}

export default MainView
