import React, { Component } from 'react'
import {
    Text,
    View,
    Platform,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native'

import Continue from '../global/UserAction'
import Strings from '../resources/string/Strings'
import UserInput from '../global/UserInput'
import styles from '../resources/styles/Styles'
import Toast, { DURATION } from 'react-native-easy-toast'
import Font from '../resources/styles/Font';

const { width } = Dimensions.get('window');

const selected = require('../resources/images/check_box.png')
const unselected = require('../resources/images/check_box_gray.png')

export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            number: this.props.number,
            callback: this.props.callback,
            cca2: this.props.cca2,
            callingCode: Strings.TEXT_COUNTRY_CODE,
            position: 'bottom',
            style: {},
            checked: false
        }
    }

    componentDidMount() {
        this.setState({ cca2: this.props.cca2 })
    }

    getResult(result) {
        this.setState({ number: result }, function () {
            const { number, callingCode } = this.state;
            this.props.callback(number, callingCode)
        })
        console.log("result value", result)
    }

    _showToast = (message) => {
        this.refs.toast.show(message, DURATION.LENGTH_LONG)
    }

    onTermsClick = () => {
        const { navigation } = this.props;
        navigation.navigate('WebViewScreen',
            {
                Title: Strings.TEXT_TITLE_TERMS,
                Url: Strings.TEXT_TERMS_CONDITIONS
            })
    }

    onCheckedClick = () => {
        const { checked } = this.state;
        this.setState({ checked: !checked })
    }

    onContinueClick = () => {
        const { onClick } = this.props;
        const { checked } = this.state;
        onClick(checked)
    }

    render() {
        const { number, position, cca2, checked } = this.state;
        return (
            <View
                style={{ flex: 1 }}>
                <View style={styles.containerNumber}>
                    <View style={[styles.codeContainer, { justifyContent: 'center' }]}>
                        <Text style={[styles.textSignIn, { color: '#4B4B4B' }]}>
                            {Strings.TEXT_COUNTRY_CODE}
                        </Text>
                    </View>
                    <UserInput
                        inputStyles={{
                            width: width - 120, color: '#4B4B4B', borderLeftWidth: 0,
                            borderTopWidth: 0,
                            borderRightWidth: 0,
                            borderBottomWidth: 0.5,
                            borderBottomColor: '#4B4B4B',
                        }}
                        keyboard={'numeric'}
                        placeholder="phone number"
                        autoCapitalize={'none'}
                        returnKeyType={'done'}
                        autoCorrect={false}
                        value={number}
                        length={10}
                        callback={this.getResult.bind(this)} />
                </View>
                <View style={[styles.containerNumber, { paddingTop: 20 }]}>
                    <TouchableOpacity
                        style={{ padding: 5 }}
                        onPress={this.onCheckedClick}>
                        <Image
                            style={{ height: 20, width: 20 }}
                            source={checked ? selected : unselected} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.onTermsClick}>
                        <Text style={[styles.textSignIn, {
                            color: '#4B4B4B', textAlign: 'left',
                            fontSize: Font.Small, marginLeft: 10,
                            paddingTop: 5
                        }]}
                            numberOfLines={2}>
                            {Strings.TEXT_TERMS_SERVICE}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Continue
                    data={number}
                    inputStyles={{ margin: 30, marginTop: 10 }}
                    onClick={this.onContinueClick}
                    action={Strings.TEXT_CONTINUE} />

                <Toast ref="toast" position={position} />
            </View >
        );
    }
}