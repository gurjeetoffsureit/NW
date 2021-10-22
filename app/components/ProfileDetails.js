import React, { Component } from 'react';
import {
    View,
    Platform,
    Dimensions,
    NetInfo,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput, Text
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import CircleImage from '../global/CircleImage';
import Strings from '../resources/string/Strings';
import Fields from '../global/Fields';
import Label from '../global/Label';
import CreateProfile from '../global/UserAction';
import DatabaseKey from '../constants/DatabaseKeys';
import Toast, { DURATION } from 'react-native-easy-toast';
// import ImagePicker from 'react-native-image-picker';
import { RNS3 } from '../AwsS3/RNS3';
import Loading from '../global/Loader';
import Skills from '../items/SkillItems';
import validator from 'validator';
import SkillsAlert from '../alerts/AlertSkills';
import SkillsData from '../constants/AppData';
import { Type } from '../enum/ViewType';
import OfflineNotice from '../alerts/OfflineNotice';
import Services from '../constants/WebServices';
import AlertLogout from '../alerts/AlertLogout';
import webService from '../global/WebServiceHandler';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width } = Dimensions.get('window');
const image = require('../resources/images/photoIcon.png');
const addButton = require('../resources/images/add_tag_ic.png');

const btnAdd = '12366545811232';

const insta = [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'
]

