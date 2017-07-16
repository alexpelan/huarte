import React from "react";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  StatusBar,
  ListView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from "react-native";
import DismissKeyboard from 'dismissKeyboard';

import Question from "./Question";
import SimpleMessage from "./SimpleMessage";

import styles from "../styles/styles";

import StateHelper from "../util/StateHelper";

// FIXFIX: a lot of shared logic with final jeopardy bid. like, 90% the same
const DailyDoubleBid = React.createClass({
  getInitialState: function() {
    return {
      text: ""
    };
  },

  getMaxBid: function() {
    const store = this.props.store;
    const score = StateHelper.getCurrentGame(store).score;
    let highestBidForGame = StateHelper.getHighestBidForCurrentGame(store);
    let maxBid;

    if (score > highestBidForGame) {
      maxBid = score;
    } else {
      maxBid = highestBidForGame;
    }

    return maxBid;
  },

  validateBid: function() {
    const store = this.props.store;
    let text = this.state.text;
    let state= store.getState();
    let score = state.score;
    let bid;

    const maxBid = this.getMaxBid();
    let parsedBid = parseInt(text);
    if(!isNaN(parsedBid) && parsedBid >= 0){
      if (parsedBid > maxBid) {
        this.setState({errorMessage: "You cannot wager more than you have to bid."});
        return;
      }
      bid = text;
    } else {
      this.setState({errorMessage: "Please enter a positive number."});
      return;
    }

    const categoryName = this.props.categoryName;
    this.props.clue.value = "$" + bid;
    this.props.navigator.push({
      title: this.props.clue.value,
      navigationBarHidden: true,
      component: Question,
      passProps: {
        clue: this.props.clue,
        isSkippable: false,
        store,
        categoryName
      }
    });

  },

  onKeyboardToggle: function(toggleState) {
    this.setState({isKeyboardOpen: toggleState});
  },

  render: function() {
    let keyboardSpacerStyle;
    StatusBar.setBarStyle('light-content', true);
    const maxBid = this.getMaxBid();

    if (!this.state.isKeyboardOpen) {
      keyboardSpacerStyle = styles.keyboardSpacerHidden;
    }

    return (
      <TouchableWithoutFeedback onPress={() => DismissKeyboard()}>
        <View style={styles.questionView}>
          <Text style={styles.question}>
            What is your bid? You have {maxBid} to wager.
          </Text>
          <Text>{this.state.errorMessage}</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.setState({text})}
            onSubmitEditing={() => this.validateBid()}
            value={this.state.text}
            keyboardType="numeric"
            autoFocus
          />
          <KeyboardSpacer style={keyboardSpacerStyle} onToggle={(toggleState) => this.onKeyboardToggle(toggleState)} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
});

export default DailyDoubleBid;