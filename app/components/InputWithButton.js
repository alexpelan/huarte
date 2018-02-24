import React from 'react';
import {
  Button,
  TextInput,
  View,
} from 'react-native';

import styles from '../styles/styles';


class InputWithButton extends React.Component {
  render() {
    return (
      <View style={[styles.flexRow]}>
        <TextInput
          style={[styles.textInput, styles.textInputWithButton]}
          onChangeText={text => this.props.onChangeText(text)}
          onSubmitEditing={() => this.props.onSubmit()}
          value={this.props.text}
          keyboardType="numeric"
          autoFocus
        />
        <Button
          color="white"
          style={[styles.buttonWithTextInput, styles.button]}
          onPress={() => this.props.onSubmit()}
          title="Submit"
          accessibilityLabel="Submit your bid"
        />
      </View>
    );
  }
}

export default InputWithButton;
