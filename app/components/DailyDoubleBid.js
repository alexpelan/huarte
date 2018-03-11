import React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  Keyboard,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import InputWithButton from './InputWithButton';
import Question from './Question';

import styles from '../styles/styles';

import StateHelper from '../util/StateHelper';

// FIXFIX: a lot of shared logic with final jeopardy bid. like, 90% the same
class DailyDoubleBid extends React.Component {
  state = {
    text: '',
  };

  onKeyboardToggle = (toggleState) => {
    this.setState({ isKeyboardOpen: toggleState });
  };

  getMaxBid = () => {
    const store = this.props.store;
    const score = StateHelper.getCurrentGame(store).score;
    const highestBidForGame = StateHelper.getHighestBidForCurrentGame(store);
    let maxBid;

    if (score > highestBidForGame) {
      maxBid = score;
    } else {
      maxBid = highestBidForGame;
    }

    return maxBid;
  };

  validateBid = () => {
    const store = this.props.store;
    const text = this.state.text;
    let bid;

    const maxBid = this.getMaxBid();
    const parsedBid = parseInt(text, 10);
    if (!isNaN(parsedBid) && parsedBid >= 0) {
      if (parsedBid > maxBid) {
        this.setState({ errorMessage: 'You cannot wager more than you have to bid.' });
        return;
      }
      bid = text;
    } else {
      this.setState({ errorMessage: 'Please enter a positive number.' });
      return;
    }

    const categoryName = this.props.categoryName;
    this.props.clue.value = `$${bid}`;
    this.props.navigator.push({
      title: this.props.clue.value,
      navigationBarHidden: true,
      component: Question,
      passProps: {
        clue: this.props.clue,
        isSkippable: false,
        store,
        categoryName,
      },
    });
  };

  render() {
    let keyboardSpacerStyle;
    StatusBar.setBarStyle('light-content', true);
    const maxBid = this.getMaxBid();

    if (!this.state.isKeyboardOpen) {
      keyboardSpacerStyle = styles.keyboardSpacerHidden;
    }

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.questionView}>
          <Text style={[styles.bid]}>
            What is your bid? You have {maxBid} to wager.
          </Text>
          <Text style={[styles.bid]}>{this.state.errorMessage}</Text>
          <InputWithButton
            onSubmit={() => this.validateBid()}
            onChangeText={text => this.setState({ text })}
            text={this.state.text}
          />
          <KeyboardSpacer
            style={[keyboardSpacerStyle]}
            onToggle={toggleState => this.onKeyboardToggle(toggleState)}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default DailyDoubleBid;
