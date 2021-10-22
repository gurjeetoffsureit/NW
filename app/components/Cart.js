import React, { PureComponent } from 'react'
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    AppState,
    Platform
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import Styles from '../resources/styles/Styles'
import Strings from '../resources/string/Strings'
import Loading from '../global/Loader'
import DatabaseKey from '../constants/DatabaseKeys'
import Items from '../items/itemCart'
import RNImmediatePhoneCall from 'react-native-immediate-phone-call'
import Permissions from 'react-native-permissions'
import AppData from '../constants/AppData';
import Toast, { DURATION } from 'react-native-easy-toast'

class LogoTitle extends PureComponent {
    render() {
        return (
            <View style={{
                alignItems: 'center', justifyContent: 'center',
                flex: 1, flexDirection: 'row'
            }}>
                <Text style={Styles.textHeader}>{Strings.TEXT_CART}</Text>
            </View>
        );
    }
}

class HeaderRight extends PureComponent {
    render() {
        return (
            <View style={{
                alignItems: 'center', justifyContent: 'center',
                paddingRight: 15
            }} />
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

export default class Cart extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            cartData: [],
            loading: false,
            day: '',
            position: 'bottom',
            style: {},
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <LogoTitle />,
            headerLeft: <HeaderLeft
                onPress={navigation.getParam('onPress')} />,
            headerRight: <HeaderRight />,
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
        }
    };

    componentDidMount() {
        var weekDay = new Date().getDay();
        var index = AppData.weekdays.findIndex((week) => week.day === weekDay);
        if (index > -1) {
            this.setState({ day: AppData.weekdays[index].weekday })
        }

        this.getCartDetails()
        this.props.navigation.setParams({ onPress: this.onBackPress.bind(this) });
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange)
    }

    onBackPress = () => {
        this.props.navigation.goBack();
    }

    getCartDetails = () => {
        AsyncStorage.getItem(DatabaseKey.cartDetails).then((cartDetails) => {
            console.log('Cart Details ::: ' + cartDetails);
            if (cartDetails) {
                var cartData = JSON.parse(cartDetails);
                this.setState({ cartData })
            } else {
                
            }
        }).done();
    }

    _onPressItem = (id, status) => {

        if (status === AppData.Clicked.Closed) {
            this._showToast('Studio is closed right now.');
            return;
        }

        const { cartData } = this.state;
        var index = cartData.findIndex((item) => item.studio_id === id);
        console.log('Index is ::: ' + index)
        if (index > -1) {
            switch (status) {
                case AppData.Clicked.Switch:
                    this.props.navigation.navigate('RequestBook',
                        {
                            item: cartData[index]
                        })
                    break;
                case AppData.Clicked.Call:
                    // this.makePhoneCall('' + cartData[index].phoneNumber)
                    break;
            }

        }
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

    _showToast = (message) => {
        this.refs.toast.show(message, DURATION.LENGTH_LONG)
    }

    //update permissions when app comes back from settings
    _handleAppStateChange = appState => {
        if (appState == 'active') {
            this._updatePermissions(this.state.types)
        }
    }

    _renderItem = ({ item }) => (
        <Items
            day={this.state.day}
            id={item._id}
            onPressItem={this._onPressItem}
            selected={item.selected}
            item={item} />
    );

    _keyExtractor = (item, index) => item.studio_id;

    render() {
        const { cartData, loading, position } = this.state;
        return (
            <View style={Styles.container}>
                <Loading loading={loading} />
                {
                    cartData.length > 0 ?
                        <FlatList
                            data={cartData}
                            key={cartData.studio_id}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem} /> :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={Styles.label}>No Booking Found</Text>
                        </View>
                }
                <Toast ref="toast" position={position} />
            </View>
        )
    };
}