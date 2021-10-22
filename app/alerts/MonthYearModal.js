
import React from 'react';
import {
    View, Text, Dimensions, Picker, Modal, TouchableOpacity, Platform
} from 'react-native';
const { height } = Dimensions.get('window')
import Fonts from '../resources/styles/Font';
import moment from 'moment';
const isIOS = Platform.OS == 'ios'

export default class MonthYearModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            months: Array(31).fill().map((_, i) => i < 9 ? '0' + (i + 1) : i + 1),
            years: Array(12).fill().map((elem, index) => parseInt(moment().format('YYYY')) + index),
        }
    }

    _tapOnConfirm = () => {
        const { onMonthChange, onYearChange,
            selectedMonth, selectedYear, hidePicker } = this.props

        if (selectedMonth == '') {
            onMonthChange(this.state.months[0])
            if (selectedYear == '') onYearChange(this.state.years[0])
        } else if (selectedYear == '') {
            onYearChange(this.state.years[0])
        }
        hidePicker(false)
    }

    render() {
        const { showModal, onMonthChange, onYearChange,
            selectedYear, selectedMonth, hidePicker } = this.props
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={showModal}
                onRequestClose={() => { }}>
                <View style={styles.container} >

                    <View style={styles.viewSubContainer}>
                        <View style={{ flexDirection: 'row', padding: 16 }}>
                            <Text style={styles.textCancel} onPress={() => hidePicker(false)}>Cancel</Text>
                            <Text style={[styles.textCancel, { textAlign: 'right' }]} onPress={() => this._tapOnConfirm()} >Confirm</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>

                            <Picker style={{ flex: 1 }} selectedValue={selectedMonth} onValueChange={onMonthChange}>
                                {this.state.months.map((elem, index) => {
                                    return (
                                        <Picker.Item label={elem.toString()} key={index} value={elem.toString()} />
                                    )
                                })}
                            </Picker>
                            <Picker style={{ flex: 1 }} selectedValue={selectedYear} onValueChange={onYearChange}>
                                {this.state.years.map((elem, index) => {
                                    return (
                                        <Picker.Item label={elem.toString()} key={index} value={elem.toString()} />
                                    )
                                })}
                            </Picker>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}


const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    viewSubContainer: {
        height: isIOS ? height / 3 : height / 5, backgroundColor: 'white', width: '100%'
    },
    textCancel: {
        flex: 1, fontSize: Fonts.TEXT_M, color: 'black',
    },
}