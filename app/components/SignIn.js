import React, { Component } from 'react';
import { BackHandler, Image, Platform, Text, View, KeyboardAvoidingView } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import Toast, { DURATION } from 'react-native-easy-toast';
import firebase from 'react-native-firebase';
import validator from 'validator';
import LoginAnother from '../alerts/AlertLogout';
import Login from '../components/Login';
import OTP from '../components/Otp';
import { default as Alert, default as AppData } from '../constants/AppData';
import DatabaseKey from '../constants/DatabaseKeys';
import Services from '../constants/WebServices';
import Loading from '../global/Loader';
import webService from '../global/WebServiceHandler';
import Strings from '../resources/string/Strings';
import Font from '../resources/styles/Font';
import styles from '../resources/styles/Styles';

import { fetchLink, authLogin } from '../global/endpoints';


const deviceId = DeviceInfo.getUniqueID();

export default class SignIn extends Component {

    constructor(props) {
        super(props)
        this.unsubscribe = null;
        this.state = {
            user: null,
            number: '',
            callingCode: Strings.TEXT_COUNTRY_CODE,
            codeInput: '',
            isLoading: true,
            loading: false,
            position: 'bottom',
            style: {},
            confirmResult: null,
            verificationId: null,
            loginAnother: false,
            alertMessage: '',
            type: '',
            logoutAnotherToken: '',
            deviceToken: ''
        }

    }

    static navigationOptions = {
        header: null,
        gesturesEnabled: false,
    }

