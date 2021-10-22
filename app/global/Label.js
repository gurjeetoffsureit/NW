import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';
import styles from '../resources/styles/Styles'
import Font from '../resources/styles/Font';

export default class Label extends Component {

    render() {
        const { inputStyle, name, visible, error, errorStyle } = this.props;
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.label, inputStyle]}>{name}</Text>
                {
                    visible && <Text style={[{
                        alignSelf: 'center', marginTop: 3, marginLeft: 15,
                        color: 'red', fontSize: Font.Small,
                    }, errorStyle]}>{error}</Text>
                }
            </View>
        );
    }
}