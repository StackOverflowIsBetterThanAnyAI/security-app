import { StyleSheet, View } from 'react-native'

import { SystemStatsType } from '@/api/handleApiFetchStats'
import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { formatBytes, formatDuration, formatTime } from '@/utils/formatStats'

type SystemStatsProps = {
    stats: SystemStatsType | null
    statsFailed: boolean
    statsUpdatedAt: Date | null
}

type StatRow = {
    label: string
    value: string
    warning: boolean
}

const buildRows = (stats: SystemStatsType): StatRow[] => {
    const loadAverage = stats.load_average
    const rows: (StatRow | null)[] = [
        stats.cpu_temperature !== null
            ? {
                  label: 'CPU Temperature',
                  value: `${stats.cpu_temperature.toFixed(1)} °C`,
                  warning: stats.cpu_temperature >= 70,
              }
            : null,
        stats.throttling
            ? {
                  label: 'Power Supply',
                  value: stats.throttling.under_voltage_now
                      ? 'Under-voltage'
                      : stats.throttling.throttled_now
                        ? 'Throttled'
                        : stats.throttling.under_voltage_occurred
                          ? 'Under-voltage since boot'
                          : 'OK',
                  warning:
                      stats.throttling.under_voltage_now ||
                      stats.throttling.throttled_now ||
                      stats.throttling.under_voltage_occurred,
              }
            : null,
        stats.disk
            ? {
                  label: 'Storage',
                  value: `${formatBytes(stats.disk.free)} free of ${formatBytes(stats.disk.total)}`,
                  warning: stats.disk.free / stats.disk.total < 0.1,
              }
            : null,
        stats.memory
            ? {
                  label: 'Memory',
                  value: `${formatBytes(stats.memory.available)} free of ${formatBytes(stats.memory.total)}`,
                  warning: stats.memory.available / stats.memory.total < 0.15,
              }
            : null,
        stats.memory && stats.memory.swap_total > 0
            ? {
                  label: 'Swap',
                  value: `${formatBytes(stats.memory.swap_total - stats.memory.swap_free)} used of ${formatBytes(stats.memory.swap_total)}`,
                  warning:
                      stats.memory.swap_free / stats.memory.swap_total < 0.5,
              }
            : null,
        ...(loadAverage
            ? ['1 min', '5 min', '15 min'].map((period, index) => ({
                  label: `Load (${period})`,
                  value: loadAverage[index].toFixed(2),
                  warning: index > 0 && loadAverage[index] > 2,
              }))
            : []),
        stats.uptime_seconds !== null
            ? {
                  label: 'Uptime',
                  value: formatDuration(stats.uptime_seconds),
                  warning: false,
              }
            : null,
        {
            label: 'Last Live Image',
            value:
                stats.live.newest_age_seconds !== null
                    ? `${formatDuration(stats.live.newest_age_seconds)} ago`
                    : 'None',
            warning:
                stats.live.newest_age_seconds === null ||
                stats.live.newest_age_seconds > 60,
        },
        {
            label: 'Last Archive Image',
            value:
                stats.archive.newest_age_seconds !== null
                    ? `${formatDuration(stats.archive.newest_age_seconds)} ago`
                    : 'None',
            warning:
                stats.archive.newest_age_seconds === null ||
                stats.archive.newest_age_seconds > 600,
        },
        {
            label: 'Archive Images',
            value:
                stats.archive.count >= stats.archive.max
                    ? `${stats.archive.count} (full)`
                    : `${stats.archive.count} of ${stats.archive.max}`,
            warning: false,
        },
    ]

    return rows.filter((row): row is StatRow => row !== null)
}

const SystemStats = ({
    stats,
    statsFailed,
    statsUpdatedAt,
}: SystemStatsProps) => {
    const borderColor = useThemeColor({}, 'border')
    const backgroundColor = useThemeColor({}, 'background')
    const warningColor = useThemeColor({}, 'red')

    const styles = StyleSheet.create({
        border: {
            borderTopColor: borderColor,
            borderTopWidth: 2,
            marginBottom: -8,
            marginHorizontal: 8,
            paddingVertical: 16,
        },
        label: {
            flexShrink: 1,
        },
        row: {
            flexDirection: 'row',
            gap: 16,
            justifyContent: 'space-between',
        },
        value: {
            flexShrink: 1,
            textAlign: 'right',
        },
        warning: {
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
                <ThemedText type="subtitle">System</ThemedText>
                {stats ? (
                    buildRows(stats).map((row) => (
                        <View
                            accessible={true}
                            accessibilityLabel={`${row.label}: ${row.value}${
                                row.warning ? ', warning' : ''
                            }`}
                            key={row.label}
                            style={styles.row}
                        >
                            <ThemedText style={styles.label}>
                                {row.label}
                            </ThemedText>
                            <ThemedText
                                style={[
                                    styles.value,
                                    row.warning ? styles.warning : undefined,
                                ]}
                            >
                                {row.value}
                            </ThemedText>
                        </View>
                    ))
                ) : (
                    <ThemedText>
                        {statsFailed
                            ? 'System stats are currently unavailable.'
                            : 'Loading system stats…'}
                    </ThemedText>
                )}
                {stats && statsUpdatedAt && (
                    <ThemedText isDisabled>
                        {statsFailed
                            ? `Last update failed, showing values from ${formatTime(statsUpdatedAt)}.`
                            : `Last updated at ${formatTime(statsUpdatedAt)}.`}
                    </ThemedText>
                )}
            </View>
        </View>
    )
}

export default SystemStats
