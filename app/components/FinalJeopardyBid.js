import React from 'react';
import {
  Button,
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';

import {
  bidFinalJeopardy,
} from '../actions/index';

import Question from './Question';

import styles from '../styles/styles';

import StateHelper from '../util/StateHelper';

class FinalJeopardyBid extends React.Component {
  state = {
    text: '',
  };

  onKeyboardToggle = (toggleState) => {
    this.setState({ isKeyboardOpen: toggleState });
  };

  validateBid = () => {
    const store = this.props.store;
    const text = this.state.text;
    const score = StateHelper.getCurrentGame(store).score;
    let bid;
    let maxBid;

    if (score > 0) {
      maxBid = score;

      const parsedBid = parseInt(text, 10);
      if (!isNaN(parsedBid) && parsedBid >= 0) {
        if (bid > maxBid) {
          this.setState({ errorMessage: 'You cannot wager more than you have to bid.' });
          return;
        }
        bid = text;
      } else {
        this.setState({ errorMessage: 'Please enter a positive number.' });
        return;
      }
    } else {
      bid = 0;
    }

    store.dispatch(bidFinalJeopardy(bid));
    const finalJeopardyClue = StateHelper.getCurrentRound(store).categories[0];
    const categoryName = this.props.category.name;
    this.props.navigator.push({
      title: 'Final Jeopardy',
      navigationBarHidden: true,
      component: Question,
      passProps: {
        clue: finalJeopardyClue,
        isSkippable: false,
        store,
        categoryName,
        isFinalJeopardy: true,
      },
    });
  };

  render() {
    let keyboardSpacerStyle;
    StatusBar.setBarStyle('light-content', true);
    const score = StateHelper.getCurrentGame(this.props.store).score;

    if (!this.state.isKeyboardOpen) {
      keyboardSpacerStyle = styles.keyboardSpacerHidden;
    }

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.questionView}>
          <Text style={styles.question}>
            What is your bid? You have {score} to wager.
          </Text>
          <Text>{this.state.errorMessage}</Text>
          <View style={[styles.flexRow]}>
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.setState({ text })}
              onSubmitEditing={() => this.validateBid()}
              value={this.state.text}
              keyboardType="numeric"
              autoFocus
            />
            <Button
              color="white"
              style={[styles.buttonWithTextInput, styles.button]}
              onPress={() => this.validateBid()}
              title="Submit"
              accessibilityLabel="Submit your bid"
            />
          </View>
          <KeyboardSpacer
            style={keyboardSpacerStyle}
            onToggle={toggleState => this.onKeyboardToggle(toggleState)}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default FinalJeopardyBid;
