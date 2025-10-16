import { useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { ScrollView } from 'react-native'

export const useScrollToTop = (
    scrollRef: React.RefObject<ScrollView | null>
) => {
    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress' as never, () => {
            const isFocused = navigation.isFocused?.()
            if (isFocused && scrollRef.current) {
                scrollRef.current.scrollTo({ y: 0, animated: true })
            }
        })

        return unsubscribe
    }, [navigation])
}
