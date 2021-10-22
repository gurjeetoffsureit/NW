import React, { PureComponent } from 'react';
import { Alert, FlatList, NetInfo, Text, View, Linking, Platform } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import { NavigationActions, StackActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Notify from '../alerts/Notify';
import AppData from '../constants/AppData';
import DatabaseKey from '../constants/DatabaseKeys';
import Services from '../constants/WebServices';
import DropDown from '../global/DropDown';
import Loading from '../global/Loader';
import SearchBar from '../global/SearchBar';
import webService from '../global/WebServiceHandler';
import ItemStudioRooms from '../items/ItemStudioRooms';
import Styles from '../resources/styles/Styles';
import DeviceInfo from 'react-native-device-info';

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'SignIn' })
    ]
});

export default class RoomsTab extends PureComponent {

    state = {
        loading: false,
        data: [],
        searchData: [],
        notify: false,
        message: ''
    }

    componentDidMount() {
        this.setState({ loading: true })
        // NetInfo.isConnected.addEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );

        setTimeout(() => {

            this.checkNewVersion();
        }, 1000);



    }
    checkNewVersion = () => {

        webService.get((Services.Update), {
            'content-type': 'application/json',
            'x-content-type': 'application/json'
        }, {})
            .then((responseJson) => {
                console.log('checkNewVersion :: ' + responseJson.resultCount)
                console.log('checkNewVersion :: ' + JSON.stringify(responseJson))
                console.log(`OS is ${Platform.OS === 'ios'}`)

                if (Platform.OS === 'ios') {
                    //   console.log(`version name>>> in api ${responseJson.ios.versionName.compareTo('')}`)
                    if ('ios' in responseJson) {


                        if (this.isNewerVersion(DeviceInfo.getVersion(), responseJson.ios.versionName)) {

                            console.log(`Need to update`)
                            this.setState({
                                loading: false
                            }, function () {
                                this.updateAlert(Services.iTunes)
                            })

                        }
                        else {
                            this.fetchStudiosRoom('1');
                        }
                    }
                } else {
                    if ('android' in responseJson) {
                        console.log(`version name>>> in api ${responseJson.android.versionName}`)
                        console.log(`version name>>> in device ${DeviceInfo.getVersion()}`)


                        if (this.isNewerVersion(DeviceInfo.getVersion(), responseJson.android.versionName)) {
                            //if (responseJson.android.versionName > DeviceInfo.getVersion()) {

                            this.setState({
                                loading: false
                            }, function () {
                                this.updateAlert(Services.PlayStore)
                            })

                        } else {
                            this.fetchStudiosRoom('1');
                        }
                    }
                }
            })
            .catch((error) => {
                console.log('checkNewVersion error :' + JSON.stringify(error))
            });
    }


