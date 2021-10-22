import Moment from 'moment';
import React, { PureComponent } from 'react';
import { Alert, Dimensions, FlatList, Image, ImageBackground, Modal, NetInfo, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Dialog from "react-native-dialog";
import DialogInput from 'react-native-dialog-input';
import Toast, { DURATION } from 'react-native-easy-toast';
import { NavigationActions, StackActions } from 'react-navigation';
import validator from 'validator';
import Tabs from '../components/Tabs';
import AsyncStorage from '@react-native-community/async-storage';
import AppData from '../constants/AppData';
import DatabaseKey from '../constants/DatabaseKeys';
import Services from '../constants/WebServices';
import Loading from '../global/Loader';
import webService from '../global/WebServiceHandler';
import String from '../resources/string/Strings';
import Font from '../resources/styles/Font';
import Styles from '../resources/styles/Styles';

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'SignIn' })
    ]
});

const loading = require('../resources/images/no_image.jpg')

const { height, width } = Dimensions.get('window');
const inputStyle = { height: height / 1.4, justifyContent: 'center', alignItems: 'center' };

export default class BookingTab extends PureComponent {

    state = {
        modalVisible: false,
        access_token: '',
        upComingData: '',
        historyData: '',
        loading: false,
        history: false,
        bookingId: '',
        price: '',
        date: '',
        item: '',
        email: '',
        isDialogVisible: false,
        location: false,
    };

    componentDidMount() {

        // NetInfo.isConnected.addEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );
        // if (this.props.location === true) {
        AsyncStorage.getItem(DatabaseKey.access_token).then((access_token) => {
            this.setState({ access_token, loading: true }, function () {
                let body = { 'page': 1 }
                this.fetchBookedStudiosList(access_token, body)
            })
        }).done();
        // }
    }

