import { FlatList } from 'react-native'

import { RecordingDay } from '@/api/handleApiFetchDays'
import DayGridItem from '@/components/day-grid-item'

type DayGridProps = {
    days: RecordingDay[]
    handleSelectDay: (date: string) => void
    userToken: string
}

const DayGrid = ({ days, handleSelectDay, userToken }: DayGridProps) => {
    const lastRowStart = days.length - (days.length % 2 === 0 ? 2 : 1)

    return (
        <FlatList
            data={days}
            keyExtractor={(day) => day.date}
            numColumns={2}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
                <DayGridItem
                    day={item}
                    handleSelectDay={handleSelectDay}
                    index={index}
                    isLastRow={index >= lastRowStart}
                    userToken={userToken}
                />
            )}
        />
    )
}

export default DayGrid
