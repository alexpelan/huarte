'use strict';
import React, {
  AppRegistry,
  Component,
  Image,
  ListView,
  NavigatorIOS,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { createStore } from "redux";

let defaultState = {
  show_number:"Show #7125",
  air_date:"Friday, July 31, 2015",
  jeopardy:
    {
      categories:[
        {
          name:"A PICTURE IS WORTH...",
          clues:[
            {
              value:"$200",
              question: "Two words: this body of water",
              answer: "Puget Sound"
            },
            {
              value:"$400",
              question: "Four words:  this crazy condition",
              answer: "bats in the belfry"
            },
            {
              value:"$600",
              question: "Six words:  This 1969 movie title",
              answer: "<i>Butch Cassidy and the Sundance Kid</i>"
            },
            {
              value:"$800",
              question: "Three names now:  This inventor",
              answer: "Thomas Alva Edison"
            },
            {
              value:"$1000",
              question: "Two words:  This historic structure",
              answer: "Tower Bridge"
            }
          ]
        },
        {
          name:"4-LETTER VERBS",
          clues:[
            {
              value:"$200",
              question: "Used especially of stallions, it means to father a child",
              answer: "sire"
            },
            {
              value:"$400",
              question: "As a noun, it's the ridge on the fingerboard of a guitar; as a verb, it means to worry",
              answer: "fret"
            },
            {
              value:"$600",
              question: "Helen Reddy sang, \"I am woman, hear me\" do this",
              answer: "roar"
            },
            {
              value:"$800",
              question: "To decrease gradually in intensity, such as the moon in passing from full to new",
              answer: "wane"
            },
            {
              value:"$1000",
              question: "Itemize, or what a ship does when it tilts to one side",
              answer: "list"
            }
          ]
        },
      ]
    },
    double_jeopardy:{
      categories:[
        {
          name:"OLD TV SHOWS BY EPISODE TITLE",
          clues:
            [
              {
                value:"$400",
                question: "\"Ricky Loses His Voice\"",
                answer: "<i>I Love Lucy</i>"
              },
              {
                value:"$800",
                question: "\"The Courage of Tonto\"",
                answer: "<i>The Lone Ranger</i>"
              },
              {
                value:"$1200",
                question: "A Western:  \"Kitty's Love Affair\"",
                answer: "<i>Gunsmoke</i>"
              },
              {
                value:"$1600",
                question: "\"Norton Moves In\"",
                answer: "<i>The Honeymooners</i>"
              },
              {
                value:"$2000",
                question: "\"Wally's Car Accident\"",
                answer: "<i>Leave It to Beaver</i>"
              }
            ]
        },
      ]
    },
    final_jeopardy:
      {
        category: "CELEBRITIES IN SONG LYRICS",
        question: "In a song, Weird Al says, \"I know a guy who knows a guy who knows a guy who knows a guy who knows a guy who knows\" him",
        answer: "Kevin Bacon"
    },
    score: 0
};

//*************************
// ACTIONS
//*************************
function selectQuestion(game, categoryIndex, clueIndex){
  return {
    type: "SELECT_QUESTION",
    game: game,
    categoryIndex: categoryIndex,
    clueIndex: clueIndex
  };
};

function updateScore(delta) {
  return {
    type: "UPDATE_SCORE",
    delta: delta
  }
}


//*************************
// REDUCERS
//*************************


function huarteApp(state, action) {
  var newState;
  switch(action.type) {
    case "SELECT_QUESTION":
      newState = Object.assign({}, state);
      newState[action.game].categories[action.categoryIndex].clues[action.clueIndex].isCompleted = true;
      return newState;
    case "UPDATE_SCORE":
      newState = Object.assign({}, state);
      newState.score = newState.score + action.delta;
      return newState;
    default:
      return state;
  }

};


var store = createStore(huarteApp, defaultState);

let _ = require("lodash");
let levenshtein = require("fast-levenshtein");
let REQUEST_URL = 'http://localhost:3000/scraper';


//*************************
// VIEWS
//*************************


var Question = React.createClass({
  getInitialState: function() {
    return {
      text: ""
    };
  },
  setAnswerStatus: function(wasCorrect, wasntQuiteCorrect){
    var answeredQuestion = true;
    this.setState({wasCorrect, wasntQuiteCorrect, answeredQuestion})

    setTimeout(() => {
      this.props.navigator.popN(2); // not ideal, but popToRoute is undocumented / doesn't seem to work right
    }, 3000);
  },
  checkAnswer: function(text) {
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
    if(this.state.answeredQuestion) {
      var correctText = "Incorrect!";
      if(this.state.wasCorrect && !this.state.wasntQuiteCorrect) {
        correctText = "Correct!";
      } else if (this.state.wasCorrect && this.state.wasntQuiteCorrect) {
        correctText = "Close Enough!";
      }
      var answerFeedback = <Text>You entered {this.state.text}. The correct answer is {this.props.clue.answer}. {correctText}.</Text>
    }
    return (
      <View>
        <Text style={styles.question}>
          {this.props.clue.question}
        </Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({text})}
          onSubmitEditing={(text) => this.checkAnswer(text)}
          value={this.state.text}
          autoFocus
        />
        {answerFeedback}
      </View>
    );
  }
});

