import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useContext, useRef, useState } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'

import { handleApiFetchLogs, LogEntryType } from '@/api/handleApiFetchLogs'
import { handleApiFetchStats, SystemStatsType } from '@/api/handleApiFetchStats'
import { handleApiFetchUsers, UsersType } from '@/api/handleApiFetchUsers'
import Button from '@/components/button'
import { noUsers } from '@/components/icon-symbol'
import MainView from '@/components/main-view'
import ServiceLogs from '@/components/service-logs'
import ShutdownButton from '@/components/shutdown-button'
import SkeletonUserGrid from '@/components/skeleton-user-grid'
import SystemStats from '@/components/system-stats'
import ThemedText from '@/components/themed-text'
import UserGrid from '@/components/user-grid'
import UserHeader from '@/components/user-header'
import UserSettings from '@/components/user-settings'
import { ContextError } from '@/context/ContextError'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'

const LOGS_REFRESH_MS = 5000

const AdminScreen = () => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error(
            'AdminScreen must be used within a ContextError.Provider'
        )
    }
    const { setError, setRetryFn } = contextError

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error(
            'AdminScreen must be used within a ContextUser.Provider'
        )
    }
    const { setIsUserLoggedIn, userName, userToken } = contextUser

    const colorIcon = useThemeColor({}, 'text')
    const router = useRouter()

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isLoadingInitially, setIsLoadingInitially] = useState<boolean>(true)
    const [isLoadingPull, setIsLoadingPull] = useState<boolean>(false)
    const [logs, setLogs] = useState<LogEntryType[] | null>(null)
    const [logsFailed, setLogsFailed] = useState<boolean>(false)
    const [logsUpdatedAt, setLogsUpdatedAt] = useState<Date | null>(null)
    const [stats, setStats] = useState<SystemStatsType | null>(null)
    const [statsFailed, setStatsFailed] = useState<boolean>(false)
    const [statsUpdatedAt, setStatsUpdatedAt] = useState<Date | null>(null)
    const [users, setUsers] = useState<UsersType[]>([])

    const handleFetchStats = useCallback(() => {
        handleApiFetchStats({
            router,
            setError,
            setIsUserLoggedIn,
            setStats,
            setStatsFailed,
            setStatsUpdatedAt,
            userToken,
        })
    }, [router, setError, setIsUserLoggedIn, userToken])

    const isFetchingLogs = useRef<boolean>(false)

    const handleFetchLogs = useCallback(async () => {
        if (isFetchingLogs.current) {
            return
        }
        isFetchingLogs.current = true
        try {
            await handleApiFetchLogs({
                router,
                setError,
                setIsUserLoggedIn,
                setLogs,
                setLogsFailed,
                setLogsUpdatedAt,
                userToken,
            })
        } finally {
            isFetchingLogs.current = false
        }
    }, [router, setError, setIsUserLoggedIn, userToken])

    const handleFetchUsers = useCallback(
        (setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
            handleApiFetchUsers({
                router,
                setError,
                setIsLoading,
                setIsUserLoggedIn,
                setRetryFn,
                setUsers,
                userToken,
            })
        },
        [router, setError, setIsUserLoggedIn, setRetryFn, setUsers, userToken]
    )

    const handleFetchUsersManual = useCallback(() => {
        handleFetchUsers(setIsLoading)
        setIsLoadingInitially(false)
    }, [handleFetchUsers, setIsLoading, setIsLoadingInitially])

    const handleFetchUsersPull = () => {
        handleFetchUsers(setIsLoadingPull)
        handleFetchStats()
        handleFetchLogs()
    }

    useFocusEffect(
        useCallback(() => {
            handleFetchLogs()
            const refresh = setInterval(handleFetchLogs, LOGS_REFRESH_MS)
            return () => {
                clearInterval(refresh)
            }
        }, [handleFetchLogs])
    )

    useFocusEffect(
        useCallback(() => {
            handleFetchUsersManual()
        }, [handleFetchUsersManual])
    )

    useFocusEffect(
        useCallback(() => {
            handleFetchStats()
            const refresh = setInterval(handleFetchStats, 30000)
            return () => {
                clearInterval(refresh)
            }
        }, [handleFetchStats])
    )

    const styles = StyleSheet.create({
        activityLoader: {
            alignItems: 'center',
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
        },
        noUsersContainer: {
            alignItems: 'center',
            gap: 16,
            paddingBottom: 8,
        },
    })

    return (
        <MainView
            refreshControl={
                <RefreshControl
                    accessibilityLabel="Refreshing Users"
                    refreshing={isLoadingPull}
                    onRefresh={handleFetchUsersPull}
                    tintColor={colorIcon}
                />
            }
        >
            <UserHeader userName={userName} userRole="admin" />
            {isLoading && isLoadingInitially && !users.length ? (
                <SkeletonUserGrid />
            ) : users.length ? (
                <>
                    <Button
                        accessibilityLabel="Refresh Users"
                        handlePress={handleFetchUsersManual}
                        label="Refresh"
                    />
                    <UserGrid setUsers={setUsers} users={users} />
                </>
            ) : (
                <View style={styles.noUsersContainer}>
                    {noUsers(colorIcon)}
                    <ThemedText center>
                        Currently, there are no other Users registered.
                    </ThemedText>
                    <Button
                        accessibilityLabel="Refresh Users"
                        handlePress={handleFetchUsersManual}
                        label="Refresh"
                    />
                </View>
            )}
            <SystemStats
                stats={stats}
                statsFailed={statsFailed}
                statsUpdatedAt={statsUpdatedAt}
            />
            <ServiceLogs
                handleRefresh={handleFetchLogs}
                logs={logs}
                logsFailed={logsFailed}
                logsUpdatedAt={logsUpdatedAt}
            />
            <UserSettings handleFetchUserRole={undefined} />
            <ShutdownButton />
        </MainView>
    )
}

export default AdminScreen
