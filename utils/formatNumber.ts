export const formatNumber = (number: number) => {
    if (number >= 10) {
        return number
    }
    return `0${number}`
}
