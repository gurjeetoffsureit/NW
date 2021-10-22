import React, { PureComponent } from 'react';
import {
    Modal,
    View,
    FlatList,
    ImageBackground,
    Text,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import styles from '../resources/styles/Styles'
import Strings from '../resources/string/Strings'
import Submit from '../global/UserAction'
import Skills from '../items/SkillItems'
import update from 'react-addons-update'
import DatabaseKey from '../constants/DatabaseKeys'
import webService from '../global/WebServiceHandler'
import Services from '../constants/WebServices'
import Loading from '../global/Loader'
const { width } = Dimensions.get('window');

export default class AlertSkills extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            visible: this.props.visible,
            loading: false,
        }
    }

    _keyExtractor = (item, index) => item._id;

    _onPressItem = (name) => {
        const { data } = this.state;
        var index = data.findIndex((item) => item.name === name)
        console.log(index)
        if (index > -1) {
            var item = data[index];
            item.selected = !item.selected;
            const updatedItem = update(data, { $splice: [[index, item]] });
            this.setState({
                data: updatedItem,
            })
        }
    };

    _renderItem = ({ item }) => (
        <Skills
            inputStyles={{ width: (width / 3.80) }}
            id={item._id}
            onPressItem={this._onPressItem}
            selected={item.selected}
            item={item.name} />
    );

    _updateData = () => {
        const { data } = this.state;
        const { selectedItems } = this.props;
        console.log(selectedItems);
        console.log(data.length);
        if (data.length > 0) {
            for (let item of data) {
                if (selectedItems.length > 0) {
                    var index = selectedItems.findIndex((name) => name === item.name);
                    if (index > -1) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                    const updatedItem = update(data, { $splice: [[index, item]] });
                    this.setState({
                        data: updatedItem,
                    })
                }
            }
        }
        this.setState({ loading: false })
    }

    _cancelPress = () => {
        const { data } = this.state;
        const { selectedItems } = this.props;
        this.setState({ visible: false })
        if (selectedItems.length > 0) {
            for (let item of data) {
                var index = selectedItems.findIndex((name) => name === item.name);
                if (index > -1) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
                const updatedItem = update(data, { $splice: [[index, item]] });
                this.setState({
                    data: updatedItem,
                })
            }
        } else {
            for (let item of data) {
                item.selected = false;
                const updatedItem = update(data, { $splice: [[index, item]] });
                this.setState({
                    data: updatedItem,
                })
            }
        }
        this.props.onCalcelClick();
    }

    _submitClick = () => {
        const { data } = this.state;
        const { selectedItems } = this.props;
        console.log('selectedItems is :::' + selectedItems);
        if (selectedItems && selectedItems.length > 0)
            selectedItems.splice(0, selectedItems.length);
        console.log('Data is :::' + JSON.stringify(data));
        for (let item of data) {
            if (item.selected) {
                selectedItems.push(item.name);
                item.selected = !item.selected;
                var index = data.indexOf(item);
                const updatedItem = update(data, { $splice: [[index, item]] });
                this.setState({
                    data: updatedItem,
                })
            }
        }

        console.log('Data selectedItems is :::' + JSON.stringify(selectedItems));
        const { callback } = this.props;
        callback(selectedItems)
        this.setState({ visible: false })
    }

    fetchGenre = (access_token) => {
        webService.get((Services.Url + Services.App + Services.Genre), {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
        }, {}).then((responseJson) => {
            console.log("Genre response Alert : " + JSON.stringify(responseJson));
            this.setState({ loading: false })
            var data = [];
            for (let item of responseJson.data) {
                var genre = {
                    'name': item.name,
                    '_id': item._id,
                    'selected': false
                }

                data.push(genre)
            }
            this.setState({ data }, function () {
                this._updateData();
            })
            console.log("Genre response Alert : " + JSON.stringify(data));
        })
            .catch((error) => {
                this._showToast(error)
                console.error(error);
            });
    }

    componentDidMount() {
        console.log('called')
        this.setState({ loading: true }, function () {
            AsyncStorage.getItem(DatabaseKey.access_token).then((access_token) => {
                this.fetchGenre(access_token)
            }).done();
        })
    }
    componentWillReceiveProps() {
        this._updateData();
    }

    render() {
        const { visible } = this.props;
        const { data, loading } = this.state;
        return (
            <View>
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={visible}
                    onRequestClose={() => { console.log('close modal') }}>
                    <View style={styles.modalBackgroundSkillsAlert}>
                        <View style={styles.backgroundSkillsAlert}>
                            <Loading loading={loading} />
                            <View style={{ flex: 3, flexDirection: 'column' }}>
                                <View style={{ flex: 0.3, flexDirection: 'row' }}>
                                    <View style={{ flex: 0.1 }} />
                                    <Text style={{
                                        flex: 0.8, alignSelf: 'center', textAlign: 'center',
                                        fontSize: 18, color: 'black', fontWeight: 'bold'
                                    }}>{Strings.TEXT_YOU_DO}</Text>
                                    <TouchableOpacity style={{ flex: 0.1, padding: 5, marginTop: 5, alignItems: 'center' }}
                                        onPress={this._cancelPress}>
                                        <ImageBackground style={{ height: 15, width: 15, }}
                                            source={require('../resources/images/cross.png')} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 2.2 }}>
                                    <FlatList
                                        style={{ marginLeft: 5, marginRight: 5, padding: 5 }}
                                        numColumns={3}
                                        data={data}
                                        extraData={this.state}
                                        keyExtractor={this._keyExtractor}
                                        renderItem={this._renderItem} />
                                </View>
                                <View style={{ flex: 0.5 }}>
                                    <Submit
                                        inputStyles={{ margin: 15 }}
                                        onClick={this._submitClick}
                                        action={Strings.TEXT_SUBMIT} />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}