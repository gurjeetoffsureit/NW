import { Drawer } from 'native-base';
import React, { PureComponent } from 'react';
import {
    Alert, AppState, BackHandler, Dimensions, Image, ImageBackground, Platform, StyleSheet,
    Text, TouchableOpacity, View, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast, { DURATION } from 'react-native-easy-toast';
import firebase from 'react-native-firebase';
import Permissions from 'react-native-permissions';
import { NavigationActions, StackActions } from 'react-navigation';
import AlertLogout from '../alerts/AlertLogout';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import AppData from '../constants/AppData';
import DatabaseKey from '../constants/DatabaseKeys';
import Services from '../constants/WebServices';
import ProfileImage from '../global/CircleImage';
import Loading from '../global/Loader';
import webService from '../global/WebServiceHandler';
import Strings from '../resources/string/Strings';
import Moment from 'moment';

const { width } = Dimensions.get('window')
const calendar = require('../resources/images/calendar.png')

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'SignIn' })
    ]
});

const loading = require('../resources/images/no_image.jpg')

class LogoTitle extends PureComponent {

    render() {
        const { header, image, dropDown, imageUrl, address, location } = this.props;
        console.log("Image Url is ::: " + imageUrl)
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row' }}>
                {/* {
                    location && image && <ProfileImage
                        image={
                            (imageUrl !== '') ? { uri: Services.Url + Services.Media + imageUrl }
                                : loading
                        }
                        width={30}
                        height={30}
                        borderWidth={0}
                        circle={true} />
                } */}
                <TouchableOpacity
                    style={{ maxWidth: '80%', justifyContent: 'center', alignItems: 'center' }}
                    onPress={dropDown}>
                    <Text
                        style={styles.textHeader}
                        numberOfLines={1}
                        ellipsizeMode='tail'>{header}</Text>

                    {/* {
                        location && image && <Text
                            style={[styles.textHeader, { fontSize: 10, marginTop: 1 }]}
                            numberOfLines={1}
                            ellipsizeMode='tail'>{address}</Text>
                    } */}

                </TouchableOpacity>

                {/* {
                    location && image &&
                    <TouchableOpacity
                        onPress={dropDown}>
                        <Image
                            style={{ marginLeft: 10 }}
                            source={require('../resources/images/down_arrow.png')} />
                    </TouchableOpacity>
                } */}
            </View>
        );
    }
}

class HeaderLeft extends PureComponent {
    render() {
        const { onMenuPress, onCalendarPress } = this.props;
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 15, height: '100%' }}
                    onPress={onMenuPress}>
                    <ProfileImage
                        image={require('../resources/images/menu_icon.png')}
                        width={20}
                        height={20}
                        borderwidth={0}
                        circle={false}
                        onClick={onMenuPress} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 15, paddingBottom:5, height: '100%' }}
                    onPress={onCalendarPress}>
                    <Image style={{
                        height: 20, width: 20,tintColor: '#FDA02A'
                    }}
                        source={calendar} />
                </TouchableOpacity>
            </View>
        );
    }
}

class HeaderRight extends PureComponent {

    render() {
        const { image, onCartPress, onSearchPress, count } = this.props;
        return (
            <TouchableOpacity style={{
                alignItems: 'center', justifyContent: 'center',
                height: '100%'
            }}>
                {
                    image ?
                        <TouchableOpacity
                            onPress={onSearchPress}>
                            <Image style={{ marginRight: 15 }}
                                source={require('../resources/images/search_icon.png')} />
                        </TouchableOpacity> :
                        <TouchableOpacity
                            onPress={onCartPress}>
                            <ImageBackground style={{
                                height: 20, width: 20,
                                marginRight: 15, marginTop: 10
                            }}
                                source={require('../resources/images/cart_icon.png')}
                            >
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
                }
            </TouchableOpacity>
        );
    }
}

