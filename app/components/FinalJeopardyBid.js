import React, {
  StatusBar,
  ListView,
  Text,
  TextInput
  View
} from "react-native";

import {
  bidFinalJeopardy
} from "../actions/index";

import Question from "./Question";

import styles from "../styles/styles";

import StateHelper from "../util/StateHelper";

const FinalJeopardyBid = React.createClass({
  getInitialState: function() {
    return {
      text: ""
    };
  },

  validateBid: function() {
    const store = this.props.store;
    var text = this.state.text;
    var score = StateHelper.getCurrentGame().score;
    let bid;
    let maxBid;

    if (score > 0) {
      maxBid = score;

      var parsedBid = parseInt(text);
      if(!isNaN(parsedBid) && parsedBid >= 0){
        if (bid > maxBid) {
          this.setState({errorMessage: "You cannot wager more than you have to bid."})
          return;
        }
        bid = text;
      } else {
        this.setState({errorMessage: "Please enter a positive number."})
        return;
      }
    } else {
      bid = 0;
    }

    store.dispatch(bidFinalJeopardy(bid));
    let finalJeopardyClue = state.final_jeopardy.categories[0];
    this.props.navigator.push({
      title: "Final Jeopardy",
      navigationBarHidden: true,
      component: Question,
      passProps: {
        clue: finalJeopardyClue,
        isSkippable: false,
        store
      }
    });

  },

  render: function() {
    StatusBar.setBarStyle('light-content', true);
    var score = StateHelper.getCurrentGame(this.props.store).score;


     return (
      <View style={styles.questionView}>
        <Text style={styles.question}>
          What is your bid? You have {score} to wager.
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
      </View>
    );
  }
});

export default FinalJeopardyBid;