    isNewerVersion(oldVer, newVer) {
        const oldParts = oldVer.split('.')
        const newParts = newVer.split('.')
        for (var i = 0; i < newParts.length; i++) {
            const a = parseInt(newParts[i]) || 0
            const b = parseInt(oldParts[i]) || 0
            if (a > b) return true
            if (a < b) return false
        }
        return false
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

    componentWillUnmount() {
        // NetInfo.isConnected.removeEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );
        // navigator.geolocation.clearWatch(this.watchId);
    }

    _handleConnectivityChange = (status) => {
        this.setState({
            connected: status
        })
        console.log('*********_handleConnectivityChange: Network Connectivity status *******: ' + status);
    }

    _onItemSelection = (id) => {
        const { dropDowndata, itemSelection } = this.props;
        var index = dropDowndata.findIndex((item) => item._id === id);
        if (index > -1) {
            const { access_token } = this.state;
            itemSelection(
                id, dropDowndata[index].name, dropDowndata[index].image, dropDowndata[index].address
            )
            this.setState({ loading: true }, function () {
                this.fetchStudiosRoom(access_token, '1')
            })
        }
    }

    onChange = (text) => {
        const { searchData } = this.state;
        console.log('searchData ::: ' + searchData.length)
        if (searchData.length > 0) {
            if (text.length >= 2) {
                this.initiateSmartSearch(text)
            }
        } else {
            console.log('Nothing to search.')
        }
    }

    initiateSmartSearch = (text) => {
        const { searchData, data } = this.state;
        var search = []
        for (let item of searchData) {
            if (item.name.toLowerCase().indexOf(text.toLowerCase()) > -1) {
                search.push(item)
            }
        }
        this.setState({ data: search })
    }

    onClearSearch = () => {
        const { access_token } = this.state;
        this.setState({ loading: true, searchClose: true })
        this.fetchStudiosRoom('1')
    }

    onNotifyCancel = (notify, type) => {
        this.setState({ notify })
    }

    render() {
        const { loading, data, position, notify, message } = this.state;
        const { dropDown, dropDowndata, outsideClick, search, searchClose, currentLocation, location } = this.props;
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#000000'
            }}>
                <SearchBar
                    visible={search}
                    onChange={this.onChange}
                    onClearSearch={this.onClearSearch.bind(this)}
                    onClose={searchClose} />
                <DropDown
                    location={location}
                    visible={dropDown}
                    callback={outsideClick}
                    itemSelected={this._onItemSelection.bind(this)}
                    currentLocation={currentLocation}
                    data={dropDowndata} />
                <Notify
                    visible={notify}
                    message={message}
                    callback={this.onNotifyCancel} />
                <Loading loading={loading} />
                {
                    data.length > 0 ?
                        <FlatList
                            style={{ paddingBottom: 5 }}
                            data={data}
                            renderItem={this._renderItem}
                            keyExtractor={this._keyExtractor}
                        />
                        : !loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={Styles.noData}>No Rooms Found</Text>
                        </View>
                }
                <Toast ref="toast" position={position} />
            </View>
        )
    }

    // fetchStudiosRoom = (access_token, page) => {
    fetchStudiosRoom = (page) => {
        // const { studioId } = this.props;
        // if (studioId === '') {
        //     this.setState({ loading: false })
        //     return;
        // }
        // webService.get((Services.Url + Services.App + Services.Rooms +
        // studioId), {
        webService.get((Services.Url + Services.App + Services.Rooms), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': this.props.access_token
        }, { 'page': page })
            .then((responseJson) => {
                this.setState({ loading: false })
                console.log('Studios Room List: ', responseJson)
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
                if (responseJson.data.length > 0) {
                    console.log('Studios Room changed List: ' + JSON.stringify(responseJson.data))
                    this.state.data.splice(0, this.state.data.length);
                    this.state.searchData.splice(0, this.state.searchData.length);
                    this.setState({
                        loading: false,
                        data: responseJson.data,
                        searchData: responseJson.data
                    })
                } else {
                    this.setState({
                        loading: false, data: [], searchData: []
                    })
                }
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
                }
                console.log('callapi error :' + JSON.stringify(error))
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
                const { navigation } = this.props;
                navigation.dispatch(resetAction);
            })
        }).done();
    }

    _onItemPress = (id) => {
        console.log("item Clicked : " + id)
        const { data } = this.state;
        var index = data.findIndex((item) => item._id === id);
        if (index > -1) {
            var item = data[index];
            if ('maintenance' in item) {
                if (item.maintenance) {
                    setTimeout(() => {
                        console.log(`Clicked Item is ${JSON.stringify(item)}`)
                        alert(item.maintenanceNote)
                    }, 100);
                } else {
                    this.switchScreen(item)
                }
            } else {
                this.switchScreen(item)
            }
        }
    }

    _onVideoPress = (video) => {
        const { navigation } = this.props;
        navigation.navigate('WebViewScreen',
            {
                Title: Strings.TEXT_VIDEO,
                Url: video
            });
    }

    switchScreen = (item) => {
        const { navigation } = this.props;
        var studioManager = this.getMangersList(item.studio.studioManagers)
        var timeZone = this.getTimeZone(item)
        navigation.navigate('Rooms',
            {
                roomId: item._id,
                studioId: item.studio._id,
                studioName: `${item.studio.name} ${timeZone}`,
                studioAddress: item.studio.address,
                studioManagers: studioManager
            });
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

    getMangersList(studioMangers) {
        var managerList = []
        for (var i = 0; i < studioMangers.length; i++) {
            var object = {
                email: studioMangers[i].email
                // email: 'jyotpreet.xeemu@gmail.com'
            }
            managerList.push(object)
        }
        return managerList

    }

    _showToast = (message) => {
        this.refs.toast.show(message, DURATION.LENGTH_LONG)
    }

    _keyExtractor = (item) => item._id;

    _renderItem = ({ item }) => (
        <ItemStudioRooms
            onPressItem={this._onItemPress}
            onVideoPress={this._onVideoPress}
            item={item} />
    );
}