export default class Home extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <LogoTitle
                header={navigation.getParam('header')}
                address={navigation.getParam('address')}
                image={navigation.getParam('image')}
                data={navigation.getParam('data')}
                clickItem={navigation.getParam('clickItem')}
                dropDown={navigation.getParam('dropDown')}
                location={navigation.getParam('location')}
                imageUrl={navigation.getParam('imageUrl')} />,
            headerLeft: <HeaderLeft
                onMenuPress={navigation.getParam('onMenuPress')}
                onCalendarPress={navigation.getParam('onCalendarPress')}/>,
            headerRight: <HeaderRight
                onCartPress={navigation.getParam('onCartPress')}
                onSearchPress={navigation.getParam('onSearchPress')}
                image={navigation.getParam('image')}
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

    state = {
        header: '',
        type: 'home',
        data: [],
        studioId: '',
        studioName: '',
        studioImage: '',
        studioAddress: '',
        position: 'bottom',
        style: {},
        dropDown: false,
        search: false,
        latitude: null,
        longitude: null,
        error: null,
        types: [],
        status: {},
        coordinates: [],
        isOpen: false,
        name: '',
        image: '',
        alert: false,
        alertMessage: '',
        alertType: '',
        loading: false,
        location: false,
        hasLocation: false,
        access_token: '',
    }

    constructor(props) {
        super(props);
        this._setHeader(`Pick Your Vibe`, true);
    }

    componentDidMount() {
        // this.fetchCurrentLocation()
        // this.fetchHeaderdata()


        AsyncStorage.getItem(DatabaseKey.access_token).then((access_token) => {
            this.setState({ access_token });
        }).done();
        this._setupHeaderParams();
        this._fetchUserProfile();

        this._sub = this.props.navigation.addListener(
            'didFocus',
            this.refreshScreen
        );

        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.receiveMessages()
                } else {
                    this.requestPermission()
                }
            });


    }

    receiveMessages = () => {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            //console.log('json data is '+JSON.stringify(notification))
            console.log("notification called")
            setTimeout(() => {
                Alert.alert(
                    notification.title,
                    notification.body,
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    { cancelable: false }
                );
            }, 100);
        });

        firebase.notifications().getInitialNotification()
            .then((notificationOpen) => {
                if (notificationOpen) {
                    // const notification = notificationOpen.notification;
                    // setTimeout(() => {
                    //     Alert.alert(
                    //         notification.title,
                    //         notification.body,
                    //         [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    //         { cancelable: false }
                    //     );
                    // }, 100);
                }
            });
    }



    requestPermission = () => {
        firebase.messaging().requestPermission()
            .then(() => {
                // alert('Permission authorised by Uesr.')
                this.receiveMessages()
            })
            .catch(error => {
                // setTimeout(() => {
                //     alert('Permission denied by Uesr.')
                // }, 100);
            });
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

    onCartPress = () => {
        const { access_token } = this.state;
        // this.props.navigation.navigate('Cart');
        this.props.navigation.navigate('RequestBook', {
            access_token
        });
    }

    onSearchPress = () => {
        this.setState({ search: true })
    }

    onMenuPress = () => {
        const { isOpen } = this.state;
        (isOpen) ? this.closeDrawer() : this.openDrawer()
    }

    componentWillMount() {
        // this.closeDrawer()
        BackHandler.addEventListener('hardwareBackPress removeEventListener', this.handleBackButton);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange)
        this._sub.remove();
        this.notificationListener();
    }

    handleBackButton() {
        return true
    }

    _onFooterClick = (selectedType) => {
        const { type } = this.state;
        switch (selectedType) {
            case 'home':
                if (type === selectedType)
                    return

                this.setState({ studioName: `Pick Your Vibe`, type: selectedType, }, function () {
                    this._setHeader(this.state.studioName, true);
                });

                break;
            case 'profile':
                if (type === selectedType)
                    return
                this.setState({ type: selectedType, loading: false }, function () {
                    AsyncStorage.getItem(DatabaseKey.notActive).then((value) => {
                        console.log("value home ", value)
                        if (value) {
                            if (value === 'true') {
                                setTimeout(() => {
                                    alert(Services.status[4].errorMesage);
                                }, 100);
                            }
                        }
                    }).done();
                })
                this._setHeader("Profile", false)
                break;
            case 'booking':
                if (type === selectedType)
                    return
                this.setState({ type: selectedType })
                this._setHeader("Booked Studios", false)
                break;
            case 'mic':
                if (type === selectedType)
                    return
                this.setState({ type: selectedType })
                this._setHeader(`Pick Your Vibe`, false)
                break;
        }
    }

    _onDropDownClick = () => {
        this.setState({ dropDown: true })
    }

    _onOutsideClick = (dropDown) => {
        this.setState({ dropDown })
    }

    _switchbetweenScreens = (screenName, studioId) => {
        if (studioId === '') {
            this.props.navigation.navigate(screenName)
        } else {
            const { data } = this.state;
            var index = data.findIndex((item) => item._id === studioId);
            if (index > -1) {
                this.props.navigation.navigate(screenName,
                    { studioId, studioName: data[index].name })
            }
        }
    }

    _setupHeaderParams = () => {
        this.props.navigation.setParams({
            clickItem: this._onItemSelection.bind(this),
            onCartPress: this.onCartPress.bind(this),
            onSearchPress: this.onSearchPress.bind(this),
            onMenuPress: this.onMenuPress.bind(this),
            onCalendarPress: this._onCalendarPress.bind(this)
        });

    }

    _onCalendarPress = () => {
        this.props.navigation.navigate('More',
            {
                access_token: this.state.access_token,
                date: Moment(new Date()).format('YYYY-MM-DD')
            }
        );
    }

    _gotoStudioDetailsScreen = () => {
        this.props.navigation.navigate('StudioDetailScreen', { name: 'Jane' })
    }

    _setHeader = (title, image) => {
        const { studioImage, studioAddress, location } = this.state;
        this.props.navigation.setParams({
            header: title,
            image,
            dropDown: (image && this._onDropDownClick.bind(this)),
            imageUrl: (image && studioImage),
            address: (image && studioAddress),
            location
        });
    }

    fetchHeaderdata = () => {
        AsyncStorage.getItem(DatabaseKey.studiosList).then((studiosList) => {
            console.log('Studio List ::: ' + studiosList)
            if (studiosList !== null) {
                const { data } = this.state;
                if (data.length > 0)
                    data.splice(0, data.length);
                var jsonObject = JSON.parse(studiosList);
                console.log("Local Data : " + JSON.stringify(jsonObject));
                if (jsonObject) {
                    const { latitude, longitude } = this.state;
                    for (let item of jsonObject) {
                        var items = {
                            '_id': item._id,
                            'name': item.name,
                            'image': item.image,
                            'address': item.address,
                            'location': ('location' in item) ? item.location.coordinates : [],
                        }
                        data.push(items);
                    }
                }
            }
        }).done();
    }

    fetchCurrentLocation = () => {
        AsyncStorage.getItem(DatabaseKey.coordinates).then((coordinates) => {
            console.log('coordinates List ::: ' + coordinates);
            if (coordinates) {
                this.setState({ coordinates, location: true });
            }
        }).done();
    }

    _setDropDownHeaderData = (data) => {
        this.props.navigation.setParams({ data });
    }

    _onItemSelection = (studioId, studioName, studioImage, studioAddress) => {
        this.setState({ studioId, studioName, studioImage, studioAddress }, function () {
            this._setHeader(this.state.studioName, true)
        })
    }

    _showToast = (message) => {
        this.refs.toast.show(message, DURATION.LENGTH_LONG)
    }

    //update permissions when app comes back from settings
    _handleAppStateChange = appState => {
        if (appState == 'active') {
            this._updatePermissions(this.state.types)
        }
    }

    _fetchLocation() {
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { hasLocation } = this.state;
                var coordinates = [];
                coordinates.push(position.coords.longitude);
                coordinates.push(position.coords.latitude);
                if (!hasLocation) {
                    this.setState({ coordinates, hasLocation: true }, function () {
                        AsyncStorage.getItem(DatabaseKey.access_token).then((access_token) => {
                            if (access_token) {
                                var profile = {
                                    coordinates,
                                };
                                this._updateProfile(profile, access_token);
                            }
                        }).done();
                    });
                    this._storeData(DatabaseKey.coordinates, JSON.stringify(coordinates));
                }
            },
            (error) => {
                this.setState({ error: error.message, loading: false, location: false });
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
        );
    }

    _updateProfile = (profile, access_token) => {

        webService.patch((Services.Url + Services.Self), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token,
        }, profile)
            .then((responseJson) => {
                console.log("Location update is : " + JSON.stringify(responseJson));
                console.log((responseJson.code === Services.statusCodes.failure));
                this.setState({ location: true });
                // this._saveUserProfile(profile, access_token);
            })
            .catch((error) => {
                if (error) {
                    if (error.code === Services.statusCodes.failure) {
                        var index = Services.status.findIndex((status) => status.flag === error.flag);
                        console.log(index);
                        if (index > -1) {
                            this.setState({
                                loading: false,
                                logoutVisible: true,
                                alertMessage: Services.status[index].errorMesage
                            })
                        }
                    }
                    console.log(JSON.stringify(error));
                }
                console.log(error);
            });
    };

    _storeData = (key, value) => {
        AsyncStorage.setItem(key, value);
    }

    _updatePermissions = types => {
        Permissions.checkMultiple(types)
            .then(status => {
                if (this.state.isAlways) {
                    return Permissions.check('location', 'always').then(location => ({
                        ...status,
                        location,
                    }))
                }
                return status
            })
            .then(status => this.setState({ status }))
    }

    _openSettings = () =>
        Permissions.openSettings().then(() => {
            setTimeout(() => {
                alert('back to app!!');
            }, 100);
        })

    _requestPermission = permission => {
        var options

        if (permission == 'location') {
            options = this.state.isAlways ? 'always' : 'whenInUse'
        }

        Permissions.request(permission, options)
            .then(res => {
                this.setState({
                    status: { ...this.state.status, [permission]: res },
                })
                console.log('resource is ::: ' + res)
                if (res != 'authorized') {
                    this.setState({ location: false });
                    setTimeout(() => {
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
                    }, 100);
                } else {
                    this._fetchLocation()
                }
            })
            .catch(e => {
                this.setState({ location: false });
                console.log('Warning is ::: ' + e)
                console.warn(e)
            })
    }

    onSearchClose = (search) => {
        this.setState({ search })
    }

    updateMenuState(isOpen) {
        this.setState({ isOpen });
    }


    onMenuItemSelected = (item) => {
        this.menuItemClick(item)
    }

    menuItemClick = (item) => {
        console.log('Item is ::: ' + item)
        switch (item) {
            case 'About':
                setTimeout(() => {
                    alert('Still to implement.');
                }, 100);
                break;
            case 'Terms of Services':
                this.props.navigation.navigate("WebViewScreen",
                    {
                        Title: Strings.TEXT_TITLE_TERMS,
                        Url: Strings.TEXT_TERMS_CONDITIONS
                    });
                break;
            case 'Privacy':
                this.props.navigation.navigate("WebViewScreen",
                    {
                        Title: Strings.TEXT_TITLE_PRIVACY,
                        Url: Strings.TEXT_PRIVACY_POLICY
                    });
                break;
            case 'Logout':
                setTimeout(() => {
                    var buttons = [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Logout',
                            onPress: () => this._onAlertClick(AppData.alert.logout)
                        }
                    ];
                    Alert.alert(
                        'Alert!',
                        'Are you certain, you want to logout?',
                        buttons,
                        { cancelable: false }
                    );
                }, 100);
                break;
        }
        this.closeDrawer()
    }

    _onAlertClick = (clicked) => {
        console.log('clicked is ::: ' + clicked)
        switch (clicked) {
            case AppData.alert.logout:
                this.setState({ loading: true })
                AsyncStorage.getItem(DatabaseKey.access_token).then((access_token) => {
                    this._logout(AppData.LogoutFlag.None, access_token)
                }).done();
                break;
        }
    }

    _logoutUser = () => {
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
                this.props.navigation.dispatch(resetAction);
            })
        }).done();
    }


    _logout = (type, access_token) => {
        webService.delete((Services.Url + Services.Self), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token,
        }, {
            'flag': type,
        }).then((responseJson) => {
            console.log("Logout response : " + JSON.stringify(responseJson));
            if (responseJson.code === Services.statusCodes.success) {
                var index = Services.status.findIndex((status) => status.flag === responseJson.flag);
                if (index > -1) {
                    this._showToast(Services.status[index].message)
                    this._logoutUser();
                }
                console.log(index);

            }
        })
            .catch((error) => {
                this._showToast(error)
                console.error(error);
            });
    }

    _fetchUserProfile() {
        console.log('tokennnnnn',this.state.access_token)
        AsyncStorage.getItem(DatabaseKey.profile).then((profile) => {
            this._updateUserProfileDetails(profile)
        }).done();
    }

    _updateUserProfileDetails = (profile) => {
        var jsonObject = JSON.parse(profile)
        this.setState({
            name: jsonObject.firstName.split(" ")[0],
            image: jsonObject.photos === '' ? '' : { uri: jsonObject.photos },
        })
        console.log("Profile image is : " + jsonObject.photos)
    }

    closeDrawer = () => {
        this.drawer._root.close()
    };

    openDrawer = () => {
        this.drawer._root.open()
    };

    render() {
        const { type, studioId, search, refresh, position, dropDown, data, location,
            name, image, alert, alertMessage, alertType, loading, coordinates, access_token } = this.state;
        const menu = <Menu
            onItemSelected={this.onMenuItemSelected}
            name={name}
            image={image} />;
        return (
            <Drawer
                ref={(ref) => { this.drawer = ref; }}
                content={menu}
                type={(Platform.OS === 'ios') ? 'static' : 'overlay'}
                tapToClose={true}
                captureGestures={true}
                panOpenMask={0.05}
                onOpen={() => {
                    this.setState({ isOpen: true }, function () {
                        this.openDrawer()
                    });
                }}
                onClose={() => {
                    this.setState({ isOpen: false }, function () {
                        this.closeDrawer()
                    });
                }}>
                <StatusBar
                    backgroundColor="#595656"
                    barStyle="light-content"
                />
                <View style={styles.container}>
                    <Loading loading={loading} />
                    <AlertLogout
                        visible={alert}
                        message={alertMessage}
                        type={alertType}
                        callback={this._onAlertClick.bind(this)} />

                    <View style={{ flex: 0.92 }}>
                        <Container
                            access_token={access_token}
                            type={type}
                            studioId={studioId}
                            refresh={refresh}
                            search={search}
                            location={location}
                            searchClose={this.onSearchClose}
                            callback={this._switchbetweenScreens.bind(this)}
                            navigation={this.props.navigation}
                            itemSelection={this._onItemSelection.bind(this)}
                            dropDown={dropDown}
                            currentLocation={coordinates}
                            dropDowndata={data}
                            outsideClick={this._onOutsideClick.bind(this)} />
                    </View>
                    <Toast ref="toast" position={position} />
                    <View style={{ flex: 0.08 }}>
                        <Footer
                            callback={this._onFooterClick.bind(this)} />
                    </View>
                </View >
            </Drawer >
        )
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FDA02A'
    },
    viewHeader: {
        backgroundColor: '#009788',
        height: 45,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    backIconHeader: {
        height: 30,
        justifyContent: 'center',
        width: 30,
        position: 'absolute',
        start: 20
    },
    backIconHeaderImage: {
        width: 20,
        height: 20,
    },
    textHeader: {
        fontSize: 20,
        color: '#FDA02A',
        marginStart: 5
    },
    TouchSearchIcon: {
        justifyContent: 'center',
        height: 30,
        width: 30,
        position: 'absolute',
        end: 20
    },
    bottomTabView: {
        height: 50,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',

        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        elevation: 1,
        marginRight: 5,
        marginTop: 10,
    },
    imageBottomTab: {
        height: 24,
        width: 24
    },
    touchHomeView: {
        flex: 1,
        height: 24,
        width: 24,
        paddingStart: 40
    },
    touchBookingView: {
        flex: 1,
        height: 24,
        width: 24,
        paddingStart: 25
    },
    touchMapView: {
        flex: 1,
        height: 24,
        width: 24,
        paddingStart: 25
    },
    touchProfileView: {
        flex: 1,
        height: 24,
        width: 24,
        paddingStart: 25
    },
    textPremium: {
        borderWidth: 1,
        marginTop: 5,
        borderColor: 'black',
        borderRadius: 5,
        alignSelf: 'center',
        fontSize: 12,
        paddingStart: 5,
        paddingEnd: 5,
        color: 'white',
        backgroundColor: 'black'
    },
    textVerified: {
        marginStart: 5,
        marginTop: 5,
        borderWidth: 0.5,
        borderColor: '#4B4B4B',
        alignSelf: 'center',
        borderRadius: 5,
        fontSize: 12,
        paddingStart: 5,
        paddingEnd: 5,
        color: 'black',
    },

})