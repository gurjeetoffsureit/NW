import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
} from 'react-native';
import Strings from '../resources/string/Strings'

const { width } = Dimensions.get('window');

export default class Alert extends PureComponent {

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ padding: 10, flex: 0.2, flexDirection: 'row' }}>
                    <Text style={{ flex: 0.1, width: width }}>{Strings.TEXT_YOU_DO}</Text>
                    <Image
                        style={{ height: 20, width: 20, flex: 0.1 }}
                        source={require('../resources/images/cross.png')} />
                </View>
                <View style={{ flex: 0.6 }}>
                </View>
                <View style={{ flex: 0.2 }}>
                </View>
            </View>
        );
    }
}