import React, { PureComponent } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,Keyboard,
    Dimensions, TouchableOpacity, Image, KeyboardAvoidingView
} from 'react-native';
import { Button } from 'native-base'
import styles from '../resources/styles/Styles'
import Actions from '../global/UserAction'
import Strings from '../resources/string/Strings'
import ImagePicker from 'react-native-image-picker';
import Label from '../global/Label';
import Font from '../resources/styles/Font';
var valid = require('card-validator');
const { width, height } = Dimensions.get('window')
var isUpdatedFirstTime = false

export default class AddGovId extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            notesValue: this.props.notes,
            govtIdImage: '',
            govtIdImageUrl: '',
        }
        console.log("AlertAddNote constructor>>>>")
    }


    render() {
        console.log("AlertAddNote render>>>>")
        const { visible, notes } = this.props;
        const { notesValue, govtIdImage, error } = this.state;
        return (
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
                        <View style={[styles.backgroundCardDetails, {
                            paddingTop: 10, paddingLeft: 10, paddingRight: 10,

                        }]}>
                            <Label
                                inputStyle={{ marginTop: 8 }}
                                visible={false}
                                name={'Upload Government Photo ID'} />
                            <Label
                                inputStyle={{ marginTop: 8 }}
                                visible={false}
                                inputStyle={{ fontSize: Font.xSmall, marginTop: 5 }}
                                name={'Drivers License, Passport, Green Card, Military ID are all accepted forms of identification.'} />
                            <View style={{
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderTopWidth: 1,
                                borderBottomWidth: 1,
                                margin: 10,
                                height: 40,
                                flexDirection: 'row',
                            }}>
                                <Text style={{
                                    fontSize: width * 0.04,
                                    color: '#4B4B4B',
                                    flex: 0.9,
                                    height: 30,
                                    alignSelf: 'center',
                                    padding: 3
                                }} numberOfLines={1}>{govtIdImage}</Text>
                                <TouchableOpacity style={{ flex: 0.1, height: 40, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => this._saveImageUri()}>
                                    <Image style={{ height: 16, width: 16, alignSelf: 'center', marginEnd: 5 }}
                                        source={require('../resources/images/ic_upload.png')} />
                                </TouchableOpacity>
                            </View>

                            {error && <Text style={{
                                alignSelf: 'center', marginTop: 3,
                                color: 'red', fontSize: Font.Small,
                            }}>Field cannot be empty.</Text>}

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

    _saveImageUri = () => {
        var options = {
            title: 'Choose photo',
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                // alert(`ImagePicker Error: ${response.error}`);
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log('response response response _saveImageUri --> ' + JSON.stringify(response))
                let source = { uri: response.uri };
                // alert(`ImagePicker source.uri ${source.uri}`);
                let image = '/image_001.png';
                if (response.fileNam) {
                    image = response.fileName
                }

                this.setState({ govtIdImage: image, govtIdImageUrl: source.uri, error: false });
            }
        });
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
        const { govtIdImage, govtIdImageUrl } = this.state;
        const { callback } = this.props;
        if (govtIdImage === '' && govtIdImageUrl === '') {
            console.log(" notes is govtIdImage  >>>>>" + govtIdImage)
            this.setState({ error: true });
        } else {
            callback(govtIdImage, govtIdImageUrl);
        }
    }

    _renderLogoutSelf() {
        return (
            <View style={{ flexDirection: 'row', marginTop: 10, alignSelf: 'center', marginBottom: 10 }}>
                <Actions
                    inputStyles={styles.buttonResend}
                    textStyles={
                        {
                            fontSize: Font.Medium,
                            color: '#000000',
                        }
                    }
                    onClick={this._onConfirmClick}
                    action={Strings.TEXT_UPLOAD} />
            </View>
        );
    }
}

