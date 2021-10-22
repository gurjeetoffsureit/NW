import React, { PureComponent } from 'react'
import {
    TouchableOpacity,
    Text,
    View,
    AsyncStorage
} from 'react-native'

import styles from '../resources/styles/Styles';
import DatabaseKey from '../constants/DatabaseKeys';

export default class ItemDropDown extends PureComponent {

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    state = {
        coordinates: '',
    }

    componentDidMount() {
        const { currentLocation } = this.props;
        this.setState({
            coordinates: currentLocation
        });
    }

    componentWillReceiveProps() {
        const { currentLocation } = this.props;
        this.setState({
            coordinates: currentLocation
        });
    }

    haversineDistance(coords1, coords2, isMiles) {
        function toRad(x) {
            return x * Math.PI / 180;
        }

        var lon1 = coords1[0];
        var lat1 = coords1[1];

        var lon2 = coords2[0];
        var lat2 = coords2[1];

        var R = 6371; // km

        var x1 = lat2 - lat1;
        var dLat = toRad(x1);
        var x2 = lon2 - lon1;
        var dLon = toRad(x2)
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        if (isMiles) d /= 1.60934; 
        return Number(d).toFixed(2);
    }

    getMiles = (location) => {
        const { coordinates } = this.state;
        console.log('Location is ::: ' + coordinates);
        if (!coordinates) {
            return ''
        }
        return this.haversineDistance(coordinates, location, true) + ' miles'
    }

    render() {
        const { item } = this.props;
        return (
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={this._onPress}
                activeOpacity={1}>
                <View style={{
                    borderBottomWidth: 0.5, borderBottomColor: '#8E9090',
                    paddingBottom: 10
                }}>
                    <Text style={styles.labelDropDown}
                        numberOfLines={1}
                        ellipsizeMode='tail'>{item.name} </Text>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.addressDropDown, { flex: 1 }]}
                            numberOfLines={1}
                            ellipsizeMode='tail'>{item.address} </Text>

                        <Text style={styles.addressDropDown}
                            numberOfLines={1}
                            ellipsizeMode='tail'>{this.getMiles(item.location)} </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}