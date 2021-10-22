import React, { PureComponent } from 'react';
import {
    Alert, BackHandler, Dimensions, FlatList, Image, KeyboardAvoidingView,
    NetInfo, Platform, Text, TouchableOpacity, View, Modal
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
// import ApiCalendar from 'react-google-calendar-api';
import AsyncStorage from '@react-native-community/async-storage';
import CardDetails from '../alerts/AlertCardDetails';
import AddCardDetails from '../alerts/AddCardDetails';
import AddGovId from '../alerts/AddGovId';
import AddNotesNew from '../alerts/AddNotesNew';
import Notify from '../alerts/Notify';
import AppData from '../constants/AppData';
import DatabaseKey from '../constants/DatabaseKeys';
import Services from '../constants/WebServices';
import { RNS3 } from '../AwsS3/RNS3';
import Loading from '../global/Loader';
import BookRoom from '../global/UserAction';
import webService from '../global/WebServiceHandler';
import ItemBookingOverview from '../items/itemBookingOverview';
import Strings from '../resources/string/Strings';
import Styles from '../resources/styles/Styles';
import validator from 'validator';
var stripe = require('stripe-client')('pk_test_uimFpHj4BXjd0f60m6fiPQAe');
const PaymentRequest = require('react-native-payments').PaymentRequest;
const isIOS = Platform.OS == 'ios'

const METHOD_DATA = [{
    supportedMethods: ['apple-pay'],
    data: {
        merchantIdentifier: 'merchant.com.offsureit.recordingstudio',
        supportedNetworks: ['visa', 'mastercard', 'amex'],
        countryCode: 'US',
        currencyCode: 'USD'
    }
}];
// const OPTIONS = {
//     requestPayerName: true,
//     requestPayerPhone: false,
//     requestPayerEmail: true,
//     requestShipping: false
// };
const OPTIONS = {
    requestPayerPhone: false,
};
// var stripe = require('stripe-client')('pk_live_21dcy77LbepqJxAS2QRgHAiB');
import moment from 'moment';
const { width } = Dimensions.get('window')
import DeviceInfo from 'react-native-device-info';
import DummyModal from '../alerts/DummyModal'

var fontSize = width * 0.03;
var googleCalendarEventSavedCount = 0
var clearCartWithoutSavingDetails = 1
var clearCartWtihSavingDetails = 2

class LogoTitle extends PureComponent {
    render() {
        const { name, address } = this.props;
        return (
            <View style={{
                alignItems: 'center', justifyContent: 'center',
                flex: 1
            }}>
                <Text
                    style={Styles.textHeader}
                    numberOfLines={1}
                    ellipsizeMode='tail'>Cart{}</Text>

                {/* <Text
                    style={[Styles.textHeader, { fontSize: 10, marginTop: 1 }]}
                    numberOfLines={1}
                    ellipsizeMode='tail'>{address}</Text> */}

            </View>
        );
    }
}

class HeaderRight extends PureComponent {

    render() {
        const { onPress, isMasterUser } = this.props;

        return (
            <View style={{
                alignItems: 'center', justifyContent: 'center',
                paddingRight: 15
            }} >
                {
                    <TouchableOpacity
                        onPress={onPress}>
                        <Text style={Styles.textHeaderRight}>Note</Text>
                    </TouchableOpacity>
                }
            </View>
        );
    }

}

class HeaderLeft extends PureComponent {
    render() {
        const { onPress } = this.props;
        return (
            <TouchableOpacity style={{
                alignItems: 'center', justifyContent: 'center',
                paddingLeft: 15, height: '100%'
            }} onPress={onPress}>
                <Image source={require('../resources/images/back_arrow.png')} />
            </TouchableOpacity>
        );
    }
}

export default class RequestBook extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            position: 'bottom',
            style: {},
            totalPrice: 0,
            visible: false,
            data: [],
            notify: false,
            isAlreadyBooked: false,
            message: '',
            type: AppData.alert.cancel,
            stripeCstmrId: '',
            orderId: '',
            cardAvailable: false,
            cardNumber: '',
            service_fee: 0,
            notesModalVisible: false,
            parking: false,
            parkingName: '',
            engineer: false,
            engineerName: '',
            notes: '',
            govtIdImage: '',
            govtIdImageUrl: '',
            isNotesOpenOnRequestBook: false,
            govid: false
        };
    }

    static navigationOptions = ({ navigation }) => {
        var isMasterUser = navigation.getParam('isMasterUser')
        return {
            headerTitle: <LogoTitle
                name={navigation.getParam('name')}
                address={navigation.getParam('address')} />,
            headerLeft: <HeaderLeft
                onPress={navigation.getParam('onPress')} />,
            headerRight: <HeaderRight
                isMasterUser={isMasterUser}
                onPress={navigation.getParam('openAddNotesModal')}
            />,
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
        }
    };

    onBackPress = () => {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onBackPress.bind(this), openAddNotesModal: this.openAddNotesModal.bind(this) });
        this.setState({ loading: true })
        // NetInfo.isConnected.addEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );

        const { access_token } = this.props.navigation.state.params;

        this.setState({ access_token })
        this._getCartListFromDatabase(true)

        AsyncStorage.getItem(DatabaseKey.cardDetails).then((cardDetails) => {
            console.log(`is cardDetails ${cardDetails}`)
            if (cardDetails) {
                var details = JSON.parse(cardDetails);
                this.setState({ cardAvailable: true, cardNumber: '' + (details.number % 10000) })
            }
        }).done();

        AsyncStorage.getItem(DatabaseKey.masterUser).then((masterUser) => {
            console.log(`is master ${masterUser}`)
            if (masterUser && masterUser == "true") {
                this.props.navigation.setParams({ isMasterUser: "true" })
            } else {
                this.props.navigation.setParams({ isMasterUser: "false" })
            }
        }).done();

        this.getStripeCustomerId()
    }

    openAddNotesModal = (isFromRequest) => {
        const { data } = this.state;

        // if (data.length <= 0) {
        //     alert(`No cart data found.`)
        //     return;
        // }

        this.setState({
            isNotesOpenOnRequestBook: isFromRequest == undefined ? false : true,
            notesModalVisible: true
        });
    }
    _getCartListFromDatabase = (isNeedtoValidateCartDetails) => {
        AsyncStorage.getItem(DatabaseKey.cartDetails).then((cartDetails) => {
            console.log('Has customer id cartDetails cartDetails ::: ' + cartDetails);
            if (cartDetails) {
                var cartData = JSON.parse(cartDetails);
                var temp = [];
                var parking = false;
                var engineer = false;
                var service_fee = 0;
                cartData.map((item, key) => {
                    console.log(`Data is : `, item);
                    service_fee += item.service_fee * item.bookedRooms.length;

                    item.bookedRooms.map((subItem, subKey) => {
                        if ('parkingSpot' in subItem) {
                            if (!parking)
                                parking = subItem.parkingSpot
                        }

                        if ('engineer' in subItem) {
                            if (!engineer)
                                engineer = subItem.engineer
                        }
                        subItem['studioManagers'] = item.studioManagers
                        for (let slots of subItem.slots) {
                            for (let booked of slots.bookesSlots) {
                                if (!this.compareDates(moment(slots.date))) {
                                    booked.booked = true;
                                }
                            }
                        }
                        temp.push(subItem);
                    });
                });

                console.log(`Has customer id cartDetails cartDetails ::: ${cartDetails}, Parking : ${parking}, Engineer : ${engineer}`);
                this.setState({ data: temp, loading: false, service_fee, parking, engineer }, function () {
                    if (isNeedtoValidateCartDetails)
                        this.validateCartDetails();
                    else
                        this.getTotalBookedSlots();
                });
            } else {
                this.setState({ loading: false })
            }
        }).done();
    }

    getStripeCustomerId = () => {
        AsyncStorage.getItem(DatabaseKey.profile).then((profile) => {
            var jsonObject = JSON.parse(profile)
            console.log('Has stripeCustId id ::: ' + ('stripeCustId' in jsonObject));
            if ('stripeCustId' in jsonObject) {
                this.setState({
                    stripeCstmrId: jsonObject.stripeCustId
                })
            }

            if ('cardLast4Digits' in jsonObject) {
                this.setState({
                    cardNumber: jsonObject.cardLast4Digits
                })
            }
        }).done();
    }

    componentWillMount() {
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
    }

    _handleConnectivityChange = (status) => {
        this.setState({
            connected: status
        })
        console.log('*********_handleConnectivityChange: Network Connectivity status *******: ' + status);
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
        return `${time}:00.000`;
    }

    onBookThisRoomClick = () => {
        this.openAddNotesModal(true);
    }
    bookRoom() {
        googleCalendarEventSavedCount = 0;
        AsyncStorage.getItem(DatabaseKey.masterUser).then((masterUser) => {
            console.log(`is master ${masterUser}`)
            if (masterUser && masterUser == "true") {
                this.requestBooking('');
            } else
                // this.props.navigation.navigate('ConfirmAndPayScreen')
                this._getStripeTokenAndBookStudio();
        }).done();
    }

    // getUrlAndHeaderForCreateEvent = async (email, accessToken) => {

    //     var profile = await AsyncStorage.getItem(DatabaseKey.profile)
    //     console.log(`profile object is ${JSON.parse(profile)}`)

    //     var eventList = this.getEventList(JSON.parse(profile))
    //     console.log(`final event list ${JSON.stringify(eventList)}`)
    //     var header = {
    //         'Authorization': `Bearer ${accessToken}`,
    //         'Content-Type': "application/json"
    //     }
    //     var url = `https://www.googleapis.com/calendar/v3/calendars/${email}/events`
    //     console.log(`Url is ${url}`)

    //     this.saveGoogleCalendarEventsInRecursion(eventList, header, url)

    // }
    // getEventList(profile) {
    //     const { data } = this.state;
    //     console.log(`Selected Data is ${JSON.stringify(data)}`)


    //     var eventList = []

    //     data.map((roomObject, key) => {
    //         var slots = roomObject.slots

    //         slots.map((slotsObject, key) => {


    //             var bookedSlots = slotsObject.bookesSlots


    //             bookedSlots.map((bookedSlotsObject, key) => {

    //                 var startDate = slotsObject.date
    //                 var endDate = slotsObject.date

    //                 var timeSlots = bookedSlotsObject.label.split('-');

    //                 var slotStartTime = timeSlots[0].replace(/\s/g, '');
    //                 var slotEndTime = timeSlots[1].replace(/\s/g, '');

    //                 var dateCompare = this.compareDates(
    //                     `${startDate} ${this.get24hTime(slotStartTime)}`, `${endDate} ${this.get24hTime(slotEndTime)}`)
    //                 // alert(`Date compare is ${dateCompare}`)

    //                 if (!dateCompare) {

    //                     // let tomorrow = new Date();
    //                     console.log(`Old date is :: ${endDate}`)
    //                     endDate = moment(endDate).add(1, 'day').format('YYYY-MM-DD');
    //                     console.log(`new date is :: ${endDate}`)
    //                 }

    //                 startDate = moment(`${startDate} ${this.get24hTime(slotStartTime)}`).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    //                 endDate = moment(`${endDate} ${this.get24hTime(slotEndTime)}`).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    //                 var slotTiming12HourOr6Hour = bookedSlotsObject.name.replace("hr", "Hour");

    //                 var summaryy = `${roomObject.room_name} ${slotTiming12HourOr6Hour} lockout by ${profile.firstName} ${profile.lastName}`
    //                 console.log(`summary is ${summaryy}`)

    //                 var eventObject = {
    //                     summary: summaryy,
    //                     description: `Contact Info:
    //                  ${profile.email}  
    //                  ${profile.countryCode} ${profile.phone}`,
    //                     start: {
    //                         dateTime: startDate,
    //                         timeZone: DeviceInfo.getTimezone()
    //                     },
    //                     end: {
    //                         dateTime: endDate,
    //                         timeZone: DeviceInfo.getTimezone()
    //                     },

    //                     attendees: roomObject.studioManagers
    //                 }

    //                 eventList.push(eventObject)
    //             })
    //         })
    //     })

    //     console.log(`event List is ::: ${JSON.stringify(eventList)}`)
    //     return eventList
    // }

    // saveGoogleCalendarEventsInRecursion(eventList, header, url) {
    //     console.log(`Api hit count ${googleCalendarEventSavedCount}`)
    //     if (googleCalendarEventSavedCount == eventList.length) {
    //         this.setState({
    //             loading: false
    //         }, function () {
    //             setTimeout(() => {
    //                 alert('Events saved on Google Calendar.')
    //                 this.bookingComplete()
    //             }, 100)
    //         })

    //         return
    //     }
    //     var eventObject = eventList[googleCalendarEventSavedCount]
    //     console.log(`final object is ${JSON.stringify(eventObject)}`)

    //     webService.post(url, header, eventObject)
    //         .then((responseJson) => {
    //             console.log(`Response count success  ${JSON.stringify(responseJson)}`)
    //             ++googleCalendarEventSavedCount
    //             this.saveGoogleCalendarEventsInRecursion(eventList, header, url)

    //         })
    //         .catch((error) => {
    //             //alert(`${JSON.stringify(error)}`)
    //             if (error.name == '503') {
    //                 this.setState({
    //                     loading: false
    //                 }, function () {
    //                     setTimeout(() => {
    //                         alert(error.message)
    //                         this.bookingComplete()
    //                     }, 100)
    //                 })
    //                 return
    //             }

    //             console.log(`Response count failure`)
    //             ++googleCalendarEventSavedCount
    //             this.saveGoogleCalendarEventsInRecursion(eventList, header, url)


    //         });
    // }


    // async googleAuthenticate() {
    //     // add any configuration settings here:
    //     await GoogleSignin.configure({
    //         scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'], // what API you want to access on behalf of the user, default is email and profile
    //         webClientId: '834270141150-7ahvucs3ekfvqarlnpq7i6ce3q7486kb.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    //         offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //         hostedDomain: '', // specifies a hosted domain restriction
    //         loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
    //         forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
    //         accountName: '', // [Android] specifies an account name on the device that should be used
    //         // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    //     });
    //     const data = GoogleSignin.signIn().then((response) => {
    //         console.log(`google json response is ${JSON.stringify(response)}`)
    //         if (response) {
    //             this.setState({
    //                 loading: true
    //             }, function () {
    //                 this.getUrlAndHeaderForCreateEvent(response.user.email, response.accessToken)
    //             })

    //         }

    //     })
    //         .catch((error) => {
    //             alert(error)
    //             this.bookingComplete()
    //         })
    // }

    showAlert(msg) {
        setTimeout(() => {
            var buttons = [
                {
                    text: 'Okay',
                    onPress: () => {
                        this.bookingComplete()
                    }
                },
            ];
            Alert.alert(
                'Alert!',
                msg,
                buttons,
                { cancelable: false }
            )
        }, 100);
    }

    compareDates = (startTime) => {
        var momentA = moment(startTime).format('YYYY-MM-DD');
        var momentB = moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD');
        if (momentA > momentB)
            return true;
        else
            return false
    }

    _getStripeTokenAndBookStudio = () => {
        const { stripeCstmrId, cardAvailable, cardNumber } = this.state;
        if (stripeCstmrId === '' && cardNumber === '') {
            this.setState({ visible: true })
        } else {
            this.setState({
                loading: false
            }, function () {
                if (cardAvailable === true) {
                    if ((cardNumber !== '') && (cardNumber.length === 4) && stripeCstmrId.trim() !== '') {
                        setTimeout(() => {
                            var buttons = [
                                {
                                    text: 'Proceed',
                                    onPress: () => {
                                        this.setState({ loading: true }, function () {
                                            this.requestBooking(stripeCstmrId.trim())
                                        })
                                    }
                                },
                                {
                                    text: 'Change',
                                    onPress: () => this.setState({ visible: true })
                                }
                            ];
                            Alert.alert(
                                'Alert!',
                                `You have a card registered with us ending with ${cardNumber}. Do you want to proceed with same or change it?`,
                                buttons,
                                { cancelable: false }
                            )

                        }, 100);
                    } else {
                        this.setState({ visible: true })
                    }
                } else {
                    if (stripeCstmrId.trim() !== '' && cardNumber !== '') {
                        setTimeout(() => {
                            var buttons = [
                                {
                                    text: 'Proceed',
                                    onPress: () => {
                                        this.setState({ loading: true }, function () {
                                            this.requestBooking(stripeCstmrId.trim())
                                        })
                                    }
                                },
                                {
                                    text: 'Change',
                                    onPress: () => this.setState({ visible: true })
                                }
                            ];
                            Alert.alert(
                                'Alert!',
                                `You have a card registered with us ending with ${cardNumber}. Do you want to proceed with same or change it?`,
                                buttons,
                                { cancelable: false }
                            )

                        }, 100);
                    } else {
                        this.setState({ visible: true });
                    }

                }
            })

        }
    }

    _showToast = (message) => {
        this.refs.toast.show(message, DURATION.LENGTH_LONG)
    }

    getRequestedData = (status) => {
        const { data, engineerName, parkingName } = this.state;
        var tempData = [];
        console.log('Data is ::: ' + JSON.stringify(data));
        if (data.length > 0) {
            data.map((item, key) => {
                item.slots.map((subItem, subKey) => {
                    subItem.bookesSlots.map((subHeaderItem, subHeaderKey) => {
                        if (status === 'validating') {
                            var dataItem = {
                                'slot': subHeaderItem.index,
                                'room': item.room_id,
                                'date': subItem.date,
                                'engineer': item.engineer ? engineerName : '',
                                'parkingSpot': item.parkingSpot ? parkingName : ''
                            };
                            tempData.push(dataItem)
                        } else {
                            if (!subHeaderItem.booked) {
                                var dataItem = {
                                    'slot': subHeaderItem.index,
                                    'room': item.room_id,
                                    'date': subItem.date,
                                    'engineer': item.engineer ? engineerName : '',
                                    'parkingSpot': item.parkingSpot ? parkingName : ''
                                };
                                tempData.push(dataItem)
                            }
                        }
                    });
                });
            });
        }
        return tempData
    }

    updateCartData = (updatedData) => {
        const { data } = this.state;
        var totalSlots = 0
        var totalBookedSlots = 0
        if (updatedData.length > 0) {
            for (let items of data) {
                for (let slots of items.slots) {
                    for (let booked of slots.bookesSlots) {
                        totalSlots++
                        var index = updatedData.findIndex((update) => (
                            (slots.date === update.date) &&
                            (booked.index === update.slot) &&
                            (items.room_id === update.room)
                        ));

                        if (index > -1) {
                            if (updatedData[index].alreadyBooked) {
                                totalBookedSlots++
                                this.setState({ isAlreadyBooked: updatedData[index].alreadyBooked });
                                booked.booked = updatedData[index].alreadyBooked
                            } else {
                                if (booked.booked) {
                                    totalBookedSlots++;
                                    this.setState({ isAlreadyBooked: true });
                                }
                            }
                        }
                    }
                }
            }
        }

        if (this.state.isAlreadyBooked) {
            if (totalSlots === totalBookedSlots) {
                this.setState({ loading: false }, function () {
                    setTimeout(() => {
                        var buttons = [
                            {
                                text: 'Okay',
                                onPress: () => {
                                    this.updateCart(
                                        clearCartWithoutSavingDetails,
                                        'Selected items are removed from cart.');
                                }
                            },

                        ];
                        Alert.alert(
                            'Alert!',
                            AppData.NotAvailable.available,
                            buttons,
                            { cancelable: false }
                        );
                    }, 100);
                });
            } else {
                this.setState({ loading: false }, function () {
                    setTimeout(() => {
                        Alert.alert('Alert', AppData.NotAvailable.booked);
                    }, 100);
                });
            }
        }

        this.setState({ loading: false, }, function () {
            this.getTotalBookedSlots();
            // this.setHeaderData();
        })
        console.log('totalSlots is ::: ' + totalSlots)
        console.log('totalBookedSlots is ::: ' + totalBookedSlots)
    }

    validateCartDetails = () => {
        var cartData = this.getRequestedData('validating')
        console.log('Cart Details Validation :::' + JSON.stringify(cartData))
        // return;
        const { access_token } = this.state;

        webService.post((Services.Url + Services.App + Services.Validate), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }, { 'data': cartData })
            .then((responseJson) => {
                if (responseJson.code === 409) {
                    this.setState({ loading: false }, function () {
                        setTimeout(() => {
                            this.updateCartData(responseJson.response);
                        }, 100);
                    })
                } else {
                    this.setState({ loading: false }, function () {
                        setTimeout(() => {
                            this.updateCartData(responseJson);
                        }, 100);
                    })
                }
                console.log('Studios Booking slots Details : ' + JSON.stringify(responseJson))
            })
            .catch((error) => {
                if (error.status === 409) {
                    error.json().then((err) => {
                        this.setState({ loading: false }, function () {
                            setTimeout(() => {
                                this.updateCartData(err);
                            }, 100);
                        });
                        console.log('callapi error validateCartDetails :', err.status)
                    });
                } else {
                    error.json().then((err) => {
                        console.log('callapi error validateCartDetails :', err.status)
                        this.setState({ loading: false }, function () {
                            setTimeout(() => {
                                var data = []
                                this.updateCartData(data)
                            }, 100);
                        });
                    });
                }
            });
    }

    requestBooking = (token, isDebitCreditCardSelected, cardId) => {
        var cartData = this.getRequestedData('booking')
        var body = {}

        body = { 'data': cartData, 'notes': this.state.notes }
        console.log('Cart Details Validation :::' + JSON.stringify(cartData))
        console.log('body body requestBooking :::' + JSON.stringify(body))
        console.log('body body requestBooking ::: token ', token)
        const { access_token } = this.state;
        webService.post((Services.Url + Services.App + Services.Book), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }, body)
            .then((responseJson) => {
                console.log('Studios Booking slots Details Book Response : ' + JSON.stringify(responseJson))
                setTimeout(() => {
                    // if (token == '') {
                    //     console.log(`log 4 update cart :::::::::::::::::::::::::::::::`)
                    //     this.updateCart(clearCartWtihSavingDetails)
                    // }
                    // else
                    // this.makePayment(token, responseJson.orderId, '')
                    this.makePayment(token, responseJson.orderId, true, isDebitCreditCardSelected, cardId)
                    // this.props.navigation.navigate('ConfirmAndPayScreen')

                }, 1000);
                console.log('Studios Booking slots Details Book Response : ' + JSON.stringify(responseJson))
            })
            .catch((error) => {
                if (responseJson.code < 200 || responseJson.code > 299) {
                    error.json().then((err) => {
                        this.setState({ loading: false }, function () {
                            setTimeout(() => {
                                alert(err);
                            }, 100);
                        });
                        console.log('callapi error validateCartDetails :', err.status)
                    });
                }
            });
    }

    makePayment = (token, orderId, update, isDebitCreditCardSelected, cardId, postBody = undefined) => {
        const { access_token, cardNumber } = this.state;
        let body = postBody
        if (postBody == undefined) {
            body = {
                'id': orderId,
                'token': isDebitCreditCardSelected == true || isDebitCreditCardSelected == undefined ? token : '',
                'update': update,
                'cardLast4Digits': cardNumber,
                'card': isDebitCreditCardSelected == false ? cardId : ''
            }
        }
        console.log('isDebitCreditCardSelected :::' + isDebitCreditCardSelected)
        console.log('postBody :::' + JSON.stringify( postBody))

        console.log('token :::' + token)
        webService.post((Services.Url + Services.App + Services.Pay), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }, body)
            .then((responseJson) => {
                console.log('Studios Booking slots Details Pay Response : ' + JSON.stringify(responseJson))
                if (responseJson.code < 200 || responseJson.code > 299) {
                    this.setState({ loading: false }, function () {
                        setTimeout(() => {
                            alert(responseJson.response.message);
                        }, 100);
                    });
                } else {
                    this.setState({
                        loading: false
                    }, function () {
                        console.log(`log 3 update cart :::::::::::::::::::::::::::::::`)
                        setTimeout(() => {
                            this.updateCart(clearCartWtihSavingDetails, '', responseJson.isNewUser);
                        }, 100)
                    })

                }
            })
            .catch((error) => {
                console.log('callapi error makePayment :', error.status);
                if (error.status < 200 || error.status > 299) {
                    error.json().then((r) => {
                        this.setState({ loading: false }, function () {
                            setTimeout(() => {
                                var buttons = [
                                    {
                                        text: 'Okay',
                                        onPress: () => {
                                            // AsyncStorage.removeItem(DatabaseKey.cartDetails);
                                            this.handleOkClickOfPopUP();
                                        }
                                    },
                                ];
                                Alert.alert('Alert', r.message, buttons, { cancelable: false });
                            }, 100);
                        });
                    });
                } else {
                    error.json().then((err) => {
                        this.setState({ loading: true }, function () {
                            setTimeout(() => {
                                this.validateCartDetails();
                            }, 100);
                        });
                        this._showToast(err);
                    });
                }
                // // return
                // error.json().then((r) => {
                //     console.log('callapi error makePayment :', r)
                //     // this.setState({ loading: false }, function () {
                //     //     if (r.code === Services.statusCodes.failure) {
                //     //         var index = Services.status.findIndex((status) => status.flag === r.flag);
                //     //         console.log(index);
                //     //         if (index > -1) {
                //     //             this.setState({
                //     //                 loading: false,
                //     //                 loginAnother: true,
                //     //                 type: r.flag,
                //     //                 alertMessage: Services.status[index].errorMesage,
                //     //                 logoutAnotherToken: r.token
                //     //             })
                //     //         }
                //     //     }
                //     // });
                // });
                // // this.setState({ loading: false })
                // // this._showToast(JSON.stringify(error));
                // // this.setState({ loading: true }, function () {
                // //     setTimeout(() => {
                // //         this.validateCartDetails();
                // //     }, 100)
                // // })
                // console.log('callapi error makePayment :' + JSON.stringify(error))
            });
    }

    updateStripeId = (stripeCustId) => {
        AsyncStorage.getItem(DatabaseKey.profile).then((profile) => {

            var jsonObject = JSON.parse(profile)
            console.log("Profile image is : " + JSON.stringify(jsonObject))
            if ('stripeCustId' in jsonObject) {
                // jsonObject.stripeCustId = stripeCustId
                // AsyncStorage.setItem(DatabaseKey.profile, JSON.stringify(jsonObject))
            } else {

            }
        }).done();

    }

    // showGoogleCalendarPop() {
    //     var buttons = [
    //         {
    //             text: 'Save',
    //             onPress: () => {
    //                 this.googleAuthenticate()
    //             }
    //         },
    //         {
    //             text: 'Cancel',
    //             onPress: () => { this.bookingComplete() }

    //         }
    //     ];
    //     Alert.alert(
    //         'Alert!',
    //         'Save your bookings on Google Calendar',
    //         buttons,
    //         { cancelable: false }
    //     )


    // }

    handleOkClickOfPopUP = (type) => {
        // if (type == clearCartWtihSavingDetails)
        //     this.showGoogleCalendarPop()
        // else
        this.bookingComplete()
    }

    updateCart = (type, message, newUser) => {
        console.log(`log 1 update cart :::::::::::::::::::::::::::::::`)
        var msg = 'Your booking at Neighborhood Watche has been made.'

        if (message != undefined && message != '')
            msg = message

        if (newUser) {
            msg = Strings.TEXT_GOV_ID;
        }
        var buttons = [
            {
                text: 'Okay',
                onPress: () => {
                    if (newUser) {
                        this.setState({ govid: true });
                    } else {
                        this.handleOkClickOfPopUP(type);
                    }
                }
            },
        ];
        Alert.alert(
            'Alert!',
            msg,
            buttons,
            { cancelable: false }
        );
        AsyncStorage.removeItem(DatabaseKey.cartDetails);


        // const { item } = this.props.navigation.state.params;
        // AsyncStorage.getItem(DatabaseKey.cartDetails).then((cartDetails) => {
        //     console.log('Cart Details ::: ' + cartDetails);
        //     if (cartDetails) {
        //         var cartData = JSON.parse(cartDetails);
        //         if (cartData.length > 0) {
        //             var index = cartData.findIndex((data) => data.studio_id === item.studio_id);
        //             if (index > -1) {
        //                 cartData.splice(index, 1)
        //                 this.setState({ loading: false }, function () {
        //                     if (cartData.length > 0) {
        //                         AsyncStorage.setItem(DatabaseKey.cartDetails, JSON.stringify(cartData))
        //                     } else {
        //                         AsyncStorage.removeItem(DatabaseKey.cartDetails)
        //                     }
        //                     setTimeout(() => {
        //                         var buttons = [
        //                             {
        //                                 text: 'Okay',
        //                                 onPress: () => { this.bookingComplete() }
        //                             },
        //                         ];
        //                         Alert.alert(
        //                             'Alert!',
        //                             'Your booking at Neighborhood Watche has been made successfully.',
        //                             buttons,
        //                             { cancelable: false }
        //                         )
        //                     }, 100);

        //                 })
        //             }
        //         }
        //     }
        // }).done();
    }

    bookingComplete = () => {
        this.props.navigation.navigate("Home");
    }

    setHeaderData = () => {
        // const { item } = this.props.navigation.state.params;
        // this.props.navigation.setParams({
        //     name: item.studio_name,
        //     address: item.address
        // });
    }

    getTotalBookedSlots = () => {
        const { data, service_fee } = this.state;
        var price = 0
        var totalPrice = 0
        var count = 0
        data.map((headerItem, headerKey) => {
            console.log(`Data is ${JSON.stringify(headerItem)}`)
            // price = headerItem.price;
            headerItem.slots.map((item, key) => {
                item.bookesSlots.map((subItem, subKey) => {
                    if (subItem.booked === false) {
                        totalPrice += subItem.price;
                        count++;
                    }
                });
            });
            // totalPrice += (price * count);
            count = 0;
            price = 0;
        });
        totalPrice += service_fee;
        this.setState({ totalPrice });
    }

    _removeRoomIdFromDatabase = (id, cartDetails) => {

        //Remove Item from state data to get new total from getToalBookedSlots method
        var dataItemIndex = this.state.data.findIndex((item) => item.room_id === id)
        console.log(`dataItemIndex:::${dataItemIndex}`)
        if (dataItemIndex > -1)
            this.state.data.splice(dataItemIndex, 1)

        var cartData = JSON.parse(cartDetails);
        for (var i = 0; i < cartData.length; i++) {
            var bookedRooms = cartData[i].bookedRooms
            var index = bookedRooms.findIndex((item) => item.room_id === id)
            console.log(`index is ${index}`)
            //Compare clicked object in cartData
            if (index > -1) {
                bookedRooms.splice(index, 1)
                //clear complete object if Booked room size is empty
                if (bookedRooms == 0) {
                    cartData.splice(i, 1)
                }
                break;
            }
        }

        AsyncStorage.setItem(DatabaseKey.cartDetails, JSON.stringify(cartData))
        this._getCartListFromDatabase(false)
    }

    itemClick = (id, date) => {
        console.log(`Date is ${date}`)

        var buttons = [
            {
                text: 'Remove',
                onPress: () => {
                    this.removeRequestBook(id, date)
                    // this.setState({ loading: true }, function () {
                    //     this.requestBooking(stripeCstmrId)
                    // })
                }
            },
            {
                text: 'Cancel',
                //onPress: () => this.setState({ visible: true })
            }
        ];
        Alert.alert(
            'Alert!',
            'Are you sure you want remove it?',
            buttons,
            { cancelable: false }
        )

    }
    removeRequestBook = (id, date) => {
        if (date == undefined) {
            AsyncStorage.getItem(DatabaseKey.cartDetails).then((cartDetails) => {
                console.log('Has customer id cartDetails cartDetails ::: ' + cartDetails);

                if (cartDetails) {
                    this._removeRoomIdFromDatabase(id, cartDetails)
                }
            }).done();
        }
        else {
            AsyncStorage.getItem(DatabaseKey.cartDetails).then((cartDetails) => {
                console.log('Has customer id cartDetails cartDetails ::: ' + cartDetails);

                if (cartDetails) {
                    var cartData = JSON.parse(cartDetails);

                    for (var i = 0; i < cartData.length; i++) {

                        var bookedRooms = cartData[i].bookedRooms
                        var isItemFound = false

                        for (var j = 0; j < bookedRooms.length; j++) {
                            var slots = bookedRooms[j].slots

                            if (bookedRooms[j].room_id === id) {

                                isItemFound = true
                                var index = slots.findIndex((slotsObject) => slotsObject.date === date)

                                if (index > -1)
                                    slots.splice(index, 1)
                                console.log(`room ids matched ${JSON.stringify(slots)}::::${index}`)

                                if (slots.length === 0) {
                                    this._removeRoomIdFromDatabase(id, cartDetails)
                                    break
                                }
                                else {
                                    //  cartData[i].bookedRooms[j].slots.splice(index, 1)
                                    AsyncStorage.setItem(DatabaseKey.cartDetails, JSON.stringify(cartData))
                                    this._getCartListFromDatabase(false)
                                    console.log(`cart Data after removing object ${JSON.stringify(cartData)}`)
                                }
                            }
                        }
                        if (isItemFound)
                            break
                    }
                }
            }).done();
        }
    }

    _renderItem = ({ item }) => (
        <ItemBookingOverview
            onPressItem={this.itemClick}
            day={this.state.day}
            id={item.room_id}
            item={item} />
    );

    _keyExtractor = (item, index) => item.room_id;

    _onCardActionPerform = (action, form, isDebitCreditCardSelected, cardId) => {

        switch (action) {
            case AppData.alert.submit:
                this.setState({ loading: true, cardNumber: (form.number % 10000) }, function () {
                    if (isDebitCreditCardSelected == true) {
                        this.validateCardDetails(form, isDebitCreditCardSelected);
                    } else {
                        this.requestBooking('', isDebitCreditCardSelected, cardId);
                    }
                });
                break;
        }

        this.setState({ visible: false })
    }

    validateCardDetails = (cardDetails, isDebitCreditCardSelected) => {
        console.log('From is :::' + JSON.stringify(cardDetails))
        console.log('From is :::' + cardDetails.expiry)
        if (cardDetails) {
            // Create a Stripe token with new card infos
            AsyncStorage.setItem(DatabaseKey.cardDetails, JSON.stringify(cardDetails))
            var information = {
                card: {
                    number: cardDetails.number,
                    exp_month: cardDetails.month,
                    exp_year: cardDetails.year,
                    cvc: cardDetails.CVV,
                    name: cardDetails.name
                }
            };
            this.onPayment(information, isDebitCreditCardSelected)
        } else {
            this._showToast('Invalid card details.')
        }
    }

    async onPayment(information, isDebitCreditCardSelected) {
        const { type, orderId } = this.state;
        var card = await stripe.createToken(information);
        console.log('Stripe card ::: ' + JSON.stringify(card))
        var token = card.id;
        console.log('Stripe token ::: ' + token)
        switch (type) {
            case AppData.alert.payment:
                this.makePayment(card.id, orderId, true, isDebitCreditCardSelected, card)
                break;
            default:
                this.requestBooking(card.id, isDebitCreditCardSelected, '');
                break;
        }

    }

    onNotifyCancel = (notify, type) => {
        switch (type) {
            case AppData.alert.remove:
                this.setState({ notify: false }, function () {
                    console.log(`log 4 update cart :::::::::::::::::::::::::::::::`)
                    setTimeout(() => {
                        this.updateCart(clearCartWithoutSavingDetails, 'Selected items are removed from cart.')
                    }, 100);
                });
                break;
            case AppData.alert.payment:
                this.setState({ notify }, function () {
                    setTimeout(() => {
                        this.setState({ visible: true });
                    }, 100);
                });
                break;
            default:
                this.setState({ notify });
                break
        }
    }

    _onAddNotesActionPerform = (notes, parking, engineer) => {
        console.log(`Notes is : ${notes}, Parking is : ${parking}, Engineer is : ${engineer}`);
        this.setState({
            notes: notes,
            parkingName: parking,
            engineerName: engineer,
            notesModalVisible: false
        });
        this.bookRoom();
    }

    _uploadGovId = (govtIdImage, govtIdImageUrl) => {
        this.setState({ govtIdImage, govtIdImageUrl, govid: false }, function () {
            setTimeout(() => {
                this.setState({ loading: true }, function () {
                    AsyncStorage.getItem(DatabaseKey.profile).then((profile) => {
                        if (profile) {
                            var jsonObject = JSON.parse(profile);
                            let number = jsonObject.phone;
                            this.setState({ govtIdImage: `/${number}_image.png` }, function () {
                                this._onProfileImageUpload();
                            });
                        }
                    }).done();

                });
            }, 100);
        });
    }

    _onProfileImageUpload = () => {

        const { govtIdImageUrl, govtIdImage, access_token } = this.state;

        if (validator.isURL(govtIdImageUrl)) {
            this._completeProfile(profileImageUrl)
            return
        }

        var file = {
            uri: govtIdImageUrl,
            name: `${govtIdImage}`,
            type: "image/png"
        }

        const options = {
            keyPrefix: "uploads/",
            bucket: "offsureit",
            region: "us-east-1",
            accessKey: "AKIA5Q3F5H22RKBV5EDK",
            secretKey: "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",
            successActionStatus: 201
        }

        RNS3.put(file, options).then(response => {
            if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
            console.log('_uploadGovtIdImage --> ' + response.body);
            let source = response.body.postResponse.location;
            this.setState({ govtIdImageUrl: source, govtIdImage: response.body.postResponse.key });
            var profile = {
                'govt_id': source,
            };
            this._updateProfile(profile, access_token);
        });
    }

    _updateProfile = (profile, access_token) => {

        webService.patch((Services.Url + Services.Self), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token,
        }, profile)
            .then((responseJson) => {
                console.log("Response is : " + JSON.stringify(responseJson));
                console.log((responseJson.code === Services.statusCodes.failure));
                this.setState({ loading: false }, function () {
                    this._showToast(`Thank you.`);
                    setTimeout(() => {
                        this._thankyou();
                    }, 100);
                });
            })
            .catch((error) => {
                if (responseJson.code < 200 || responseJson.code > 299) {
                    error.json().then((err) => {
                        this.setState({ loading: false }, function () {
                            setTimeout(() => {
                                alert(err);
                            }, 100);
                        });
                        console.log('callapi error validateCartDetails :', err.status)
                    });
                }
            });
    }

    _thankyou = () => {
        var buttons = [
            {
                text: 'Okay',
                onPress: () => {
                    this.bookingComplete();
                }
            },

        ];
        Alert.alert(
            'Alert!',
            'Thank you.',
            buttons,
            { cancelable: false }
        );
    }

    hideAddCardDetailsModal = () => {
        this.setState({ visible: false })
    }

    _tapOnApplePay = () => {
        const { data } = this.state;
        let item = {}
        {
            data.map((elem, index) => {
                console.log('element--->>>', JSON.stringify(elem))
                if (elem) item = elem
            })
        }
        if (item) {
            console.log('item--->>>', JSON.stringify(item))

            let totalPrice = parseFloat(item.price) + .30
            let finalValue = `${totalPrice.toFixed(2)}`
            const DETAILS = {
                id: item.room_id,
                displayItems: [{
                    label: item.room_name,
                    amount: { currency: 'USD', value: finalValue }
                },],
                total: {
                    label: 'Total',
                    amount: { currency: 'USD', value: finalValue }
                }
            };
            try {
                const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS, OPTIONS);
                // const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);


                paymentRequest.canMakePayments().then((canMakePayment) => {

                    if (canMakePayment) {
                        console.log('Can Make Payment')
                        paymentRequest.show().then(paymentResponse => {
                            // Your payment processing code goes here
                            paymentResponse.complete('success')
                            const { transactionIdentifier, paymentData } = paymentResponse.details;
                            console.log('paymentResponse.details', paymentResponse.details)

                            let body = {
                                "type": "APPLE_PAY",
                                "transaction_identifier": transactionIdentifier,
                                "payment_data": paymentData
                            }
                            this.makePayment('', '', true, '', '', body)
                        })
                    }
                    else {
                        console.log('No Payment')
                    }
                })
            } catch (error) {
                console.log("paymentRequest>>>>>>>> error ", error)
            }
        }
    }

    render() {
        const { position, loading, totalPrice, visible, data, notify, message, type, service_fee, notesModalVisible,
            notes, isNotesOpenOnRequestBook, parking, engineer, govid } = this.state;
        console.log('Has customer id ::: cartDetails cartDetails ::: ' + JSON.stringify(data));
        return (
            <KeyboardAvoidingView style={{ backgroundColor: 'white', flex: 1 }}
                behavior={Platform.OS === 'ios' ? "padding" : ""}
                enabled>
                {
                    notesModalVisible &&
                    <AddNotesNew
                        visible={notesModalVisible}
                        isParkingSpaceNeedToAsk={parking}
                        isEngineerNeedToAsk={engineer}
                        notes={notes}
                        isNotesOpenOnRequestBook={isNotesOpenOnRequestBook}
                        callback={this._onAddNotesActionPerform}
                    />
                }

                {
                    govid &&
                    <AddGovId
                        visible={govid}
                        isParkingSpaceNeedToAsk={parking}
                        isEngineerNeedToAsk={engineer}
                        notes={notes}
                        isNotesOpenOnRequestBook={isNotesOpenOnRequestBook}
                        callback={this._uploadGovId}
                    />
                }

                <Loading loading={loading} />

                {/* <CardDetails visible={visible}
                    callback={this._onCardActionPerform} /> */}
                <AddCardDetails visible={visible}
                    callback={this._onCardActionPerform}
                    hideModalCallBack={this.hideAddCardDetailsModal}
                    tapOnApplePay={this._tapOnApplePay} />
                <Notify
                    visible={notify}
                    message={message}
                    callback={this.onNotifyCancel}
                    type={type} />
                {
                    data.length > 0 ? <FlatList
                        data={data}
                        key={data && data.room_id}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem} /> :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            {
                                notesModalVisible ? null :
                                    <Text style={Styles.noData}>No Data Found</Text>
                            }

                        </View>
                }

                {data.length > 0 && <View style={{
                    flexDirection: 'row', marginTop: 8
                }}>
                    <Text
                        style={[Styles.label, { marginLeft: 10, flex: 0.6, fontSize: 14 }]}>SERVICE FEE</Text>
                    <Text
                        style={[Styles.label, { marginLeft: 10, marginRight: 10, flex: 0.4, textAlign: 'right' }]}>
                        ${service_fee}</Text>
                </View>}
                {data.length > 0 && <Text style={[Styles.textPriceValue, {
                    marginLeft: 10, marginTop: 8,
                    marginBottom: 8, fontSize: fontSize, marginRight: 10, textAlign: 'center'
                }]}>
                    {'* This fee helps us run the platform and provide you with the best experience and possible support.'}
                </Text>}

                {data.length > 0 && <View style={{
                    flexDirection: 'row', backgroundColor: 'white',
                    elevation: 1,
                    padding: 3,
                    borderWidth: 1,
                    borderRadius: 2,
                    borderColor: '#ddd',
                    borderBottomWidth: 0,
                    alignItems: 'center',
                }}>
                    <View style={{ flex: 0.6 }}>
                        <Text style={[Styles.label, {
                            textAlign: 'left', marginRight: 5,
                            marginLeft: 0, fontSize: 24,
                        }]} >${data && (totalPrice)}</Text>
                        <Text style={Styles.textTime}>{'Total'}</Text>
                    </View>

                    <BookRoom
                        onClick={this.onBookThisRoomClick.bind(this)}
                        inputStyles={{ flex: 0.4, borderRadius: 5 }}
                        action={Strings.TEXT_BOOK} />
                </View>
                }

                <Toast ref="toast" position={position} />
            </KeyboardAvoidingView >
        );
    }
}