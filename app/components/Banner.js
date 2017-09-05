import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import {
  dismissError,
} from '../actions/index';

import styles from '../styles/styles';

class Banner extends React.Component {
  dismiss = () => {
    this.props.store.dispatch(dismissError());
  };

  render() {
    return (
      <View style={styles.popove}>
        <Text style={styles.errorPopover}>
          {this.props.errorMessage} &nbsp; &nbsp; &nbsp;
          <Text style={styles.hyperlink} onPress={() => { this.dismiss(); }}>
            Dismiss
          </Text>
        </Text>
      </View>
    );
  }
}

export default Banner;
