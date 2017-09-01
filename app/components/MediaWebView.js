import React from "react";
import {
  StyleSheet,
  WebView
} from "react-native";

import SimpleMessage from "./SimpleMessage";
import styles from "../styles/styles";

class MediaWebView extends React.Component {
  onError = () => {
    this.props.navigator.replace({
      title: "Error",
      component: SimpleMessage,
      passProps: {
        message: "There was an error loading the image"
      }
    })
  };

  render() {
    return (
      <WebView
        source={{uri: this.props.url}}
        onError={this.onError}
        scalesPageToFit={true}
      />
    );
  }
}

export default MediaWebView;