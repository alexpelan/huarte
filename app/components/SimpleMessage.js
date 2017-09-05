import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import styles from '../styles/styles';

class SimpleMessage extends React.Component {
  static defaultProps = {
    message: 'Loading...',
  };

  render() {
    return (
      <View style={styles.loadingView}>
        <Text style={styles.loadingText}>
          {this.props.message}
        </Text>
      </View>
    );
  }
}

export default SimpleMessage;
