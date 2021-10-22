import React, { PureComponent } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Dimensions, StatusBar,
    Platform, KeyboardAvoidingView, Image, ActivityIndicator, TouchableOpacity, StyleSheet
} from 'react-native';
import { Container, Content, Header, Left, Button, Right, Body } from 'native-base';
import Loading from '../global/Loader';

import AsyncStorage from '@react-native-community/async-storage';
import styles from '../resources/styles/Styles'
import Actions from '../global/UserAction'
import Strings from '../resources/string/Strings'
import AppData from '../constants/AppData';
import DatabaseKey from '../constants/DatabaseKeys'
import Label from '../global/Label';
import Font from '../resources/styles/Font';
import MonthYearModal from '../alerts/MonthYearModal';
import webService from '../global/WebServiceHandler';
import Services from '../constants/WebServices';
const isIOS = Platform.OS == 'ios'
import Toast, { DURATION } from 'react-native-easy-toast';
const { width, } = Dimensions.get('window')
const selected = require('../resources/images/check_box.png')
const unselected = require('../resources/images/check_box_gray.png')
var valid = require('card-validator');


var error = { color: 'red', fontSize: Font.Small, marginTop: 5, marginLeft: 10 };


export default class AddCardDetails extends PureComponent {

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
            cvvError: '',
            cardId: '',