var DollarAmountList = React.createClass({
  getInitialState: function () {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row !== row2
    });
    return {
      dataSource: dataSource.cloneWithRows(this.props.category.clues)
    };
  },

  selectClue: function(clue, clueIndex) {
    store.dispatch(selectQuestion("jeopardy", this.props.categoryIndex, clueIndex));
    this.props.navigator.push({
      title: clue.value,
      navigationBarHidden: true,
      component: Question,
      passProps: {
        clue
      }
    });
  },

  render: function() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(clue, sectionId, clueIndex) => this.renderClue(clue, clueIndex)}
        style={styles.listView}/>
    )
  },

  renderClue: function(clue, clueIndex){
    return (
      <Text style={[styles.listItem, clue.isCompleted && styles.listItemDisabled]}
        onPress={() => {
            if(!clue.isCompleted) {
              this.selectClue(clue, clueIndex)
            }
          }
        }>
        {clue.value}
      </Text>
    );
  }

});

var CategoryList = React.createClass({
   getInitialState: function() {
    var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
    });
    return {
      dataSource: dataSource.cloneWithRows(store.getState().jeopardy.categories),
      loaded: true
    };
  },

  componentDidMount: function() {
    store.subscribe(() => {
      var state = store.getState();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(state.jeopardy.categories)
      });
    });
  },

  fetchData: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(defaultState.jeopardy.categories), //FIXFIX: Should eventually use actual response data
          loaded: true
        });
      })
      .done();
  },

  selectCategory: function(category, categoryIndex) {
    this.props.navigator.push({
      title: category.name,
      component: DollarAmountList,
      passProps: {
        category,
        categoryIndex
      },
    });
  },

  render: function() {
    if(!this.state.loaded) {
      return this.renderLoadingView();
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(category, sectionID, categoryIndex) => this.renderCategory(category, categoryIndex)}
        style={styles.listView}/>
    )
  },

  renderCategory: function(category, categoryIndex) {
    return (
      <Text style={styles.listItem}
        onPress={() => this.selectCategory(category, categoryIndex)}>
        {category.name}
      </Text>
    );
  },

  renderLoadingView: function() {
    return (
        <View style={styles.container}>
          <Text>
            Loading...
          </Text>
        </View>
      );
  }
});

var huarte = React.createClass({
 render: function() {
  return (
    <NavigatorIOS
      style={styles.container}
      initialRoute={{
        title: 'Categories',
        component: CategoryList
      }}/>
  );
 }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  listItem: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center'
  },
  listItemDisabled: {
    color: '#ececec'
  },
  listView: {
    paddingTop: 35,
    backgroundColor: '#F5FCFF'
  },
  question: {
    paddingTop: 100,
    fontSize: 20
  },
  textInput: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1,
  },

});

AppRegistry.registerComponent('huarte', () => huarte);
