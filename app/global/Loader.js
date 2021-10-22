import React, {Component} from 'react';
import {
    View,
    ActivityIndicator,
    Modal,
} from 'react-native'
import styles from '../resources/styles/Styles'

export default class Loader extends Component {
    render () {
        const { loading } = this.props;
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={loading}
                onRequestClose={() => {console.log('close modal')}}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator
                         animating={loading} />
                    </View>    
                </View>
            </Modal>
        );
    }
}