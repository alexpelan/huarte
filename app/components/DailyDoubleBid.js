import React, {
  StatusBar,
  ListView,
  Text,
  TextInput
  View
} from "react-native";

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



  validateBid: function() {
    const store = this.props.store;
    var text = this.state.text;
    var state= store.getState();
    var score = state.score;
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

    this.props.clue.value = "$" + bid;
    this.props.navigator.push({
      title: this.props.clue.value,
      navigationBarHidden: true,
      component: Question,
      passProps: {
        clue: this.props.clue,
        isSkippable: false,
        store
      }
    });

  },

  render: function() {
    StatusBar.setBarStyle('light-content', true);
    var score= StateHelper.getCurrentGame(this.props.store).score;


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

export default DailyDoubleBid;