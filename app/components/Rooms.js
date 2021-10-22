import React, { PureComponent } from 'react';
import { Alert, BackHandler, Dimensions, Image, ImageBackground, NetInfo, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions, StackActions } from 'react-navigation';
import AppData from '../constants/AppData';
import DatabaseKey from '../constants/DatabaseKeys';
import Services from '../constants/WebServices';
import ImageSlider from '../global/ImageSlider';
import Loading from '../global/Loader';
import RequestBook from '../global/UserAction';
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


const { height, width } = Dimensions.get('window');
const marginTopLabel = { marginTop: 10, fontSize: 18, fontWeight: 'bold', };
const marginTopText = { marginTop: 5, fontSize: 12, marginBottom: 5, fontWeight: '100' };
const fontSize = { fontSize: 12 };
const placeholder = require('../resources/images/no_image.jpg');

var book = width * 0.05;

class LogoTitle extends PureComponent {

    render() {
        const { header, address } = this.props;
        return (
            <View style={{
                alignItems: 'center', justifyContent: 'center',
                flex: 1
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
        return (
            <TouchableOpacity
                style={{
                    alignItems: 'center', justifyContent: 'center',
                    height: '100%'
                }}
                onPress={onCartPress}>
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
                            marginTop: -10, marginRight: -10, justifyContent: 'center',
                            alignItems: 'center'
                        }} >
                            <Text style={{ fontSize: 10, color: 'white', fontWeight: '800' }}>{count}</Text>
                        </View>}
                    </ImageBackground>
                </TouchableOpacity>
            </TouchableOpacity>
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

export default class Rooms extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <LogoTitle
                header={navigation.getParam('header')}
                address={navigation.getParam('address')} />,
            headerLeft: <HeaderLeft
                onPress={navigation.getParam('onPress')} />,
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
            headerTintColor: '#fff',
        }
    };

    onBackPress = () => {
        this.props.navigation.goBack();
    }

    state = {
        loading: false,
        data: '',
        header: 'Studios',
        address: 'address',
        slidePosition: 1,
        position: 'bottom',
        style: {},
        day: '',
    }