    componentDidMount() {
        // NetInfo.isConnected.addEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );

        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(`User is ::: ${user}`)
                this.setState({ user: user.toJSON() });
            } else {
                // User has been signed out, reset the state
                this.setState({
                    user: null,
                    message: '',
                    codeInput: '',
                    phoneNumber: '+44',
                    confirmResult: null,
                });
            }
        });

        // this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        //     if (user) {
        //         firebase.auth().signOut();
        //         this.state = {
        //             number: '',
        //             callingCode: Strings.TEXT_COUNTRY_CODE,
        //             codeInput: '',
        //             isLoading: true,
        //             loading: false,
        //             position: 'bottom',
        //             style: {},
        //             confirmResult: null,
        //             loginAnother: false,
        //             alertMessage: '',
        //             type: '',
        //             logoutAnotherToken: '',
        //         }
        //     } else {
        //         // User has been signed out, reset the state
        //     }
        // });

        firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    this.setState({ deviceToken: fcmToken })
                }
            });
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress removeEventListener', this.handleBackButton);
    }

    handleBackButton() {
        return true
    }

    componentWillUnmount() {
        // NetInfo.isConnected.removeEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );
        if (this.unsubscribe) this.unsubscribe();
    }

    _handleConnectivityChange(status) {
        console.log('*********_handleConnectivityChange: Network Connectivity status *******: ' + status);
    }

    _continuePress = (checked) => {

        // if (AppData.build.local) {
        //     if (Platform.OS === "android") {
        //         this.setState({ number: '9780685852', callingCode: '+91' }, function () {
        //             this._saveUserProfile(this.state.number)
        //             this.hitLoginNetInfo(this.state.number, this.state.callingCode)
        //         })
        //     } else {
        const { number, callingCode } = this.state;
        console.log(`Number ::: ${number}, Checked ::: ${checked}, callingCode :: ${callingCode}`)
        this.setState({ loading: true }, function () {
            //  if (validator.isMobilePhone(number, Strings.TEXT_COUNTRY_LOCALE)) {
            if (number.length > 6) {
                if (checked === false) {
                    alert('Please accept Terms of Service and Privacy Policy.')
                    this.setState({ loading: false })
                } else {
                    this.sendOtp(callingCode + number);
                }
            }
            else {
                alert('Please enter valid phone number.')
                this.setState({ loading: false })
            }


        });
        //     }
        // }
    }

    sendOtp = (number) => {
        console.log('Number is ::: ' + number)
        firebase.auth().verifyPhoneNumber(number)
            .on('state_changed', (phoneAuthSnapshot) => {
                console.log("phoneAuthSnapshot.state ")
                switch (phoneAuthSnapshot.state) {
                    case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                        console.log('code sent');
                        this._showToast('Code has been sent!');
                        this.setState({ verificationId: phoneAuthSnapshot.verificationId, isLoading: false, loading: false });
                        break;
                    case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                        console.log('verification error');
                        this._showToast(`${phoneAuthSnapshot.error}`);
                        this.setState({ loading: false })
                        console.log(phoneAuthSnapshot.error);
                        break;
                    case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                        console.log('auto verify on android timed out');
                        console.log('code sent');
                        this._showToast('Code has been sent!');
                        this.setState({ verificationId: phoneAuthSnapshot.verificationId, isLoading: false, loading: false });
                        break;
                    case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                        const { verificationId, code } = phoneAuthSnapshot;
                        const { number, callingCode } = this.state;
                        const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
                        firebase.auth().signInAndRetrieveDataWithCredential(credential)
                            .then((user) => {
                                this._showToast('Code Confirmed!');
                                this.setState({ loading: true })
                                this._saveUserProfile(number)
                                this.hitLoginNetInfo(number, callingCode)
                                this.setState({ codeInput: '' })
                            })
                            .catch(error => {
                                this.setState({ loading: false })
                                console.log(error)
                                this._showToast(`Code Confirm Error : ` + error);
                            });
                        console.log('auto verified on android');
                        console.log(phoneAuthSnapshot);
                        break;
                }
            }, (error) => {
                console.log(error);
                this.setState({ loading: false })
                this._showToast('' + error);
                console.log(error.verificationId);
            }, (phoneAuthSnapshot) => {
                console.log(phoneAuthSnapshot);
                // const { verificationId, code } = phoneAuthSnapshot;
                //         const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
                //         firebase.auth().signInAndRetrieveDataWithCredential(credential)
                //             .then((user) => {
                //                 this._showToast('Code Confirmed!');
                //                 this.setState({ loading: true })
                //                 this._saveUserProfile(number)
                //                 this.hitLoginNetInfo(number, callingCode)
                //                 this.setState({ codeInput: '' })
                //             })
                //             .catch(error => {
                //                 this.setState({ loading: false })
                //                 console.log(error)
                //                 this._showToast(`Code Confirm Error : ` + error);
                //             });
                //         console.log('auto verified on android');
                //         console.log(phoneAuthSnapshot);
            });
        // firebase.auth().signInWithPhoneNumber(number)
        //     .then(confirmResult => {
        //         this.setState({ confirmResult, isLoading: false, loading: false });
        //         this._showToast('Code has been sent!');
        //     })
        //     .catch((error) => {
        //         this.setState({ loading: false })
        //         this._showToast('' + error);
        //     }
        //     );
    }

    _onVerifyPress = () => {
        this.setState({ loading: true })
        const { number, codeInput, confirmResult, verificationId, callingCode } = this.state;
        if (verificationId && (codeInput.length == 6)) {
            // if (confirmResult && (codeInput.length == 6)) {
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, codeInput);
            firebase.auth().signInAndRetrieveDataWithCredential(credential)
                .then((user) => {
                    this._showToast('Code Confirmed!');
                    this.setState({ loading: true })
                    this._saveUserProfile(number)
                    this.hitLoginNetInfo(number, callingCode)
                    this.setState({ codeInput: '' })
                })
                .catch(error => {
                    this.setState({ loading: false })
                    console.log(error)
                    this._showToast(`Code Confirm Error : ` + error);
                });
            // confirmResult.confirm(codeInput)
            //     .then((user) => {
            //         this._showToast('Code Confirmed!');
            //         this.setState({ loading: true })
            //         this._saveUserProfile(number)
            //         this.hitLoginNetInfo(number, callingCode)
            //         this.setState({ codeInput: '' })
            //     })
            //     .catch(error => {
            //         this.setState({ loading: false })
            //         console.log(error)
            //         this._showToast(`Code Confirm Error : ` + error);
            //     });
        } else {
            this.setState({ loading: false }, function () {
                this._showToast(`Invalid access code.`);
            });
        }
    }

    _onCancel = () => {
        this.setState({ isLoading: true });
    }

    _saveUserProfile = (number) => {
        if (Platform.OS === 'android') {
            var profile = {
                'phone': number.toString(),
                'firstName': 'Mahesh',
                'lastName': '',
                'genre': [],
                'email': 'mahesh@gmail.com',
                "photos": "",
                "countryCode": Strings.TEXT_COUNTRY_CODE,
            }
            this._storeData(DatabaseKey.profile, JSON.stringify(profile))
        } else {
            var profile = {
                'phone': number.toString(),
                'firstName': '',
                'lastName': '',
                'genre': '',
                'email': '',
                "photos": "",
                "countryCode": Strings.TEXT_COUNTRY_CODE,
            }
            this._storeData(DatabaseKey.profile, JSON.stringify(profile))
        }
    }

    hitauth = (number, callingCode) => {
        fetchLink(authLogin, `POST`, ``, {
            "phone": number,
            "countryCode": callingCode,
            "deviceId": deviceId,
            "deviceType": Platform.OS === 'ios' ? 'iOS' : 'Android',
            "deviceToken": this.state.deviceToken
        })
            .then(response => response.json())
            .then(response => {
                console.log(`Response hitauth`, response.code);
                if (response.code === Services.statusCodes.failure) {
                    var index = Services.status.findIndex((status) => status.flag === response.flag);
                    console.log(index);
                    if (index > -1) {
                        this.setState({
                            loading: false,
                            loginAnother: true,
                            type: response.flag,
                            alertMessage: Services.status[index].errorMesage,
                            logoutAnotherToken: response.token
                        })
                    }
                } else {
                    this.setState({
                        loading: false
                    }, function () {
                        var userInfo = responseJson.userInfo;
                        console.log('callapi Login details : ' + JSON.stringify(userInfo))
                        this._storeData(DatabaseKey.access_token, responseJson.token)
                        this._storeData(DatabaseKey.profile, JSON.stringify(userInfo))
                        this._storeData(DatabaseKey.isUserLogin, "true")
                        if ('masterUser' in userInfo && userInfo.masterUser) {
                            this._storeData(DatabaseKey.masterUser, "true")
                        }
                        if ((userInfo.phone !== '') &&
                            (userInfo.firstName !== '') &&
                            (userInfo.email !== '') &&
                            (userInfo.photos !== '') &&
                            (userInfo.countryCode !== '') &&
                            (userInfo.genre.length > 0)) {
                            this._storeData(DatabaseKey.isProfileCompleted, "true")
                            this.props.navigation.navigate("Home")
                        } else {
                            this._storeData(DatabaseKey.isProfileCompleted, "false")
                            this.props.navigation.navigate("Profile")
                        }
                    });
                }
            })
            .catch(error => {
                console.log(`Error `, error);
                this.setState({ loading: false }, function () {
                    setTimeout(() => {
                        alert(error);
                    }, 100);
                });
            })
    }

    hitLoginNetInfo = (number, callingCode) => {
        webService.post((Services.Url + Services.Self), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
        }, {
            "phone": number,
            "countryCode": callingCode,
            "deviceId": deviceId,
            "deviceType": Platform.OS === 'ios' ? 'iOS' : 'Android',
            "deviceToken": this.state.deviceToken
        })
            .then((responseJson) => {
                console.log('callapi: response' + JSON.stringify(responseJson))
                this.setState({
                    loading: false
                }, function () {
                    var userInfo = responseJson.userInfo;
                    console.log('callapi Login details : ' + JSON.stringify(userInfo))
                    this._storeData(DatabaseKey.access_token, responseJson.token)
                    this._storeData(DatabaseKey.profile, JSON.stringify(userInfo))
                    this._storeData(DatabaseKey.isUserLogin, "true")
                    if ('masterUser' in userInfo && userInfo.masterUser) {
                        this._storeData(DatabaseKey.masterUser, "true")
                    }
                    if ((userInfo.phone !== '') &&
                        (userInfo.firstName !== '') &&
                        (userInfo.email !== '') &&
                        (userInfo.photos !== '') &&
                        (userInfo.countryCode !== '') &&
                        (userInfo.genre.length > 0)) {
                        this._storeData(DatabaseKey.isProfileCompleted, "true")
                        this.props.navigation.navigate("Home")
                    } else {
                        this._storeData(DatabaseKey.isProfileCompleted, "false")
                        this.props.navigation.navigate("Profile")
                    }
                })
            })
            .catch((error) => {
                console.log(`callapi: error 1 `, error.code);
                error.json().then((r) => {
                    this.setState({ loading: false }, function () {
                        if (r.code === Services.statusCodes.failure) {
                            var index = Services.status.findIndex((status) => status.flag === r.flag);
                            console.log(index);
                            if (index > -1) {
                                this.setState({
                                    loading: false,
                                    loginAnother: true,
                                    type: r.flag,
                                    alertMessage: Services.status[index].errorMesage,
                                    logoutAnotherToken: r.token
                                })
                            }
                        }
                    });
                });
            });
    }

    _fetchStudios = (access_token, page) => {
        webService.get((Services.Url + Services.App + Services.Studios), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }, { 'page': page })
            .then((responseJson) => {
                console.log('Studios List: ' + JSON.stringify(responseJson.data))
                this.setState({
                    loading: false,
                    number: '',
                    callingCode: Strings.TEXT_COUNTRY_CODE,
                    codeInput: '',
                    isLoading: true,
                    position: 'bottom',
                    style: {},
                    confirmResult: null,
                    loginAnother: false,
                    alertMessage: '',
                    type: '',
                    logoutAnotherToken: '',
                }, function () {
                    if (responseJson.data) {
                        // var data = [];
                        // for (let item of jsonObject) {
                        //     var items = {
                        //         '_id': item._id,
                        //         'name': item.name,
                        //         'image': item.image,
                        //         'address': item.address,
                        //         'location': ('location' in item) ? item.location.coordinates : [],
                        //     }
                        //     data.push(items);
                        // }
                        this._storeData(DatabaseKey.studiosList, JSON.stringify(responseJson.data))
                        // this._storeData(DatabaseKey.headerData, JSON.stringify(data))

                    }
                    this.props.navigation.navigate("Home")
                }
                )
            })
            .catch((error) => {
                this.setState({ loading: false })
                this._showToast(JSON.stringify(error))
                console.log('callapi error :' + JSON.stringify(error))
            });
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
            var index = Services.status.findIndex((status) => status.flag === responseJson.flag);
            console.log(index);
            if (responseJson.code === Services.statusCodes.success) {
                this.setState({
                    loading: false,
                    loginAnother: true,
                    type: AppData.alert.login,
                    alertMessage: Services.status[index].message,
                })
            }
        })
            .catch((error) => {
                this._showToast(error)
                console.error(error);
            });
    }

    _storeData = (key, value) => {
        AsyncStorage.setItem(key, value);
    }

    _onResendPress = () => {
        this.setState({ loading: true })
        const { number, callingCode } = this.state;
        this.sendOtp(callingCode + number)
    }

    _onAlertClick = (clicked) => {
        switch (clicked) {
            case Alert.alert.cancel:
                this.setState({
                    isLoading: true,
                    number: '',
                    loginAnother: false,
                })
                break;

            case Alert.alert.logoutAnother:
                this.setState({
                    loading: true,
                    loginAnother: false,
                })
                this._logout(AppData.LogoutFlag.Another, this.state.logoutAnotherToken)
                break;

            case Alert.alert.login:
                this.setState({
                    loading: true,
                    loginAnother: false,
                })
                this.hitLoginNetInfo(this.state.number, this.state.callingCode)
                break;

            default:
                break;
        }
    }

    getResult(number, callingCode) {
        // this._showToast('calling code is ::: ' + callingCode);
        this.setState({ number, callingCode })
        console.log("result value", number)
    }

    getCodeInput(code) {
        this.setState({ codeInput: code })
        console.log("result value", code)
    }

    _showToast = (message) => {
        this.refs.toast.show(message, DURATION.LENGTH_LONG)
    }

    render() {
        console.log("number value", this.state.number)
        const { loading, loginAnother, alertMessage, position, number, type, isLoading } = this.state;
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? "padding" : ""}
                    enabled
                    style={{ flex: 1 }}
                >
                    <Loading loading={loading} />
                    <LoginAnother
                        visible={loginAnother}
                        message={alertMessage}
                        callback={this._onAlertClick.bind(this)}
                        type={type} />
                    <View
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Image source={require('../resources/images/logo.png')} />
                        {
                            <Text
                                style={
                                    [styles.textDesc,
                                    {
                                        color: '#4B4B4B', fontSize: Font.Large, padding: 15,

                                    }]
                                }>
                                {isLoading ? Strings.ENTER_PHONE_NUMBER_DESC :
                                    Strings.TEXT_OTP_DESC}
                            </Text>
                        }
                    </View>
                    <View style={
                        {
                            flex: 1,
                        }
                    }>

                        {
                            isLoading ? (
                                <Login
                                    onClick={this._continuePress}
                                    callback={this.getResult.bind(this)}
                                    cca2={DeviceInfo.getDeviceCountry()}
                                    navigation={this.props.navigation}
                                    number={number} />
                            ) : (
                                    <OTP
                                        cancel={this._onCancel}
                                        verifyOtp={this._onVerifyPress}
                                        resendOtp={this._onResendPress}
                                        callback={this.getCodeInput.bind(this)}
                                        number={number} />
                                )
                        }

                    </View>

                    <Toast ref="toast" position={position} />
                </KeyboardAvoidingView>
            </View>
        );
    }
}