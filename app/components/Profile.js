import React, { Component } from 'react'
import { BackHandler, View } from 'react-native'
import ProfileDetails from '../components/ProfileDetails'
import styles from '../resources/styles/Styles'
import Loading from '../global/Loader'
import DatabaseKey from '../constants/DatabaseKeys'
import Services from '../constants/WebServices'
import webService from '../global/WebServiceHandler'
import AsyncStorage from '@react-native-community/async-storage';

export default class Profile extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Create Profile",
            headerLeft: null,
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: '#000000',
            },
            headerTintColor: '#FDA02A',
        }
    };

    state = {
        loading: false,
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress removeEventListener', this.handleBackButton);
    }

    handleBackButton() {
        return true
    }

    _gotoHome = (access_token) => {
       // this.setState({ loading: true })
        this.props.navigation.navigate("Home")
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
                }, function () {
                    if (responseJson.code !== Services.statusCodes.failure) {
                        this._storeData(DatabaseKey.studiosList, JSON.stringify(responseJson.data))
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

    _storeData = (key, value) => {
        AsyncStorage.setItem(key, value);
    }

    render() {
        const { inputStyle, action } = this.props;
        const { loading } = this.state;
        return (
            <View style={[styles.container, inputStyle]}>
                <Loading loading={loading} />
                <ProfileDetails
                    callback={this._gotoHome.bind(this)}
                    action={action} />
            </View>
        );
    }
}