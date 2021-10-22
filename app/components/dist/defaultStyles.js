import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
    },
    otpContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 6,
        borderWidth: 1,
        height: 53,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpInput: {
        color: '#4B4B4B',
        fontSize: width * 0.06,
        paddingTop: 10,
        textAlign: 'center',
        width: width / 10,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#4B4B4B',
        alignSelf: 'center'
    },
    inputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 25,
        marginVertical: 20,
    },
    errorMessageContainer: {
        marginHorizontal: 25,
    },
});
//# sourceMappingURL=defaultStyles.js.map