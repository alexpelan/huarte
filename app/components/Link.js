import React from 'react';
import {
  Linking,
  Text,
} from 'react-native';

import styles from '../styles/styles';

class Link extends React.Component {
  render() {
    return (
      <Text style={styles.hyperlink} onPress={() => { Linking.openURL(this.props.url); }}>
        {this.props.text}
      </Text>
    );
  }
}

export default Link;
