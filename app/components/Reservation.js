import Moment from 'moment';
import { Button, Icon } from 'native-base';
import React, { PureComponent } from 'react';
import {
    AppState, BackHandler, Dimensions, Image, ImageBackground, NetInfo,
    Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Calendar } from 'react-native-calendars';
import Toast, { DURATION } from 'react-native-easy-toast';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import Permissions from 'react-native-permissions';
import AppData from '../constants/AppData';
import DatabaseKey from '../constants/DatabaseKeys';
import Services from '../constants/WebServices';
import CheckBox from '../global/CheckBox';
import Loading from '../global/Loader';
import BookRoom from '../global/UserAction';
import webService from '../global/WebServiceHandler';
import Strings from '../resources/string/Strings';
import Font from '../resources/styles/Font';
import Styles from '../resources/styles/Styles';

var dateFormat = 'YYYY-MM-DD';
const { width } = Dimensions.get('window');
const placeholder = require('../resources/images/no_image.jpg')
const calendar = require('../resources/images/calendar.png')

class LogoTitle extends PureComponent {
    render() {
        const { header, address } = this.props;
        return (
            <View style={{
                alignItems: 'center', justifyContent: 'center',
                flex: 1, paddingStart: 12
            }}>
                <Text style={Styles.textHeader}
                    numberOfLines={1}
                    ellipsizeMode='tail'>{header}</Text>
                <Text style={[Styles.textHeader, { fontSize: 10, marginTop: 1 }]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>{address}</Text>
            </View>
        );
    }
}

class HeaderRight extends PureComponent {

    render() {
        const { onCartPress, count } = this.props;
        // const { count } = this.state;
        return (
            <View style={{
                alignItems: 'center', justifyContent: 'center',
                height: '100%', flexDirection: 'row'
            }}>
                <TouchableOpacity
                    onPress={onCartPress}>
                    <ImageBackground style={{
                        height: 20, width: 20,
                        marginRight: 15, marginTop: 10
                    }}
                        source={require('../resources/images/cart_icon.png')} >
                        {count > 0 && <View style={{
                            height: 20, width: 20, alignSelf: 'flex-end',
                            borderRadius: 20 / 2, backgroundColor: 'red',
                            marginTop: -10, marginRight: -10,
                            justifyContent: 'center', alignItems: 'center'
                        }} >
                            <Text style={{ fontSize: 10, color: 'white', fontWeight: '800' }}>{count}</Text>
                        </View>}
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        );
    }
}

class HeaderLeft extends PureComponent {
    render() {
        const { onPress, onCalendarPress } = this.props;
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{
                    alignItems: 'center', justifyContent: 'center',
                    paddingLeft: 15, height: '100%'
                }} onPress={onPress}>
                    <Icon name='arrow-back' style={{ color: '#FDA02A' }} />
                    {/* <Image source={require('../resources/images/back_arrow.png')} /> */}
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        ...Platform.select({
                            ios: { alignItems: 'center', justifyContent: 'center' },
                            android: { alignItems: 'center', justifyContent: 'center' }
                        }), paddingLeft: 15, height: '100%'
                    }}
                    onPress={onCalendarPress}>
                    <Image style={{
                        height: 20, width: 20, paddingStart: 8,
                        tintColor: '#FDA02A'
                    }}
                        source={calendar} />
                </TouchableOpacity>
            </View>
        );
    }
}

