import React, { Component } from 'react';
import {
    Image,
    TouchableOpacity
} from 'react-native';

const placeholder = require('../resources/images/photoIcon.png');

export default class CircleImage extends Component {

    render() {
        const { image, onClick, borderColor, borderWidth, width, height } = this.props;
        console.log("Border width :"+borderWidth)
        return (
            <TouchableOpacity
                onPress={onClick}
                activeOpacity={1}>
                <Image
                    source={
                        image === '' ?
                            placeholder : image
                    }
                    style={{
                        width: width,
                        height: height,
                        borderRadius: width / 2,
                        borderWidth: borderWidth,
                        borderColor: borderColor
                    }} />
            </TouchableOpacity>
        );
    }
}