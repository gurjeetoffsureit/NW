import React, { PureComponent } from 'react';
import {
    Modal,
    View,
    Text
} from 'react-native';

import styles from '../resources/styles/Styles'
import Actions from '../global/UserAction'
import Strings from '../resources/string/Strings'

export default class Notify extends PureComponent {

    render() {
        const { visible, message } = this.props;
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={visible}
                onRequestClose={() => { console.log('close modal') }}>
                <View style={styles.modalBackground}>
                    <View style={styles.backgroundLogoutAlert}>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: 18, color: 'black',
                                fontWeight: 'bold', textAlign: 'center'
                            }}>
                                Alert!</Text>
                        </View>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: 16, color: 'black', textAlign: 'center',
                                paddingLeft: 15, paddingRight: 15
                            }}>
                                {message}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row', margin: 3, alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {this._render()}
                        </View>
                    </View>
                </View>
            </Modal >
        );
    }

    _onCancelClick = () => {
        const { callback, type } = this.props;
        callback(false, type)
    }

    _render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Actions
                    inputStyles={{ flex: 1, marginLeft: 30, marginRight: 30 }}
                    onClick={this._onCancelClick.bind(this)}
                    textStyles={
                        {
                            fontSize: 14,
                            color: 'white',
                        }
                    }
                    action={
                        Strings.TEXT_OKAY
                    } />
            </View>
        );
    }

}