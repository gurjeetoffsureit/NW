import React, { PureComponent } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    BackHandler,
    ImageBackground,
    Alert
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import webService from '../global/WebServiceHandler'
import DatabaseKey from '../constants/DatabaseKeys'
import Services from '../constants/WebServices'
import Loading from '../global/Loader'
import Toast, { DURATION } from 'react-native-easy-toast'
import ItemStudioRooms from '../items/ItemStudioRooms'
import Styles from '../resources/styles/Styles'
import Notify from '../alerts/Notify'
import AppData from '../constants/AppData';
import Strings from '../resources/string/Strings'
import { NavigationActions, StackActions } from 'react-navigation';

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'SignIn' })
    ]
});

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
            <TouchableOpacity style={{
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

export default class StudioRooms extends PureComponent {

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
            },
            headerTintColor: '#fff',
        }
    };

    onBackPress = () => {
        this.props.navigation.goBack();
    }

    state = {
        loading: false,
        data: [],
        header: 'Studios',
        address: 'address',
        position: 'bottom',
        style: {},
        notify: false,
        message: ''
    }

    componentDidMount() {
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
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress removeEventListener',
            this.handleBackButton);
    }

    onCartPress = () => {
        this.props.navigation.navigate('Cart');
    }

    handleBackButton() {
        return true
    }

    setHeader = (header, address) => {
        this.props.navigation.setParams({ header, address });
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

    _onItemSelection = (id) => {
        const { dropDowndata, itemSelection } = this.props;
        var index = dropDowndata.findIndex((item) => item._id === id);
        if (index > -1) {
            const { access_token } = this.state;
            itemSelection(id, dropDowndata[index].name, dropDowndata[index].image)
            this.setState({ loading: true }, function () {
                this.fetchStudiosRoom(access_token, '1')
            })
        }
    }

    onNotifyCancel = (notify, type) => {
        this.setState({ notify })
    }

    render() {
        const { loading, data, position, notify, message } = this.state;
        return (
            <View style={Styles.container}>
                <Loading loading={loading} />
                <Notify
                    visible={notify}
                    message={message}
                    callback={this.onNotifyCancel} />
                {data.length > 0 ?
                    <FlatList
                        data={data}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor} />
                    : !loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={Styles.label}>No Rooms Found</Text>
                    </View>
                }
                <Toast ref="toast" position={position} />
            </View>
        )
    }

    fetchStudiosRoom = (access_token, page) => {
        const { studioId } = this.props.navigation.state.params
        if (studioId === '') {
            this.setState({ loading: false })
            return;
        }
        webService.get((Services.Url + Services.App + Services.Rooms +
            studioId), {
                'content-type': 'application/json',
                'x-content-type': 'application/json',
                'authorization-key': Services.AuthKey,
                'token': access_token
            }, { 'page': page })
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
                    return;
                }
                console.log('Studios Room List: ' + JSON.stringify(responseJson))
                if (responseJson.data.length > 0) {
                    console.log('Studios Room changed List: ' + JSON.stringify(responseJson.data))
                    this.state.data.splice(0, this.state.data.length);
                    this.setState({
                        loading: false, data: responseJson.data
                    })
                } else {
                    this.setState({
                        loading: false, data: []
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false })
                this._showToast(JSON.stringify(error));
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
                this.props.navigation.dispatch(resetAction);
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
                    alert(item.maintenanceNote)
                } else {
                    this.switchScreen(item)
                }
            } else {
                this.switchScreen(item)
            }
        }
    }

    _onVideoPress = (video) => {
        this.props.navigation.navigate('WebViewScreen',
            {
                Title: Strings.TEXT_VIDEO,
                Url: video
            });
    }

    switchScreen = (item) => {
        this.props.navigation.navigate('Rooms',
            {
                roomId: item._id,
                studioId: item.studio._id,
                studioName: item.studio.name,
                studioAddress: item.studio.address,
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