
import React, { PureComponent } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';

export default class Footer extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            home: true,
            booking: false,
            mic: false,
            profile: false
        };
    }

    _onHomeClick = () => {
        this.setState({
            home: true,
            booking: false,
            mic: false,
            profile: false
        })
        this.props.callback('home');
    }

    _onBookingClick = () => {
        this.setState({
            home: false,
            booking: true,
            mic: false,
            profile: false
        })
        this.props.callback('booking');
    }

    _onMicClick = () => {
        this.setState({
            home: false,
            booking: false,
            mic: true,
            profile: false
        })
        this.props.callback('mic');
    }

    _onProfileClick = () => {
        this.setState({
            home: false,
            booking: false,
            mic: false,
            profile: true
        })
        this.props.callback('profile');
    }

    onFooterItemClick = (item) => {

        this.setState({
            home: false,
            booking: false,
            mic: false,
            profile: false
        }, function () {

        });

    }

    render() {
        const { home, booking, mic, profile } = this.state;
        return (
            <View style={styles.bottomTabView} >
                <TouchableOpacity style={styles.footerItem}
                    onPress={this._onHomeClick}>
                    <Image
                        style={{ tintColor: (home) ? '#000000' : '#FFFFFF' }}
                        source={require('../resources/images/ic_home_blck.png')}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.footerItem}
                    onPress={this._onBookingClick}>
                    <Image
                        style={{ tintColor: (booking) ? '#000000' : '#FFFFFF' }}
                        source={require('../resources/images/ic_booking_black.png')}
                    />
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.footerItem}
                    onPress={this._onMicClick}>
                    <Image
                        style={{ tintColor: (mic) ? '#000000' : '#CDCECF' }}
                        source={require('../resources/images/mic_icon_gray.png')}
                    />
                </TouchableOpacity> */}

                <TouchableOpacity style={styles.footerItem}
                    onPress={this._onProfileClick}>
                    <Image
                        style={{ tintColor: (profile) ? '#000000' : '#FFFFFF' }}
                        source={require('../resources/images/ic_profile_black.png')}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDA02A'
    },
    bottomTabView: {
        flex: 1,
        height: 50,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FDA02A',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 1,
        marginRight: 5,
        marginTop: 10,
    },
    footerItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
})