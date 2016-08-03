'use strict';
import React, {
  AsyncStorage,
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

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

const loggerMiddleware = createLogger();

let defaultState = {
    seasons: [],
    games: [],
    currentGame: {},
    score: 0,
    currentRound: "jeopardy",
    currentGameCorrect: 0,
    currentGameIncorrect: 0,
    gameLoaded: false,
    seasonsLoaded: false,
    gameListLoaded: false
};
//*************************
// CONSTS
//*************************
const JEOPARDY = "jeopardy";
const DOUBLE_JEOPARDY = "double_jeopardy";
const FINAL_JEOPARDY = "final_jeopardy";
const GAME_REQUEST_URL = 'http://localhost:3000/scraper/games/';
const SEASONS_REQUEST_URL = "http://localhost:3000/scraper/";
const GAME_LIST_REQUEST_URL = "http://localhost:3000/scraper/seasons/";

//*************************
// ACTIONS
//*************************
function requestGame() { //will eventually have some sort of id to fetch game by
  return {
    type: "REQUEST_GAME"
  }
};

function receiveGame(json) {
  return {
    type: "RECEIVE_GAME",
    game: json
  }
};

function requestSeasons() {
  return {
    type: "REQUEST_SEASONS"
  };
};

function receiveSeasons(json) {
  return {
    type: "RECEIVE_SEASONS",
    seasons: json.seasons
  };
};

function requestGameList() {
  return {
    type: "REQUEST_GAME_LIST",
  }
};

function receiveGameList(json) {
  return {
    type: "RECEIVE_GAME_LIST",
    games: json.games
  }
}

function selectQuestion(round, categoryIndex, clueIndex){
  return {
    type: "SELECT_QUESTION",
    round: round,
    categoryIndex: categoryIndex,
    clueIndex: clueIndex
  };
};

function updateScore(delta, wasCorrect) {
  return {
    type: "UPDATE_SCORE",
    delta: delta
  }
};

function nextRound(currentRound) {
  var nextRound;
  if (currentRound === "jeopardy") {
    nextRound = "double_jeopardy";
  } else if (currentRound === "double_jeopardy") {
    nextRound = "final_jeopardy";
  } else if (currentRound === "final_jeopardy") {
    Common.savePlayerStatistics(store.getState());
  }

  return {
    type: "NEXT_ROUND",
    nextRound: nextRound
  };
}

function bidFinalJeopardy(bid) {
  return {
     type: "BID_FINAL_JEOPARDY",
     bid: bid
  };
}

//*************************
// THUNKS
//*************************
function fetchGame(gameId) {
  return function(dispatch) {
    //first dispatch that we are requesting
    dispatch(requestGame());

    //return a promise 
    return  fetch(GAME_REQUEST_URL + gameId)
      .then((response) => response.json())
      .then((json) => {
        dispatch(receiveGame(json));
      });

    //FIXFIX: handle failure
  };  
};

function fetchSeasons() {
  return function(dispatch) {
    dispatch(requestSeasons());

    return fetch(SEASONS_REQUEST_URL)
      .then((response) => response.json())
      .then((json) => {
        dispatch(receiveSeasons(json));
      });
  }
};

function fetchGameList(seasonId) {
  return function(dispatch) {
    dispatch(requestGameList());

    return fetch(GAME_LIST_REQUEST_URL + seasonId)
      .then((response) => response.json())
      .then((json) => {
        dispatch(receiveGameList(json));
      });
  }
};


//*************************
// REDUCERS
//*************************


function huarteApp(state = defaultState, action) {
  var newState;
  switch(action.type) {
    case "REQUEST_GAME":
      newState = Object.assign({}, state);
      return newState; //no-op for now
    case "RECEIVE_GAME":
      newState = Object.assign({},state);
      newState.currentGame = action.game;
      newState.gameLoaded = true;
      return newState;
    case "REQUEST_SEASONS":
      newState = Object.assign({}, state);
      return newState;
    case "RECEIVE_SEASONS":
      newState = Object.assign({}, state);
      newState.seasons = action.seasons;
      newState.seasonsLoaded = true;
      return newState;
    case "REQUEST_GAME_LIST":
      newState = Object.assign({}, state);
      return newState;
    case "RECEIVE_GAME_LIST":
      newState = Object.assign({}, state);
      newState.games = action.games;
      newState.gameListLoaded = true;
      return newState;
    case "SELECT_QUESTION":
      newState = Object.assign({}, state);
      newState.currentGame[action.round].categories[action.categoryIndex].clues[action.clueIndex].isCompleted = true;
      return newState;
    case "UPDATE_SCORE":
      newState = Object.assign({}, state);
      if (action.delta > 0) {
        newState.currentGameCorrect = newState.currentGameCorrect + 1;
      } else {
        newState.currentGameIncorrect = newState.currentGameIncorrect + 1;
      }

      newState.score = newState.score + action.delta;
      return newState;
    case "NEXT_ROUND":
      newState = Object.assign({}, state);
      newState.currentRound = action.nextRound;
      return newState;
    case "BID_FINAL_JEOPARDY":
      newState = Object.assign({}, state);
      newState.final_jeopardy.categories[0].value = "$" + action.bid;
      return newState;
    default:
      return state;
  }

};


var store = createStore(huarteApp, applyMiddleware(thunkMiddleware, loggerMiddleware));

let _ = require("lodash");
let levenshtein = require("fast-levenshtein")


//*************************
// UTILITY FUNCTIONS
//*************************

var Common = {
  renderLoadingView: function() {
    return (
        <View style={styles.container}>
          <Text>
            Loading...
          </Text>
        </View>
      );
  },


  saveStatistics: function(state) { 
    this.changeNumericAsyncStorage("total_winnings", state.currentScore);
    this.changeNumericAsyncStorage("total_correct", state.currentGameCorrect);
    this.changeNumericAsyncStorage("total_incorrect", state.currentGameIncorrect);
  },


  // used to take existing value and apply a change to it, not to set a new value
  changeNumericAsyncStorage: function(key, delta) {
        AsyncStorage.getItem(key).then((value) => {

      if (!value) {
        value = 0;
      }

      AsyncStorage.setItem(key, value + delta);

    }).done();
  }


};

//*************************
// VIEWS
//*************************


var FinalJeopardyBid = React.createClass({
  getInitialState: function() {
    return {
      text: ""
    };
  },



  validateBid: function() {
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

    store.dispatch(bidFinalJeopardy(bid));
    let finalJeopardyClue = state.final_jeopardy.categories[0];
    this.props.navigator.push({
      title: "Final Jeopardy",
      navigationBarHidden: true,
      component: Question,
      passProps: {
        clue: finalJeopardyClue
      }
    });

  },

  render: function() {
    var state = store.getState();


     return (
      <View>
        <Text style={styles.question}>
          What is your bid? You have {state.score} to wager.
        </Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({text})}
          onSubmitEditing={() => this.validateBid()}
          value={this.state.text}
          keyboardType="numeric"
          autoFocus
        />
        <Text>{this.state.errorMessage}</Text>
      </View>
    );
  }
});


