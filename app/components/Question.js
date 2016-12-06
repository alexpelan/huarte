import React from "react";
import {
  StatusBar,
  ListView,
  Text,
  TextInput,
  View
} from "react-native";

import {
  updateScore,
  nextRound
} from "../actions/index";

import MediaLink from "./MediaLink";
import SimpleMessage from "./SimpleMessage";

import styles from "../styles/styles";

import CONSTS from "../util/Consts";
import StateHelper from "../util/StateHelper";

let levenshtein = require("fast-levenshtein");
let _ = require("lodash");

const Question = React.createClass({
  getInitialState: function() {
    return {
      text: ""
    };
  },

  getDelta: function(wasCorrect) {
    var numberWithoutDollarSign = parseInt(this.props.clue.value.slice(1));
    if (wasCorrect) {
      return numberWithoutDollarSign;
    } else {
      return -1 * numberWithoutDollarSign;
    }
  },

  checkIfAllQuestionsAnswered: function() {
    var returnValue = true;

    _.each(StateHelper.getCurrentRound(this.props.store).categories, function(category){
      _.each(category.clues, function(clue){
        if(!clue.isCompleted) {
          returnValue = false;
        }
      })

    });

    return returnValue;

  },

  setAnswerStatus: function(wasCorrect, wasntQuiteCorrect){
    const store = this.props.store;
    var answeredQuestion = true;
    this.setState({wasCorrect, wasntQuiteCorrect, answeredQuestion})
    var delta = this.getDelta(wasCorrect || wasntQuiteCorrect);
    store.dispatch(updateScore(delta));
   
    //store.dispatch(nextRound("double_jeopardy")) easy to skip to FJ while debugging via this
    if (this.checkIfAllQuestionsAnswered()) {
      store.dispatch(nextRound(StateHelper.getCurrentGame(store).currentRound));
    }

    setTimeout(() => {
      if (!this.state.disputedQuestion) {
        this.returnToCategories();
      }
    }, 3000);
  },

  skipQuestion: function() {
    this.returnToCategories();
  },

  disputeQuestion: function() {
    if (this.state.disputedQuestion) {
      this.returnToCategories();
    } else {
      fetch(CONSTS.DISPUTE_URL, {
        method: "POST",
        body: JSON.stringify({
          clue: this.props.clue,
          userAnswer: this.state.text.toLowerCase()
        })
      }).then(() => true); // fire and forget
      this.setState({disputedQuestion: true});
    }
  },

  returnToCategories: function() {
      if (this.props.clue.isDailyDouble) {
        this.props.navigator.popN(3); // have an extra screen for bidding
      }
      else {
        this.props.navigator.popN(2); // not ideal, but popToRoute is undocumented / doesn't seem to work right
      }
  },

  checkAnswer: function() {
    var text = this.state.text.toLowerCase();
    var answer = this.props.clue.answer.toLowerCase();

    var wasCorrect = false;
    var wasntQuiteCorrect = false;
    if(text === answer ) {
      wasCorrect = true; //always down to take an exact match
    } 

    var answerTokens = answer.split(" ");
    if (answerTokens.length > 1 && !wasCorrect) {
      //be super lenient for now - an exact match on one of the words will pass
      _.each(answerTokens, (token) => {
        if(token === text) {
          wasCorrect = true;
          wasntQuiteCorrect = true
        }
      })

    }

    //otherwise, do a levenshtein difference based on the length of the combined answers - allow for some mispellings
    var levDistance = levenshtein.get(text, answer);

    //we'll allow one typo every...four letters? idk, we can tweak this
    var allowedErrors = Math.ceil(answer.length / 4);
    if(levDistance <= allowedErrors && !wasCorrect){
      wasCorrect = true;
      wasntQuiteCorrect = true;
    }

    this.setAnswerStatus(wasCorrect, wasntQuiteCorrect);

  },

  render: function() {
    let skipLink;
    let disputeLink;
    let disputeLinkText;
    StatusBar.setBarStyle('light-content', true);
    if(this.state.answeredQuestion) {
      var correctText = "Incorrect!";
      if(this.state.wasCorrect && !this.state.wasntQuiteCorrect) {
        correctText = "Correct!";
      } else if (this.state.wasCorrect && this.state.wasntQuiteCorrect) {
        correctText = "Close Enough!";
      }
      var answerFeedback = <Text>You entered {this.state.text}. The correct answer is {this.props.clue.answer}. {correctText}.</Text>

      if (this.state.disputedQuestion) {
        disputeLinkText = "Thanks for the feedback. Tap to continue.";
      } else {
        disputeLinkText = "Report inaccurate grading"
      }

      disputeLink = <Text style={[styles.hyperlink, styles.negativeAction]} onPress={() => this.disputeQuestion()}>{disputeLinkText}</Text>
    }

    if (this.props.isSkippable && !this.state.answeredQuestion) {
      skipLink = <Text style={[styles.hyperlink, styles.scoreText]} onPress={() => this.skipQuestion()}>Skip</Text>
    }

    return (
      <View style={styles.questionView}>
        <Text style={styles.questionHeader}>
          {this.props.categoryName} - {this.props.clue.value}
        </Text>
        <Text style={styles.question}>
          {this.props.clue.question}
        </Text>
        {this.props.clue.media.map((mediaLink) => {
          return (
              <MediaLink media={mediaLink} navigator={this.props.navigator} key={mediaLink.url}>
              </MediaLink>
            );
        })}
        <Text style={styles.question}>
            {answerFeedback}
        </Text>
        {disputeLink}
        {skipLink}
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({text})}
          onSubmitEditing={() => this.checkAnswer()}
          value={this.state.text}
          autoFocus
          placeholder="What is..."
          placeholderTextColor="white"
        />
      </View>
    );
  }
});

export default Question;