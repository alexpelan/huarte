import React, {
	Linking,
	StyleSheet,
	Text
} from "react-native";

import styles from "../styles/styles";

const Link = React.createClass({
  render: function () {
    return (
      <Text style={styles.hyperlink} onPress={() => { Linking.openURL(this.props.url)}}>
        {this.props.text}
      </Text>
      );
  }
});

export default Link;