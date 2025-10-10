import { Router } from 'expo-router'
import { useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { handleApiFetchImages } from '@/api/handleApiFetchImages'
import PaginationButton from '@/components/pagination-button'
import ThemedText from '@/components/themed-text'
import { ContextError } from '@/context/ContextError'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'

type PaginationProps = {
    ITEMS_PER_PAGE: number
    page: number
    router: Router
    setImages: React.Dispatch<React.SetStateAction<string[] | null>>
    setPage: React.Dispatch<React.SetStateAction<number>>
    setTotalImages: React.Dispatch<React.SetStateAction<number>>
    totalImages: number
    url: string
}

const Pagination = ({
    ITEMS_PER_PAGE,
    page,
    router,
    setPage,
    setImages,
    setTotalImages,
    totalImages,
    url,
}: PaginationProps) => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error(
            'Pagination must be used within a ContextError.Provider'
        )
    }
    const { setError, setRetryFn } = contextError

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('HomeScreen must be used within a ContextUser.Provider')
    }
    const { setIsUserLoggedIn, userName, userToken } = contextUser

    const backgroundColorInactive = useThemeColor({}, 'background')

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isNextDisabled, setIsNextDisabled] = useState<boolean>(false)
    const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(true)

    const handlePressNext = () => {
        const next = page + 1
        if (next >= Math.ceil(totalImages / ITEMS_PER_PAGE)) {
            setIsNextDisabled(true)
        } else {
            setIsNextDisabled(false)
        }
        setPage(next)
        setIsPreviousDisabled(false)
        handleApiFetchImages({
            page: next,
            router,
            setError,
            setImages,
            setIsLoading,
            setIsUserLoggedIn,
            setPage,
            setRetryFn,
            setTotalImages,
            url,
            userToken,
        })
    }
    const handlePressPrevious = () => {
        if (page > 1) {
            const prev = page - 1
            if (prev <= 1) {
                setIsPreviousDisabled(true)
            }
            setPage(prev)
            setIsNextDisabled(false)
            handleApiFetchImages({
                page: prev,
                router,
                setError,
                setImages,
                setIsLoading,
                setIsUserLoggedIn,
                setPage,
                setRetryFn,
                setTotalImages,
                url,
                userToken,
            })
        }
    }

    const styles = StyleSheet.create({
        wrapper: {
            alignItems: 'center',
            backgroundColor: backgroundColorInactive,
            borderRadius: 24,
            display: 'flex',
            flexDirection: 'row',
            gap: 32,
            height: 48,
            justifyContent: 'center',
            marginBottom: 16,
            marginHorizontal: 'auto',
        },
    })

    return (
        <View style={styles.wrapper}>
            <PaginationButton
                handlePress={handlePressPrevious}
                isDisabled={isPreviousDisabled}
                isLoading={isLoading}
                isNext={false}
            />
            <ThemedText>{page}</ThemedText>
            <PaginationButton
                handlePress={handlePressNext}
                isDisabled={isNextDisabled}
                isLoading={isLoading}
                isNext={true}
            />
        </View>
    )
}

export default Pagination
