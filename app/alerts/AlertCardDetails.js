import React, { PureComponent } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Dimensions,
    Platform, KeyboardAvoidingView
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import styles from '../resources/styles/Styles'
import Actions from '../global/UserAction'
import Strings from '../resources/string/Strings'
import AppData from '../constants/AppData';
import DatabaseKey from '../constants/DatabaseKeys'
import Label from '../global/Label';
import Font from '../resources/styles/Font';

var valid = require('card-validator');

const { width } = Dimensions.get('window');

var error = { color: 'red', fontSize: Font.Small, marginTop: 5, marginLeft: 10 };
var input = {
    width: width - 50, color: 'black', padding: 3,
    marginLeft: 10,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    fontSize: Font.Large,
    color: '#4B4B4B',
};

export default class AlertCardDetails extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            callback: this.props.callback,
            name: '',
            nameError: '',
            number: '',
            numberError: '',
            expiry: '',
            expiryError: '',
            CVV: '',
            cvvError: ''
        }
    }

    componentWillMount() {
        AsyncStorage.getItem(DatabaseKey.cardDetails).then((cardDetails) => {
            if (cardDetails) {
                var details = JSON.parse(cardDetails);
                console.log('Card details ::: ' + details)
                console.log('Card details name ::: ' + details.name)
                this.setState({
                    name: details.name,
                    number: details.number,
                    expiry: details.expiry
                })
            }
        }).done();
    }

    getName = (name) => {
        this.setState({ name }, function () {
            this.setState({ nameError: '' })
        })
    }

    getNumber = (number) => {
        this.setState({ number }, function () {
            this.setState({ numberError: '' })
        })
        return
        let newText = '';
        let numbers = '0123456789';
        for (var i = 0; i < number.length; i++) {
            if (numbers.indexOf(number[i]) > -1) {
                newText = newText + number[i];
                this.setState({ number: newText }, function () {
                    this.setState({ numberError: '' })
                })
            }
            else {
                // your call back function
                this.setState({ numberError: 'please enter numbers only' }, function () {
                    this.setState({ number: '' })
                })
            }
        }
        // this.setState({ number }, function () {
        //     this.setState({ numberError: '' })
        // })
    }

    getExpiry = (expiry) => {
        this.setState({ expiry }, function () {
            this.setState({ expiryError: '' })
        })
        return
        let newText = '';
        let numbers = '0123456789 ';
        if (expiry === '') {
            return
        }
        for (var i = 0; i < expiry.length; i++) {
            if (numbers.indexOf(expiry[i]) > -1) {
                newText = newText + expiry[i];
                this.setState({ expiry: newText }, function () {
                    this.setState({ expiryError: '' })
                })
            }
            else {
                // your call back function
                this.setState({ expiryError: 'please enter numbers only' }, function () {
                    this.setState({ number: '' })
                })
            }
        }
        // this.setState({ expiry }, function () {
        //     this.setState({ expiryError: '' })
        // })
    }

    getCVV = (CVV) => {
        this.setState({ CVV }, function () {
            this.setState({ cvvError: '' })
        })
        return
        if (CVV === '') {
            return
        }
        let newText = '';
        let numbers = '0123456789';
        for (var i = 0; i < CVV.length; i++) {
            if (numbers.indexOf(CVV[i]) > -1) {
                newText = newText + CVV[i];
                this.setState({ CVV: newText }, function () {
                    this.setState({ cvvError: '' })
                })
            }
            else {
                // your call back function
                this.setState({ cvvError: 'please enter numbers only' }, function () {
                    this.setState({ number: '' })
                })
            }
        }
    }

    render() {
        const { visible } = this.props;
        const { name, number, expiry, CVV,
            nameError, numberError, expiryError, cvvError } = this.state;
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={visible}
                onRequestClose={() => { console.log('close modal') }}>
                <KeyboardAvoidingView style={styles.modalBackground}
                    behavior={Platform.OS === 'ios' ? "padding" : ""}
                    enabled>
                    <View style={styles.backgroundCardDetails}>
                        <Label
                            inputStyle={{ marginTop: 3 }}
                            visible={false}
                            name={Strings.TEXT_NAME + ' :'} />
                        <TextInput
                            keyboardType={'default'}
                            style={input}
                            placeholder={Strings.TEXT_PLACEHOLDER_NAME}
                            placeholderTextColor="#CDCECF"
                            underlineColorAndroid="transparent"
                            editable={true}
                            onChangeText={(text) => this.getName(text)}
                            value={name}
                        />
                        {
                            nameError ? <Text style={error}>{nameError}</Text> : null
                        }

                        <Label
                            inputStyle={{ marginTop: 8 }}
                            visible={false}
                            name={Strings.TEXT_CARD_NUMBER + ' :'} />

                        <TextInput
                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                            style={input}
                            placeholder={Strings.TEXT_PLACEHOLDER_CARD_NUMBER}
                            placeholderTextColor="#CDCECF"
                            underlineColorAndroid="transparent"
                            editable={true}
                            maxLength={16}
                            onChangeText={(text) => this.getNumber(text)}
                            value={number}
                        />
                        {
                            numberError ? <Text style={error}>{numberError}</Text> : null
                        }
                        <Label
                            inputStyle={{ marginTop: 8 }}
                            visible={false}
                            name={Strings.TEXT_EXPIRY + ' :'} />
                        <TextInput
                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                            style={input}
                            placeholder={Strings.TEXT_PLACEHOLDER_EXPIRY}
                            placeholderTextColor="#CDCECF"
                            underlineColorAndroid="transparent"
                            editable={true}
                            maxLength={4}
                            onChangeText={(text) => this.getExpiry(text)}
                            value={expiry}
                        />
                        {
                            expiryError ? <Text style={error}>{expiryError}</Text> : null
                        }
                        <Label
                            inputStyle={{ marginTop: 8 }}
                            visible={false}
                            name={Strings.TEXT_CVV + ' :'} />
                        <TextInput
                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                            style={input}
                            placeholder={Strings.TEXT_PLACEHOLDER_CVV}
                            placeholderTextColor="#CDCECF"
                            underlineColorAndroid="transparent"
                            editable={true}
                            maxLength={4}
                            onChangeText={(text) => this.getCVV(text)}
                            value={CVV}
                        />
                        {
                            cvvError ? <Text style={error}>{cvvError}</Text> : null
                        }

                        {this._renderLogoutSelf()}
                    </View>
                </KeyboardAvoidingView>
            </Modal >
        );
    }

    _onFocus = (field) => console.log("focusing", field);

    _onChange = form => {
        console.log("form", form);
        this.setState({ form })
    };

    _onCancelClick = () => {
        const { callback } = this.props;
        this.setState({ valid: '' })
        callback(AppData.alert.cancel)
    }

    _onConfirmClick = () => {
        const { callback } = this.props;
        const { name, number, expiry, CVV } = this.state;

        if (name === '') {
            this.setState({ nameError: '^Invalid name.' })
            return
        }

        if (!valid.number(number).isValid) {
            this.setState({ numberError: '^Invalid card number.' })
            return
        }

        var expiryDate = valid.expirationDate(expiry)
        if (!expiryDate.isValid) {
            this.setState({ expiryError: '^Invalid expiry date.' })
            return
        }

        if (CVV.length<3) {
            this.setState({ cvvError: '^Invalid CVV.' })
            return
        }
        var details = AppData.CardDetails;
        details.name = name
        details.number = number
        details.expiry = expiry
        details.month = expiryDate.month
        details.year = expiryDate.year
        details.CVV = CVV
        console.log('Card Details is ::: ' + JSON.stringify(details))
        callback(AppData.alert.submit, details)
    }

    _renderLogoutSelf() {
        return (
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Actions
                    inputStyles={[styles.buttonResend, { marginLeft: 30 }]}
                    textStyles={
                        {
                            fontSize: Font.Medium,
                            color: '#000000',
                        }
                    }
                    onClick={this._onCancelClick}
                    action={Strings.TEXT_CANCEL} />

                <Actions
                    inputStyles={styles.buttonResend}
                    textStyles={
                        {
                            fontSize: Font.Medium,
                            color: '#000000',
                        }
                    }
                    onClick={this._onConfirmClick}
                    action={Strings.TEXT_SUBMIT} />
            </View>
        );
    }

}