    componentWillReceiveProps() {
        // this.setState({ location: this.props.location })
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

    setModalVisible(visible, item) {
        this.setState({
            modalVisible: visible,
            item
        });
    }

    showDialog = (show, id) => {
        this.setState({ isDialogVisible: show, bookingId: id })
    }

    closeModal(modalVisible) {
        this.setState({
            modalVisible
        });
    }
    getTimeZoneFromBooking = (item) => {
        var timeZoneShort = ""

        if (item.bookings.studio.timeZone == undefined)
            return timeZoneShort

        var timeZone = item.bookings.studio.timeZone.timeZoneName
        let matches = timeZone.match(/\b(\w)/g);
        timeZoneShort = `(${matches.join('')})`;
        console.log("Time zone is ::: " + timeZoneShort)
        return timeZoneShort
    }

    _keyExtractor = (item, index) => item.id;

    _renderItemForUpcoming = ({ item, index }) => {
        var timeZone = this.getTimeZoneFromBooking(item)

        console.log(` Upcoming bookings ::: ${JSON.stringify(item)}`)
        return (
            <View style={styles.touchIncomingItem}>
                <ImageBackground
                    style={styles.imageItem}
                    source={loading}>
                    < Image style={{ height: '100%', width: '100%' }}
                        source={{
                            uri: Services.Url + Services.Media + item.bookings.room.images[0]
                        }}
                    />
                </ImageBackground>
                <View style={{
                    flexDirection: 'row', padding: 5, backgroundColor: '#F9FAFA',
                    borderColor: '#CBCDCD', borderWidth: 0.5, overflow: 'hidden'
                }} >
                    <View style={{ flex: 1 }}>
                        <View style={styles.viewIdItem}>
                            <Text style={[styles.textItemId, { flex: 0.4 }]}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}>ID: {item._id}</Text>
                            <Text style={[styles.textStudioNameItem, { flex: 0.6 }]}
                                numberOfLines={2}
                                ellipsizeMode={'tail'}>{`${item.bookings.room.name} ${timeZone}`}</Text>
                            <Text style={[styles.textItemId, { flex: 0.4 }]}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}>
                                Date:{Moment(item.bookings.bookedFrom.split('T')[0]).format('ddd, MMM DD')}
                                {/* Date: {Moment(item.bookings.bookedTo).format('ddd, MMM DD')} */}

                            </Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ flexDirection: 'row', marginRight: Font.Small }}>
                            <TouchableOpacity style={styles.touchRecieptImage}
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible, item);
                                }}>
                                < Image
                                    style={{ height: '100%', width: '100%' }}
                                    source={require('../resources/images/receipt_icon.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touchRecieptImage}
                                onPress={() => { this.showDialog(true, item._id) }}>
                                < Image
                                    style={{ height: '100%', width: '100%' }}
                                    source={require('../resources/images/share_icon.png')} />
                            </TouchableOpacity>
                        </View>
                        {item.status !== 'canceled' && < Text numberOfLines={1}
                            ellipsizeMode='tail'
                            onPress={() => this.onCancelBookingClicked(
                                item._id, item.bookings.room.name, item.totalBookings
                            )}
                            style={[Styles.open, { marginTop: 5 }]}>{String.TEXT_CANCEL}</Text>}
                    </View>
                </View >
            </View >
        )
    }

    onCancelBookingClicked = (id, name, total) => {
        var message = `Are you certain, you want to cancel booking for ${name}?`;
        if (total > 1) {
            message = `There are ${total - 1} more bookings associated with this booking. If you try to cancel this booking other will automatiaclly get cancelled too. Are you certain, you want to proceed further?`;
        }
        setTimeout(() => {
            var buttons = [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: () => {
                        this.setState({ loading: true }, function () {
                            this.canceBookingConfirmation(id)
                        })
                    }
                }
            ];
            Alert.alert(
                'Alert!',
                message,
                buttons,
                { cancelable: false }
            );
        }, 100);
    }

    canceBookingConfirmation = (id) => {
        const { access_token } = this.state;
        webService.post((Services.Url + Services.App + Services.Booking + Services.Cancel), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }, {
                'id': id,
            })
            .then((responseJson) => {
                console.log("REsponse is >>> " + JSON.stringify(responseJson))

                if (responseJson.code === Services.statusCodes.failure) {
                    var index = Services.status.findIndex((status) => status.flag === responseJson.response.flag);
                    console.log(index);
                    console.log("index is >>>>" + index)
                    if (index > -1) {
                        this.setState({ loading: false }, function () {
                            setTimeout(() => {
                                var buttons = [
                                    {
                                        text: 'Okay',
                                        onPress: () => this.alertActions(Services.status[index].action)
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
                    else {


                    }

                    return
                }
                this.setState({ loading: false }, function () {
                    setTimeout(() => {
                        var buttons = [
                            {
                                text: 'Okay',
                                onPress: () => { this.bookingCancelled() }
                            },
                        ];
                        Alert.alert(
                            'Alert!',
                            responseJson.message,
                            buttons,
                            { cancelable: false }
                        )
                    }, 100);
                })

                console.log('Studios Booking slots Details Pay Response : ' + JSON.stringify(responseJson))
            })
            .catch((error) => {

                console.log('callapi error :' + JSON.stringify(error))

                this.setState({
                    loading: false
                }, function () {
                    setTimeout(() => {
                        alert(error.message)
                    }, 100)

                })
            });
    }

    bookingCancelled = () => {
        const { access_token } = this.state;
        let body = { 'page': 1 }
        this.setState({ loading: true }, function () {
            this.fetchBookedStudiosList(access_token, body)
        })
    }

    _renderItemForHistory = ({ item, index }) => {
        var imageUrl = require('../resources/images/no_image.jpg')
        if (item.bookings.room != undefined) {
            imageUrl = { uri: Services.Url + Services.Media + item.bookings.room.images[0] }
        }
        var timeZone = this.getTimeZoneFromBooking(item)

        return (
            <View style={styles.touchIncomingItem}>

                <ImageBackground
                    style={styles.imageItem}
                    source={loading}>
                    < Image style={{ height: '100%', width: '100%' }}
                        source={imageUrl}
                    />
                </ImageBackground>
                <View style={{
                    flexDirection: 'row', padding: 5, backgroundColor: '#F9FAFA',
                    borderColor: '#CBCDCD', borderWidth: 0.5, overflow: 'hidden'
                }} >
                    <View style={{ flex: 1 }}>
                        <View style={styles.viewIdItem}>
                            <Text style={[styles.textItemId, { flex: 0.4 }]}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}>ID: {item._id}</Text>
                            <Text style={[styles.textStudioNameItem, { flex: 0.6 }]}
                                numberOfLines={2}
                                ellipsizeMode={'tail'}>{`${item.bookings.room.name} ${timeZone}`}</Text>
                            <Text style={[styles.textItemId, { flex: 0.4 }]}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}>
                                Date: {Moment(item.bookings.bookedFrom.split('T')[0]).format('ddd, MMM DD')}</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ flexDirection: 'row', marginRight: Font.Small }}>
                            <TouchableOpacity style={styles.touchRecieptImage}
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible, item);
                                }}>
                                < Image
                                    style={{ height: '100%', width: '100%' }}
                                    source={require('../resources/images/receipt_icon.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >
            </View >
        )
    }

    shareBookingDetails = (email) => {
        const { access_token, bookingId } = this.state;
        webService.post((Services.Url + Services.App + Services.Share + Services.Booking + '/' + bookingId), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }, {
                'email': email,
            })
            .then((responseJson) => {
                if (responseJson.code === Services.statusCodes.failure) {
                    var index = Services.status.findIndex((status) => status.flag === responseJson.response.flag);
                    console.log(index);
                    if (index > -1) {
                        this.setState({ loading: false }, function () {
                            setTimeout(() => {
                                var buttons = [
                                    {
                                        text: 'Okay',
                                        onPress: () => this.alertActions(Services.status[index].action)
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
                console.log('responseJson ::: ' + JSON.stringify(responseJson))
                this.setState({ loading: false }, function () {
                    setTimeout(() => {
                        console.log('responseJson ::: ' + JSON.stringify(responseJson))
                        var buttons = [
                            {
                                text: 'Okay',
                                onPress: () => { console.log('rjfgvbj3') }
                            },
                        ];
                        Alert.alert(
                            'Alert!',
                            responseJson.message,
                            buttons,
                            { cancelable: false }
                        )
                    }, 100);
                })
                console.log('responseJson ::: ' + JSON.stringify(responseJson))
            })
            .catch((error) => {
                this.setState({ loading: false })
                console.log('callapi error :' + JSON.stringify(error))
            });
    }

    fetchBookedStudiosList = (access_token, body) => {
        webService.get((Services.Url + Services.App + Services.Booking), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }, body)
            .then((responseJson) => {
                console.log('Studios Booking Details : ' + JSON.stringify(responseJson))

                console.log(`Access Token:::: ${access_token}`)
                if (responseJson.code === Services.statusCodes.failure) {
                    var index = Services.status.findIndex((status) => status.flag === responseJson.response.flag);
                    console.log(index);
                    if (index > -1) {
                        if (Services.status[index].flag === 'userNotActive') {
                            this._storeData(DatabaseKey.notActive, 'true')
                        } else {
                            this._storeData(DatabaseKey.notActive, 'false')
                        }
                        this.setState({ loading: false }, function () {
                            setTimeout(() => {
                                var buttons = [
                                    {
                                        text: 'Okay',
                                        onPress: () => this.alertActions(Services.status[index].action)
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
                } else {
                    this._storeData(DatabaseKey.notActive, 'false')
                }
                const { history } = this.state;
                this.setState({ loading: false })
                if (history) {
                    this.setState({
                        historyData: responseJson.data
                    }, function () {
                        this.setState({ loading: false })
                    })
                } else {
                    this.setState({
                        upComingData: responseJson.data
                    }, function () {
                        this.setState({ loading: false })
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false })
                console.log('callapi error :' + JSON.stringify(error))
            });
    }

    _storeData = (key, value) => {
        AsyncStorage.setItem(key, value);
    }

    alertActions = (action) => {
        console.log('Clicked is ::: ' + action)
        switch (action) {
            case AppData.alert.login:
                this._logoutUser();
                break;
            case AppData.alert.exit:
                this.setState({ loading: true }, function () {
                    this._logoutUser();
                });
                break;
            case AppData.alert.logout:
                this.setState({ loading: true }, function () {
                    this._logoutUser();
                });
                break;
        }
    }

    _logoutUser = () => {
        this.setState({
            alert: false,
            // loading: true
        })
        let keys = [
            DatabaseKey.isUserLogin,
            DatabaseKey.access_token,
            DatabaseKey.profile,
            DatabaseKey.isProfileCompleted,
            DatabaseKey.studiosList,
            DatabaseKey.cartDetails,
            DatabaseKey.cardDetails,
            DatabaseKey.masterUser
        ];
        // if (GoogleSignin.isSignedIn)
        //     await GoogleSignin.signOut();

        AsyncStorage.multiRemove(keys, (error) => {
            console.log("Removing item : " + error)
            this.setState({ loading: false }, function () {
                const { navigation } = this.props;
                navigation.dispatch(resetAction);
            })
        }).done();

    }


    _keyExtractor = (item, index) => `${index}`;

    _onTabChange = (title) => {
        const { location } = this.props;
        switch (title) {
            case String.TAB_UPCOMING:
                // if (location) {
                this.setState({ history: false, loading: true }, function () {
                    let body = { 'page': 1 };
                    this.fetchBookedStudiosList(this.state.access_token, body)
                });
                // }
                break;
            case String.TAB_HISTORY:
                // if (location) {
                this.setState({ history: true, loading: true }, function () {
                    let body2 = { 'page': 1, history: true };
                    this.fetchBookedStudiosList(this.state.access_token, body2)
                });
                // }
                break;
        }
    }

    _showToast = (message) => {
        this.refs.toast.show(message, DURATION.LENGTH_LONG)
    }

    sendInput = (email) => {
        if (!validator.isEmail(email)) {
            setTimeout(() => {
                alert(AppData.email.error.message.replace('^', ''))
            }, 100);
            return
        }
        this.setState({ isDialogVisible: false }, function () {
            setTimeout(() => {
                this.shareBookingDetails(email)
            }, 100);
        });
    }

    render() {
        const { upComingData, historyData, loading, position, item, isDialogVisible, email } = this.state;
        const { location } = this.props;
        return (
            <View style={styles.container}>
                <Loading loading={loading} />
                {
                    Platform.OS === 'android' ? <Dialog.Container visible={isDialogVisible}>
                        <Dialog.Title>Email</Dialog.Title>
                        <Dialog.Input
                            style={Styles.shareInput}
                            underlineColorAndroid="transparent"
                            keyboardType='email-address'
                            placeholder='jack@gmail.com'
                            onChangeText={(email) => this.setState({ email })} />
                        <Dialog.Button label="Cancel" onPress={() => { this.showDialog(false, '') }} />
                        <Dialog.Button label="Submit" onPress={() => { this.sendInput(email) }} />
                    </Dialog.Container> :
                        <DialogInput
                            isDialogVisible={isDialogVisible}
                            title={"Email"}
                            textInputProps={{ autoCorrect: false }}
                            hintInput={"jack@gmail.com"}
                            submitInput={(inputText) => {
                                this.sendInput(inputText);
                            }}
                            closeDialog={() => { this.showDialog(false, '') }}>
                        </DialogInput>
                }
                {item != '' &&
                    <Modal
                        transparent={true}
                        backgroundColor={'rgba(0,0,0,0.6)'}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { console.log('close modal') }} >
                        <View style={Styles.modalBackground}>
                            <View style={{
                                backgroundColor: 'white',
                                borderRadius: 5, width: '90%',
                                paddingTop: 5, paddingBottom: 5
                            }}>
                                <Text style={styles.textReciept}>Receipt</Text>
                                <Text style={styles.textId}>(ID : {item._id})</Text>
                                <Text style={[styles.textReciept, { marginBottom: 3 }]}>{item.bookings.room.name}
                                </Text>
                                {
                                    item.bookings.studio.email != undefined && item.bookings.studio.email != '' &&
                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <Text style={styles.textEmail}>Email  </Text>
                                        <Text style={styles.textEmailValue}>{item.bookings.studio.email}</Text>
                                    </View>
                                }
                                {
                                    item.bookings.studio.phoneNumber != undefined && item.bookings.studio.phoneNumber != '' &&
                                    <View style={{ flexDirection: 'row', marginTop: 5}}>
                                        <Text style={styles.textEmail}>Phone Number  </Text>
                                        <Text style={styles.textEmailValue}>{
                                            item.bookings.studio.phoneNumber
                                        }</Text>
                                    </View>
                                }
                                <View style={[styles.viewTotalBooking, { marginBottom: 3, marginTop: 5 }]}>
                                    <Text style={styles.textTotalBookingPrice}>Date  </Text>
                                    <Text style={styles.textTotalBookingPriceValue}>{
                                        Moment(item.bookings.bookedFrom.split('T')[0]).format('ddd, MMM DD')
                                    }</Text>

                                </View>

                                <View style={[styles.viewTotalBooking, { marginBottom: 3, marginTop: 5, marginBottom: 8 }]}>
                                    <Text style={styles.textTotalBookingPrice}>Timing  </Text>
                                    <Text style={styles.textTotalBookingPriceValue}>
                                        {AppData.timing[item.bookings.slot].timing}</Text>
                                </View>
                                <View style={[styles.viewTotalBooking, { marginBottom: 3, marginTop: 5 }]}>
                                    <Text style={styles.textTotalBookingPrice}>Price</Text>
                                    <Text style={styles.textTotalBookingPriceValue}>{'$' + item.bookings.roomPrice}</Text>
                                </View>
                                <View style={[styles.viewTotalBooking, { marginBottom: 3, marginTop: 5 }]}>
                                    <Text style={styles.textTotalBookingPrice}>Service Fee</Text>
                                    <Text style={styles.textTotalBookingPriceValue}>{'$' + item.bookings.service_fee}</Text>
                                </View>

                                <View style={styles.lineView} />

                                <View style={[styles.viewTotalBooking, { marginBottom: 5, marginTop: 5 }]}>
                                    <Text style={styles.textTotalBookingPrice}>TOTAL PRICE</Text>
                                    <Text style={styles.textTotalBookingPriceValue}>{
                                        '$' + (item.bookings.roomPrice + item.bookings.service_fee)}</Text>
                                </View>

                                <TouchableOpacity style={styles.touchCrossIcon}
                                    onPress={() => {
                                        this.closeModal(false);
                                    }}>
                                    <Image style={styles.imageCrossIcon}
                                        source={require('../resources/images/cross.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                }
                < Tabs callback={this._onTabChange.bind(this)}>
                    < View title={String.TAB_UPCOMING} style={styles.container}>
                        {
                            // (location === true) &&
                            (upComingData.length > 0) ?
                                < FlatList
                                    data={upComingData}
                                    extraData={upComingData}
                                    renderItem={this._renderItemForUpcoming}
                                    keyExtractor={this._keyExtractor} />
                                : !loading && <View style={inputStyle}>
                                    <Text style={Styles.noData}>
                                        {String.TEXT_NO_BOOKING}
                                    </Text>
                                </View>
                        }
                    </View>

                    <View title={String.TAB_HISTORY} style={styles.container}>
                        {
                            // (location === true) && 
                            (historyData.length > 0) ?
                                < FlatList
                                    data={historyData}
                                    extraData={historyData}
                                    renderItem={this._renderItemForHistory}
                                    keyExtractor={this._keyExtractor} />
                                : !loading && <View style={inputStyle}>
                                    <Text style={Styles.noData}>
                                        {
                                            // (location) ? String.TEXT_NO_DATA : 
                                            String.TEXT_NO_HISTORY
                                        }
                                    </Text>
                                </View>
                        }
                    </View>
                </Tabs >
                <Toast ref="toast" position={position} />
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    lineView: {
        borderBottomColor: '#f4f3f4',
        borderBottomWidth: 1.5,
        marginTop: 3,
        marginStart: 10,
        marginEnd: 10,
    },
    imageCrossIcon: {
        height: 15,
        width: 15
    },
    imageItem: {
        height: height / 3,
        marginTop: 10,
        width: '100%',
    },
    textItemId: {
        fontSize: 14,
        color: '#4A4A4A',
        fontWeight: 'bold'
    },
    textReciept: {
        color: '#4B4B4B',
        textAlign: 'center',
        fontSize: width * 0.06,
        marginTop: 5,
        fontWeight: 'bold'
    },
    textId: {
        color: '#FDA02A',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 5
    },
    textPrice: {
        color: '#4B4B4B',
        fontSize: 16,
        marginStart: 10
    },
    textPriceValue: {
        color: '#4B4B4B',
        position: 'absolute',
        end: 10,
        fontSize: 16
    },
    textDate: {
        color: '#4B4B4B',
        fontSize: 16,
        marginStart: 10
    },
    textHours: {
        color: '#4B4B4B',
        position: 'absolute',
        end: 10,
        fontSize: 16
    },
    viewSubtotal: {
        flexDirection: 'row',
        marginTop: 10
    },
    touchRecieptImage: {
        height: 30,
        width: 30,
        padding: 3,
        alignSelf: 'center'
    },
    imageRecieptItem: {
        height: 20,
        width: 20,
    },
    textStudioNameItem: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A4A4A',
    },
    textDateItem: {
        fontSize: 16,
        color: '#252B33'
    },
    textTimingItem: {
        fontSize: 16,
        alignSelf: 'center',
        color: '#4B4B4B'
    },
    viewIdItem: {
        flexDirection: 'column',
        marginTop: 5,
    },
    touchIncomingItem: {
        marginStart: 8,
        marginEnd: 8
    },

    viewTotalBooking: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },

    textTotalBookingPrice: {
        color: '#4B4B4B',
        fontSize: width * 0.05,
        marginStart: 10,
        fontWeight: 'bold'
    },
    textEmail: {

        flex: 1, color: '#4B4B4B',
        fontSize: width * 0.05,
        marginStart: 10,
        fontWeight: 'bold',

    },
    textTotalBookingPriceValue: {
        color: '#4B4B4B',
        position: 'absolute',
        end: 10,
        fontSize: 18,
        fontWeight: 'bold'
    },
    textEmailValue: {
        flex: 1, color: '#4B4B4B',
        end: 10,
        textAlign: 'right',
        fontSize: 18,
        fontWeight: 'bold'
    },
    textSubtotal: {
        color: '#4B4B4B',
        fontSize: 16,
        marginStart: 10
    },
    textSubtotalValue: {
        color: '#4B4B4B',
        position: 'absolute',
        end: 10,
        fontSize: 16
    },
    touchCrossIcon: {
        height: '5%',
        width: '5%',
        position: 'absolute',
        end: 10,
        top: 10
    },
});