import { StyleSheet, View } from 'react-native'

import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'

type FormErrorProps = {
    error: string
}

const FormError = ({ error }: FormErrorProps) => {
    const color = useThemeColor({}, 'red')

    const styles = StyleSheet.create({
        error: { paddingBottom: 8 },
        exclamationMark: { color, fontWeight: 800 },
        wrapper: {
            display: 'flex',
            flexDirection: 'row',
        },
    })

    return (
        <>
            {error ? (
                <View style={styles.wrapper}>
                    <ThemedText
                        type="error"
                        style={[styles.error, styles.exclamationMark]}
                    >
                        !{' '}
                    </ThemedText>
                    <ThemedText type="error" style={styles.error}>
                        {error}
                    </ThemedText>
                </View>
            ) : undefined}
        </>
    )
}

export default FormError