// FIXFIX: a lot of shared logic with final jeopardy bid. like, 90% the same
var DailyDoubleBid = React.createClass({
  getInitialState: function() {
    return {
      text: ""
    };
  },



  validateBid: function() {
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
        clue: this.props.clue
      }
    });

  },

  render: function() {
    var state = store.getState();


     return (
      <View>
        <Text style={styles.question}>
          What is your bid? You have {state.score} to wager.
        </Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({text})}
          onSubmitEditing={() => this.validateBid()}
          value={this.state.text}
          keyboardType="numeric"
          autoFocus
        />
        <Text>{this.state.errorMessage}</Text>
      </View>
    );
  }
});

var Question = React.createClass({
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
    var state = store.getState();
    var round = state.currentRound;
    var returnValue = true;

    _.each(state.currentGame[round].categories, function(category){
      _.each(category.clues, function(clue){
        if(!clue.isCompleted) {
          returnValue = false;
        }
      })

    });

    return returnValue;

  },

  setAnswerStatus: function(wasCorrect, wasntQuiteCorrect){
    var answeredQuestion = true;
    this.setState({wasCorrect, wasntQuiteCorrect, answeredQuestion})
    var delta = this.getDelta(wasCorrect || wasntQuiteCorrect);
    store.dispatch(updateScore(delta));
   
    //store.dispatch(nextRound("double_jeopardy")) easy to skip to FJ while debugging via this
    if (this.checkIfAllQuestionsAnswered()) {
      store.dispatch(nextRound(store.getState().currentRound));
    }

    setTimeout(() => {

      if (this.props.clue.isDailyDouble) {
        this.props.navigator.popN(3); // have an extra screen for bidding
      }
      else {
        this.props.navigator.popN(2); // not ideal, but popToRoute is undocumented / doesn't seem to work right
      }

    }, 3000);
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
          onSubmitEditing={() => this.checkAnswer()}
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
    store.dispatch(selectQuestion(store.getState().currentRound, this.props.categoryIndex, clueIndex));

    if (clue.isDailyDouble) {
      this.props.navigator.push({
        title: "Daily Double!",
        component: DailyDoubleBid,
        passProps: {
          clue,
          clueIndex
        }
      })

    } else {
      this.props.navigator.push({
        title: clue.value,
        navigationBarHidden: true,
        component: Question,
        passProps: {
          clue
        }
      });  
    }



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
      dataSource: dataSource.cloneWithRows([])
    };
  },

  componentDidMount: function() {
    store.subscribe(() => {
      var state = store.getState();
      if (state.gameLoaded) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(state.currentGame[state.currentRound].categories)
        });
      }
    });
    store.dispatch(fetchGame(this.props.game.id));
  },


  selectCategory: function(category, categoryIndex) {
    if (store.getState().currentRound === FINAL_JEOPARDY) {
      this.props.navigator.push({
        title: "Final Jeopardy",
        navigationBarHidden: true,
        component: FinalJeopardyBid,
        passProps: {
          category
        }
      })

    } else {

      this.props.navigator.push({
        title: category.name,
        component: DollarAmountList,
        passProps: {
          category,
          categoryIndex
        },
      });

    }
  },

  render: function() {
    if(!store.getState().gameLoaded) {
      return Common.renderLoadingView();
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(category, sectionID, categoryIndex) => this.renderCategory(category, categoryIndex)}
        renderFooter={() => this.renderFooter()}
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

  getRoundDisplayName: function() {
    var round = store.getState().currentRound;
    round = round.slice(0,1).toUpperCase() + round.slice(1);
    round = round.replace("_", " ")
    return round
  },

  renderFooter: function() {
    var roundisplayName = this.getRoundDisplayName();
    return (
      <Text>Current Score: {store.getState().score} - {roundisplayName} Round</Text>
    )
  },

});

