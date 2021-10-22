import React, {Component} from 'react';
import {
    View,
    Picker,
} from 'react-native';

export default class CountryCodePicker extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user : ''
        }
    }

    updateUser = (user) => {
        this.setState({user : user})
    }

    render() {
        return (
            <View style={{marginLift: 30}}>
                <Picker selectedValue={this.state.user} onValueChange={this.updateUser}>
                    <Picker.Item value="+1" label="+1"/>
                </Picker>
            </View>
        );
    }
}