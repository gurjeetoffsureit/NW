import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert } from 'react-native';

export default class DummyModal extends Component {


    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={true}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={{ marginTop: 22,backgroundColor:'red' }}>
                    <View>
                        <Text>Hello World!</Text>

                        <TouchableHighlight
                            onPress={() => {
                                //   this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <Text>Hide Modal</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}