var GameList = React.createClass({
  getInitialState: function() {
    var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
    });
    return {
      dataSource: dataSource.cloneWithRows([])
    };
  },

  componentDidMount: function() {
    store.subscribe(() => {
      var state = store.getState();
      if (state.gameListLoaded) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(state.games)
        });
      }
    });
    store.dispatch(fetchGameList(this.props.season.id));
  },

  selectGame: function(game, gameIndex) {
    this.props.navigator.push({
      title: game.displayName,
      component: CategoryList,
      passProps: {
        game,
        gameIndex
      },
    });
  },

  render: function() {
    if (!store.getState().gameListLoaded) {
      return Common.renderLoadingView();
    } 
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(game, sectionID, gameIndex) => this.renderGame(game, gameIndex)}
        style={styles.listView}/>
      )
  },

  renderGame: function(game, gameIndex) {
    return (
      <Text style={styles.listItem}
        onPress={() => this.selectGame(game, gameIndex)}>
        {game.displayName}
      </Text>
      )
  }
});


var SeasonList = React.createClass({
   getInitialState: function() {
    var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
    });
    return {
      dataSource: dataSource.cloneWithRows([])
    };
  },

  componentDidMount: function() {
    store.subscribe(() => {
      var state = store.getState();
      if (state.seasonsLoaded) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(state.seasons)
        });
      }
    });
    store.dispatch(fetchSeasons());
  },


  selectSeason: function(season, seasonIndex) {
    this.props.navigator.push({
      title: season.displayName,
      component: GameList,
      passProps: {
        season,
        seasonIndex
      },
    });
  },

  render: function() {
    if(!store.getState().seasonsLoaded) {
      return Common.renderLoadingView();
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(season, sectionID, seasonIndex) => this.renderSeason(season, seasonIndex)}
        style={styles.listView}/>
    )
  },

  renderSeason: function(season, seasonIndex) {
    return (
      <Text style={styles.listItem}
        onPress={() => this.selectSeason(season, seasonIndex)}>
        {season.displayName}
      </Text>
    );
  }
});

var huarte = React.createClass({

 render: function() {
  return (
    <NavigatorIOS
      ref="nav"
      style={styles.container}
      initialRoute={{
        title: 'Seasons',
        component: SeasonList
      }}/>
  );
 }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listItem: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
    color: 'white'
  },
  listItemDisabled: {
    color: '#ececec'
  },
  listView: {
    paddingTop: 70,
    backgroundColor: '#0000af',
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
// I promise I will actually use things like modules and files once this gets to 1000 lines.
