import React, { Component } from 'react';
import { StatusBar, View, StyleSheet, Alert, Image, TouchableOpacity, Platform, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { Container, Content, Header, Left, Button, Right, Text, Body } from 'native-base';
import Font from '../resources/styles/Font';
import Loading from '../global/Loader';
import MonthYearModal from '../alerts/MonthYearModal';
import webService from '../global/WebServiceHandler';
import Services from '../constants/WebServices';
import AsyncStorage from '@react-native-community/async-storage';
import DatabaseKey from '../constants/DatabaseKeys';
import AppData from '../constants/AppData';
import Toast, { DURATION } from 'react-native-easy-toast';
const { width, } = Dimensions.get('window')
const isIOS = Platform.OS == 'ios'
const selected = require('../resources/images/check_box.png')
const unselected = require('../resources/images/check_box_gray.png')

class ConfirmAndPayScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
        };
    }

    static navigationOptions = {
        header: null,
        gesturesEnabled: false
    }

    componentDidMount() {
        AsyncStorage.getItem(DatabaseKey.access_token).then((access_token) => {
            this.setState({ access_token }, function () {
                console.log('database', DatabaseKey)
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

    _goBack = () => {
        this.props.navigation.goBack();
    }

    _tapOnCheck = (index) => {
        var savedCards = this.state.savedCards
        for (let i in savedCards) {
            savedCards[i].isSelected = false
        }

        let selectedCard = index != undefined ? savedCards[index] : {};//selectedCard when tap in savedcard touch.

        if (index != undefined) savedCards[index].isSelected = true;

        this.setState({
            isDebitCreditCardSelected: index != undefined ? false : true,//hide card when tap in savedcard touch.
            cardName: '',
            cardNumber: '',
            selectedMonth: '',
            selectedYear: '',
            cardCVV: '',
            savedCards,
            selectedCard
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


    _tapOnPayNow = async (token, orderId, update) => {
        const { cardNumber, access_token, cardName, selectedMonth, selectedYear, cardCVV, selectedCard, isDebitCreditCardSelected } = this.state;

        // makePayment = (token, orderId, update) => {
        console.log('token :::' + token)
        webService.post((Services.Url + Services.App + Services.Pay), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }, {
            'id': orderId,
            'token': token,
            'update': update,
            'cardLast4Digits': cardNumber
        })
            .then((responseJson) => {
                console.log('Studios Booking slots Details Pay Response : ' + JSON.stringify(responseJson))
                if (responseJson.code < 200 || responseJson.code > 299) {
                    this.setState({ loading: false }, function () {
                        setTimeout(() => {
                            alert(responseJson.response.message);
                        }, 100);
                    });
                } else {
                    this.setState({
                        loading: false
                    }, function () {
                        console.log(`log 3 update cart :::::::::::::::::::::::::::::::`)
                        setTimeout(() => {
                            this.updateCart(clearCartWtihSavingDetails, '', responseJson.isNewUser);
                        }, 100)
                    })
                }
            })
            .catch((error) => {
                console.log('callapi error makePayment :', error.status);
                if (error.status < 200 || error.status > 299) {
                    error.json().then((r) => {
                        this.setState({ loading: false }, function () {
                            setTimeout(() => {
                                var buttons = [
                                    {
                                        text: 'Okay',
                                        onPress: () => {
                                            // AsyncStorage.removeItem(DatabaseKey.cartDetails);
                                            this.handleOkClickOfPopUP();
                                        }
                                    },
                                ];
                                Alert.alert('Alert', r.message, buttons, { cancelable: false });
                            }, 100);
                        });
                    });
                } else {
                    error.json().then((err) => {
                        this.setState({ loading: true }, function () {
                            setTimeout(() => {
                                this.validateCartDetails();
                            }, 100);
                        });
                        this._showToast(err);
                    });
                }
            });
        // }
    }

    _tapOnApplePay = async () => {
        const { cardNumber, cardName, selectedMonth, selectedYear,
            cardCVV, selectedCard, isDebitCreditCardSelected } = this.state;

        alert('Still to Implement')
    }


    render() {
        const { loading, isDebitCreditCardSelected, cardName, cardNumber, selectedYear, selectedMonth, cardCVV, showHidePicker, savedCards } = this.state;
        return (
            <Container style={{ backgroundColor: 'black' }}>
                {showHidePicker && <MonthYearModal showModal={showHidePicker}
                    onMonthChange={this._updateMonth}
                    onYearChange={this._updateYear}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    hidePicker={this._showHidePickerModal} />}
                <Header style={{ backgroundColor: 'black', borderBottomColor: '#FDA02A' }}>
                    <Left>
                        <Button transparent style={{ paddingStart: 15 }} onPress={() => { this._goBack() }}>
                            <Image source={require('../resources/images/back_arrow.png')} />
                        </Button>
                    </Left>
                    <Body style={{
                        ...Platform.select({
                            ios: { alignItems: 'center', justifyContent: 'center' },
                            android: { alignItems: 'flex-end', justifyContent: 'flex-end' }
                        })
                    }}>
                        <Text style={{ color: '#FDA02A' }}>{'Confirm & Pay'}</Text>
                    </Body>
                    <Right />
                </Header>
                <StatusBar
                    backgroundColor="#595656"
                    barStyle="light-content" />
                <Loading loading={loading} />
                <Content contentContainerStyle={{ flex: 1, }} scrollEnabled={false}>
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
                                value={cardCVV} maxLength={4} onChangeText={this._onChangeCardCVV} />
                        </View>
                    </View>}


                    {isIOS && <Button success style={{
                        backgroundColor: '#FDA02A', marginTop: 35, alignSelf: 'center', width: width / 1.0932944606, height: 50,
                        justifyContent: 'center'
                    }} onPress={() => this._tapOnApplePay()}>
                        <Text style={{ color: 'white', fontSize: Font.Medium, }} uppercase={false}>{'Apple Pay'}</Text>
                    </Button>}
                    <Button success style={{
                        backgroundColor: '#FDA02A', marginTop: 10, alignSelf: 'center', width: width / 1.0932944606, height: 50,
                        justifyContent: 'center'
                    }} onPress={() => this._tapOnPayNow()}>
                        <Text style={{ color: 'white', fontSize: Font.Medium, }} uppercase={false}>{'Pay Now'}</Text>
                    </Button>
                </Content>
            </Container>
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

const styles = StyleSheet.create({
    calendar: {
        borderBottomWidth: 0.5,
        borderColor: '#FDA02A'
    },
    text: {
        textAlign: 'center',
        borderColor: '#bbb',
        padding: 10,
        backgroundColor: '#eee'
    },
    container: {
        flex: 1,
        backgroundColor: 'gray'
    },
    viewDebitCard: {
        backgroundColor: 'black',
        padding: 16,
        margin: 16,
        borderRadius: 6,
        borderColor: 'white',
        borderWidth: 1,
        marginTop: width / 18.5
    }

});

export default ConfirmAndPayScreen;