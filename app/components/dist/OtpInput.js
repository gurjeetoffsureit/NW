import React, { Component } from 'react';
import { TextInput, View, Platform } from 'react-native';
import defaultStyles from './defaultStyles';
export default class OtpInput extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            isFocused: false,
        };
        this._onFocus = () => this.setState({ isFocused: true });
        this._onBlur = () => this.setState({ isFocused: false });
    }
    render() {
        const { containerStyles, error, focusedBorderColor, handleBackspace, inputStyles, textErrorColor, unFocusedBorderColor, updateText, value, } = this.props;
        return (<View style={[
            defaultStyles.otpContainer,
            containerStyles,
            { borderColor: this.state.isFocused ? focusedBorderColor : unFocusedBorderColor },
        ]}>
            <TextInput
                clearTextOnFocus={true}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                maxLength={1} onBlur={this._onBlur} onChangeText={updateText}
                onFocus={this._onFocus} onKeyPress={handleBackspace}
                ref={input => (this.input = input)}
                selectTextOnFocus={true}
                style={[defaultStyles.otpInput, inputStyles, error && { color: textErrorColor }]}
                underlineColorAndroid="transparent" value={value} />
        </View>);
    }
}