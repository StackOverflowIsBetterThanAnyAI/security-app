import { useThemeColor } from '@/hooks/use-theme-color'
import { ReactNode } from 'react'
import {
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Rect } from 'react-native-svg'

type MainViewProps = {
    children: ReactNode
}

const PatternBackground = () => {
    const { width, height } = Dimensions.get('window')
    const fill = useThemeColor({}, 'rect')

    return (
        <Svg
            width={width}
            height={height}
            style={{ position: 'absolute', top: 0, left: 0, margin: 16 }}
        >
            {Array.from({ length: Math.ceil(width / 64) }).map((_, i) =>
                Array.from({ length: Math.ceil(height / 64) }).map((_, j) => (
                    <Rect
                        key={`${i}-${j}`}
                        x={i * 64}
                        y={j * 64}
                        width={32}
                        height={32}
                        fill={fill}
                    />
                ))
            )}
        </Svg>
    )
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
            <PatternBackground />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default MainView
