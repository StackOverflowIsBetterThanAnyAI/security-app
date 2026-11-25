import { useRef } from 'react'
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    ScrollView,
    ScrollViewInstance,
    StyleSheet,
    View,
} from 'react-native'

import { LogEntryType } from '@/api/handleApiFetchLogs'
import Button from '@/components/button'
import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { formatTime } from '@/utils/formatStats'

// journald priorities: 3 = error, 4 = warning
const PRIORITY_WARNING = 4

type ServiceLogsProps = {
    handleRefresh: () => Promise<void>
    logs: LogEntryType[] | null
    logsFailed: boolean
    logsUpdatedAt: Date | null
}

const ServiceLogs = ({
    handleRefresh,
    logs,
    logsFailed,
    logsUpdatedAt,
}: ServiceLogsProps) => {
    const borderColor = useThemeColor({}, 'border')
    const backgroundColor = useThemeColor({}, 'background')
    const backgroundSecondary = useThemeColor({}, 'backgroundSecondary')
    const warningColor = useThemeColor({}, 'red')

    const scrollRef = useRef<ScrollViewInstance>(null)
    const isAtEnd = useRef<boolean>(true)

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } =
            event.nativeEvent
        isAtEnd.current =
            contentOffset.y + layoutMeasurement.height >=
            contentSize.height - 24
    }

    const handleContentSizeChange = () => {
        if (isAtEnd.current) {
            scrollRef.current?.scrollToEnd({ animated: false })
        }
    }

    const styles = StyleSheet.create({
        border: {
            borderTopColor: borderColor,
            borderTopWidth: 2,
            marginBottom: -8,
            marginHorizontal: 8,
            paddingVertical: 16,
        },
        console: {
            backgroundColor: backgroundSecondary,
            borderRadius: 8,
            height: 360,
        },
        consoleContent: {
            gap: 4,
            padding: 8,
        },
        entry: {
            fontFamily: Platform.select({
                android: 'monospace',
                default: 'Courier',
            }),
            fontSize: 12,
            lineHeight: 16,
        },
        time: {
            fontWeight: 'bold',
        },
        warning: {
            color: warningColor,
        },
        error: {
            color: warningColor,
            fontWeight: 'bold',
        },
        wrapper: {
            backgroundColor,
            borderColor,
            borderRadius: 12,
            borderWidth: 2,
            gap: 8,
            padding: 12,
        },
    })

    return (
        <View style={styles.border}>
            <View style={styles.wrapper}>
                <ThemedText type="subtitle">Logs</ThemedText>
                {logs ? (
                    <ScrollView
                        accessibilityLabel="Service logs"
                        contentContainerStyle={styles.consoleContent}
                        nestedScrollEnabled={true}
                        onContentSizeChange={handleContentSizeChange}
                        onScroll={handleScroll}
                        ref={scrollRef}
                        scrollEventThrottle={100}
                        style={styles.console}
                    >
                        {logs.length ? (
                            logs.map((entry, index) => (
                                <ThemedText
                                    key={`${entry.time}-${index}`}
                                    selectable={true}
                                    style={[
                                        styles.entry,
                                        entry.priority < PRIORITY_WARNING
                                            ? styles.error
                                            : entry.priority ===
                                                PRIORITY_WARNING
                                              ? styles.warning
                                              : undefined,
                                    ]}
                                >
                                    <ThemedText
                                        style={[styles.entry, styles.time]}
                                    >
                                        {formatTime(
                                            new Date(entry.time * 1000)
                                        )}
                                    </ThemedText>{' '}
                                    {entry.message}
                                </ThemedText>
                            ))
                        ) : (
                            <ThemedText style={styles.entry}>
                                No log entries.
                            </ThemedText>
                        )}
                    </ScrollView>
                ) : (
                    <ThemedText>
                        {logsFailed
                            ? 'Logs are currently unavailable.'
                            : 'Loading logs…'}
                    </ThemedText>
                )}
                {logs && logsUpdatedAt && (
                    <ThemedText isDisabled>
                        {logsFailed
                            ? `Last update failed, showing logs from ${formatTime(logsUpdatedAt)}.`
                            : `Last updated at ${formatTime(logsUpdatedAt)}.`}
                    </ThemedText>
                )}
                <Button
                    accessibilityLabel="Refresh Logs"
                    handlePress={handleRefresh}
                    label="Refresh"
                />
            </View>
        </View>
    )
}

export default ServiceLogs
