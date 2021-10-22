import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');

export default class OfflineNotice extends PureComponent {
    render() {
        const { message, visible } = this.props;
        console.log("Visibility is : " + visible);
        if (visible) {
            return null;
        }
        return (
            <View style={styles.offlineContainer} visible={visible} >
                <Text style={styles.offlineText}>{message}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        position: 'absolute',
    },
    offlineText: {
        color: '#fff'
    }
});
