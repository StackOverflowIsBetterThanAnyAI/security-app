export const formatBytes = (bytes: number) => {
    const gigabytes = bytes / 1024 ** 3
    if (gigabytes >= 1) {
        return `${gigabytes.toFixed(1)} GB`
    }
    return `${Math.round(bytes / 1024 ** 2)} MB`
}

export const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) {
        return `${days} d ${hours} h`
    }
    if (hours > 0) {
        return `${hours} h ${minutes} min`
    }
    if (minutes > 0) {
        return `${minutes} min`
    }
    return `${seconds} s`
}

export const formatTime = (date: Date) =>
    [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map((value) => `${value}`.padStart(2, '0'))
        .join(':')
