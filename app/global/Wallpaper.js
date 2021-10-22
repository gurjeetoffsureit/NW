import React, {Component} from 'react';
import {
    Image,
    View
} from 'react-native';

import styles from '../resources/styles/Styles'

import logo from '../resources/images/logo.png';

export default class Wallpaper extends Component {

    constructor(props){
        super(props)
    }

    render(){

        const { flex, image , inputStyle} = this.props;

        return(
            <View style={
                {
                    flex: flex,
                    backgroundColor: '#FFFFFF',
                    alignItems: 'center',
                    justifyContent:'center',
                }
            }>
            <Image style={[
                styles.imageWallpaper, inputStyle
            ]
            } source={image} />
            </View>
        );
    }
}