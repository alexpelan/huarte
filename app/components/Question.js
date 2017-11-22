import React from 'react';
import {
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {
  updateScore,
  nextRound,
} from '../actions/index';

import MediaLink from './MediaLink';

import styles from '../styles/styles';

import AnswerValidator from '../util/AnswerValidator';
import api from '../util/Api';
import StateHelper from '../util/StateHelper';

const _ = require('lodash');

class Question extends React.Component {
  state = {
    text: '',
  };

  onKeyboardToggle = (toggleState) => {
    this.setState({ isKeyboardOpen: toggleState });
  };

  getDelta = (wasCorrect) => {
    const numberWithoutDollarSign = parseInt(this.props.clue.value.slice(1), 10);
    if (wasCorrect) {
      return numberWithoutDollarSign;
    }
    return -1 * numberWithoutDollarSign;
  };

  setAnswerStatus = (wasCorrect, wasntQuiteCorrect) => {
    const store = this.props.store;
    const answeredQuestion = true;
    this.setState({ wasCorrect, wasntQuiteCorrect, answeredQuestion });
    const delta = this.getDelta(wasCorrect || wasntQuiteCorrect);
    store.dispatch(updateScore(delta));

    this.checkIfAllQuestionsAnswered();
    setTimeout(() => {
      if (!this.state.disputedQuestion) {
        this.returnToCategories();
      }
    }, 3000);
  };

  checkIfAllQuestionsAnswered = () => {
    let allQuestionsAnswered = true;

    _.each(StateHelper.getCurrentRound(this.props.store).categories, (category) => {
      _.each(category.clues, (clue) => {
        if (!clue.isCompleted) {
          allQuestionsAnswered = false;
        }
      });
    });

    if (allQuestionsAnswered) {
      const store = this.props.store;
      store.dispatch(nextRound(StateHelper.getCurrentGame(store).currentRound, store));
    }
  };

  skipQuestion = () => {
    this.setState({ skippedQuestion: true });
    this.checkIfAllQuestionsAnswered();
    setTimeout(() => {
      this.returnToCategories();
    }, 3000);
  };

  disputeQuestion = () => {
    if (this.state.disputedQuestion) {
      this.returnToCategories();
    } else {
      api.disputeQuestion({
        method: 'POST',
        body: JSON.stringify({
          clue: this.props.clue,
          userAnswer: this.state.text.toLowerCase(),
        }),
        headers: { 'Content-Type': 'application/json' },
      }, this.props.store).then(() => true); // fire and forget
      this.setState({ disputedQuestion: true });
    }
  };

  returnToCategories = () => {
    // not ideal, but popToRoute is undocumented / doesn't seem to work right
    if (this.props.clue.isDailyDouble || this.props.isFinalJeopardy) {
      // have an extra screen for bidding, or it's end of game (fj)
      this.props.navigator.popN(3);
    } else {
      this.props.navigator.popN(2);
    }
  };

  checkAnswer = () => {
    const {
      wasCorrect,
      wasntQuiteCorrect,
    } = AnswerValidator.checkAnswer(this.state.text, this.props.clue);
    this.setAnswerStatus(wasCorrect, wasntQuiteCorrect);
  };

  render() {
    let skipLink;
    let disputeLink;
    let disputeLinkText;
    let answerFeedback;
    let keyboardSpacerStyle;
    StatusBar.setBarStyle('light-content', true);
    if (this.state.answeredQuestion) {
      let correctText = ' Incorrect!';
      if (this.state.wasCorrect && !this.state.wasntQuiteCorrect) {
        correctText = ' Correct!';
      } else if (this.state.wasCorrect && this.state.wasntQuiteCorrect) {
        correctText = ' Close Enough!';
      }
      answerFeedback = (
        <Text>
          You entered {this.state.text}.
          The correct answer is {this.props.clue.answer}.
          {correctText}.
        </Text>
      );

      if (this.state.disputedQuestion) {
        disputeLinkText = 'Thanks for the feedback. Tap to continue.';
      } else {
        disputeLinkText = 'Report inaccurate grading';
      }

      disputeLink = (
        <Text
          style={[styles.hyperlink, styles.negativeAction]}
          onPress={() => this.disputeQuestion()}
        >
          {disputeLinkText}
        </Text>
      );
    } else if (this.state.skippedQuestion) {
      answerFeedback = <Text>The correct answer was {this.props.clue.answer}.</Text>;
    }

    if (this.props.isSkippable && !this.state.answeredQuestion) {
      skipLink = (
        <Text
          style={[styles.hyperlink, styles.scoreText]}
          onPress={() => this.skipQuestion()}
        >
          Skip
        </Text>
      );
    }

    if (!this.state.isKeyboardOpen) {
      keyboardSpacerStyle = styles.keyboardSpacerHidden;
    }

    // gross, but until backend fix just null check here
    if (!this.props.clue.media) {
      this.props.clue.media = [];
    }

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.questionView} >
          <Text style={styles.questionHeader}>
            {this.props.categoryName} - {this.props.clue.value}
          </Text>
          <Text style={styles.question}>
            {this.props.clue.question}
          </Text>
          {this.props.clue.media.map(mediaLink => (
            <MediaLink media={mediaLink} navigator={this.props.navigator} key={mediaLink.url} />
          ))}
          <Text style={styles.question}>
            {answerFeedback}
          </Text>
          {disputeLink}
          {skipLink}
          <TextInput
            style={[styles.textInput, styles.questionTextInput]}
            onChangeText={text => this.setState({ text })}
            onSubmitEditing={() => this.checkAnswer()}
            value={this.state.text}
            autoFocus
            placeholder="What is..."
            placeholderTextColor="white"
          />
          <KeyboardSpacer
            style={keyboardSpacerStyle}
            onToggle={toggleState => this.onKeyboardToggle(toggleState)}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Question;
