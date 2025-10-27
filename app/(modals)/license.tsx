import { StyleSheet, View } from 'react-native'

import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'

const LicenseScreen = () => {
    const currentYear = new Date().getFullYear()

    return (
        <MainView>
            <View style={styles.titleContainer}>
                <ThemedText center type="title">
                    MIT License
                </ThemedText>
                <ThemedText center type="subtitle">
                    Copyright &#169; 2025
                    {currentYear > 2025 ? ` - ${currentYear}` : ''} Michael
                    Münzenhofer
                </ThemedText>
                <ThemedText>
                    Permission is hereby granted, free of charge, to any person
                    obtaining a copy of this software and associated
                    documentation files (the "Software"), to deal in the
                    Software without restriction, including without limitation
                    the rights to use, copy, modify, merge, publish, distribute,
                    sublicense, and/or sell copies of the Software, and to
                    permit persons to whom the Software is furnished to do so,
                    subject to the following conditions:
                </ThemedText>
                <ThemedText>
                    The above copyright notice and this permission notice shall
                    be included in all copies or substantial portions of the
                    Software.
                </ThemedText>
                <ThemedText>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
                    KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
                    WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                    PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
                    OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
                    OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                    OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
                    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </ThemedText>
            </View>
        </MainView>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'column',
        gap: 16,
        marginTop: -24,
        padding: 4,
        paddingBottom: 16,
    },
})

export default LicenseScreen
