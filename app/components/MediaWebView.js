import React from "react";
import {
  StyleSheet,
  WebView
} from "react-native";

import SimpleMessage from "./SimpleMessage";
import styles from "../styles/styles";

const MediaWebView = React.createClass({

  onError: function() {
    this.props.navigator.replace({
      title: "Error",
      component: SimpleMessage,
      passProps: {
        message: "There was an error loading the image"
      }
    })
  },

  render: function() {
    return (
      <WebView
        source={{uri: this.props.url}}
        onError={this.onError}
      />
    );
  }

}); 

export default MediaWebView;