import React, { PureComponent } from 'react'
import {
    View,
    FlatList,
    Modal,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions
} from 'react-native';

import styles from '../resources/styles/Styles'
import Items from '../items/ItemDropDown'

const { width } = Dimensions.get('window');

export default class DropDown extends PureComponent {

    setModalVisible = () => {
        this.props.callback(false)
    }

    _keyExtractor = (item, index) => item._id;

    _renderItem = ({ item }) => (
        <Items
            id={item._id}
            onPressItem={this._onPressItem}
            selected={item.selected}
            currentLocation={this.props.currentLocation}
            item={item} />
    );

    _onPressItem = (id) => {
        this.props.itemSelected(id);
        this.setModalVisible()
    };

    render() {
        const { visible, data, location } = this.props;
        return (
            <View  >
                {
                    <Modal
                        transparent={true}
                        animationType={'none'}
                        visible={visible}
                        onRequestClose={() => { console.log('close modal') }}>
                        <View style={styles.modalDropDown}>
                            <TouchableHighlight
                                style={{ flex: 1, width: width - 20 }}
                                onPress={this.setModalVisible}>
                                <View style={[styles.backgroundModalDropDown,
                                { height: '50%', width: '100%' }]}>
                                    <FlatList
                                        style={{ margin: 10 }}
                                        data={data}
                                        extraData={this.state}
                                        keyExtractor={this._keyExtractor}
                                        renderItem={this._renderItem} />
                                </View>
                            </TouchableHighlight>
                        </View>
                    </Modal>
                }
            </View >
        );
    }
}