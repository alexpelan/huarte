import React from 'react';
import {
  StatusBar,
  View,
  Text,
} from 'react-native';

import Link from './Link';
import styles from '../styles/styles';

class About extends React.Component {
  render() {
    StatusBar.setBarStyle('default', true);
    return (
      <View style={[styles.loadingView, styles.paragraphView]}>
        <Text style={styles.loadingText}>
          Huarte is a game by <Link text="Alex Pelan," url="http://www.alexpelan.com" /> a software developer in Brooklyn, NY. The questions and answers are from <Link text="J-Archive." url="www.j-archive.com" /> The app was built using Facebook&apos;s <Link text="React Native" url="https://facebook.github.io/react-native/" /> framework and its source is fully available <Link text="here." url="https://github.com/alexpelan/huarte" />
        </Text>
      </View>
    );
  }
}

export default About;
