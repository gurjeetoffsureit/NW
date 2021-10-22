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

const placeholder = require('../resources/images/no_image.jpg')
const { width } = Dimensions.get('window');

export default class itemCart extends PureComponent {

    state = {
        day: '',
        closed: false,
    }

    _onItemPress = () => {
        const { closed } = this.state;
        const { onPressItem, item } = this.props;
        // var type = AppData.Clicked.Switch;
        // if (!closed) {
        //     type = AppData.Clicked.Switch;
        // } else {
        //     type = AppData.Clicked.Closed;
        // }
        onPressItem(item.studio_id, AppData.Clicked.Switch);
    }

    onCallClicked = () => {
        const { onPressItem, item } = this.props;
        onPressItem(item._id, AppData.Clicked.Call);
    }

    render() {
        const { item, day } = this.props;
        console.log('Studio day  is : ' + day);
        console.log('Studio day  service_fee : ' + item.service_fee);
        // var closed = true;
        // if (item.workingDays.length > 0) {
        //     var index = item.workingDays.findIndex((days) => days.day === day);
        //     console.log('Studio day  is : ' + index);
        //     if (index > -1) {
        //         closed = item.workingDays[index].closed
        //     }
        // }
        const premium = styles.textPremium;
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
                        (item.studio_image === '') ? placeholder :
                            { uri: Services.Url + Services.Media + item.studio_image }
                    } />
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text numberOfLines={2}
                        ellipsizeMode='tail'
                        style={[styles.label, { marginTop: 8 }]}>{item.studio_name}</Text>

                    <Text numberOfLines={2}
                        ellipsizeMode='tail'
                        style={{
                            color: '#000000', flex: 1,
                            marginLeft: 10, fontSize: width * 0.03, marginTop: 3
                        }}>{item.address}</Text>

                    <View style={{
                        flex: 1, flexDirection: 'row',
                        paddingLeft: 5, alignItems: 'center',
                        marginTop: 3, marginBottom: 10
                    }} >
                        <View style={{ flex: 0.8, flexDirection: 'row', marginTop: 10 }}>
                            {item.premium && <Text style={premium}>{String.TEXT_PREMIUM}</Text>}
                            {item.verified && <Text style={premium}>{String.TEXT_VERIFIED}</Text>}
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
        );
    }
}