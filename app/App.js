import React, { Component } from 'react'
import { createStackNavigator } from 'react-navigation'
import Splash from './components/Splash'
import SignIn from './components/SignIn'
import Profile from './components/Profile'
import Home from './components/Home'
import StudioRooms from './components/StudioRooms'
import Rooms from './components/Rooms'
import Reservation from './components/Reservation'
import RequestBook from './components/RequestBook'
import Cart from './components/Cart'
import WebViewScreen from './components/WebViewScreen'
import More from './components/More';
import ConfirmAndPayScreen from './components/ConfirmAndPayScreen';

export default class App extends Component {

    render() {
        const AppNavigator = createStackNavigator({
            Splash: { screen: Splash },
            SignIn: { screen: SignIn },
            Profile: { screen: Profile },
            Home: { screen: Home },
            StudioRooms: { screen: StudioRooms },
            Rooms: { screen: Rooms },
            Reservation: { screen: Reservation },
            RequestBook: { screen: RequestBook },
            Cart: { screen: Cart },
            WebViewScreen: { screen: WebViewScreen },
            More: { screen: More },
            ConfirmAndPayScreen: { screen: ConfirmAndPayScreen }
        });
        return (<AppNavigator />);
    }

}