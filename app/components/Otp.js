import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';

import styles from '../resources/styles/Styles';
import Strings from '../resources/string/Strings';
import OtpInputs from '../components/dist/OtpInputs'
import Verify from '../global/UserAction';


export default class Otp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            number: this.props.number,
            otp: '',
            navigate: this.props.navigate,
            callback: this.props.callback,
        }
    }


    render() {
        const { verifyOtp, resendOtp, cancel } = this.props
        return (
            <View style={{ flexDirection: 'column' }}>
                <OtpInputs
                    handleChange={
                        code => this.setState({ otp: code }, function () {
                            this.props.callback(this.state.otp)
                        })
                    }
                    numberOfInputs={6}
                    focusedBorderColor={'white'}
                />
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                }}>
                    <Verify
                        inputStyles={styles.buttonVerify}
                        onClick={verifyOtp}
                        action={Strings.TEXT_VERIFY} />

                    <Verify
                        inputStyles={styles.buttonResend}
                        textStyles={
                            {
                                color: '#000000',
                            }
                        }
                        onClick={resendOtp}
                        action={Strings.TEXT_RESEND_OTP} />
                </View>
                <View style={{
                    marginTop: 80,
                    flexDirection: 'row',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <Verify
                        inputStyles={styles.buttonResend}
                        textStyles={
                            {
                                color: '#000000',
                            }
                        }
                        onClick={cancel}
                        action={Strings.TEXT_CANCEL} />

                </View>
            </View>
        );
    }
}