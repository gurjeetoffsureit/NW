import React, { PureComponent } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Dimensions,
    Platform, TouchableOpacity, Image, Keyboard, CheckBox, KeyboardAvoidingView
} from 'react-native';
import styles from '../resources/styles/Styles'
import Actions from '../global/UserAction'
import Strings from '../resources/string/Strings'
import Label from '../global/Label';
import Font from '../resources/styles/Font';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import Styles from '../resources/styles/Styles';

export default class AddNotesNew extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            notesValue: this.props.notes,
            isParkingRequired: false,
            isEngineerRequired: false,
            parkingSpaceUserName: ''
        }
        console.log("AlertAddNote constructor>>>>")
    }

    render() {
        const { visible, notes, isEngineerNeedToAsk, isParkingSpaceNeedToAsk } = this.props;
        const { notesValue, isParkingRequired, isEngineerRequired, parkingSpaceUserName, error, errorName } = this.state;
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={visible}
                onRequestClose={() => { console.log('close modal') }}>
                <KeyboardAvoidingView style={styles.keyboardAvoidingViewStyle}
                    behavior={Platform.OS === 'ios' ? "padding" : ""}
                    enabled>
                    <TouchableOpacity style={styles.completeViewTouchableOpacity} onPress={() => Keyboard.dismiss()}>
                        <View style={[styles.backgroundCardDetails, { paddingTop: 10, paddingLeft: 10, paddingRight: 10 }]}>
                            <Label
                                inputStyle={{ marginTop: 3 }}
                                visible={false}
                                name={Strings.TEXT_SPECIAL_INSTRUCTIONS} />
                            <Label
                                inputStyle={{ marginTop: 8 }}
                                visible={false}
                                inputStyle={{ fontSize: Font.xSmall }}
                                name={Strings.TEXT_NEIGHTBORHOOD_WANTS_TO_SERVE_YOU_BETTER} />

                            <Label
                                inputStyle={{ fontSize: Font.Medium, marginTop: 10 }}
                                errorStyle={{ marginTop: 10 }}
                                visible={true}
                                error={error}
                                name={Strings.TEXT_NOTES} />
                            <View style={[Styles.textInputOuterView, { height: 70 }]}>
                                <TextInput
                                    keyboardType={'default'}
                                    style={[styles.textInputNotes, { minHeight: 50 }]}
                                    numberOfLines={5}
                                    placeholder={Strings.TEXT_RESERVATION_NAME}
                                    placeholderTextColor="#CDCECF"
                                    underlineColorAndroid="transparent"
                                    maxLength={500}
                                    multiline={true}
                                    editable={true}
                                    onChangeText={(text) => this.getNotes(text)}
                                    value={notesValue}
                                />
                            </View>
                            {isParkingSpaceNeedToAsk &&
                                <View>
                                    <Label
                                        inputStyle={{ marginTop: 3 }}
                                        visible={true}
                                        error={errorName}
                                        errorStyle={{ marginTop: 10, marginLeft: 5 }}
                                        inputStyle={{ fontSize: Font.Medium, marginTop: 10 }}
                                        name={Strings.TEXT_PARKING_SPACE_QUESTION} />
                                    <RadioGroup
                                        style={{ flexDirection: 'row' }}
                                        selectedIndex={1}
                                        onSelect={(index, value) => this.onSelect(index, value)}>

                                        <RadioButton value={isParkingRequired}>
                                            <Text>Yes</Text>
                                        </RadioButton>

                                        <RadioButton value={!isParkingRequired}>
                                            <Text>No</Text>
                                        </RadioButton>
                                    </RadioGroup>
                                </View>
                            }
                            {
                                isParkingRequired &&
                                <View style={[styles.textInputOuterView, { height: 50 }]}>
                                    <TextInput
                                        keyboardType={'default'}
                                        style={{
                                            backgroundColor: '#ffffff',
                                            padding: 10
                                        }}
                                        numberOfLines={5}
                                        placeholderTextColor="#CDCECF"
                                        underlineColorAndroid="transparent"
                                        maxLength={50}
                                        multiline={false}
                                        editable={true}
                                        placeholder={Strings.TEXT_PARKING_SPACE_USER_NAME}
                                        onChangeText={(text) => this.getNameOfParkingSpace(text)}
                                        value={parkingSpaceUserName}
                                    />
                                </View>
                            }{
                                isEngineerNeedToAsk &&
                                <View>
                                    <Label
                                        inputStyle={{ marginTop: 3 }}
                                        visible={false}
                                        inputStyle={{ fontSize: Font.Medium, marginTop: 10 }}
                                        name={Strings.TEXT_ENGINEER_QUESTION} />
                                    <RadioGroup
                                        style={{ flexDirection: 'row' }}
                                        selectedIndex={1}
                                        onSelect={(index, value) => this.onSelectEngineerOptions(index)}>
                                        <RadioButton value={isEngineerRequired}>
                                            <Text>Yes</Text>
                                        </RadioButton>

                                        <RadioButton value={!isEngineerRequired}>
                                            <Text>No</Text>
                                        </RadioButton>
                                    </RadioGroup>
                                </View>
                            }
                            {this._renderLogoutSelf()}
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal >
        );
    }

    onSelect(index) {
        if (index == 0) {
            this.setState({
                isParkingRequired: true,
            })
        }
        else {
            this.setState({
                isParkingRequired: false,
            })
        }
    }
    onSelectEngineerOptions(index) {
        if (index == 0) {
            this.setState({
                isEngineerRequired: true,
            })
        }
        else {
            this.setState({
                isEngineerRequired: false,
            })
        }
    }

    getNotes = (text) => {
        this.setState({
            notesValue: text
        })
    }
    getNameOfParkingSpace = (text) => {
        this.setState({
            parkingSpaceUserName: text
        })
    }

    _onCancelClick = () => {
        const { callback, notes, isNotesOpenOnRequestBook } = this.props;
        console.log(" notes is >>>>>" + notes)
        callback(notes, isNotesOpenOnRequestBook)
        this.setState({
            notesValue: '',
        })
    }

    _onConfirmClick = () => {
        const { isParkingRequired, isEngineerRequired, parkingSpaceUserName, notesValue } = this.state;
        const { callback, isEngineerNeedToAsk, isParkingSpaceNeedToAsk } = this.props;
        var notes = "";
        var parking = "";
        var engineer = "";

        if (notesValue == '') {
            this.setState({ error: 'Note field cannot be empty.' })
            return
        }

        // if (notesValue === "") {
        //     this.setState({
        //         error : 'Notes cannot empty.'
        //     });
        //     return;
        // } else {
        //     notes = notesValue;
        // }
        if (isParkingSpaceNeedToAsk && isEngineerNeedToAsk) {
            if (isParkingRequired) {
                if (parkingSpaceUserName === "") {
                    this.setState({
                        errorName: 'Name cannot empty.'
                    })
                    return;
                } else {
                    parking = parkingSpaceUserName
                }
            }
            if (isEngineerRequired) {
                engineer = "yes"
            } else {
                engineer = "no"
            }
        } else if (isParkingSpaceNeedToAsk) {
            if (isParkingRequired) {
                if (parkingSpaceUserName === "") {

                    return;
                } else {
                    parking = parkingSpaceUserName
                }
            }
        } else if (isEngineerNeedToAsk) {
            if (isEngineerRequired) {
                engineer = "yes"
            } else {
                engineer = "no"
            }
        }
        callback(notesValue, parking, engineer)
        // callback(notes, parking, engineer)
        this.setState({
            notesValue: '',
        })
    }

    _renderLogoutSelf() {
        return (
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
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

                <Actions inputStyles={{
                    marginTop: 10,
                    marginBottom: 10,
                    borderColor: '#000000',
                    backgroundColor: '#FFFFFF',
                    borderWidth: 2
                }}
                    // inputStyles={styles.buttonResend}
                    textStyles={{
                        paddingStart: 30, paddingEnd: 30,
                        fontSize: Font.Medium,
                        color: '#000000',
                    }}
                    onClick={this._onConfirmClick}
                    action={Strings.TEXT_SAVE} />
            </View>
        );
    }
}

