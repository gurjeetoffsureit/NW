import React, { PureComponent } from 'react';
import {
    Text,
    Image,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Services from '../constants/WebServices'
import styles from '../resources/styles/Styles'
import String from '../resources/string/Strings'
import AppData from '../constants/AppData'
import Font from '../resources/styles/Font'

const placeholder = require('../resources/images/no_image.jpg');
const call = require('../resources/images/call_icon.png');
const { width } = Dimensions.get('window');

export default class ItemStudios extends PureComponent {

    state = {
        day: '',
        open: false,
    }

    _onItemPress = () => {
        const { onPressItem, item } = this.props;
        onPressItem(item._id, AppData.Clicked.Switch);
    }

    onCallClicked = () => {
        const { onPressItem, item } = this.props;
        onPressItem(item._id, AppData.Clicked.Call);
    }

    render() {
        const { item, day } = this.props;
        console.log('Studio day  is : ' + JSON.stringify(item));
        console.log('Studio day  is : ' + item.workingDays.length);

        var closed = true;
        if (item.workingDays.length > 0) {
            var index = item.workingDays.findIndex((days) => days.day === day);
            console.log('Studio day  is : ' + index);
            if (index > -1) {
                closed = item.workingDays[index].closed
            }
        }

        const premium = styles.textPremium;
        const verified = styles.textVerified;
        const status = styles.open;
        return (
            <TouchableOpacity style={styles.backgroundStudioItems}
                onPress={this._onItemPress}>
                <Image
                    style={
                        {
                            width: width / 3.5,
                            height: '100%',
                            padding: 0.5,
                            borderBottomLeftRadius: 8,
                            borderTopLeftRadius: 8
                        }
                    }
                    source={
                        (item.image === '') ? placeholder :
                            { uri: Services.Url + Services.Media + item.image }
                    }
                />
                <View style={{ flexDirection: 'column', flex: 1 }}>

                    <View style={{ flexDirection: 'row' }}>
                        <Text numberOfLines={2}
                            ellipsizeMode='tail'
                            style={[styles.label, { marginTop: 8, flex: 1 }]}>{item.name}</Text>

                        <View style={{
                            marginTop: 8, width: Font.Xlarge, height: Font.Xlarge,
                            borderRadius: Font.Xlarge / 2, backgroundColor: '#000000', overflow: 'hidden',
                            justifyContent: 'center', marginRight: 20, alignItems: 'center'
                        }}>
                            <Text style={{
                                color: '#FDA02A', fontSize: Font.Medium, alignSelf: 'center',
                                fontWeight: 'bold'
                            }}
                                numberOfLines={1}>{item.activeRooms}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                        <Image
                            style={{
                                height: 15, width: 15, marginLeft: 10
                            }}
                            source={require('../resources/images/location_icon.png')} />
                        <Text numberOfLines={2}
                            ellipsizeMode='tail'
                            style={{
                                color: '#000000', flex: 1,
                                marginLeft: 3, fontSize: Font.Small, fontWeight: '500',
                                marginRight: 3
                            }}>{item.address}</Text>
                    </View>
                    <View style={{
                        flex: 1, flexDirection: 'row',
                        paddingLeft: 5, alignItems: 'center',
                        marginTop: 3, marginBottom: 10
                    }} >
                        <View style={{ flex: 0.7, flexDirection: 'row', marginTop: 5 }}>
                            {item.premium && <Text style={premium}>{String.TEXT_PREMIUM}</Text>}
                            {item.verified && <Text style={premium}>{String.TEXT_VERIFIED}</Text>}
                        </View>
                        {!closed &&
                            <TouchableOpacity
                                style={{ flex: 0.3, paddingTop: 5 }}
                                onPress={this.onCallClicked}>
                                <Image
                                    source={call} />
                            </TouchableOpacity>
                        }

                    </View>
                </View>
            </TouchableOpacity >
        );
    }
}