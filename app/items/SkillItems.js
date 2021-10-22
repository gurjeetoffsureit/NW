import React, { PureComponent } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';
import styles from '../resources/styles/Styles';
import addButton from '../resources/images/add_tag_ic.png';
import { Type } from '../enum/ViewType';

const { width } = Dimensions.get('window');

export default class SkillItems extends PureComponent {

    _onPress = () => {
        this.props.onPressItem(this.props.item);
    };

    render() {
        const { item, type, selected } = this.props;
        console.log('Item is ::: ' + item);
        return (
            <View>
                {
                    item === 'btnbtnbtn' ? (
                        (type === Type.SELECTED) && this.renderAddButton()
                    ) : (
                            type === Type.SELECTED ? (
                                selected && this.renderItemView()
                            ) : (
                                    this.renderItemView()
                                )
                        )
                }
            </View>
        );
    }

    renderItemView() {
        const { item, inputStyles, selected } = this.props;
        const textStyles = selected ? styles.textSelected : styles.textUnselected;
        const borderStyle = selected ? styles.textBorderSelected : styles.textBorderUnselected;
        // alert(item)
        return (
            <TouchableOpacity
                style={[borderStyle, inputStyles]}
                onPress={this._onPress}
                activeOpacity={1}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={[styles.text, textStyles]}>
                    {item}
                </Text>
            </TouchableOpacity>
        );
    }

    renderAddButton() {
        return (
            <TouchableOpacity
                style={{ alignItems: 'center', marginTop: 3 }}
                onPress={this._onPress}
                activeOpacity={1}>
                <Image source={addButton} style={{ height: 30, width: 30 }} />
            </TouchableOpacity>
        );
    }
}