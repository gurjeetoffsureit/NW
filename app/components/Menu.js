import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

import Styles from '../resources/styles/Styles'

const { width, height } = Dimensions.get('window');
const placeholder = require('../resources/images/photoIcon.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    height: height,
    backgroundColor: '#000000',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 15,
    marginTop: 8,
    marginLeft: 20,
  },
  avatar: {
    width: width / 3.5,
    height: width / 3.5,
    borderRadius: (width / 3.5) / 2,
    flex: 1,
  },
  name: {
    marginTop: 15,
    color: '#FDA02A'
  },
  item: {
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 8,
    color: '#FDA02A'
  },
});

export default function Menu({ onItemSelected, name, image }) {

  return (
    // <TouchableOpacity style={styles.container}
    //   onPress={() => onItemSelected('close')}>
    <ScrollView scrollsToTop={false} style={styles.menu}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={
            image === '' ? placeholder : image
          }
        />
        <Text style={[Styles.label, styles.name]}
          numberOfLines={1}
          ellipsizeMode={'tail'}>{name}</Text>
      </View>

      {/* <Text
        onPress={() => onItemSelected('About')}
        style={styles.item}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        About
      </Text> */}

      <Text
        onPress={() => onItemSelected('Terms of Services')}
        style={styles.item}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        Terms of Services
      </Text>

      <Text
        onPress={() => onItemSelected('Privacy')}
        style={styles.item}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        Privacy Policy
      </Text>

      <Text
        onPress={() => onItemSelected('Logout')}
        style={styles.item}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        Logout
      </Text>
    </ScrollView>
    // </TouchableOpacity>
  );
}

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
  name: PropTypes.string,
  image: PropTypes.any
};