export default class ProfileDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            number: '',
            name: '',
            nameError: '',
            email: '',
            emailError: '',
            skillsError: '',
            instagramError: '',
            photo: image,
            photoUri: '',
            govtIdImage: '',
            govtIdImageUrl: '',
            skills: '',
            data: SkillsData.Skills,
            selectedData: ['btnbtnbtn'],
            selectedItems: [],
            position: 'bottom',
            style: {},
            loading: false,
            selected: (new Map()),
            skillsVisible: false,
            refreshing: false,
            connected: true,
            connectionError: '',
            logoutVisible: false,
            alertMessage: '',
            profile: '',
            action: this.props.action,
            sliderOneChanging: false,
            sliderOneValue: [5],
            multiSliderValue: [3, 7],
        }

    }

    componentDidMount() {
        // NetInfo.isConnected.addEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );

        this._fetchUserProfile()

        if (this.state.action !== Strings.TEXT_SAVE) {
            this.setState({
                action: Strings.TEXT_CREATE_PROFILE
            })
        }
    }
    componentWillUnmount() {
        // NetInfo.isConnected.removeEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );
    }

    _handleConnectivityChange = (status) => {
        this.setState({
            connected: status
        })
        console.log('*********_handleConnectivityChange: Network Connectivity status *******: ' + status);
    }

    getUserName(result) {
        this.setState({ name: result }, function () {
            if (result === '') {
                this.state.nameError = SkillsData.name.error.message;
            } else {
                this.state.nameError = ''
            }
        })
    }

    getInstagramUserName(instagram) {
        this.setState({ instagram })
    }

    getUserEmail(result) {
        this.setState({ email: result }, function () {
            if (result === '') {
                this.state.emailError = SkillsData.email.error.message;
            } else {
                this.state.emailError = ''
            }
        })
    }

    getSkills(selectedItems) {
        console.log('Data selectedItems is :::' + JSON.stringify(selectedItems));
        var btn = 'btnbtnbtn';
        selectedItems.push(btn)
        this.setState({ selectedData: selectedItems })
        this.setState({ skillsVisible: false });
        console.log(this.state.selectedData);
    }

    getUserNumber(result) {
        this.setState({ number: result })
    }

    _onCreateProfileClick = () => {

        const { name, email, photoUri, selectedData, connected, photo, instagram } = this.state;

        var format = /[!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?]+/;


        var complete = true;

        if (!connected) {
            this.setState({
                connectionError: SkillsData.internet.error.message
            })
            complete = false;
        }

        if (name === '') {
            this.setState({
                nameError: SkillsData.name.error.message
            })
            complete = false; 
        }

        if (email === '') {
            this.setState({
                emailError: SkillsData.email.empty.message
            })
            complete = false;
        }

        if (!validator.isEmail(email)) {
            this.setState({
                emailError: SkillsData.email.error.message
            })
            complete = false;
        }

        if (instagram.trim() === '') {
            this.setState({
                instagramError: '^Instagram handle is required. We only need your handle, without the @ sign.'
            })
            complete = false;
        } else if (format.test(instagram)) {
            this.setState({
                instagramError: '^Instagram handle is required. We only need your handle, without the @ sign.'
            })
            complete = false;
        }

        // if ((photoUri === '') && (photo === '')) {
        //     this._showToast(`Profile picture is required`);
        //     complete = false;
        // }

        if (selectedData.length <= 1) {
            this.setState({
                skillsError: SkillsData.skills.error.message
            });
            complete = false;
        }

        if (complete) {
            console.log(photo);
            // if (validator.isURL(photo.uri)) {
            //     this.setState({ loading: true }, function () {
            //         this._uploadGovtIdImage(photo.uri)
            //         // this._completeProfile(photo.uri)
            //     })
            // } else {
            //     this._onProfileImageUpload();
            // }
            // this._onProfileImageUpload();
            this._completeProfile(photo.uri)
        } else {

        }
    }

    _onProfileImageUpload = () => {

        this.setState({ loading: true })

        const { photoUri, name, number } = this.state;

        var file = {
            uri: photoUri,
            name: `${name}_${number}_image.png`,
            type: "image/png"
        }
        // name: name + "_" + number + "image.png",

        const options = {
            keyPrefix: "uploads/",
            bucket: "offsureit",
            region: "us-east-1",
            accessKey: "AKIA5Q3F5H22RKBV5EDK",
            secretKey: "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",
            successActionStatus: 201
        }

        RNS3.put(file, options).then(response => {
            if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
            console.log('_onProfileImageUpload ' + response.body);
            let source = response.body.postResponse.location;
            this._uploadGovtIdImage(source)
            // this.setState({ loading: false }, function () {
            //     // this._completeProfile(source)
            //     this._uploadGovtIdImage(source)
            // })
        });
    }

    _uploadGovtIdImage = (profileImageUrl) => {
        const { govtIdImageUrl, govtIdImage } = this.state;

        if (validator.isURL(govtIdImageUrl)) {
            this._completeProfile(profileImageUrl)
            return
        }

        var file = {
            uri: govtIdImageUrl,
            name: `${govtIdImage}`,
            type: "image/png"
        }
        // name: name + "_" + number + "image.png",

        const options = {
            keyPrefix: "uploads/",
            bucket: "offsureit",
            region: "us-east-1",
            accessKey: "AKIA5Q3F5H22RKBV5EDK",
            secretKey: "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",
            successActionStatus: 201
        }

        RNS3.put(file, options).then(response => {
            if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
            console.log('_uploadGovtIdImage --> ' + response.body);
            let source = response.body.postResponse.location;
            this.setState({ govtIdImageUrl: source, govtIdImage: response.body.postResponse.key })
            this._completeProfile(profileImageUrl)

            // let source = response.body.postResponse.location;
            // this.setState({ loading: false }, function () {
            //     this._completeProfile(source)
            // })
        });
    }

    _completeProfile = (photo) => {

        this.setState({ loading: true })
        const { number, name, email, selectedData, connected, instagram, sliderOneValue, govtIdImageUrl } = this.state;

        if (!connected) {
            this.setState({
                connectionError: SkillsData.internet.error.message,
                loading: false
            })
            return
        }

        var skills = []
        for (let selected of selectedData) {
            if (selected !== 'btnbtnbtn') {
                skills.push(selected);
            }
        }

        var profile = {
            'firstName': name,
            'email': email,
            'photos': photo,
            'govt_id': govtIdImageUrl,
            'genre': skills,
            'IGName': instagram,
            'defaultArea': sliderOneValue[0]
        };
        console.log('profile _completeProfile _completeProfile --> ' + JSON.stringify(profile));

        AsyncStorage.getItem(DatabaseKey.access_token).then((access_token) => {
            this._updateProfile(profile, access_token)
        }).done();
    }

    _updateProfile = (profile, access_token) => {

        webService.patch((Services.Url + Services.Self), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token,
        }, profile)
            .then((responseJson) => {
                console.log("Response is : " + JSON.stringify(responseJson));
                console.log((responseJson.code === Services.statusCodes.failure));
                this._saveUserProfile(profile, access_token);
            })
            .catch((error) => {
                if (error.status === Services.statusCodes.failure) {
                    error.json().then((err) => {
                        var index = Services.status.findIndex((status) => status.flag === error.flag);
                        console.log(index);
                        if (index > -1) {
                            this.setState({
                                loading: false,
                                logoutVisible: true,
                                alertMessage: Services.status[index].errorMesage
                            })
                        } 
                    });
                }
                console.error(JSON.stringify(error));
            });
    }

    _saveUserProfile = (user, access_token) => {
        const { profile } = this.state;
        const { action } = this.props;
        profile.firstName = user.firstName;
        profile.email = user.email;
        profile.photos = user.photos;
        profile.genre = user.genre;
        profile.IGName = user.IGName;
        profile.govt_id = user.govt_id;

        this.setState({
            loading: false
        }, function () {
            this._storeData(DatabaseKey.profile, JSON.stringify(profile));
            this._storeData(DatabaseKey.isProfileCompleted, "true");
            if (action) {
                switch (action) {
                    case Strings.TEXT_SAVE:
                        this._showToast('Profile updated successfully.')
                        break;
                    case Strings.TEXT_CONTINUE:
                        this._showToast("Profile created successfully.");
                        this.props.callback(access_token)
                        break;
                }
            } else {
                this._showToast("Profile created successfully.");
                this.props.callback(access_token)
            }

        })
    }

    _storeData = (key, value) => {
        AsyncStorage.setItem(key, value);
    }

    // _onProfileImageClick = () => {
    //     this._saveImageUri(true)
    // }

    // _saveImageUri = (isUserImage) => {
    //     var options = {
    //         title: 'Choose photo',
    //         quality: 1.0,
    //         maxWidth: 500,
    //         maxHeight: 500,
    //         storageOptions: {
    //             skipBackup: true,
    //             path: 'images'
    //         }
    //     };

    //     ImagePicker.showImagePicker(options, (response) => {
    //         console.log('Response = ', response);
    //         if (response.didCancel) {
    //             console.log('User cancelled image picker');
    //         }
    //         else if (response.error) {
    //             console.log('ImagePicker Error: ', response.error);
    //         }
    //         else if (response.customButton) {
    //             console.log('User tapped custom button: ', response.customButton);
    //         }
    //         else {
    //             console.log('response response response _saveImageUri --> ' + JSON.stringify(response))
    //             let source = { uri: response.uri };
    //             if (isUserImage) this.setState({ photo: source, photoUri: source.uri });
    //             else this.setState({ govtIdImage: response.fileName, govtIdImageUrl: source.uri });
    //         }
    //     });
    // }

    _keyExtractor = (item, index) => item;

    _onPressItem = (item) => {
        if (item === 'btnbtnbtn') {
            this._onAddPress()
            // this.setState({ skillsVisible: true, skillsError: '' })
        }
    };

    _onAddPress = () => {
        this.setState({ skillsVisible: true, skillsError: '' })
    };

    _renderItem = ({ item }) => (
        <Skills
            type={Type.SELECTED}
            inputStyles={{ width: (width / 3.50) }}
            onPressItem={this._onPressItem}
            selected={true}
            item={'' + item}
        />
    );

    _onCancelClick = (data) => {
        this.setState({ skillsVisible: false })
    }

    _onSubmitClick = () => {
        this.setState({ skillsVisible: false })
    }

    sliderOneValuesChangeStart = () => {
        this.setState({
            sliderOneChanging: true,
        });
    };

    sliderOneValuesChange = values => {
        let newValues = [0];
        newValues[0] = values[0];
        this.setState({
            sliderOneValue: newValues,
        });
    };

    sliderOneValuesChangeFinish = () => {
        this.setState({
            sliderOneChanging: false,
        });
    };

    render() {
        const { name, number, email, photo, nameError, emailError, instagramError,
            selectedData, skillsVisible, loading, connected, skillsError, connectionError,
            logoutVisible, alertMessage, action, instagram, sliderOneValue, govtIdImageUrl } = this.state;
        console.log('Selected data is ::: ' + selectedData);
        console.log('validator.isURL(JSON.stringify(govtIdImageUrl))is ::: ' + validator.isURL(JSON.stringify(govtIdImageUrl)));

        return (
            <View style={{ flexDirection: 'column', flex: 2 }}>
                <Loading loading={loading} />
                <SkillsAlert
                    callback={this.getSkills.bind(this)}
                    selectedItems={selectedData}
                    visible={skillsVisible}
                    onCalcelClick={this._onCancelClick}
                    onSubmitClick={this._onSubmitClick} />
                <OfflineNotice
                    visible={connected}
                    message={connectionError} />
                <AlertLogout
                    visible={logoutVisible}
                    message={alertMessage} />
                <ScrollView>
                    {/* <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center', flex: 0.5 }}>
                        <CircleImage
                            image={photo}
                            width={125}
                            height={125}
                            borderColor={'#FDA02A'}
                            borderWidth={3}
                            onClick={this._onProfileImageClick.bind(this)} />
                    </View> */}
                    <View style={{ flex: 1.5, padding: 10 }}>
                        <View style={{ flex: 1.35 }}>
                            <Fields
                                inputStyle={{ width: width - 50, color: 'black' }}
                                value={name}
                                name={Strings.TEXT_NAME + ' :'}
                                placeholder={Strings.TEXT_PLACEHOLDER_NAME}
                                callback={this.getUserName.bind(this)}
                                editable={true}
                                keyboard={'default'}
                                error={nameError} />

                            <Fields
                                inputStyle={{ width: width - 50, color: 'black' }}
                                length={13}
                                value={number}
                                name={Strings.TEXT_PHONE_NUMBER + ' :'}
                                callback={this.getUserNumber.bind(this)}
                                placeholder={Strings.TEXT_PLACEHOLDER_NUMBER}
                                editable={false}
                                keyboard={Platform.OS === 'ios' ? 'number-pad' : 'numeric'} />

                            <Fields
                                inputStyle={{ width: width - 50, color: 'black' }}
                                value={email}
                                name={Strings.TEXT_EMAIL + ' :'}
                                callback={this.getUserEmail.bind(this)}
                                placeholder={Strings.TEXT_PLACEHOLDER_EMAIL}
                                editable={true}
                                keyboard={'email-address'}
                                error={emailError} />

                            {/* <Label inputStyle={{ marginTop: 10 }}
                                visible={false}
                                name={"Upload Government Verified Id :"} />

                            <View style={{
                                margin: 10,
                                marginEnd: 20,
                                flexDirection: 'row',
                                borderBottomWidth: 0.5,
                                paddingBottom: 5,
                                borderBottomColor: '#000000',
                            }}>
                                <Text style={{
                                    fontSize: width * 0.05,
                                    color: '#4B4B4B',
                                    flex: .9
                                }} numberOfLines={1}>{this.state.govtIdImage}</Text>
                                <TouchableOpacity style={{ flex: .1 }}
                                    onPress={() => this._saveImageUri(false)}>
                                    <Image style={{ height: 16, width: 16, alignSelf: 'flex-end', marginEnd: 5 }}
                                        source={require('../resources/images/ic_upload.png')} />
                                </TouchableOpacity>
                            </View> */}

                            <Fields
                                inputStyle={{ width: width - 50, color: 'black' }}
                                value={instagram}
                                name={Strings.TEXT_INSTAGRAM + ' :'}
                                callback={this.getInstagramUserName.bind(this)}
                                placeholder={Strings.TEXT_PLACEHOLDER_INSTAGRAM}
                                editable={true}
                                keyboard={'default'}
                                error={instagramError} />

                            <Label
                                error={skillsError}
                                visible={true}
                                inputStyle={{ marginTop: 15, marginBottom: 0 }}
                                name={Strings.TEXT_SEARCH_RADIUS + '    ' + this.state.sliderOneValue + ' miles'} />

                            <View style={{ marginStart: 15, marginEnd: 20 }}>
                                <MultiSlider
                                    values={sliderOneValue}
                                    sliderLength={width - 60}
                                    min={5}
                                    max={100}
                                    step={1}
                                    unselectedStyle={{ backgroundColor: 'black' }}
                                    selectedStyle={{ backgroundColor: '#FDA02A' }}
                                    onValuesChangeStart={this.sliderOneValuesChangeStart}
                                    onValuesChange={this.sliderOneValuesChange}
                                    onValuesChangeFinish={this.sliderOneValuesChangeFinish}
                                />
                            </View>

                            <Label
                                error={skillsError}
                                visible={true}
                                inputStyle={{ marginTop: 8, marginBottom: 10 }}
                                name={Strings.TEXT_YOU_DO} />

                            {
                                (selectedData && selectedData.length > 0) ? (
                                    <FlatList
                                        style={{ marginLeft: 8 }}
                                        numColumns={3}
                                        data={selectedData}
                                        extraData={this.state}
                                        keyExtractor={this._keyExtractor}
                                        renderItem={this._renderItem} />
                                ) :
                                    <TouchableOpacity
                                        style={{ alignItems: 'flex-start', marginTop: 3, marginLeft: 8 }}
                                        onPress={this._onAddPress}
                                        activeOpacity={1}>
                                        <Image
                                            source={addButton}
                                            style={{ height: width / 10, width: width / 10 }} />
                                    </TouchableOpacity>
                            }

                        </View>
                        <View style={{ flex: 0.15, padding: 10 }}>
                            <CreateProfile
                                onClick={this._onCreateProfileClick.bind(this)}
                                action={action} />
                        </View>
                    </View>
                </ScrollView>
                <Toast ref="toast" position={this.state.position} positionValue={180} />
            </View>
        );
    }

    restrict(event) {
        // const regex = new RegExp('/^[^!-\/:-@\[-`{-~]*$/');
        // const regex = new RegExp("^[a-zA-Z]+$");

        const numbers = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
        const key = String.fromCharCode(!event.nativeEvent.key ? event.which : event.nativeEvent.key);
        var index = insta.findIndex((number) => number === key);
        alert('' + index);
        if (index > -1) {
            event.preventDefault();
            return false;
        } else {
            return true;
        }

        // alert('' + JSON.stringify(event.nativeEvent));

        // if (regex.test(key)) {
        //     event.preventDefault();
        //     return false;
        // }
    }

    _fetchUserProfile() {
        AsyncStorage.getItem(DatabaseKey.profile).then((profile) => {
            this._updateUserProfileDetails(profile)
        }).done();
    }

    _updateUserProfileDetails = (profile) => {
        var jsonObject = JSON.parse(profile)
        console.log("Profile image is : " + JSON.stringify(jsonObject))
        this.setState({ profile: jsonObject })

        // let imageName = jsonObject.govt_id == '' ? '' : jsonObject.govt_id.split('%')
        // this.setState({
        //     number: jsonObject.countryCode + jsonObject.phone,
        //     name: jsonObject.firstName,
        //     email: jsonObject.email,
        //     photo: jsonObject.photos === '' ? '' : { uri: jsonObject.photos },
        //     selectedData: jsonObject.genre ? jsonObject.genre : [],
        //     selectedItems: jsonObject.genre ? jsonObject.genre : [],
        //     instagram: jsonObject.IGName ? jsonObject.IGName : '',
        //     sliderOneValue: ('defaultArea' in jsonObject) ? [jsonObject.defaultArea] : [25],
        //     govtIdImage: imageName[imageName.length - 1],
        //     govtIdImageUrl: jsonObject.govt_id
        // })

        this.setState({
            number: jsonObject.countryCode + jsonObject.phone,
            name: jsonObject.firstName,
            email: jsonObject.email,
            selectedData: jsonObject.genre ? jsonObject.genre : [],
            selectedItems: jsonObject.genre ? jsonObject.genre : [],
            instagram: jsonObject.IGName ? jsonObject.IGName : '',
            sliderOneValue: ('defaultArea' in jsonObject) ? [jsonObject.defaultArea] : [25],
        });
        this._setSelectedSkills();
    }

    _setSelectedSkills = () => {
        const { selectedData } = this.state;
        console.log("selectedData is : " + selectedData)

        var btn = 'btnbtnbtn';
        selectedData.push(btn);
        console.log("selectedData fvvevv is : " + selectedData)
        this.setState({ selectedData });
    }

    _showToast = (message) => {
        this.refs.toast.show(message, DURATION.LENGTH_LONG)
    }
}