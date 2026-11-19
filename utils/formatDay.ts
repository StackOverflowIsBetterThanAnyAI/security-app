const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

export const formatDay = (day: string) => {
    const [year, month, date] = day.split('-').map(Number)
    const value = new Date(year, month - 1, date)

    const today = new Date()
    if (isSameDay(value, today)) {
        return 'Today'
    }

    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    if (isSameDay(value, yesterday)) {
        return 'Yesterday'
    }

    return value.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    })
}