export default class Reservation extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            position: 'bottom',
            roomId: props.navigation.state.params ? props.navigation.state.params.roomId : undefined,
            studioDetails: props.navigation.state.params ? props.navigation.state.params.studioDetails : undefined,
            studioId: props.navigation.state.params ? props.navigation.state.params.studioId : undefined,
            style: {},
            slots: [],
            selected: props.navigation.state.params ? props.navigation.state.params.date : Moment(new Date()).format('YYYY-MM-DD'),
            slot1: false,
            slot2: false,
            header: 'Studios',
            address: 'address',
            more: '',
            markedDates: AppData.markedDates,
            day: '',
            weekdays: [],
            saturdays: [],
            sundays: [],
            mondays: [],
            tuesdays: [],
            wednesdays: [],
            thursdays: [],
            fridays: [],
            cart: '',
            index: -1,
            day01: '',
            day02: '',
            day03: '',
            day04: '',
            day05: '',
            day06: '',
            day07: '',
            day08: '',
            day09: '',
            day10: '',
            day11: '',
            day12: '',
            day13: '',
            day14: '',
            day15: '',
            day16: '',
            day17: '',
            day18: '',
            day19: '',
            day20: '',
            day21: '',
            day22: '',
            day23: '',
            day24: '',
            day25: '',
            day26: '',
            day27: '',
            day28: '',
            day29: '',
            day30: '',
            day31: ''
        };
        this.onDayPress = this.onDayPress.bind(this);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <LogoTitle
                header={navigation.getParam('header')}
                address={navigation.getParam('address')} />,
            headerLeft: <HeaderLeft
                onPress={navigation.getParam('onPress')}
                onCalendarPress={navigation.getParam('onCalendarPress')} />,
            headerRight: <HeaderRight
                onCartPress={navigation.getParam('onCartPress')}
                count={navigation.getParam('count')} />,
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: '#000000',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomColor: `#FDA02A`,
            },
            headerTintColor: '#FDA02A',
        }
    };

    onBackPress = () => {
        this.props.navigation.goBack();
    }

    onCartPress = () => {
        const { access_token } = this.state;
        // this.props.navigation.navigate('Cart');
        this.props.navigation.navigate('RequestBook', {
            access_token
        });
    }

    _onCalendarPress = () => {
        this.props.navigation.navigate('More', {
            access_token: this.state.access_token,
            returnData: this._returnData.bind(this),
            date: Moment(new Date()).format('YYYY-MM-DD')
        });
    }

    _returnData = (roomId, studioId, date) => {
        this.setState({
            studioId, roomId, loading: true,
            style: {},
            slots: [],
            selected: date,
            slot1: false,
            slot2: false,
            header: 'Studios',
            address: 'address',
            more: '',
            markedDates: AppData.markedDates,
            day: '',
            weekdays: [],
            saturdays: [],
            sundays: [],
            mondays: [],
            tuesdays: [],
            wednesdays: [],
            thursdays: [],
            fridays: [],
            cart: '',
            index: -1,
            day01: '',
            day02: '',
            day03: '',
            day04: '',
            day05: '',
            day06: '',
            day07: '',
            day08: '',
            day09: '',
            day10: '',
            day11: '',
            day12: '',
            day13: '',
            day14: '',
            day15: '',
            day16: '',
            day17: '',
            day18: '',
            day19: '',
            day20: '',
            day21: '',
            day22: '',
            day23: '',
            day24: '',
            day25: '',
            day26: '',
            day27: '',
            day28: '',
            day29: '',
            day30: '',
            day31: ''
        }, function () {
            this.fetchStudiosRoom(this.state.access_token, 1);
            setTimeout(() => {
                if (date)
                    this.fetchBookingDateSlots(this.state.access_token, this.state.selected);
            }, 1000);
        });
    }

    componentDidMount() {
        this.setHeader(this.state.header)
        // NetInfo.isConnected.addEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );

        const { studioDetails } = this.state;
        console.log(`Studio details : `, studioDetails);
        if (studioDetails) {
            this._getDetails();
        } else {
            this._getToken();
        }
    }

    _getToken = async () => {
        let access_token = await AsyncStorage.getItem(DatabaseKey.access_token);
        if (access_token) {
            this.setState({ access_token }, function () {
                this.fetchStudiosRoom(this.state.access_token, 1);
            })
        }
    }

    fetchStudiosRoom = (access_token, page) => {
        const { studioId, roomId } = this.state
        webService.get((Services.Url + Services.App + Services.Room +
            studioId + "/" + roomId), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }, { 'page': page })
            .then((responseJson) => {
                console.log(`fetchStudiosRoom:::  ${JSON.stringify(responseJson)}`)

                this.setState({ loading: false })
                if (responseJson.code === Services.statusCodes.failure) {
                    var index = Services.status.findIndex((status) => status.flag === responseJson.response.flag);
                    console.log(index);
                    if (index > -1) {
                        this.setState({ loading: false }, function () {
                            setTimeout(() => {
                                var buttons = [
                                    {
                                        text: 'Okay',
                                        onPress: () => { this.alertActions(Services.status[index].action) }
                                    },
                                ];
                                Alert.alert(
                                    'Alert!',
                                    Services.status[index].errorMesage,
                                    buttons,
                                    { cancelable: false }
                                )
                            }, 100);
                        })
                    }
                    return
                }
                console.log('Studios Rooms Details : ' + JSON.stringify(responseJson))
                this.setState({
                    studioDetails: responseJson
                }, function () {
                    this._getDetails();
                })
            })
            .catch((error) => {
                this.setState({ loading: false }, function () {
                    if ('name' in error && error.name == '503') {
                        setTimeout(() => {
                            alert(error.message);
                        }, 100);
                    }
                    else {
                        this._showToast(JSON.stringify(error));
                    }
                });
                console.log('callapi error :' + JSON.stringify(error));
            });
    }

    _getDetails = () => {

        this._sub = this.props.navigation.addListener(
            'didFocus',
            this.refreshScreen
        );

        const { studioDetails } = this.state;
        AsyncStorage.getItem(DatabaseKey.access_token).then((access_token) => {
            this.setState({ access_token });
            this.props.navigation.setParams({
                onPress: this.onBackPress.bind(this),
                onCartPress: this.onCartPress.bind(this),
                onCalendarPress: this._onCalendarPress.bind(this)
            });
            this.seperateDates(new Date())
        }).done();

        var weekDay = new Date().getDay();
        var index = AppData.weekdays.findIndex((week) => week.day === weekDay);
        if (index > -1) {
            this.setState({ day: AppData.weekdays[index].weekday })
        }

        if (studioDetails) {
            var timeZone = this.getTimeZone(studioDetails)
            this.setState({
                header: `${studioDetails.studio.name} ${timeZone}`,
                address: studioDetails.studio.address
            }, function () {
                this.setHeader(this.state.header, this.state.address)
            });
        }

        setTimeout(() => {
            // console.log(selected);

            if (this.state.selected)
                this.fetchBookingDateSlots(this.state.access_token, this.state.selected);
        }, 100);
    }

    getTimeZone = (item) => {
        var timeZoneShort = ""

        if (item.studio.timeZone == undefined)
            return timeZoneShort

        var timeZone = item.studio.timeZone.timeZoneName
        let matches = timeZone.match(/\b(\w)/g);
        timeZoneShort = `(${matches.join('')})`;
        console.log("Time zone is ::: " + timeZoneShort)
        return timeZoneShort
    }

    refreshScreen = () => {
        this.getCartDetails(true)
    }

    setHeader = (header, address) => {
        this.props.navigation.setParams({ header, address });
    }

    getCartDetails = (updateStateData) => {
        AsyncStorage.getItem(DatabaseKey.cartDetails).then((cartDetails) => {
            console.log('Cart Details ::: ' + cartDetails);
            const { studioDetails } = this.state;
            console.log('Cart Details studioDetails.studio._id ::: ' + studioDetails.studio._id);
            if (cartDetails) {
                var cart = JSON.parse(cartDetails);
                if (cart.length > 0) {

                    var index = cart.findIndex((item) => item.studio_id === studioDetails.studio._id)
                    console.log('Cart Details Single index ::: ' + index);
                    if (index > -1) {
                        var item = cart[index];
                        this.setState({ cart: item, index }, function () {
                            console.log('Cart Details Single ::: ' + JSON.stringify(this.state.cart));
                        })
                    }
                    var count = 0;
                    for (let studio of cart) {
                        for (let rooms of studio.bookedRooms) {
                            for (let days of rooms.slots) {
                                count += days.bookesSlots.length
                            }
                        }
                    }

                    this.updateStateDate(count, updateStateData)

                }
                else {

                    var count = 0;

                    this.updateStateDate(count, updateStateData)
                    this.setState({ cart: '' })


                }
            } else {
                this.setState({ cart: '' })
            }
        }).done();
    }
    updateStateDate = (count, updateStateData) => {
        this.props.navigation.setParams({
            count
        });
        if (updateStateData) {
            this.setState({
                selected: '',
                slots: []
            })
        }
    }

    seperateDates = (date) => {
        var month = Moment(date).format('YYYY-MM')
        var daysInMonth = Moment(month).daysInMonth();
        const { weekdays, saturdays, sundays, mondays, tuesdays, wednesdays, thursdays, fridays } = this.state;
        if (weekdays.length > 0) {
            weekdays.splice(0, weekdays.length)
        }
        if (saturdays.length > 0) {
            saturdays.splice(0, saturdays.length)
        }
        if (sundays.length > 0) {
            sundays.splice(0, sundays.length)
        }
        if (mondays.length > 0) {
            mondays.splice(0, mondays.length)
        }
        if (tuesdays.length > 0) {
            tuesdays.splice(0, tuesdays.length)
        }
        if (wednesdays.length > 0) {
            wednesdays.splice(0, wednesdays.length)
        }
        if (thursdays.length > 0) {
            thursdays.splice(0, thursdays.length)
        }
        if (fridays.length > 0) {
            fridays.splice(0, fridays.length)
        }

        console.log('Days in Month ::: ' + daysInMonth);

        for (let index = 1; index <= daysInMonth; index++) {
            var day = this.pad(index);
            var date = (month + '-' + day);
            var weekday = Moment(date).weekday();
            console.log('Weekday is ::: ' + weekday + ' , date is ::: ' + date)
            var days = {
                'day': day,
                'date': date
            };
            if ((weekday === 0)) {
                sundays.push(days)
            } else if (weekday === 1) {
                mondays.push(days)
            } else if (weekday === 2) {
                tuesdays.push(days)
            } else if (weekday === 3) {
                wednesdays.push(days)
            } else if (weekday === 4) {
                thursdays.push(days)
            } else if (weekday === 5) {
                fridays.push(days)
            } else if (weekday === 6) {
                saturdays.push(days)
            }
        }
        this.setState({
            weekdays, saturdays, sundays
        })
        const { access_token } = this.state;
        this.fetchBookedDaysDetails(access_token, month)
    }

    pad(n) {
        return (n < 10) ? ("0" + n) : n;
    }

    componentWillMount() {
        this.image = (
            <Image
                style={[{ alignSelf: 'center', }]}
                source={require('../resources/images/phone_icon.png')} />
        );
        BackHandler.addEventListener('hardwareBackPress removeEventListener',
            this.handleBackButton);
    }

    handleBackButton() {
        return true
    }

    componentWillUnmount() {
        // NetInfo.isConnected.removeEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );
        if (this._sub)
            this._sub.remove();
        AppState.removeEventListener('change', this._handleAppStateChange)
    }

    _handleConnectivityChange = (status) => {
        this.setState({
            connected: status
        })
        console.log('*********_handleConnectivityChange: Network Connectivity status *******: ' + status);
    }

    fetchBookedDaysDetails = (access_token, month) => {
        const { roomId } = this.state;
        webService.get((Services.Url + Services.App + Services.Book +
            roomId + Services.Availability), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }, { 'date': month })
            .then((responseJson) => {
                this.setState({ loading: false })
                console.log('Studios Booking slots Month : ' + JSON.stringify(responseJson))
                if (responseJson.workingDays.length > 0) {
                    for (let closedDay of responseJson.workingDays) {
                        if (closedDay.closed) {
                            switch (closedDay.day) {
                                case 'Sun':
                                    this.disableClosedDays(this.state.sundays)
                                    break;
                                case 'Mon':
                                    this.disableClosedDays(this.state.mondays)
                                    break;
                                case 'Tue':
                                    this.disableClosedDays(this.state.tuesdays)
                                    break;
                                case 'Wed':
                                    this.disableClosedDays(this.state.wednesdays)
                                    break;
                                case 'Thu':
                                    this.disableClosedDays(this.state.thursdays)
                                    break;
                                case 'Fri':
                                    this.disableClosedDays(this.state.fridays)
                                    break;
                                case 'Sat':
                                    this.disableClosedDays(this.state.saturdays)
                                    break;
                            }
                        }
                    }
                }

                if (responseJson.bookedDays.length > 0)
                    for (let number of responseJson.bookedDays) {
                        if (number.length == 1)
                            number = "0" + number


                        this.setState({
                            ['day' + number]: month + '-' + number
                        })
                        console.log('Studios Booking Dates : ' + ('day' + number))
                    }
                this.setState({
                    data: responseJson,
                })
            })
            .catch((error) => {
                this.setState({ loading: false })
                this._showToast(JSON.stringify(error));
                console.log('callapi error :' + JSON.stringify(error))
            });
    }

    disableClosedDays = (days) => {
        if (days.length > 0) {
            for (let item of days) {
                this.setState({
                    ['day' + item.day]: item.date
                })
            }
        }
    }

    fetchBookingDateSlots = (access_token, date) => {
        console.log("Selected Date ::: " + date)

        const { roomId } = this.state;
        webService.get((Services.Url + Services.App + Services.Book +
            roomId + Services.Slots), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }, { 'date': date })
            .then((responseJson) => {
                this.setState({ loading: false })
                console.log('Studios Booking Date Slots : ', responseJson);
                var slots = [];
                responseJson.map((slot, key) => {
                    var items = {}
                    if (date == Moment(new Date()).format(dateFormat)) {
                        items = this.getSlotTiming(slot, false)
                    }
                    else {
                        items = this.getSlotTiming(slot, false)
                    }

                    slots.push(items);
                });
                this.setState({ slots, loading: true }, function () {
                    this._fetchRoomsByDate(date, access_token);
                });
            })
            .catch((error) => {
                this.setState({ loading: false, slots: [] }, function () {
                    this._showToast(error.message)
                })
                console.log('callapi error :' + JSON.stringify(error))
            });
    }

    _fetchRoomsByDate = (date, access_token) => {
        webService.get(`${Services.Url}${Services.App}${Services.Book}availabile/${Services.Rooms}?date=${date}`, {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }).then(response => {
            if (response) {
                this.setState({ loading: false, more: response.totalRecords });
            }
            console.log('Response is :' + JSON.stringify(response));
        }).catch(error => {
            this.setState({ loading: false }, function () {
                if ('name' in error && error.name == '503') {
                    setTimeout(() => {
                        alert(error.message);
                    }, 100);
                }
                else {
                    alert(JSON.stringify(error));
                }
            });
            console.log('callapi error :' + JSON.stringify(error));
        });
    }

    getSlotTiming = (slot, isCurrentDate) => {
        var items = {}
        if (isCurrentDate) {
            var timeSlots = slot.label.split('-');
            var slotStartTime = timeSlots[0].replace(/\s/g, '');
            var slotTime = this.get24hTime(slotStartTime)
            var currentTime = Moment(new Date()).format("HH:MM")
            var isSlopTimePassed = this.compareDates(slotTime, currentTime)
            console.log(" is slot time passed " + isSlopTimePassed)
            items = {
                'label': slot.label,
                'index': slot.index,
                'name': slot.name,
                'booked': isSlopTimePassed,
                'price': slot.price,
                'selected': false,
                'available': slot.available
            }
        }
        else {
            items = {
                'label': slot.label,
                'index': slot.index,
                'name': slot.name,
                'booked': slot.booked,
                'price': slot.price,
                'selected': false,
                'available': slot.available
            }
        }
        return items

    }

    get24hTime(str) {
        str = String(str).toLowerCase().replace(/\s/g, '');
        var has_am = str.indexOf('am') >= 0;
        var has_pm = str.indexOf('pm') >= 0;
        // first strip off the am/pm, leave it either hour or hour:minute
        str = str.replace('am', '').replace('pm', '');
        // if hour, convert to hour:00
        if (str.indexOf(':') < 0) str = str + ':00';
        // now it's hour:minute
        // we add am/pm back if striped out before 
        if (has_am) str += ' am';
        if (has_pm) str += ' pm';
        // now its either hour:minute, or hour:minute am/pm
        // put it in a date object, it will convert to 24 hours format for us 
        var d = new Date("1/1/2011 " + str);
        // make hours and minutes double digits
        var doubleDigits = function (n) {
            return (parseInt(n) < 10) ? "0" + n : String(n);
        };
        var time = doubleDigits(d.getHours()) + ':' + doubleDigits(d.getMinutes())

        // return `${time}`;
        return `${time}`;
    }

    compareDates = (slotTime, currentTime) => {
        var momentA = Moment(slotTime, "HH:mm");
        var momentB = Moment(currentTime, "HH:mm");
        console.log("slotTime:::::" + momentA + " current time ::::" + momentB)
        if (momentB > momentA)
            return true;
        else
            return false
    }

    onDayPress(day) {
        this.setState({
            selected: day.dateString,
            markedDates: {
                [day.dateString]: { selected: true },
            },
            loading: true,
            slot1: false,
            slot2: false,
            more: ''
        }, function () {
            const { access_token, selected, markedDates } = this.state;
            console.log('Marked isiqfjfv ::: ' + JSON.stringify(markedDates));
            this.fetchBookingDateSlots(access_token, selected);
        });
    }

    onPressArrowLeft = (substractMonth) => {
        substractMonth()
    }

    onPressArrowRight = (addMonth) => {
        addMonth()
    }

    onMonthChange = (currMonth) => {
        this.seperateDates(currMonth.dateString)
    }

    _showToast = (message) => {
        this.refs.toast.show(message, DURATION.LENGTH_LONG)
    }

    onBookThisRoomClick = () => {
        const { selected, slot1, slot2, slots, cart } = this.state;
        this.setState({ loading: true })
        if (selected === '') {
            this._showToast('Please select booking date.')
            this.setState({ loading: false })
            return;
        }

        var selectedSlots = [];
        slots.map((slot, key) => {
            if (slot.selected === true) {
                selectedSlots.push(slot);
            }
        });

        if (selectedSlots.length <= 0) {
            this._showToast('Please select at least 1 time slot.');
            this.setState({ loading: false });
            return;
        }

        const { studioManagers } = this.props.navigation.state.params;
        const { studioDetails, roomId, } = this.state;

        var cartDetails = AppData.CartDummy;
        cartDetails.studio_name = studioDetails.studio.name
        cartDetails.studio_id = studioDetails.studio._id
        cartDetails.studio_image = studioDetails.studio.image
        cartDetails.premium = studioDetails.studio.premium
        cartDetails.verified = studioDetails.studio.verified
        cartDetails.slot_weekdays = studioDetails.studio.slot_weekdays
        cartDetails.slot_sat = studioDetails.studio.slot_sat
        cartDetails.slot_sun = studioDetails.studio.slot_sun
        cartDetails.studio_hours = studioDetails.studio.studio_hours
        cartDetails.address = studioDetails.studio.address
        cartDetails.phoneNumber = studioDetails.studio.phoneNumber
        cartDetails.price = studioDetails.price
        cartDetails.location = studioDetails.studio.location
        cartDetails.service_fee = studioDetails.studio.service_fee
        cartDetails.studioManagers = studioManagers

        var roomData = AppData.Rooms
        roomData.room_name = studioDetails.name
        roomData.room_id = studioDetails._id
        roomData.room_image = studioDetails.images.length > 0 ? studioDetails.images[0] : ""
        roomData.premium = studioDetails.premium
        roomData.verified = studioDetails.verified
        roomData.price = studioDetails.price

        if ('parkingSpot' in studioDetails.studio) {
            roomData.parkingSpot = studioDetails.studio.parkingSpot
        }

        if ('engineer' in studioDetails.studio) {
            roomData.engineer = studioDetails.studio.engineer
        }

        var slotData = AppData.SlotsData;
        slotData.date = selected
        slotData.alreadyBooked = false
        if (slotData.bookesSlots.length > 0)
            slotData.bookesSlots.splice(0, slotData.bookesSlots.length)
        slotData.bookesSlots = selectedSlots
        console.log('Cart Exist ::: ' + (cart === ''))
        console.log('Cart Exist Selected Slots slotData ::: ' + JSON.stringify(slotData))
        console.log('Cart Exist Selected Slots roomData ::: ' + JSON.stringify(roomData))
        console.log('Cart Exist Selected Slots cartDetails ::: ' + JSON.stringify(cartDetails))
        if (cart === '') {
            if (roomData.slots.length > 0)
                roomData.slots.splice(0, roomData.slots.length)

            if (cartDetails.bookedRooms.length > 0)
                cartDetails.bookedRooms.splice(0, cartDetails.bookedRooms.length)

            roomData.slots.push(slotData)
            cartDetails.bookedRooms.push(roomData)
            this.updateCartDetails(cartDetails)
        } else {
            var index = cart.bookedRooms.findIndex((item) => item.room_id === roomId);
            console.log('Cart Exist index ::: ' + index)
            if (index > -1) {
                var index2 = cart.bookedRooms[index].slots.findIndex((item) => item.date === selected);
                console.log('Cart Exist index2 ::: ' + index2)
                if (index2 > -1) {
                    console.log('Cart Exist cart.bookedRooms[index].slots[index2].bookesSlots.length ::: ' + cart.bookedRooms[index].slots[index2].bookesSlots.length)
                    console.log('Cart Exist selectedSlots.length ::: ' + selectedSlots.length)
                    console.log('Cart Exist cart.bookedRooms.slots.bookesSlots.length === selectedSlots.length ::: '
                        + (cart.bookedRooms[index].slots[index2].bookesSlots.length === selectedSlots.length))
                    console.log('Cart Exist slotData ::: ' + JSON.stringify(slotData))
                    console.log('Cart Exist cart ::: ' + JSON.stringify(cart))
                    if (cart.bookedRooms[index].slots[index2].bookesSlots.length === selectedSlots.length) {
                        this.updateCartDetails(cart)
                        this._showToast('Nothing to update')
                    } else {
                        console.log('Cart Exist slotData ::: ' + JSON.stringify(slotData))
                        if (cart.bookedRooms[index].slots.length > 0)
                            cart.bookedRooms[index].slots.splice(0, cart.bookedRooms[index].slots.length)
                        cart.bookedRooms[index].slots.push(slotData)
                        this.updateCartDetails(cart)
                    }
                } else {
                    cart.bookedRooms[index].slots.push(slotData)
                    this.updateCartDetails(cart)
                }
            } else {

                if (roomData.slots.length > 0)
                    roomData.slots.splice(0, roomData.slots.length)

                roomData.slots.push(slotData)
                cart.bookedRooms.push(roomData)
                this.updateCartDetails(cart)
            }
        }
        this.setState({ loading: false })
    }

    updateCartDetails = (cartDet) => {
        console.log('Cart Details cartDet ::: ' + JSON.stringify(cartDet));
        AsyncStorage.getItem(DatabaseKey.cartDetails).then((cartDetails) => {
            console.log('Cart Details ::: ' + cartDetails);
            if (cartDetails) {
                var cart = JSON.parse(cartDetails);
                console.log('Cart Details length ::: ' + cart.length);
                if (cart.length > 0) {
                    var index = cart.findIndex((item) => item.studio_id === cartDet.studio_id)
                    console.log('Cart Details index ::: ' + index);
                    if (index > -1) {
                        cart[index] = cartDet
                        console.log('Cart Details Cart ::: ' + JSON.stringify(cart));
                        this.storeCartDetails(DatabaseKey.cartDetails, JSON.stringify(cart))
                    } else {
                        cart.push(cartDet)
                        this.storeCartDetails(DatabaseKey.cartDetails, JSON.stringify(cart))
                    }
                } else {
                    var cartDetails = []
                    cartDetails.push(cartDet)
                    this.storeCartDetails(DatabaseKey.cartDetails, JSON.stringify(cartDetails))
                }
            } else {
                var cartDetails = []
                cartDetails.push(cartDet)
                this.storeCartDetails(DatabaseKey.cartDetails, JSON.stringify(cartDetails))
            }
        }).done();
    }

    storeCartDetails = (key, value) => {
        AsyncStorage.setItem(key, value);
        this._showToast('added to cart successfully');
        this.getCartDetails()
    }

    onCallClicked = () => {
        const { studioDetails } = this.state;
        this.makePhoneCall('' + studioDetails.studio.phoneNumber)
        // this._showToast('' + studioDetails.studio.phoneNumber)
    }

    makePhoneCall = (number) => {
        if (Platform.OS === "android") {

            let types = Permissions.getTypes()
            let canOpenSettings = Permissions.canOpenSettings()

            this.setState({ types, canOpenSettings })
            this._updatePermissions(types)
            AppState.addEventListener('change', this._handleAppStateChange)

            this._requestPermission('callPhone', '' + number)
        } else {
            RNImmediatePhoneCall.immediatePhoneCall('' + number);
        }
    }

    _requestPermission = (permission, number) => {
        var options

        if (permission == 'location') {
            options = this.state.isAlways ? 'always' : 'whenInUse'
        } else if (permission == 'callPhone') {
            options = this.state.isAlways ? 'always' : 'whenInUse'
        }

        Permissions.request(permission, options)
            .then(res => {
                this.setState({
                    status: { ...this.state.status, [permission]: res },
                })
                console.log('resource is ::: ' + res)
                if (res != 'authorized') {
                    var buttons = [{ text: 'Cancel', style: 'cancel' }]
                    if (this.state.canOpenSettings)
                        buttons.push({
                            text: 'Open Settings',
                            onPress: this._openSettings,
                        })

                    Alert.alert(
                        'Whoops!',
                        'There was a problem getting your permission. Please enable it from settings.',
                        buttons,
                    )
                } else {
                    RNImmediatePhoneCall.immediatePhoneCall('' + number);
                }
            })
            .catch(e => {
                console.log('Warning is ::: ' + e)
                console.warn(e)
            })
    }

    _updatePermissions = types => {
        Permissions.checkMultiple(types)
            .then(status => {
                if (this.state.isAlways) {
                    return Permissions.check('callPhone', 'always').then(location => ({
                        ...status,
                        location,
                    }))
                }
                return status
            })
            .then(status => this.setState({ status }))
    }

    //update permissions when app comes back from settings
    _handleAppStateChange = appState => {
        if (appState == 'active') {
            this._updatePermissions(this.state.types)
        }
    }

    render() {
        const { position, loading, slots, slot1, slot2, selected,
            day01, day02, day03, day04, day05, day06, day07, day08, day09, day10, day11, day12,
            day13, day14, day15, day16, day17, day18, day19, day20, day21, day22, day23, day24,
            day25, day26, day27, day28, day29, day30, day31
        } = this.state;
        return (
            <View style={[Styles.studioRoomsContainer]}>
                <Loading loading={loading} />
                <Calendar
                    theme={{
                        calendarBackground: 'black',
                        selectedDayTextColor: 'black',
                        arrowColor: 'white', monthTextColor: 'white',
                    }}
                    onMonthChange={this.onMonthChange.bind(this)}
                    style={styles.calendar}
                    minDate={Moment(new Date()).format(dateFormat)}
                    onDayPress={this.onDayPress.bind(this)}
                    onPressArrowLeft={this.onPressArrowLeft.bind(this)}
                    onPressArrowRight={this.onPressArrowRight.bind(this)}
                    displayLoadingIndicator={true}
                    hideExtraDays={true}
                    markedDates={{
                        [selected]: { selected: true,selectedColor: 'white' },
                        [day01]: { disabled: true, disableTouchEvent: true },
                        [day02]: { disabled: true, disableTouchEvent: true },
                        [day03]: { disabled: true, disableTouchEvent: true },
                        [day04]: { disabled: true, disableTouchEvent: true },
                        [day05]: { disabled: true, disableTouchEvent: true },
                        [day06]: { disabled: true, disableTouchEvent: true },
                        [day07]: { disabled: true, disableTouchEvent: true },
                        [day08]: { disabled: true, disableTouchEvent: true },
                        [day09]: { disabled: true, disableTouchEvent: true },
                        [day10]: { disabled: true, disableTouchEvent: true },
                        [day11]: { disabled: true, disableTouchEvent: true },
                        [day12]: { disabled: true, disableTouchEvent: true },
                        [day13]: { disabled: true, disableTouchEvent: true },
                        [day14]: { disabled: true, disableTouchEvent: true },
                        [day15]: { disabled: true, disableTouchEvent: true },
                        [day16]: { disabled: true, disableTouchEvent: true },
                        [day17]: { disabled: true, disableTouchEvent: true },
                        [day18]: { disabled: true, disableTouchEvent: true },
                        [day19]: { disabled: true, disableTouchEvent: true },
                        [day20]: { disabled: true, disableTouchEvent: true },
                        [day21]: { disabled: true, disableTouchEvent: true },
                        [day22]: { disabled: true, disableTouchEvent: true },
                        [day23]: { disabled: true, disableTouchEvent: true },
                        [day24]: { disabled: true, disableTouchEvent: true },
                        [day25]: { disabled: true, disableTouchEvent: true },
                        [day26]: { disabled: true, disableTouchEvent: true },
                        [day27]: { disabled: true, disableTouchEvent: true },
                        [day28]: { disabled: true, disableTouchEvent: true },
                        [day29]: { disabled: true, disableTouchEvent: true },
                        [day30]: { disabled: true, disableTouchEvent: true },
                        [day31]: { disabled: true, disableTouchEvent: true },
                    }}
                    hideArrows={false}
                />
                <ScrollView>
                    <View style={{ paddingTop: 5, paddingBottom: 10 }}>
                        {
                            slots.map((slot, key) => (
                                ('available' in slot) && slot.available && <View style={{
                                    backgroundColor: slot.booked ? 'red' : 'transparent',
                                    marginTop: 5, paddingLeft: 10,
                                    paddingTop: 3, paddingBottom: 3,
                                    flexDirection: 'row', alignItems: 'center',
                                }}>
                                    <Text style={[Styles.textTime, {
                                        flex: 0.9, textAlign: 'left', fontSize: 18,
                                        color: 'white'
                                    }]}>{slot.name} session ({slot.label})</Text>
                                    <View style={{ flex: 0.1, paddingTop: 3 }}>
                                        <CheckBox
                                            checkboxStyle={{ height: 20, width: 20 }}
                                            checked={slot.selected}
                                            disabled={slot.booked ? true : false}
                                            onChange={(slot1) => this.updateSlotsData(key)} />
                                    </View>
                                </View>
                            ))
                        }
                        {this.renderBottomView()}
                    </View>
                </ScrollView>
                <BookRoom
                    onClick={this.onBookThisRoomClick.bind(this)}
                    inputStyles={{ margin: 10, backgroundColor: '#FDA02A', }}
                    textStyles={{ color: 'black' }}
                    action={Strings.TEXT_BOOK_ROOM} />
                <Toast ref="toast" position={position} />
            </View >
        );
    }

    updateSlotsData = (key) => {
        const { slots } = this.state;
        let uppdatedList = [...slots];
        console.log(`List Before : ${JSON.stringify(uppdatedList)}`);
        uppdatedList[key].selected = !uppdatedList[key].selected;
        console.log(`List After : ${JSON.stringify(uppdatedList)}`);
        switch (key) {
            case 0:
                uppdatedList[2].booked = uppdatedList[key].selected;
                uppdatedList[3].booked = uppdatedList[key].selected;
                uppdatedList[4].booked = uppdatedList[key].selected;
                break

            case 1:

                break

            case 2:
                if ((uppdatedList[2].selected === false) && (uppdatedList[3].selected === false) &&
                    (uppdatedList[4].selected === false)) {
                    uppdatedList[0].booked = false;
                } else {
                    uppdatedList[0].booked = true;
                }

                break

            case 3:
                if ((uppdatedList[2].selected === false) && (uppdatedList[3].selected === false) &&
                    (uppdatedList[4].selected === false)) {
                    uppdatedList[0].booked = false;
                } else {
                    uppdatedList[0].booked = true;
                }
                uppdatedList[4].booked = uppdatedList[key].selected;
                break

            case 4:
                if ((uppdatedList[2].selected === false) && (uppdatedList[3].selected === false) &&
                    (uppdatedList[4].selected === false)) {
                    uppdatedList[0].booked = false;
                } else {
                    uppdatedList[0].booked = true;
                }
                uppdatedList[3].booked = uppdatedList[key].selected;
                break
        }
        this.setState({ slots: uppdatedList });
        console.log('Updated user ::: ' + JSON.stringify(this.state.slots));
    }

    renderBottomView() {
        const { studioDetails } = this.state;
        if (studioDetails) {
            console.log('Studio Details Reservation ::: ' + JSON.stringify(studioDetails));
            const { day, more, access_token } = this.state;
            var closed = false;
            if (day === AppData.days.Weekdays) {
                closed = studioDetails.studio.slot_weekdays.closed;
            } else if (day === AppData.days.WeekendSaturday) {
                closed = studioDetails.studio.slot_sat.closed;
            } else if (day === AppData.days.WeekendSunday) {
                closed = studioDetails.studio.slot_sun.closed;
            }

            const premium = Styles.textPremium
            const verified = Styles.textVerified;
            const status = Styles.open;
            return (
                <View style={[Styles.backgroundStudioItems, {
                    marginTop: 5, marginLeft: 15, marginRight: 15,
                    height: width / 3.3
                }]}>

                    <Image
                        style={
                            {
                                width: width / 3.5,
                                height: '100%',
                                padding: 0.5,
                                borderBottomLeftRadius: 8,
                                borderTopLeftRadius: 8
                            }
                        }
                        source={
                            (studioDetails.images.length <= 0) ? placeholder :
                                { uri: Services.Url + Services.Media + studioDetails.images[0] }
                        } />
                    <View style={{ flexDirection: 'column', flex: 1 }}>

                        <View style={{ flexDirection: 'row' }}>
                            <Text numberOfLines={1}
                                ellipsizeMode='tail'
                                style={[Styles.label, { marginTop: 8, flex: 1, color: 'white' }]}>{studioDetails.name}</Text>
                            {/* {
                                more != '' && <Button style={{
                                    marginTop: 8, height: 28, marginEnd: 8, backgroundColor: 'black',
                                    borderColor: '#FDA02A', borderRadius: 3, borderWidth: 0.3
                                }}
                                    onPress={() => {
                                        this.props.navigation.navigate('More', {
                                            access_token: this.state.access_token,
                                            returnData: this._returnData.bind(this),
                                            date: this.state.selected
                                        });
                                    }}>
                                    <Text style={{ color: '#FDA02A', fontSize: Font.Medium, marginStart: 10, marginEnd: 10, fontWeight: 'bold' }}>+{more}</Text>
                                </Button>
                            } */}
                        </View>

                        <Text numberOfLines={1}
                            ellipsizeMode='tail'
                            style={[Styles.label, { marginTop: 3, fontSize: Font.Small, color: 'white' }]}>
                            {studioDetails.studio.name}</Text>
                        {more != '' &&
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('More', {
                                        access_token: this.state.access_token,
                                        returnData: this._returnData.bind(this),
                                        date: this.state.selected
                                    });
                                }}>
                                <Text numberOfLines={1}
                                    ellipsizeMode='tail'
                                    style={[Styles.label, { marginTop: 8, fontSize: Font.Small, color: '#FDA02A' }]}>
                                    {more} other time slots available</Text>
                            </TouchableOpacity>
                        }
                        <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10, alignItems: 'center', marginTop: 12 }} >
                            <View style={{ flex: 0.7, flexDirection: 'row' }} >
                                <Text numberOfLines={1}
                                    ellipsizeMode='tail'
                                    style={[Styles.label, {
                                        textAlign: 'left', marginRight: 3,
                                        marginLeft: 0, fontSize: 24, color: 'white'
                                    }]} >${
                                        ('pricing' in studioDetails) ?
                                            studioDetails.pricing.length > 0 && studioDetails.pricing[0].price
                                            : studioDetails.price ? studioDetails.price : 0
                                    }</Text>
                                <Text numberOfLines={1}
                                    ellipsizeMode='tail'
                                    style={{
                                        color: 'white', fontSize: Font.Small, textAlign: 'left',
                                        alignSelf: 'center'
                                    }}>{Strings.TEXT_PER_SESSION}</Text>
                            </View>
                            {!closed &&
                                <TouchableOpacity
                                    style={{
                                        flex: 0.25, alignItems: 'center', justifyContent: 'center',
                                    }}
                                    onPress={this.onCallClicked}>
                                    <Image
                                        source={require('../resources/images/call_icon.png')} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    calendar: {
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#FDA02A',
    },
    text: {
        textAlign: 'center',
        borderColor: '#bbb',
        padding: 10,
        backgroundColor: '#eee'
    },
    container: {
        flex: 1,
        backgroundColor: 'gray'
    }
});