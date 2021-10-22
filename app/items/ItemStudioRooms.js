import React, { PureComponent } from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Services from '../constants/WebServices';
import String from '../resources/string/Strings';
import Font from '../resources/styles/Font';
import Styles from '../resources/styles/Styles';

const { width, height } = Dimensions.get('window');

const loading = require('../resources/images/no_image.jpg');
const video = require('../resources/images/video_icon.png');

export default class ItemStudioRooms extends PureComponent {

    _onItemPress = () => {
        const { onPressItem, item } = this.props;
        onPressItem(item._id);
    }

    _onVideoPress = () => {
        const { onVideoPress, item } = this.props;
        onVideoPress(item.videoLink);
    }

    getTimeZone = (item) => {
        var timeZoneShort = ""

        if (item.studio.timeZone == undefined)
            return timeZoneShort

        var timeZone = item.studio.timeZone.timeZoneName
        let matches = timeZone.match(/\b(\w)/g);
        timeZoneShort = `(${matches.join('')})`;
        console.log("Time zone is ::: " + timeZoneShort)
        return timeZoneShort
    }

    render() {
        const { item } = this.props;
        const premium = styles.textPremium;
        const verified = styles.textVerified;
        var timeZone = this.getTimeZone(item)
        return (
            <TouchableOpacity onPress={this._onItemPress} style={Styles.backgroundRoomsItems}>
                <ImageBackground
                    style={styles.imageItem}
                    source={loading}>
                    < Image style={{ height: '100%', width: '100%' }}
                        source={(item.images.length > 0) && {
                            uri: Services.Url + Services.Media + item.images[0]
                        }} />
                </ImageBackground>
                <View style={{
                    flexDirection: 'row', padding: 5, backgroundColor: '#000000',
                    borderColor: '#FDA02A', borderWidth: 0.5, overflow: 'hidden'
                }}>
                    <View style={{
                        backgroundColor: '#000000', padding: 8,
                        borderRadius: 5, overflow: 'hidden',
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Text style={[styles.textstudiName,
                        { color: '#FDA02A', textAlign: 'center', fontSize: 24, }
                        ]}>${
                                ('pricing' in item) ?
                                    item.pricing[0].price
                                    : item.price ? item.price : 0
                            }</Text>
                        <Text style={[styles.textTime, { color: '#FDA02A', textAlign: 'center' }]}>
                            {String.TEXT_PER_SESSION}</Text>
                    </View>
                    <View style={{ paddingStart: 5, paddingTop: 5, paddingBottom: 3, flex: 1 }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text style={[styles.textstudiName, { flex: 1, color: '#FFFFFF' }]}
                                numberOfLines={2}
                                ellipsizeMode='tail'>{item.name}</Text>
                            {('videoLink' in item) && item.videoLink !== '' && <TouchableOpacity onPress={this._onVideoPress}>
                                < Image style={{ height: 15, width: 30, marginRight: Font.Small }}
                                    source={video} />
                            </TouchableOpacity>}
                        </View>
                        <Text style={[styles.textstudiName, {
                            flex: 1, fontSize: 14, marginTop: 3, marginBottom: 3, color: '#FFFFFF'
                        }]}
                            numberOfLines={1}
                            ellipsizeMode='tail'>{item.studio.name} {(timeZone)}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {item.premium && <Text style={premium}>{String.TEXT_PREMIUM}</Text>}
                            {item.verified && <Text style={premium}>{String.TEXT_VERIFIED}</Text>}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    imageItem: {
        height: height / 3,
        width: '100%',
        marginTop: 10,
    },
    textPriceValue: {
        fontSize: 18,
        flex: 0.3,
        start: 0,
        color: '#A1A1A1'
    },
    textstudiName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A4A4A',
    },
    textTime: {
        fontSize: 10,
        alignSelf: 'center',
        color: '#252B33'
    },
    textPremium: {
        borderWidth: 1,
        marginStart: 5,
        marginTop: 3,
        borderColor: 'gray',
        borderRadius: 3,
        fontSize: 12,
        paddingStart: 5,
        paddingEnd: 5,
        color: 'white',
        fontWeight: '600',
        backgroundColor: 'gray',
        overflow: 'hidden'
    },
    textVerified: {
        marginStart: 5,
        marginTop: 5,
        borderWidth: 0.5,
        borderColor: '#4B4B4B',
        alignSelf: 'center',
        borderRadius: 3,
        fontSize: 12,
        paddingStart: 5,
        paddingEnd: 5,
        color: 'black',
        overflow: 'hidden'
    },
});