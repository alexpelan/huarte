import React, {
  StyleSheet,
  Text
} from "react-native";

import MediaWebView from "./MediaWebView";
import styles from "../styles/styles";

// Should this be truly polymorphic? 
const MediaLink = React.createClass({

  linkText: function() {
    if (this.props.media.type === "audio") {
      return "Play audio";
    } else if (this.props.media.type === "image") {
      return "View image";
    } 
  },

  showMedia: function() {
    this.props.navigator.push({
      title: "Media",
      component: MediaWebView,
      passProps: {
        url: this.props.media.url
      }
    })
  },

  render: function() {
    return (
        <Text style={[styles.hyperlink, styles.scoreText]} onPress={() => { this.showMedia()}}>{this.linkText()}</Text>
      );
  }
});

export default MediaLink;