    onCartPress = () => {
        const { access_token } = this.state;
        // this.props.navigation.navigate('Cart');
        this.props.navigation.navigate('RequestBook', {
            access_token
        });
    }

    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onBackPress.bind(this) });
        this.setHeader(this.state.header)
        this.setState({ loading: true })

        this._sub = this.props.navigation.addListener(
            'didFocus',
            this.refreshScreen
        );

        // NetInfo.isConnected.addEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );

        AsyncStorage.getItem(DatabaseKey.access_token).then((access_token) => {
            this.setState({ access_token })
            this.props.navigation.setParams({
                onPress: this.onBackPress.bind(this),
                onCartPress: this.onCartPress.bind(this)
            });
            this.fetchStudiosRoom(access_token, '1')
        }).done();

        const { studioName, studioAddress } = this.props.navigation.state.params
        if (studioName !== '') {
            this.setState({ header: studioName, address: studioAddress }, function () {
                this.setHeader(this.state.header, this.state.address)
            })
        } else {
            this.setHeader(this.state.header, this.state.address)
        }

        var weekDay = new Date().getDay();
        var index = AppData.weekdays.findIndex((week) => week.day === weekDay);
        if (index > -1) {
            this.setState({ day: AppData.weekdays[index].weekday })
        }

    }

    refreshScreen = () => {
        this.getCartDetails()
    }

    getCartDetails = () => {
        AsyncStorage.getItem(DatabaseKey.cartDetails).then((cartDetails) => {
            console.log('Cart Details ::: ' + cartDetails);
            var count = 0;
            if (cartDetails) {
                var cartData = JSON.parse(cartDetails);
                for (let studio of cartData) {
                    for (let rooms of studio.bookedRooms) {
                        for (let days of rooms.slots) {
                            count += days.bookesSlots.length
                        }
                    }
                }
                this.props.navigation.setParams({
                    count
                });
            } else {
                this.props.navigation.setParams({
                    count
                });
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
        this._sub.remove();
    }

    _handleConnectivityChange = (status) => {
        this.setState({
            connected: status
        })
        console.log('*********_handleConnectivityChange: Network Connectivity status *******: ' + status);
    }

    setHeader = (header, address) => {
        this.props.navigation.setParams({ header, address });
    }

    onRequestBookClick = () => {
        const { day, data } = this.state;
        var closed = false;
        if (day === AppData.days.Weekdays) {
            closed = data.studio.slot_weekdays.closed;
        } else if (day === AppData.days.WeekendSaturday) {
            closed = data.studio.slot_sat.closed;
        } else if (day === AppData.days.WeekendSunday) {
            closed = data.studio.slot_sun.closed;
        }
        console.log("closed is ::: " + closed)
        if (!closed) {
            const { roomId, studioManagers } = this.props.navigation.state.params
            this.props.navigation.navigate("Reservation", {
                roomId, studioDetails: this.state.data, studioManagers: studioManagers
            })
        } else {
            this._showToast('Studio is closed right now.');
        }

    }

    fetchStudiosRoom = (access_token, page) => {
        const { studioId, roomId } = this.props.navigation.state.params
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
                    data: responseJson
                })
            })
            .catch((error) => {
                if (error.status === Services.statusCodes.failure) {
                    error.json().then((err) => {
                        var index = Services.status.findIndex((status) => status.flag === err.flag);
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
                        } else {
                            this.setState({ loading: false }, function () {
                                setTimeout(() => {
                                    alert(err);
                                }, 100);
                            });
                        }
                    });
                } else {
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
                }
                console.log('callapi error :' + JSON.stringify(error));
            });
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
        // await GoogleSignin.signOut();

        AsyncStorage.multiRemove(keys, (error) => {
            console.log("Removing item : " + error)
            this.setState({ loading: false }, function () {
                this.props.navigation.dispatch(resetAction);
            })
        }).done();
    }

    _showToast = (message) => {
        this.refs.toast.show(message, DURATION.LENGTH_LONG)
    }
    callNumber = (number) => {
        // if (Platform.OS === "android") {

        //     let types = Permissions.getTypes()
        //     let canOpenSettings = Permissions.canOpenSettings()

        //     this.setState({ types, canOpenSettings })
        //     this._updatePermissions(types)
        //     AppState.addEventListener('change', this._handleAppStateChange)

        //     this._requestPermission('callPhone', '' + number)
        // } else {
        //     RNImmediatePhoneCall.immediatePhoneCall('' + number);
        // }


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
        const { loading, position, data } = this.state;
        console.log("Response data is ::: " + JSON.stringify(data));
        if (data !== '')
            console.log("Response ('pricing' in data) ::: " + ('pricing' in data));
        const premium = styles.textPremium;
        const verified = styles.textVerified;
        return (
            <View style={Styles.studioRoomsContainer}>
                <Loading loading={loading} />
                {
                    (data !== '') ?
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            {console.log("Response data Images is ::: " + data.images.length)}
                            <View style={{ height: height / 2.8 }}>
                                {
                                    (data.images.length > 0) ?
                                        <ImageSlider
                                            images={data.images} />
                                        : <Image style={{ height: height / 2.8, width }} source={placeholder} />
                                }
                            </View>
                            <ScrollView style={{
                                paddingTop: 5, marginBottom: 8
                            }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={[Styles.label, marginTopLabel, { color: `white` }]}> {data.name}</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, color: `white` }}>

                                        {data.premium && <Text style={premium}>{String.TEXT_PREMIUM}</Text>}
                                        {data.verified && <Text style={premium}>{String.TEXT_VERIFIED}</Text>}
                                    </View>
                                    <View style={{ flexDirection: 'column', paddingLeft: 10, paddingRight: 10 }}>
                                        {
                                            data.description !== '' && <Text
                                                style={[Styles.textPriceValue, marginTopLabel, { color: `white` }]}>
                                                {String.TEXT_ABOUT_STUDIO}</Text>}
                                        {
                                            data.description !== '' &&
                                            <Text style={[Styles.textTime, marginTopText, { color: `white` }]}>{data.description}
                                            </Text>
                                        }
                                        {
                                            data.studio.phoneNumber !== '' &&
                                            <Text style={[Styles.textPriceValue, marginTopLabel, { color: `white` }]}>{String.TEXT_STUDIO_CONTACT_INFORMATION}
                                            </Text>
                                        }
                                        {
                                            data.studio.phoneNumber !== undefined && data.studio.phoneNumber != '' &&
                                            <Text
                                                onPress={() => this.callNumber(data.studio.phoneNumber)}
                                                style={[Styles.textTime, marginTopText, { color: `white` }]}>{data.studio.phoneNumber.trim()}
                                            </Text>

                                        }
                                        {
                                            data.studio.email != undefined && data.studio.email !== '' &&
                                            <Text style={[Styles.textTime, marginTopText, { color: `white` }]}>{data.studio.email.trim()}
                                            </Text>
                                        }

                                        <Text
                                            style={[Styles.textPriceValue, marginTopLabel, { color: `white` }]}>{String.TEXT_STUDIO_PRICE}</Text>

                                        {
                                            ('pricing' in data) ?
                                                data.pricing.length > 0 &&
                                                data.pricing.map((price, key) => (
                                                    <Text
                                                        style={[Styles.textTime,
                                                        {
                                                            marginTop: 2, marginBottom: 2, fontWeight: '300',
                                                            fontSize: Font.Medium, color: `white`
                                                        }]}
                                                    >
                                                        {price.hours} Hour Session ${price.price}
                                                    </Text>
                                                ))
                                                : <Text
                                                    style={[Styles.textTime, marginTopText, { color: `white` }]}>{String.TEXT_BOOKING_HOURS}</Text>
                                        }
                                        {
                                            data.rules !== '' &&
                                            <Text style={[Styles.textPriceValue, marginTopLabel, { color: `white` }]}>{String.TEXT_STUDIO_RULES}
                                            </Text>
                                        }

                                        {
                                            data.rules !== '' &&
                                            <Text style={[Styles.textTime, marginTopText, { color: `white` }]}>{data.rules}
                                            </Text>
                                        }

                                        {
                                            data.amenities !== '' &&
                                            <Text style={[Styles.textPriceValue, marginTopLabel, { color: `white` }]}>{String.TEXT_AMENETIES}
                                            </Text>
                                        }

                                        {
                                            data.amenities !== '' &&
                                            <Text style={[Styles.textTime, marginTopText, { color: `white` }]}>{data.amenities.trim()}
                                            </Text>
                                        }

                                        {
                                            data.featured_equipment !== '' &&
                                            <Text style={[Styles.textPriceValue, marginTopLabel, { color: `white` }]}>{String.TEXT_FEATURED_EQUIPMENT}
                                            </Text>
                                        }

                                        {
                                            data.featured_equipment !== '' &&
                                            <Text style={[Styles.textTime, marginTopText, { color: `white` }]}>{data.featured_equipment.trim()}
                                            </Text>
                                        }

                                        {
                                            data.cancellation_policy !== '' &&
                                            <Text style={[Styles.textPriceValue, marginTopLabel, { color: `white` }]}>{String.TEXT_CANCELLATION_POLICY}
                                            </Text>
                                        }

                                        {
                                            data.cancellation_policy !== '' &&
                                            <Text style={[Styles.textTime, marginTopText, { color: `white` }]}>{data.cancellation_policy.trim()}
                                            </Text>
                                        }

                                    </View>
                                </View>
                            </ScrollView>
                        </View> : <Text style={{
                            marginTop: height / 2.3,
                            textAlign: 'center'
                        }}>
                            No Record found</Text>

                }
                {
                    (data !== '') && <View style={{
                        height: 50, backgroundColor: 'black',
                        elevation: 1, flexDirection: 'row',
                        paddingLeft: 10, paddingRight: 10,
                        borderTopWidth: 0.5,
                        borderTopColor: '#FDA02A',
                        alignItems: 'center',
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[Styles.label, {
                                textAlign: 'left', marginRight: 5,
                                marginLeft: 0, fontSize: 24, color: `white`
                            }]}>${
                                    ('pricing' in data) ?
                                        data.pricing.length > 0 && data.pricing[0].price
                                        : data.price ? data.price : 0
                                }</Text>
                            <Text style={[Styles.textTime, fontSize, {color: `white`}]}>{String.TEXT_PER_SESSION}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <RequestBook
                                onClick={this.onRequestBookClick.bind(this)}
                                inputStyles={{ borderRadius: 5, margin: 5, backgroundColor: '#FDA02A', }}
                                textStyles={{ fontSize: book, color: 'black' }}
                                action={String.TEXT_REQUEST_BOOK} />
                        </View>
                    </View>
                }

                <Toast ref="toast" position={position} />
            </View>
        );
    }
}