import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Booking from '../components/BookingTab';
import Profile from '../components/Profile';
import Rooms from '../components/RoomsTab';
import Studios from '../components/Studios';
import Strings from '../resources/string/Strings';

export default class Container extends PureComponent {

    render() {
        const { type, studioId, callback, navigation, dropDown, dropDowndata, outsideClick, itemSelection,
            search, searchClose, currentLocation, location, access_token } = this.props;
        return (
            <View style={{ flex: 1 }}>
                {(type === 'home') &&
                    <Rooms
                        access_token={access_token}
                        studioId={studioId}
                        callback={callback}
                        navigation={navigation}
                        dropDown={dropDown}
                        search={search}
                        location={location}
                        searchClose={searchClose}
                        dropDowndata={dropDowndata}
                        currentLocation={currentLocation}
                        outsideClick={outsideClick}
                        itemSelection={itemSelection} />}

                {(type === 'booking') &&
                    <Booking
                        location={location}
                        navigation={navigation} />}

                {(type === 'mic') &&
                    <Studios
                        location={location}
                        navigation={navigation} />}

                {(type === 'profile') &&
                    <Profile
                        inputStyle={{ overflow: 'hidden' }}
                        action={Strings.TEXT_SAVE} />}
            </View>
        );
    }
}