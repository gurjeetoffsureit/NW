import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Styles from '../resources/styles/Styles';
import Moment from 'moment';
export default class itemDates extends PureComponent {

    _onItemPress = () => {
        const { onPressItemDate, item, roomId } = this.props;
        //  console.log(JSON.stringify(item))
        onPressItemDate(item.date);
    }
    render() {
        const { item } = this.props;
        console.log("single Item data is ", item)
        const date = Moment(item.date).format('ddd, MMM DD');
        return (
            <View>
                <View>
                    <Text style={[Styles.textTime, {
                        marginLeft: 10, marginTop: 8,
                        fontSize: 14, fontWeight: '500'
                    }]}>{'DATE:'}</Text>

                    <TouchableOpacity
                        style={{ position: 'absolute', end: 10, alignSelf: 'center', marginTop: 8 }}
                        onPress={this._onItemPress}>
                        <Text style={{ color: 'red' }}>Remove</Text>
                        {/* <Image
                            style={{ height: 10, width: 10 }}
                            source={require('../resources/images/cross.png')}>
                        </Image> */}
                    </TouchableOpacity>

                </View>

                <Text style={[Styles.textPriceValue, {
                    marginLeft: 10, marginTop: 3, fontSize: 14,
                    color: (false ? 'white' : '#A1A1A1'),
                    backgroundColor: false ? 'red' : 'white'
                }]}>{date}</Text>
                <View style={{ flex: 1, marginTop: 8 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[Styles.textTime, {
                            marginLeft: 10, marginTop: 3,
                            fontSize: 14, fontWeight: '500', flex: 1
                        }]}>{'START TIME:'}</Text>
                        <Text style={[Styles.textTime, {
                            marginLeft: 10, marginTop: 3,
                            fontSize: 14, fontWeight: '500', flex: 1
                        }]}>{'END TIME:'}</Text>
                    </View>
                    {item.bookesSlots.map((slot, key) => (
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 3 }}
                            key={key}>
                            <View style={{ flex: 1 }}>
                                <Text style={[Styles.textPriceValue, {
                                    marginLeft: 10, marginTop: 3,
                                    color: slot.booked ? 'white' : '#A1A1A1',
                                    backgroundColor: slot.booked ? 'red' : 'white'
                                }]}>{slot.label.split(' - ')[0]}</Text>
                                <View style={{
                                    borderBottomColor: '#ddd',
                                    borderBottomWidth: 0.5, marginTop: 3,
                                    marginLeft: 10, marginRight: 10
                                }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[Styles.textPriceValue, {
                                    marginLeft: 10, marginTop: 3,
                                    color: slot.booked ? 'white' : '#A1A1A1',
                                    backgroundColor: slot.booked ? 'red' : 'white'
                                }]}>{slot.label.split(' - ')[1]}</Text>
                                <View style={{
                                    borderBottomColor: '#ddd',
                                    borderBottomWidth: 0.5, marginTop: 3,
                                    marginLeft: 10, marginRight: 10
                                }} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        );
    }
}