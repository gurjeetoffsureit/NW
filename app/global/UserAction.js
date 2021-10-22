import React, {Component} from 'react';
import {
    TouchableOpacity,
    Text,
} from 'react-native';

import styles from '../resources/styles/Styles';

export default class UserAction extends Component {
    render() {
        const { inputStyles, textStyles, onClick, action } = this.props
        return(
            <TouchableOpacity
                     style={[styles.button, inputStyles]}
                     onPress={onClick}
                     activeOpacity={1}>
                    <Text style={[styles.text, textStyles]}>{action}</Text>
            </TouchableOpacity>
        );
    }
}