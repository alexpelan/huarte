import React from 'react';
import {
  Text,
} from 'react-native';

import MediaWebView from './MediaWebView';
import styles from '../styles/styles';

// Should this be truly polymorphic? 
class MediaLink extends React.Component {
  linkText = () => {
    if (this.props.media.type === 'audio') {
      return 'Play audio';
    } else if (this.props.media.type === 'image') {
      return 'View image';
    }
    return 'View unknown media';
  };

  showMedia = () => {
    this.props.navigator.push({
      title: 'Media',
      component: MediaWebView,
      passProps: {
        url: this.props.media.url,
      },
    });
  };

  render() {
    return (
      <Text
        style={[styles.hyperlink, styles.scoreText]}
        onPress={() => this.showMedia()}
      >
        {this.linkText()}
      </Text>
    );
  }
}

export default MediaLink;
