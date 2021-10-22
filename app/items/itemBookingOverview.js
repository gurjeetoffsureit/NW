import React, { PureComponent } from 'react'
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native'

import Strings from '../resources/string/Strings'
import Styles from '../resources/styles/Styles'
import Moment from 'moment'
import ItemDates from '../items/itemDates'

export default class itemBookingOverview extends PureComponent {

    state = {
        count: 1
    }

    componentDidMount() {
        this.getTotalBookingCount()
    }

    getTotalBookingCount = () => {
        const { item } = this.props;
        var count = 0
        for (let slots of item.slots) {
            count += slots.bookesSlots.length;
        }
        this.setState({ count });
    }

    getPrice = (bookesSlots) => {
        var price = 0
        bookesSlots.map((slot, key) => {
            price += slot.price
        })
        return price
    }

    getTotalPrice = (slots) => {
        var price = 0
        slots.map((slot, key) => {
            slot.bookesSlots.map((booked, key) => {
                price += booked.price
            })
        })
        return price
    }

    _keyExtractor = (item, index) => item;
    // _keyExtractor = (item, index) => item.date;

    _renderItem = ({ item }) => {
        console.log('item item --> ' + JSON.stringify(item))
         return (
           <ItemDates
                onPressItemDate={this._onPressCancelDate}
                id={item.date}
                item={item} />
        );
    }
    

    _onPressCancelDate = ( date) => {
        const { onPressItem, item } = this.props;
        
       onPressItem(item.room_id,date);
    }

    _onItemPress = () => {
        const { onPressItem, item } = this.props;
        //console.log(JSON.stringify(item))
        onPressItem( item.room_id);
        // onPressItem('hjfg', 'fgdf');
    }

    render() {
        const { item, itemClick } = this.props;
        const { count } = this.state;
        const premium = Styles.textPremium;
        const verified = Styles.textVerified;
        console.log('item item rendedr()--> ',JSON.stringify(item))
        return (
            <View style={{ paddingRight: 12, paddingTop: 8, marginBottom: 8 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={Styles.label}>{item.room_name}</Text>
                    <TouchableOpacity
                        style={{ position: 'absolute', end: 10, alignSelf: 'center' }}
                        onPress={this._onItemPress}>
                        <Image
                            style={{ height: 15, width: 15 }}
                            source={require('../resources/images/cross.png')}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 8 }}>
                    {item.premium && <Text style={premium}>{Strings.TEXT_PREMIUM}</Text>}
                    {item.verified && <Text style={premium}>{Strings.TEXT_VERIFIED}</Text>}
                </View>

            
                 {item.slots && <FlatList
                    data={item.slots}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem} />}  

                <Text style={[Styles.textPriceValue, {
                    marginLeft: 10, marginTop: 8,
                    fontSize: 15, color: 'black', fontWeight: '500'
                }]}>
                    {'BOOKING BREAKDOWN'}</Text>
                {
                    item.slots &&
                    item.slots.map((slot, key) => (
                        < View key={key}
                            style={{ flex: 1, flexDirection: 'row', paddingTop: 8 }}>
                            <Text
                                style={[Styles.textTime, { marginLeft: 10, flex: 0.6 }]}>
                                {Moment(slot.date).format('ddd, MMM DD')}</Text>
                            <Text
                                style={[Styles.textTime, {
                                    marginLeft: 10, flex: 0.4, textAlign: 'right'
                                }]}>
                                ${
                                    this.getPrice(slot.bookesSlots)
                                    // (slot.bookesSlots[0].price * slot.bookesSlots.length)
                                } </Text>
                        </View>
                    ))
                }
                <View style={{
                    flexDirection: 'row', marginTop: 8
                }}>
                    <Text
                        style={[Styles.label, {
                            marginLeft: 10, flex: 0.6, fontSize: 16
                        }]}>
                        {'TOTAL PRICE'}</Text>
                    <Text
                        style={[Styles.label, {
                            marginLeft: 10, flex: 0.4, textAlign: 'right'
                        }]}>
                        ${this.getTotalPrice(item.slots)}</Text>
                </View>

                <View style={{
                    borderBottomColor: '#DDDDDD',
                    borderBottomWidth: 2, marginTop: 3, flex: 1
                }} />
            </View >
        );
    }

}