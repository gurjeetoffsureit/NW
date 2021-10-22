import React, { PureComponent } from 'react';
import {
  BackHandler,
  TouchableOpacity,
  Image,
  View,
  Text
} from 'react-native';
import { WebView } from 'react-native-webview';
import Strings from '../resources/string/Strings';
import Styles from '../resources/styles/Styles';

class LogoTitle extends PureComponent {
  render() {
    const { header } = this.props;
    return (
      <View style={{
        alignItems: 'center', justifyContent: 'center',
        flex: 1
      }}>
        <Text
          style={Styles.textHeader}
          numberOfLines={1}
          ellipsizeMode='tail'>{header}</Text>

      </View>
    );
  }
}

class HeaderLeft extends PureComponent {
  render() {
    const { onPress } = this.props;
    return (
      <TouchableOpacity style={{
        alignItems: 'center', justifyContent: 'center',
        paddingLeft: 15, height: '100%'
      }} onPress={onPress}>
        <Image source={require('../resources/images/back_arrow.png')} />
      </TouchableOpacity>
    );
  }
}

class HeaderRight extends PureComponent {
  render() {
    return (
      <View style={{
        alignItems: 'center', justifyContent: 'center',
        paddingRight: 15
      }} />
    );
  }
}

export default class WebViewScreen extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoTitle
        header={navigation.getParam('header')} />,
      headerLeft: <HeaderLeft
        onPress={navigation.getParam('onPress')} />,
      headerRight: <HeaderRight />,
      gesturesEnabled: false,
      headerStyle: {
        backgroundColor: '#000000',
      },
      headerTintColor: '#fff',
    }
  };

  componentWillMount() {
    const { Title } = this.props.navigation.state.params
    this.props.navigation.setParams({
      header: Title,
      onPress: this.onBackPress.bind(this)
    });
    BackHandler.addEventListener('hardwareBackPress removeEventListener', this.handleBackButton);
  }

  onBackPress = () => {
    this.props.navigation.goBack();
  }

  handleBackButton() {
    return true
  }

  render() {
    const { Url } = this.props.navigation.state.params;
    return (
      <WebView
        source={{ uri: Url }}
      />
    );
  }
}