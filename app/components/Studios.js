import React, { PureComponent } from 'react';
import {
    View,
    FlatList,
    Text,
    Platform,
    AppState,
    Alert,
    Linking
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Items from '../items/ItemStudios';
import String from '../resources/string/Strings';
import webService from '../global/WebServiceHandler';
import DatabaseKey from '../constants/DatabaseKeys';
import Services from '../constants/WebServices';
import Loading from '../global/Loader';
import Toast, { DURATION } from 'react-native-easy-toast';
import AlertLogout from '../alerts/AlertLogout';
import AlertMessage from '../constants/AppData';
import Styles from '../resources/styles/Styles';
import AppData from '../constants/AppData';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import Permissions from 'react-native-permissions';
import { NavigationActions, StackActions } from 'react-navigation';

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'SignIn' })
    ]
});

export default class Studios extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            position: 'bottom',
            style: {},
            access_token: '',
            connected: true,
            connectionError: '',
            loading: false,
            data: [],
            alertMessage: '',
            alert: false,
            type: '',
            totalRecords: 0,
            page: 1,
            totalPages: 0,
            studioStatusClose: false,
            day: '',
            message: ''
        }
    }

    componentDidMount() {

        var weekDay = new Date().getDay();
        var index = AppData.weekdays.findIndex((week) => week.day === weekDay);
        if (index > -1) {
            this.setState({ day: AppData.weekdays[index].weekday })
        }
        // NetInfo.isConnected.addEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );


        // if (this.props.location === true) {
        this.getStudios();
        // }
    }

    componentWillReceiveProps() {
        // if (this.props.location === true) {
        this.getStudios();
        // }
    }

    getStudios = () => {

        this.setState({ loading: true }, function () {
            // if (this.props.location === true)
            this._fetchStudiosListLocal();
        })

        AsyncStorage.getItem(DatabaseKey.access_token).then((access_token) => {
            this.setState({ access_token }, function () {
                const { access_token, page } = this.state;
                this._fetchStudios(access_token, page);
            });

        }).done();
    }

    componentWillUnmount() {
        // NetInfo.isConnected.removeEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleConnectivityChange = (status) => {
        this.setState({
            connected: status
        })
        console.log('*********_handleConnectivityChange: Network Connectivity status *******: ' + status);
    }

    updateAlert = (url) => {
        setTimeout(() => {
            var buttons = [
                {
                    text: 'Update',
                    onPress: () => this.update(url)
                },
            ];
            Alert.alert(
                'Alert!',
                'Finding new version, do you want to update?',
                buttons,
                { cancelable: false }
            )
        }, 100);
    }

    update = (url) => {
        Linking.openURL(url);
    }

    _fetchStudios = (access_token, page) => {
        webService.get((Services.Url + Services.App + Services.Studios), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }, { 'page': page })
            .then((responseJson) => {
                console.log('Studios List: ' + responseJson.code)
                console.log('Studios List: ' + JSON.stringify(responseJson))
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
                } else {
                    this._storeData(DatabaseKey.notActive, 'false')
                }
                console.log('Studios List: ' + JSON.stringify(responseJson))
                if (page === 1) {
                    this.setState({
                        loading: false,
                        totalPages: responseJson.totalPages,
                        page: responseJson.currentPage,
                        totalRecords: responseJson.totalRecords,
                    }, function () {
                        this._storeData(DatabaseKey.studiosList, JSON.stringify(responseJson.data));
                        this._fetchStudiosListLocal();
                    });
                } else {
                    const { data } = this.state;
                    let studioList = data.concat(responseJson.data);
                    console.log('Length after concat ::: ' + studioList.length)
                    this._storeData(DatabaseKey.studiosList, JSON.stringify(studioList));
                    this.setState({ data: studioList, loading: false });
                }
            })
            .catch((error) => {
                console.log('callapi error :' + JSON.stringify(error))
                if (error.code === Services.statusCodes.failure) {
                    var index = Services.status.findIndex((status) => status.flag === error.flag);
                    console.log(index);
                    if (index > -1) {
                        this.setState({
                            loading: false,
                            alert: true,
                            alertMessage: Services.status[index].errorMesage,
                            type: error.flag
                        })
                    }
                }
                this.setState({ loading: false })
                this._showToast(JSON.stringify(error))

            });
    }

    _storeData = (key, value) => {
        AsyncStorage.setItem(key, value);
    }

    _fetchStudiosListLocal() {
        AsyncStorage.getItem(DatabaseKey.studiosList).then((studiosList) => {
            if (studiosList) {
                console.log('Studios List Local : ' + studiosList)
                var jsonObject = JSON.parse(studiosList)
                this.setState(
                    {
                        data: jsonObject,
                        loading: false
                    }
                )
            }

        }).done();
    }

    _onAlertClick = (clicked) => {
        switch (clicked) {
            case AlertMessage.alert.login:
                this._logoutUser();
                break;
        }
    }

    _showToast = (message) => {
        this.refs.toast.show(message, DURATION.LENGTH_LONG)
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
                const { navigation } = this.props;
                // navigation.navigate('SignIn')
                navigation.dispatch(resetAction);
            })
        }).done();
    }

    _onPressItem = (id, status) => {
        const { data } = this.state;
        var index = data.findIndex((item) => item._id === id);
        if (index > -1) {
            switch (status) {
                case AppData.Clicked.Switch:
                    this.navigateToNewScreen(data[index])
                    break;
                case AppData.Clicked.Call:
                    this.makePhoneCall('' + data[index].phoneNumber)
                    break;
            }

        }
    };

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

    navigateToNewScreen = (item) => {
        const { navigation } = this.props;
        navigation.navigate('StudioRooms',
            {
                studioId: item._id, studioName: item.name,
                studioAddress: item.address
            })
    }

    _keyExtractor = (item, index) => item._id;

    _renderItem = ({ item }) => (
        <Items
            day={this.state.day}
            id={item._id}
            onPressItem={this._onPressItem}
            selected={item.selected}
            item={item} />
    );

    // _renderItem = ({ item }) => (
    //     <CardItems
    //         day={this.state.day}
    //         id={item._id}
    //         // onPressItem={this._onPressItem}
    //         selected={item.selected}
    //         item={item} />
    // );

    onScrollHandler = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            const { page, totalPages, access_token } = this.state;
            if (page <= totalPages) {
                this._fetchStudios(access_token, page);
            }
        });
    }

    alertActions = (action) => {
        console.log('Clicked is ::: ' + action)
        switch (action) {
            case AlertMessage.alert.login:
                this._logoutUser();
                break;
            case AlertMessage.alert.exit:
                this.setState({ loading: true }, function () {
                    this._logoutUser();
                });
                break;
            case AlertMessage.alert.logout:
                this.setState({ loading: true }, function () {
                    this._logoutUser();
                });
                break;
        }
    }

    render() {
        const { loading, position, data, alert, alertMessage, type } = this.state;
        const { location } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Loading loading={loading} />
                <AlertLogout
                    visible={alert}
                    message={alertMessage}
                    type={type}
                    callback={this._onAlertClick.bind(this)} />
                {
                    // (location === true) && 
                    data.length > 0 ?
                        <FlatList
                            data={data}
                            key={data._id}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            onEndReached={this.onScrollHandler}
                            onEndThreshold={0} />
                        : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={Styles.noData}>
                                {
                                    // (location) ? 
                                    String.TEXT_NO_DATA
                                    // : String.TEXT_NO_LOCATION
                                }
                            </Text>
                        </View>
                }
                <Toast ref="toast" position={position} />
            </View>
        );
    }
}