import React from 'react';
import {
  WebView,
} from 'react-native';

import SimpleMessage from './SimpleMessage';

class MediaWebView extends React.Component {
  onError = () => {
    this.props.navigator.replace({
      title: 'Error',
      component: SimpleMessage,
      passProps: {
        message: 'There was an error loading the image',
      },
    });
  };

  render() {
    return (
      <WebView
        source={{ uri: this.props.url }}
        onError={this.onError}
        scalesPageToFit
      />
    );
  }
}

export default MediaWebView;
