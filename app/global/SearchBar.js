import React, { PureComponent } from 'react'
import {
    View,
    Modal,
    TextInput,
    Image,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native'

import styles from '../resources/styles/Styles'

export default class SearchBar extends PureComponent {

    state = {
        text: ''
    }

    onTextChange = (text) => {
        const { onChange } = this.props;
        this.setState({ text })
        onChange(text)
    }

    onCloseClick = () => {
        const { onClose, onClearSearch } = this.props;
        this.setState({ text: '' })
        onClearSearch();
        onClose(false);
    }

    onOutsideCick = () => {
        const { onClose } = this.props;
        onClose(false)
    }

    render() {
        const { visible } = this.props;
        const { text } = this.state;
        return (
            <View  >
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={visible}
                    onRequestClose={() => { this.onOutsideCick }}>
                    <TouchableHighlight
                        style={[styles.modalSearch, { paddingTop: 0, backgroundColor: 'transparent' }]}
                        onPress={this.onOutsideCick}>
                        <TouchableHighlight style={{
                            width: '100%', marginTop: 20,
                            padding: '2%', backgroundColor: '#000000'
                        }}
                            onPress={this.onOutsideCick}>
                            <View style={{
                                backgroundColor: 'white', overflow: 'hidden',
                                borderColor: '#4B4B4B', borderRadius: 5, justifyContent: 'center',
                                flexDirection: 'row', alignItems: 'center'
                            }} >
                                <TextInput
                                    style={{
                                        width: '90%', height: 40, alignSelf: 'flex-start',
                                        paddingLeft: '2%', paddingRight: '2%'
                                    }}
                                    onChangeText={(text) => this.onTextChange(text)}
                                    value={text}
                                    autoFocus={true}
                                    placeholder={'Search'} />
                                <TouchableOpacity
                                    style={{
                                        height: 20, width: 15,
                                        alignItems: 'center', justifyContent: 'center'
                                    }}
                                    onPress={this.onCloseClick}>
                                    <Image style={{ height: 12, width: 12 }}
                                        source={require('../resources/images/cross.png')} />
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </TouchableHighlight>
                </Modal>
            </View >
        );
    }
}