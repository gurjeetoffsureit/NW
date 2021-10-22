import {
    StyleSheet,
} from 'react-native';

import Dimensions from 'Dimensions';
import Font from './Font';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
// your brand's theme primary color
const brandColor = '#744BAC';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    imageWallpaper: {
        resizeMode: 'contain',
    },
    textSignIn: {
        textAlign: 'center',
        fontSize: Font.Large,
        color: '#4B4B4B'
    },
    textDesc: {
        textAlign: 'center',
        fontSize: Font.Xlarge,
        color: '#B5B5B5',
        marginTop: 20
    },
    textPhone: {
        textAlign: 'left',
        fontSize: Font.Large,
        color: '#4B4B4B',
        marginTop: 50,
        marginLeft: 30
    },
    containerNumber: {
        flexDirection: 'row',
        paddingLeft: 30,
        paddingRight: 30,
    },
    codeContainer: {
        width: 50,
        height: 40,
        alignItems: 'center',
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#4B4B4B',
    },
    textInputNumber: {
        flex: 1,
        marginLeft: 10,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
    },
    textCode: {
        fontSize: 18,
        color: '#252B33',
        marginTop: 7
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        height: 40,
        borderRadius: 8,
        zIndex: 100,
    },
    open: {
        flex: 0.2,
        textAlign: 'center',
        alignSelf: 'center',
        backgroundColor: '#000000',
        color: '#FDA02A',
        borderRadius: 4,
        fontSize: Font.Small,
        padding: 3,
        marginRight: 10,
        overflow: 'hidden'
    },
    buttonVerify: {
        flex: 0.5,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 30
    },
    buttonResend: {
        flex: 0.5,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 30,
        marginLeft: 10,
        borderColor: '#000000',
        backgroundColor: '#FFFFFF',
        borderWidth: 2
    },
    textBorderUnselected: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#B5B5B5',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        height: 30,
        padding: 5,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 5,
        borderRadius: 20,
        zIndex: 100,
    },
    textBorderSelected: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: 'transparent',
        height: 30,
        padding: 3,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 5,
        borderRadius: 20,
        zIndex: 100,
    },
    textSelected: {
        fontSize: Font.Small,
        color: '#FDA02A',
        backgroundColor: 'transparent',
    },
    textUnselected: {
        fontSize: Font.Small,
        color: '#B5B5B5',
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: Font.Large,
        color: '#FDA02A',
        backgroundColor: 'transparent',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        padding: 3,
        marginTop: 3,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#000000',
        fontSize: Font.Large,
        color: '#4B4B4B'
    },
    shareInput: {
        padding: 3,
        marginTop: 3,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#000000',
        fontSize: Font.Large,
        color: '#4B4B4B'
    },
    textInput: {
        padding: 0,
        margin: 0,
        flex: 1,
        fontSize: 20,
        color: brandColor
    },
    noData: {
        alignSelf: 'center',
        color: '#4B4B4B',
        fontSize: Font.Large,
        marginLeft: 10,
        marginRight: 3,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    label: {
        color: '#4B4B4B',
        fontSize: Font.Large,
        marginLeft: 10,
        marginRight: 3,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    modalBackgroundSkillsAlert: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    backgroundSkillsAlert: {
        backgroundColor: '#FFFFFF',
        height: height / 1.5,
        width: width - 25,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'space-around'
    },
    backgroundLogoutAlert: {
        backgroundColor: '#FFFFFF',
        height: height / 3,
        width: width - 25,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'space-around'
    },
    backgroundCardDetails: {
        backgroundColor: '#FFFFFF',
        width: width - 25,
        // width: width,
        // height: height / 2,
        borderRadius: 10,
        paddingTop: 20,
        display: 'flex',
        justifyContent: 'space-around'
    },
     backgroundAddCardDetails: {
        backgroundColor: 'black',
        // width: width - 25,
        width: width,
        height: height,
        borderRadius: 10,
        paddingTop: 20,
        display: 'flex',
        justifyContent: 'space-around'
    },
    cardLabel: {
        color: "black",
        fontSize: 12,
    },
    cardInput: {
        fontSize: 16,
        color: "black",
    },
    modalBackgroundStudioItems: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    backgroundStudioItems: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 5,
        marginRight: 10,
        marginLeft: 10,
        borderColor: '#FDA02A',
        backgroundColor: '#000000',
        borderWidth: 0.5,
        borderRadius: 8,
        zIndex: 100,
        overflow: 'hidden'
    },
    backgroundRoomsItems: {
        marginTop: 5,
        marginBottom: 5,
        marginRight: 10,
        marginLeft: 10,
        zIndex: 100,
        overflow: 'hidden'
    },
    textPremium: {
        borderWidth: 1,
        marginLeft: '4%',
        borderColor: 'gray',
        borderRadius: 5,
        alignSelf: 'center',
        fontSize: Font.Small,
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingTop: 3,
        paddingBottom: 3,
        color: 'white',
        fontWeight: '600',
        backgroundColor: 'gray',
        overflow: 'hidden'
    },
    textVerified: {
        marginLeft: 10,
        borderWidth: 0.5,
        borderColor: '#4B4B4B',
        alignSelf: 'center',
        borderRadius: 5,
        fontSize: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingBottom: 3,
        color: 'black',
        overflow: 'hidden'
    },
    modalDropDown: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        width,
        paddingTop: 50,
        backgroundColor: '#00000040'
    },
    modalSearch: {
        alignItems: 'center',
        flexDirection: 'column',
        width,
        height: 500,
        backgroundColor: '#00000040'
    },
    backgroundModalDropDown: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderRadius: 5,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    labelDropDown: {
        color: '#4B4B4B',
        paddingTop: 10,
        fontSize: Font.Medium,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    addressDropDown: {
        color: '#4B4B4B',
        fontSize: Font.Small,
        marginTop: 5,
        textAlign: 'left',
    },
    studioRoomsContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    textHeader: {
        fontSize: Font.Large,
        color: '#FDA02A',
        marginStart: 5
    },
    textHeaderRight: {
        fontSize: Font.Medium,
        color: '#FDA02A',
        marginStart: 5
    },
    textPriceValue: {
        fontSize: 18,
        start: 0,
        color: '#A1A1A1'
    },
    textTime: {
        fontSize: 16,
        color: '#252B33'
    },
    statusClosed: {
        flex: 0.2,
        textAlign: 'center',
        alignSelf: 'center',
        backgroundColor: 'black',
        color: '#FFFFFF',
        borderRadius: 4,
        fontSize: 12,
        padding: 3,
        marginRight: 10,
        overflow: 'hidden'
    },
    keyboardAvoidingViewStyle: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    completeViewTouchableOpacity: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(52, 52, 52, 0.0)'
    },
    textInputOuterView: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: 10,
        marginBottom: 10,

    },
    textInputNotes: {

        backgroundColor: '#ffffff',
        paddingLeft: 10,
        paddingRight: 10
    },
     calendar: {
        borderBottomWidth: 0.5,
        borderColor: '#FDA02A'
    },
    // text: {
    //     textAlign: 'center',
    //     borderColor: '#bbb',
    //     padding: 10,
    //     backgroundColor: '#eee'
    // },
    // container: {
    //     flex: 1,
    //     backgroundColor: 'gray'
    // },
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