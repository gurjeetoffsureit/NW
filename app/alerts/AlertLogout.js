import React, { PureComponent } from 'react';
import {
    Modal,
    View,
    Text
} from 'react-native';

import styles from '../resources/styles/Styles'
import Actions from '../global/UserAction'
import Strings from '../resources/string/Strings'
import AppData from '../constants/AppData';

export default class AlertLogout extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            callback: this.props.callback,
        }
    }

    _onLogoutAnotherClick = () => {
        const { callback } = this.props;
        callback(AppData.alert.logoutAnother)
    }

    _onLogoutSelfClick = () => {
        const { callback } = this.props;
        callback(AppData.alert.logout)
    }

    render() {
        const { visible, message, type, callback } = this.props;
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={visible}
                onRequestClose={() => { console.log('close modal') }}>
                <View style={styles.modalBackground}>
                    <View style={styles.backgroundLogoutAlert}>
                        <View style={{
                            flex: 0.2, alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: 18, color: 'black',
                                fontWeight: 'bold', textAlign: 'center'
                            }}>
                                Alert!</Text>
                        </View>
                        <View style={{
                            flex: 0.5, alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: 16, color: 'black', textAlign: 'center',
                                paddingLeft: 15, paddingRight: 15
                            }}>
                                {message}</Text>
                        </View>
                        <View style={{
                            flex: 0.3, flexDirection: 'row', margin: 10, alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {
                                type === AppData.errors.logoutSelf ? (
                                    this._renderLogoutSelf()
                                ) : type === AppData.errors.logoutAnother ? (
                                    this._renderLogoutAnother()
                                ) : (
                                            this._render()
                                        )
                            }
                        </View>
                    </View>
                </View>
            </Modal >
        );
    }

    _onCancelClick = () => {
        const { callback } = this.props;
        callback(AppData.alert.cancel)
    }

    _onLoginClick = () => {
        const { callback } = this.props;
        callback(AppData.alert.login)
    }

    _renderLogoutSelf() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Actions
                    inputStyles={[styles.buttonResend, { marginLeft: 30 }]}
                    textStyles={
                        {
                            fontSize: 14,
                            color: '#000000',
                        }
                    }
                    onClick={this._onCancelClick.bind(this)}
                    action={Strings.TEXT_CANCEL} />

                <Actions
                    inputStyles={styles.buttonResend}
                    textStyles={
                        {
                            fontSize: 14,
                            color: '#000000',
                        }
                    }
                    onClick={this._onLogoutSelfClick.bind(this)}
                    action={Strings.TEXT_LOGOUT} />
            </View>
        );
    }

    _renderLogoutAnother() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Actions
                    inputStyles={[styles.buttonResend, { marginLeft: 30 }]}
                    onClick={this._onCancelClick.bind(this)}
                    textStyles={
                        {
                            fontSize: 14,
                            color: '#000000',
                        }
                    }
                    action={Strings.TEXT_CANCEL} />

                <Actions
                    inputStyles={styles.buttonResend}
                    onClick={this._onLogoutAnotherClick.bind(this)}
                    textStyles={
                        {
                            fontSize: 14,
                            color: '#000000',
                        }
                    }
                    action={Strings.TEXT_LOGOUT} />
            </View>
        );
    }

    _render() {
        const { type } = this.props;

        return (
            <View style={{ flexDirection: 'row' }}>
                <Actions
                    inputStyles={{ flex: 1, marginLeft: 30, marginRight: 30 }}
                    onClick={this._onLoginClick.bind(this)}
                    textStyles={
                        {
                            fontSize: 14,
                            color: '#FDA02A',
                        }
                    }
                    action={
                        type === AppData.errors.tokenExpire ? Strings.TEXT_OKAY : Strings.TEXT_LOGIN
                    } />
            </View>
        );
    }


}

