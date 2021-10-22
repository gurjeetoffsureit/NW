import React, { Component } from 'react';
import {
    BackHandler,
    ImageBackground,
    Image,
    StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import DatabaseKey from '../constants/DatabaseKeys'
import webService from '../global/WebServiceHandler'
import Services from '../constants/WebServices'

export default class Splash extends Component {

    constructor(props) {
        super(props)
        this.state = {
            position: 'bottom',
            style: {},
        }
    }

    static navigationOptions = {
        header: null,
        gesturesEnabled: false
    }

    componentDidMount() {
        setTimeout(() => {
            AsyncStorage.getItem(DatabaseKey.isUserLogin).then((value) => {
                console.log("value", value)
                this.moveToScreensAccordingly(value)
            }).done();
        }, 3000);
        BackHandler.addEventListener('hardwareBackPress removeEventListener', this.handleBackButton);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress removeEventListener', this.handleBackButton);
    }

    moveToScreensAccordingly = (value) => {
        // var cart = []
        // AsyncStorage.removeItem(DatabaseKey.cartDetails);

        if (value == null || value == "false") {
            this.props.navigation.navigate("SignIn")
        } else if (value == "true") {
            this.checkProfileCompleted()
        }
    }

    checkProfileCompleted() {
        AsyncStorage.getItem(DatabaseKey.isProfileCompleted).then((value) => {
            console.log(value);
            // this.getAccessToken()
            if (value == null || value == "false") {
                this.props.navigation.navigate("Profile");
            } else if (value == "true") {
                this.props.navigation.navigate("Home");
            }
        }).done();
    }

    getAccessToken = () => {
        AsyncStorage.getItem(DatabaseKey.access_token).then((access_token) => {
            this.fetchGenre(access_token)
        }).done();
    }

    fetchGenre = (access_token) => {
        webService.get((Services.Url + Services.App + Services.Genre), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token,
        }, {}).then((responseJson) => {
            console.log("Genre response : " + JSON.stringify(responseJson));
        })
            .catch((error) => {
                this._showToast(error)
                console.error(error);
            });
    }

    handleBackButton() {
        return true
    }

    render() {
        return (
            <ImageBackground
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                source={require('../resources/images/splash_screen.png')}>
                {/* <StatusBar
                    backgroundColor="#595656"
                    barStyle="light-content"
                /> */}
                <Image source={require('../resources/images/logo_new.png')} />
            </ImageBackground>
        );
    }
}