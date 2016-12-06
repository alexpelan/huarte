import React from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";

import styles from "../styles/styles";

const SimpleMessage = React.createClass({
  getDefaultProps: function() {
    return {
      message: "Loading..."
    };
  },

  render: function() {
    return (
      <View style={styles.loadingView}>
        <Text style={styles.loadingText}>
          {this.props.message}
        </Text>
      </View>
    );
  }
});  

export default SimpleMessage