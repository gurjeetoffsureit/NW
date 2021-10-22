import React, { PureComponent } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Dimensions,
    TouchableOpacity, Image, Keyboard, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'native-base'
import styles from '../resources/styles/Styles'
import Actions from '../global/UserAction'
import Strings from '../resources/string/Strings'
import AppData from '../constants/AppData';
import DatabaseKey from '../constants/DatabaseKeys'
import Label from '../global/Label';
import Font from '../resources/styles/Font';
var valid = require('card-validator');
const { width, height } = Dimensions.get('window')
var isUpdatedFirstTime = false
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
    alignItems: 'center',
    textAlignVertical: 'bottom'

};

export default class AlertAddNote extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            notesValue: this.props.notes,
        }
        console.log("AlertAddNote constructor>>>>")
    }


    render() {
        console.log("AlertAddNote render>>>>")
        const { visible, notes } = this.props;
        const { notesValue } = this.state;
        return (
            // <TouchableOpacity
            //     onPress={() => alert("Dfs")}
            //     style={{ background: 'blue' }}>
            <Modal
                transparent={true}
                animationType={'none'}
                visible={visible}
                onRequestClose={() => { console.log('close modal') }}>
                <KeyboardAvoidingView style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    backgroundColor: '#00000040'
                }}
                    behavior={Platform.OS === 'ios' ? "padding" : ""}
                    enabled>
                    <TouchableOpacity style={{
                        flex: 1,
                        alignItems: 'center',
                        alignSelf: 'center',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        backgroundColor: 'rgba(52, 52, 52, 0.0)'
                    }} onPress={() => Keyboard.dismiss()}>
                        <View style={[styles.backgroundCardDetails, { paddingTop: 10, paddingLeft: 10, paddingRight: 10 }]}>
                            <Label
                                inputStyle={{ marginTop: 3 }}
                                visible={false}
                                name={'Special Instructions'} />
                            <Label
                                inputStyle={{ marginTop: 3 }}
                                visible={false}
                                inputStyle={{ fontSize: Font.xSmall }}
                                name={'The neighborhood wants you serve you better. Please enter any special instructions you may have pertaining to your booking reservation.'} />
                            <Label
                                inputStyle={{ marginTop: 3 }}
                                visible={false}
                                inputStyle={{ fontSize: Font.Medium, marginTop: 10 }}
                                name={'1. Who is the reservation for?\n2. Do you need a parking space? \n    Yes or No \n3. Do you need an engineer?'} />

                            <View style={{
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderTopWidth: 1,
                                borderBottomWidth: 1,
                                marginTop: 10,
                                marginBottom: 10,
                                height: 120
                            }}>
                                <TextInput
                                    keyboardType={'default'}
                                    style={{
                                        height: 110,
                                        backgroundColor: '#ffffff',
                                        paddingLeft: 10,
                                        paddingRight: 10
                                    }}
                                    numberOfLines={5}
                                    placeholderTextColor="#CDCECF"
                                    underlineColorAndroid="transparent"
                                    maxLength={500}
                                    multiline={true}
                                    editable={true}
                                    onChangeText={(text) => this.getNotes(text)}
                                    value={this.setNotesText(notesValue, notes)} />
                            </View>

                            <Text style={{alignSelf: 'center', marginTop: 3, marginLeft: 15,
                        color: 'red', fontSize: Font.Small,}}>Note field cannot be empty.</Text>

                            {this._renderLogoutSelf()}
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal >
            // </TouchableOpacity>
        );

    }
    setNotesText(notesValue, notes) {
        if (!isUpdatedFirstTime) {
            console.log("AlertAddNote setNotesText if>>>>")
            isUpdatedFirstTime = true
            return notes
        }
        else {
            console.log("AlertAddNote setNotesText else>>>>")
            return notesValue
        }
    }

    getNotes = (text) => {
        this.setState({
            notesValue: text
        })
    }

    _onCancelClick = () => {
        const { callback, notes, isNotesOpenOnRequestBook } = this.props;
        console.log(" notes is >>>>>" + notes)
        callback(notes, isNotesOpenOnRequestBook)
        // if (Platform.OS == 'ios') {
        this.setState({
            notesValue: '',

        })

        isUpdatedFirstTime = false
        // }
    }

    _onConfirmClick = () => {
        const { callback } = this.props;
        callback(this.state.notesValue)
        // if (Platform.OS == 'ios') {
        this.setState({
            notesValue: '',

        })
        isUpdatedFirstTime = false
        // }
    }



    _renderLogoutSelf() {
        return (
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                {/* <Actions
                    inputStyles={[styles.buttonResend, { marginLeft: 30 }]}
                    textStyles={
                        {
                            fontSize: Font.Medium,
                            color: '#000000',
                        }
                    }
                    onClick={this._onCancelClick}
                    action={Strings.TEXT_CANCEL} /> */}

                <Actions
                    inputStyles={styles.buttonResend}
                    textStyles={
                        {
                            fontSize: Font.Medium,
                            color: '#000000',
                        }
                    }
                    onClick={this._onConfirmClick}
                    action={Strings.TEXT_SAVE} />
            </View>
        );
    }
}