            //New
            loading: false,
            cardName: '',
            cardNumber: '',
            selectedMonth: '',
            selectedYear: '',
            cardCVV: '',
            isDebitCreditCardSelected: false,
            selectedCard: {},
            showHidePicker: false,
            savedCards: [],
            access_token: '',
        }
    }

    // componentWillMount() {
    //     AsyncStorage.getItem(DatabaseKey.cardDetails).then((cardDetails) => {
    //         if (cardDetails) {
    //             var details = JSON.parse(cardDetails);
    //             console.log('Card details ::: ' + details)
    //             console.log('Card details name ::: ' + details.name)
    //             this.setState({
    //                 name: details.name,
    //                 number: details.number,
    //                 expiry: details.expiry
    //             })
    //         }
    //     }).done();
    // }


    componentDidMount() {
        AsyncStorage.getItem(DatabaseKey.access_token).then((access_token) => {
            this.setState({ access_token }, function () {
                this._getSavedCards(access_token)
                // this._onCardActionPerform()
            })
        }).done();
    }


    _getSavedCards = () => {
        this.setState({ loading: true })
        webService.get((Services.PaymentUrl + Services.App + Services.ConnectStripe), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': this.state.access_token
        })
            .then((responseJson) => {
                console.log('Response is _getSavedCards:: ' + JSON.stringify(responseJson))
                console.log("Token is : " + JSON.stringify(this.state.access_token));
                this.setState({ loading: false }, function () {
                    if (responseJson) {
                        var savedCards = responseJson
                        for (let i in savedCards) {
                            savedCards[i].isSelected = false
                        }
                        this.setState({ savedCards }, function () {
                            console.log('_getSavedCards:: ' + JSON.stringify(savedCards))
                        })
                    } else alert(responseJson.message)
                })
            })
            .catch((error) => {
                this.setState({ loading: false })
                // this._showToast(JSON.stringify(error))
                console.log('callapi error :' + JSON.stringify(error))
            });
    }


    _tapOnCheck = (index) => {
        var savedCards = this.state.savedCards
        var card = ''
        for (let i in savedCards) {
            savedCards[i].isSelected = false
        }

        let selectedCard = index != undefined ? savedCards[index] : {};//selectedCard when tap in savedcard touch.

        if (index != undefined) {
            savedCards[index].isSelected = true
            if (!this.state.isDebitCreditCardSelected) { card = savedCards[index].id }
        }

        this.setState({
            isDebitCreditCardSelected: index != undefined ? false : true,//hide card when tap in savedcard touch.
            cardName: '',
            cardNumber: '',
            selectedMonth: '',
            selectedYear: '',
            cardCVV: '',
            savedCards,
            selectedCard,
            cardId: card
        })
    }

    _updateMonth = (selectedMonth) => this.setState({ selectedMonth })

    _updateYear = (selectedYear) => this.setState({ selectedYear })

    _showHidePickerModal = (showHidePicker) => this.setState({ showHidePicker })

    _onChangeCardName = (cardName) => this.setState({ cardName })

    _onChangeCardNumber = (cardNumber) => this.setState({ cardNumber })

    _onChangeCardCVV = (cardCVV) => this.setState({ cardCVV })

    _showToast = (message) => {
        this.refs.toast.show(message, DURATION.LENGTH_LONG)
    }

    _tapOnApplePay = async () => {
        const { cardNumber, cardName, selectedMonth, selectedYear,
            cardCVV, selectedCard, isDebitCreditCardSelected } = this.state;

        alert('Still to Implement')
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
    }

    getExpiry = (expiry) => {
        this.setState({ expiry }, function () {
            this.setState({ expiryError: '' })
        })
    }

    getCVV = (CVV) => {
        this.setState({ CVV }, function () {
            this.setState({ cvvError: '' })
        })
    }

    render() {
        const { visible,hideModalCallBack,tapOnApplePay } = this.props;
        const { loading, isDebitCreditCardSelected, cardName, cardNumber, selectedYear, selectedMonth, cardCVV, showHidePicker, savedCards } = this.state;

        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={visible}
                onRequestClose={() => { console.log('close modal') }}>
                <KeyboardAvoidingView style={styles.modalBackground}
                    behavior={Platform.OS === 'ios' ? "padding" : ""}
                    enabled>
                    <View style={styles.backgroundAddCardDetails}>


                        {showHidePicker && <MonthYearModal showModal={showHidePicker}
                            onMonthChange={this._updateMonth}
                            onYearChange={this._updateYear}
                            selectedMonth={selectedMonth}
                            selectedYear={selectedYear}
                            hidePicker={this._showHidePickerModal} />}
                        <Header style={{ backgroundColor: 'black', borderBottomColor: '#FDA02A' }}>
                            <Left>
                                {/* <Button transparent style={{ paddingStart: 15 }} onPress={() => { this._goBack() }}>
                                    <Image source={require('../resources/images/back_arrow.png')} />
                                </Button> */}
                            </Left>
                            <Body style={{
                                ...Platform.select({
                                    ios: { alignItems: 'center', justifyContent: 'center' },
                                    android: { alignItems: 'flex-end', justifyContent: 'flex-end' }
                                })
                            }}>
                                <Text style={{ color: '#FDA02A' }}>{'Confirm & Pay'}</Text>
                            </Body>
                            <Right>
                                <Button transparent style={{ paddingEnd: 15 }} onPress={() => hideModalCallBack()}>
                                    <Image style={{height:width/23.4375,width:width/23.4375}} source={require('../resources/images/cross.png')} />
                                </Button>
                            </Right>
                        </Header>
                        <StatusBar
                            backgroundColor="#595656"
                            barStyle="light-content" />
                        <Loading loading={loading} />
                        <Content contentContainerStyle={{ flex: 1, }} scrollEnabled={true}>
                            {loading && <ActivityIndicator style={{ marginTop: 10 }} />}

                            {savedCards.map((elem, index) => {
                                return (
                                    <FieldSavedCards key={index} title={elem.name ? elem.name : 'N/A'}
                                        isSelected={elem.isSelected}
                                        cardNumber={'xxxx xxxx xxxx ' + elem.last4}
                                        tapOnCheck={() => this._tapOnCheck(index)} />
                                )
                            })}

                            <Text style={{ fontSize: Font.Medium, marginStart: 16, marginTop: width / 12.5, color: 'white' }}>Preferred Payment</Text>

                            <FieldSavedCards title={'Credit / Debit Card'} isSelected={isDebitCreditCardSelected}
                                tapOnCheck={this._tapOnCheck} />


                            {isDebitCreditCardSelected && <View style={styles.viewDebitCard}>

                                <FieldsCard title={'Enter Card Holder Name'} keyboardType={'default'}
                                    value={cardName} onChangeText={this._onChangeCardName} maxLength={30} />

                                <FieldsCard title={'Enter Card Number'} value={cardNumber} maxLength={16} container={{ marginTop: 10 }}
                                    titleStyle={{ marginTop: 10 }} onChangeText={this._onChangeCardNumber} />

                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ color: 'white', fontSize: Font.Small }}>Expiry</Text>
                                        <TouchableOpacity style={{
                                            marginTop: 5,
                                            height: width / 9.3,
                                            width: '100%',
                                            backgroundColor: 'white',
                                            justifyContent: 'center'
                                        }} onPress={() => this._showHidePickerModal(true)} activeOpacity={.8}>
                                            <Text style={{ color: selectedMonth == '' ? '#B1B1B1' : 'black', paddingStart: 10, }}>{selectedMonth == '' ? 'MM / YY' : selectedMonth + '/' + selectedYear}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <FieldsCard title={'CVV'} container={{ flex: 1, marginStart: 5 }}
                                        value={cardCVV} maxLength={3} onChangeText={this._onChangeCardCVV} />
                                </View>
                            </View>}


                            {isIOS && <Button success style={{
                                backgroundColor: '#FDA02A', marginTop: 35, alignSelf: 'center', width: width / 1.0932944606, height: 50,
                                justifyContent: 'center'
                            }} onPress={() => tapOnApplePay()}>
                                <Text style={{ color: 'white', fontSize: Font.Medium, }} uppercase={false}>{'Apple Pay'}</Text>
                            </Button>}
                            <Button success style={{
                                backgroundColor: '#FDA02A', marginTop: 10, alignSelf: 'center', width: width / 1.0932944606, height: 50,
                                justifyContent: 'center'
                            }} onPress={() => this._onConfirmClick()}>
                                <Text style={{ color: 'white', fontSize: Font.Medium, }} uppercase={false}>{'Pay Now'}</Text>
                            </Button>
                        </Content>

                    </View>
                </KeyboardAvoidingView>
            </Modal >
        );
    }


    _onChange = form => {
        console.log("form", form);
        this.setState({ form })
    };

    _onCancelClick = () => {
        const { callback } = this.props;
        this.setState({ valid: '' })
        callback(AppData.alert.cancel)
    }

    _isCardValidate = () => {
        const { cardNumber, cardName, selectedMonth, cardCVV, } = this.state

        if (cardName.trim() == '') {
            alert('Please provide name on the card.')
            return false
        }
        else if (cardNumber.trim() == '') {
            alert('Please provide card number.')
            return false
        }
        else if (cardNumber.length < 16) {
            alert('Please enter valid number')
            return
        }
        else if (selectedMonth.trim() == '' && selectedYear === '') {
            alert('Please provide expiry date of card.')
            return false
        }
        else if (cardCVV.trim() == '' || cardCVV.length < 3) {
            alert('Please provide CVV number of card.')
            return false
        }
        return true
    }

    _showHideLoader = (loading) => this.setState({ loading })

    _onConfirmClick = () => {
        const { callback } = this.props;
        const { cardName, cardNumber, cardId, cardCVV, selectedMonth, selectedYear, selectedCard, isDebitCreditCardSelected } = this.state;

        if (!selectedCard.id) {
            if (!isDebitCreditCardSelected) {
                alert('Please select card')
                return
            }
            if (this._isCardValidate() == false) {
                this._showHideLoader(false)
                return
            }
        }



        // if (cardName === '') {
        //     // this.setState({ nameError: '^Invalid name.' })
        //     // this.setState({ nameError: '^Invalid name.' })
        //     alert('Please enter name')
        //     return
        // }

        // if (cardNumber === '') {
        //     // this.setState({ numberError: '^Invalid card number.' })
        //     alert('Please enter number')
        //     return
        // }

        // if (cardNumber.length < 16) {
        //     // this.setState({ numberError: '^Invalid card number.' })
        //     alert('Please enter valid number')
        //     return
        // }

        // // var expiryDate = valid.expirationDate(expiry)
        // if (selectedMonth === '' && selectedYear === '') {
        //     // this.setState({ expiryError: '^Invalid expiry date.' })
        //     alert('Please enter expiry data')

        //     return
        // }

        // if (cardCVV.length < 3) {
        //     // this.setState({ cvvError: '^Invalid CVV.' })
        //     alert('Please enter cvv')
        //     return
        // }
        var details = AppData.CardDetails;
        details.name = cardName
        details.number = cardNumber
        details.expiry = `${selectedMonth}/${selectedYear}`
        details.month = selectedMonth
        details.year = selectedYear
        details.CVV = cardCVV
        console.log('Card Details is ::: ' + JSON.stringify(details))
        callback(AppData.alert.submit, details, isDebitCreditCardSelected, cardId)
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
const FieldSavedCards = ({ title, isSelected, cardNumber, tapOnCheck, }) => {
    return (
        <View style={{
            height: cardNumber ? 65 : 55,
            marginStart: 16, marginEnd: 16, alignItems: 'center', flexDirection: 'row'
        }}>
            <TouchableOpacity onPress={() => tapOnCheck()} style={{ height: '100%', paddingTop: cardNumber ? 15 : 0, justifyContent: cardNumber ? 'flex-start' : 'center' }}>
                <Image style={{
                    height: 16, width: 16, resizeMode: 'center'
                }} source={isSelected ? selected : unselected} />
            </TouchableOpacity>
            <View style={{ marginStart: 10, flex: 1 }}>
                <Text style={{ color: 'white', fontSize: Font.Medium }} onPress={() => tapOnCheck()}>{title}</Text>
                {cardNumber && <Text style={{ color: 'white', }}
                    onPress={() => tapOnCheck()}>{cardNumber}</Text>}
            </View>

            {/* <Image style={styles.imageCard} source={Images.IC_CARD} /> */}

            <View style={{
                height: 1, backgroundColor: '#D4D4D4',
                position: 'absolute', bottom: 0, width: width - 34,
            }} />
        </View>
    )
}

const FieldsCard = ({ container, title, placeholder, keyboardType, value, onChangeText, onFocus, maxLength }) => {
    return (
        <View style={container}>
            <Text style={{ color: 'white', fontSize: Font.Small }}>{title}</Text>
            <TextInput style={{
                marginTop: 5,
                height: width / 9.3,
                width: '100%',
                flexDirection: 'row',
                paddingStart: 10, paddingEnd: 10,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
            }} numberOfLines={1}
                keyboardType={keyboardType ? keyboardType : 'number-pad'}
                value={value}
                maxLength={maxLength}
                onFocus={onFocus && onFocus}
                onChangeText={onChangeText && onChangeText}
                placeholder={placeholder ? placeholder : title} />
        </View>
    )
}