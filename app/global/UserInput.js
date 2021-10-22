import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
    TextInput,
} from 'react-native';

import styles from '../resources/styles/Styles';

const insta = [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'
]

export default class UserInput extends Component {

    constructor(props) {
        super(props)
    }

    onChanged(text) {

        if ((this.props.keyboard == 'number-pad') || (this.props.keyboard == 'numeric')) {
            this.onNumberKeyboardType(text);
        } 
        // if ((this.props.keyboard === 'phone-pad')) {
        //     this.onPhonePadType(text);
        // }
         else {
            this.onStringKeyboardType(text);
        }
    }

    onNumberKeyboardType(text) {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                alert("please enter numbers only");
            }
        }
        this.setState({ value: newText }, function () {
            this.props.callback(this.state.value)
        });
    }

    restrict(event) {
        const regex = new RegExp("/^[^!-\/:-@\[-`{-~]*$/");
        const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    }

    onStringKeyboardType(text) {
        this.setState({ value: text }, function () {
            this.props.callback(this.state.value)
        });
    }

    render() {
        const { inputStyle, keyboard, length, editable, onBlur, value } = this.props;
        // const { value } = this.state;
        // console.log('Value is ::: ' + value);
        return (
            <TextInput
                keyboardType={keyboard}
                keyboardType={'numbers-and-punctuation'}
                style={[styles.input, inputStyle]}
                placeholder={this.props.placeholder}
                secureTextEntry={this.props.secureTextEntry}
                autoCorrect={this.props.autoCorrect}
                autoCapitalize={this.props.autoCapitalize}
                returnKeyType={this.props.returnKeyType}
                placeholderTextColor="#CDCECF"
                underlineColorAndroid="transparent"
                editable={editable}
                onChangeText={(text) => this.onChanged(text)}
                maxLength={length}
                onBlur={onBlur}
                value={value}
            />
        );
    }
}

UserInput.propTypes = {
    placeholder: PropTypes.string.isRequired,
    secureTextEntry: PropTypes.bool,
    autoCorrect: PropTypes.bool,
    autoCapitalize: PropTypes.string,
    returnKeyType: PropTypes.string,
};