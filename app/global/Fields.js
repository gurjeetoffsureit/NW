import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Label from '../global/Label';
import Input from '../global/UserInput';

const { width } = Dimensions.get('window');

export default class Fields extends Component {

    render() {
        const { name, placeholder, keyboard, value,
            length, inputStyle, callback, editable, onBlur, error, height } = this.props;
        return (
            <View style={[height, { marginTop: 10 }]}>
                <Label
                    visible={false}
                    name={name} />
                <Input
                    callback={callback}
                    inputStyle={inputStyle}
                    length={length}
                    value={value}
                    keyboard={keyboard}
                    placeholder={placeholder}
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    editable={editable}
                    onBlur={onBlur}
                    error={error}
                    autoCorrect={false} />
                {
                    error ? <Text style={{ color: 'red', fontSize: width * 0.03, marginTop: 5, marginLeft: 10 }}>{error}</Text> : null
                }
            </View>
        );
    }
}