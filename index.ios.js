'use strict';
import React, {
  AsyncStorage,
  AppRegistry,
  Component,
  Image,
  Linking,
  ListView,
  NavigatorIOS,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  WebView,
  View
} from 'react-native';

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

const loggerMiddleware = createLogger();

let defaultState = {
    seasons: {},
    games: {},
    currentGameId: undefined,
    seasonsLoaded: false,
    seasonsLoadedTime: undefined
};
//*************************
// CONSTS
//*************************
const JEOPARDY = "jeopardy";
const DOUBLE_JEOPARDY = "double_jeopardy";
const FINAL_JEOPARDY = "final_jeopardy";
const GAME_REQUEST_URL = 'http://localhost:3000/api/games/';
const SEASONS_REQUEST_URL = "http://localhost:3000/api/";
const GAME_LIST_REQUEST_URL = "http://localhost:3000/api/seasons/";
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

//*************************
// ACTIONS
//*************************
function requestGame(gameId) { 
  return {
    type: "REQUEST_GAME",
    gameId: gameId
  };
};

function receiveGame(json, gameId) {
  const timeLoaded = new Date()
  return {
    type: "RECEIVE_GAME",
    game: json,
    gameId: gameId,
    timeLoaded
  };
};

function requestSeasons() {
  return {
    type: "REQUEST_SEASONS"
  };
};

function receiveSeasons(json) {
  Object.keys(json.seasons).forEach((seasonId) => {
    let season = json.seasons[seasonId];
    season.gamesLoaded = false;
    season.games = [];
  });
  const timeLoaded = new Date()
  return {
    type: "RECEIVE_SEASONS",
    seasons: json.seasons,
    timeLoaded
  };
};

function requestGameList() {
  return {
    type: "REQUEST_GAME_LIST",
  };
};

function receiveGameList(json, seasonId) {
  Object.keys(json.games).forEach((gameId) => {
    let game = json.games[gameId];
    game.loaded = false;
  });
  const timeLoaded = new Date()
  return {
    type: "RECEIVE_GAME_LIST",
    games: json.games,
    seasonId, 
    timeLoaded
  };
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
  };
};

function nextRound(currentRound) {
  var nextRound;
  if (currentRound === "jeopardy") {
    nextRound = "double_jeopardy";
  } else if (currentRound === "double_jeopardy") {
    nextRound = "final_jeopardy";
  } else if (currentRound === "final_jeopardy") {
    Common.saveSingleGameStatistics(StateHelper.getCurrentGame());
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

function noop() {
  return {
    type: "NOOP"
  };
}

//*************************
// THUNKS
//*************************
function fetchGame(gameId) {
  if (store.getState().games[gameId].loaded && StateHelper.isCacheValid(store.getState().games[gameId].timeLoaded, MILLISECONDS_IN_DAY)) {
    return noop();
  }

  return function(dispatch) {
    //first dispatch that we are requesting
    dispatch(requestGame(gameId));

    //return a promise 
    return  fetch(GAME_REQUEST_URL + gameId)
      .then((response) => response.json())
      .then((json) => {
        dispatch(receiveGame(json, gameId));
      });

    //FIXFIX: handle failure
  };  
};

function fetchSeasons() {
  if (StateHelper.isCacheValid(store.getState().seasonsLoadedTime, MILLISECONDS_IN_DAY)) {
    return noop();
  }

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
  if (StateHelper.isSeasonLoaded(seasonId) && StateHelper.isCacheValid(store.getState().seasons[seasonId].timeLoaded, MILLISECONDS_IN_DAY)) {
    return noop();
  }

  return function(dispatch) {
    dispatch(requestGameList());

    return fetch(GAME_LIST_REQUEST_URL + seasonId)
      .then((response) => response.json())
      .then((json) => {
        dispatch(receiveGameList(json, seasonId));
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
      newState.currentGameId = parseInt(action.gameId);
      return newState; 
    case "RECEIVE_GAME":
      newState = Object.assign({},state);
      newState.games[action.gameId].jeopardy = action.game.jeopardy;
      newState.games[action.gameId].double_jeopardy = action.game.double_jeopardy;
      newState.games[action.gameId].final_jeopardy = action.game.final_jeopardy;
      newState.games[action.gameId].currentRound = "jeopardy";
      newState.games[action.gameId].score = 0;
      newState.games[action.gameId].numberCorrect = 0;
      newState.games[action.gameId].numberIncorrect = 0;
      newState.games[action.gameId].loaded = true;
      newState.games[action.gameId].timeLoaded = action.timeLoaded;
      return newState;
    case "REQUEST_SEASONS":
      newState = Object.assign({}, state);
      return newState;
    case "RECEIVE_SEASONS":
      newState = Object.assign({}, state);
      newState.seasons = action.seasons;
      newState.seasonsLoaded = true;
      newState.seasonsLoadedTime = action.timeLoaded;
      return newState;
    case "REQUEST_GAME_LIST":
      newState = Object.assign({}, state);
      return newState;
    case "RECEIVE_GAME_LIST":
      newState = Object.assign({}, state);
      Object.keys(action.games).forEach((gameId) => {
        newState.games[gameId] = action.games[gameId];
        newState.seasons[action.seasonId].games.push(gameId); 
      });
      newState.seasons[action.seasonId].gamesLoaded = true;
      newState.seasons[action.seasonId].timeLoaded = action.timeLoaded;
      return newState;
    case "SELECT_QUESTION":
      newState = Object.assign({}, state);
      newState.games[state.currentGameId][action.round].categories[action.categoryIndex].clues[action.clueIndex].isCompleted = true;
      return newState;
    case "UPDATE_SCORE":
      newState = Object.assign({}, state);
      let wasCorrect = false;
      if (action.delta > 0) {
        wasCorrect = true;
      } 

      Common.saveStatistics(wasCorrect, action.delta);

      var currentScore = state.games[state.currentGameId].score
      newState.games[state.currentGameId].score = currentScore + action.delta;

      if (wasCorrect) {
        newState.games[state.currentGameId].numberCorrect = newState.games[state.currentGameId].numberCorrect + 1;
      } else {
        newState.games[state.currentGameId].numberIncorrect = newState.games[state.currentGameId].numberIncorrect + 1;
      }
      return newState;
    case "NEXT_ROUND":
      newState = Object.assign({}, state);
      newState.games[state.currentGameId].currentRound = action.nextRound;
      return newState;
    case "BID_FINAL_JEOPARDY":
      newState = Object.assign({}, state);
      newState.games[state.currentGameId].final_jeopardy.categories[0].value = "$" + action.bid;
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

const Common = {
  saveStatistics: function(wasCorrect, delta) { 
    this.changeNumericAsyncStorage("total_winnings", delta);
    if (wasCorrect) {
      this.changeNumericAsyncStorage("total_correct", 1);
    } else {
      this.changeNumericAsyncStorage("total_incorrect", 1);
    }
  },

  saveSingleGameStatistics: function(game) {
    this.changeNumericAsyncStorage("games_completed", 1);
    this.changeNumericAsyncStorage("total_winnings_completed_games", game.score);
    this.changeNumericAsyncStorage("total_correct_completed_games", game.numberCorrect);
    this.changeNumericAsyncStorage("total_incorrect_completed_games", game.numberIncorrect);
  },

  getStatistics: function() {
    return AsyncStorage.multiGet(["total_winnings", "total_correct", "total_incorrect", "games_completed", "total_winnings_completed_games",
                                  "total_correct_completed_games", "total_incorrect_completed_games"])
  },

  // used to take existing value and apply a change to it, not to set a new value
  changeNumericAsyncStorage: function(key, delta) {
    AsyncStorage.getItem(key).then((value) => {

      if (!value) {
        value = 0;
      } else {
        value = parseInt(value);
      }

      value = value + delta;
      value = value.toString();

      AsyncStorage.setItem(key, value);

    }).done();
  }
};

const StateHelper = {
  isSeasonLoaded: function (seasonId) {
    return store.getState().seasons[seasonId].gamesLoaded;
  },

  getReferences: function (listOfIds, keyName) {
    var references = {};
    listOfIds.forEach((id) => {
      references[id] = store.getState()[keyName][id];
    });
    return references;
  },

  transformObjectToListDataSource: function(obj) {
    var list = []
    for (var property in obj) {
      var listItem = obj[property];
      listItem.id = property;
      list.push(listItem);
    }
    return list.sort(function(a, b){
      return b.id - a.id;
    });
  },

  getCurrentGame: function() {
    var state = store.getState();
    if (state.currentGameId) {
      var game = state.games[state.currentGameId];
      return game;
    } else {
      return {};
    }
  },

  getCurrentRound: function() {
    var game = this.getCurrentGame();
    return game[game.currentRound];
  },

  isCacheValid: function(time, expirationTime) {
    return (new Date() - expirationTime) < time;
  }
};

//*************************
// VIEWS
//*************************

const Link = React.createClass({
  render: function () {
    return (
      <Text style={styles.hyperlink} onPress={() => { Linking.openURL(this.props.url)}}>
        {this.props.text}
      </Text>
      );
  }
});

const SimpleMessage = React.createClass({
  getDefaultProps: function() {
    return {
      message: "Loading..."
    };
  },

  render: function() {
    return (
      <View style={styles.loadingView}>
        <Text style={styles.loadingText}>
          {this.props.message}
        </Text>
      </View>
    );
  }
});  

// Should this be truly polymorphic? 
const MediaLink = React.createClass({

  linkText: function() {
    if (this.props.media.type === "audio") {
      return "Play audio";
    } else if (this.props.media.type === "image") {
      return "View image";
    } 
  },

  showMedia: function() {
    this.props.navigator.push({
      title: "Media",
      component: MediaWebView,
      passProps: {
        url: this.props.media.url
      }
    })
  },

  render: function() {
    return (
        <Text style={[styles.hyperlink, styles.scoreText]} onPress={() => { this.showMedia()}}>{this.linkText()}</Text>
      );
  }
});

const MediaWebView = React.createClass({

  onError: function() {
    this.props.navigator.replace({
      title: "Error",
      component: SimpleMessage,
      passProps: {
        message: "There was an error loading the image"
      }
    })
  },

  render: function() {
    return (
      <WebView
        source={{uri: this.props.url}}
        onError={this.onError}
      />
    );
  }

}); 

const FinalJeopardyBid = React.createClass({
  getInitialState: function() {
    return {
      text: ""
    };
  },



  validateBid: function() {
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
        clue: finalJeopardyClue
      }
    });

  },

  render: function() {
    StatusBar.setBarStyle('light-content', true);
    var score = StateHelper.getCurrentGame().score;


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


// FIXFIX: a lot of shared logic with final jeopardy bid. like, 90% the same
const DailyDoubleBid = React.createClass({
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
    StatusBar.setBarStyle('light-content', true);
    var score= StateHelper.getCurrentGame().score;


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

    _.each(StateHelper.getCurrentRound().categories, function(category){
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
      store.dispatch(nextRound(StateHelper.getCurrentGame().currentRound));
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
    StatusBar.setBarStyle('light-content', true);
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
      <View style={styles.questionView}>
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

const DollarAmountList = React.createClass({
  getInitialState: function () {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row !== row2
    });
    return {
      dataSource: dataSource.cloneWithRows(this.props.category.clues)
    };
  },

  selectClue: function(clue, clueIndex) {
    store.dispatch(selectQuestion(StateHelper.getCurrentGame().currentRound, this.props.categoryIndex, clueIndex));

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
    StatusBar.setBarStyle('default', true);
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(clue, sectionId, clueIndex) => this.renderClue(clue, clueIndex)}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
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

const CategoryList = React.createClass({
   getInitialState: function() {
    var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
    });
    return {
      dataSource: dataSource.cloneWithRows([])
    };
  },

  componentDidMount: function() {
    this.unsubscribe = store.subscribe(() => {
      if (this.hasLoaded()) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(StateHelper.getCurrentRound().categories)
        });
      }
    });
    store.dispatch(fetchGame(this.props.game.id));
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  hasLoaded: function() {
    return StateHelper.getCurrentGame().loaded;
  },

  selectCategory: function(category, categoryIndex) {
    if (StateHelper.getCurrentGame().currentRound === FINAL_JEOPARDY) {
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
    StatusBar.setBarStyle('default', true);
    if(!this.hasLoaded()) {
      return (
          <SimpleMessage></SimpleMessage>
        );
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(category, sectionID, categoryIndex) => this.renderCategory(category, categoryIndex)}
        renderFooter={() => this.renderFooter()}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
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
    var round = StateHelper.getCurrentGame().currentRound;
    round = round.slice(0,1).toUpperCase() + round.slice(1);
    round = round.replace("_", " ")
    return round
  },

  renderFooter: function() {
    var roundDisplayName = this.getRoundDisplayName();
    return (
      <Text style={styles.scoreText}>Current Score: {StateHelper.getCurrentGame().score} - {roundDisplayName} Round</Text>
    )
  },

});

const GameList = React.createClass({
  getInitialState: function() {
    var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
    });
    return {
      dataSource: dataSource.cloneWithRows([])
    };
  },

  componentDidMount: function() {
    this.unsubscribe = store.subscribe(() => {
      var state = store.getState();
      if (this.hasLoaded()) {
        const games = StateHelper.getReferences(this.props.season.games, "games");
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(StateHelper.transformObjectToListDataSource(games))
        });
      }
    });
    store.dispatch(fetchGameList(this.props.season.id));
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  hasLoaded: function() {
    return StateHelper.isSeasonLoaded(this.props.season.id);
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
    StatusBar.setBarStyle('default', true);
    if (!this.hasLoaded()) {
      return (
          <SimpleMessage></SimpleMessage>
      );
    } 
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(game, sectionID, gameIndex) => this.renderGame(game, gameIndex)}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
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

const STATISTIC_METADATA = {
  total_winnings: {
    displayName: "Total Winnings",
  },
  total_correct: {
    displayName: "Total Correct",
  },
  total_incorrect: {
    displayName: "Total Incorrect",
  },
  games_completed: {
    displayName: "Games Completed",
  },
  total_winnings_completed_games: {
    displayName: "Average Winnings",
    divisor: "games_completed"
  },
  total_correct_completed_games: {
    displayName: "Average Correct",
    divisor: "games_completed"
  },
  total_incorrect_completed_games: {
    displayName: "Average Incorrect",
    divisor: "games_completed"
  }
};

const Statistics = React.createClass({
  getInitialState: function() {
    return {
      hasLoaded: false,
      statistics: []
    };
  },

  componentDidMount: function() {
    Common.getStatistics().then((statistics) => {
      statistics.forEach((stat) => {
        if (!stat[1]) {
          stat[1] = 0;
        }

        if (STATISTIC_METADATA[stat[0].divisor]) {
          const divisor = statistics[stats[0].divisor][1];
          if (divisor !== 0) {
            stat[1] = stat[1] / divisor;
          }
        }

      });

      this.setState({
        hasLoaded: true,
        statistics: statistics
      })
    })
  },

  render: function() {
    StatusBar.setBarStyle('default', true);
    if (!this.state.hasLoaded) {
      return (
          <SimpleMessage></SimpleMessage>
      );
    }

    return (
      <View style={[styles.loadingView, styles.paragraphView]}>
        <Text style={styles.loadingText}> Statistics </Text>
        {this.state.statistics.map((statistic) => {
          return (
            <Text style={styles.scoreText} key={statistic[0]}> {STATISTIC_METADATA[statistic[0]].displayName}: {[statistic[1]]}</Text>
            );
        })}
      </View>
      )
  }
});

const About = React.createClass({
  render: function() {
    StatusBar.setBarStyle('default', true);
    return (
      <View style={[styles.loadingView, styles.paragraphView]}>
        <Text style={styles.loadingText}>
          Huarte is a game by <Link text="Alex Pelan," url="http://www.alexpelan.com"/> a software developer in Brooklyn, NY. The questions and answers are from <Link text="J-Archive." url="www.j-archive.com"/> The app was built using Facebook's <Link text="React Native" url="https://facebook.github.io/react-native/"/> framework and its source is fully available <Link text="here." url="https://github.com/alexpelan/huarte"/>
        </Text>
      </View>
      )
  }
}) 


const SeasonList = React.createClass({
   getInitialState: function() {
    var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
    });
    return {
      dataSource: dataSource.cloneWithRows([])
    };
  },

  componentDidMount: function() {
    this.unsubscribe = store.subscribe(() => {
      var state = store.getState();
      if (state.seasonsLoaded) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(StateHelper.transformObjectToListDataSource(state.seasons))
        });
      }
    });
    store.dispatch(fetchSeasons());
  },

  componentWillUnmount: function() {
    this.unsubscribe();
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
    StatusBar.setBarStyle('default', true);
    if(!store.getState().seasonsLoaded) {
      return (
          <SimpleMessage></SimpleMessage>
      );
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(season, sectionID, seasonIndex) => this.renderSeason(season, seasonIndex)}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
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

const HUARTE_MENU_DATASOURCE = [
  {
    displayName: "Play",
    component: SeasonList
  },
  {
    displayName: "Statistics",
    component: Statistics
  },
  {
    displayName: "About",
    component: About
  }
];

const HuarteMainMenu = React.createClass({
  getInitialState: function() {
    var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
    });
    return {
      dataSource: dataSource.cloneWithRows(HUARTE_MENU_DATASOURCE)
    };
  },


  render: function() {
    StatusBar.setBarStyle('default', true);
    return (
      <ListView
        dataSource = {this.state.dataSource}
        renderRow={(menuItem) => this.renderMenuRow(menuItem)}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
        style={styles.listView}/>
      )
  },

  renderMenuRow: function(menuItem) {
    return (
      <Text style={styles.listItem}
        onPress={() => this.selectMenuItem(menuItem)}>
        {menuItem.displayName}
      </Text>
    );
  },

  selectMenuItem: function(menuItem) {
    this.props.navigator.push({
      title: menuItem.displayName,
      component: menuItem.component
    })
  }

});

const huarte = React.createClass({

 render: function() {
  return (
    <NavigatorIOS
      ref="nav"
      style={styles.container}
      initialRoute={{
        title: 'Huarte',
        component: HuarteMainMenu
      }}/>
  );
 }
})

const STYLE_CONSTS = {
  JEOPARDY_BLUE: "#0000af"
};

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
    color: STYLE_CONSTS.JEOPARDY_BLUE,
  },
  listView: {
    paddingTop: 70,
    backgroundColor: STYLE_CONSTS.JEOPARDY_BLUE,
  },
  question: {
    paddingTop: 100,
    fontSize: 20,
    color: 'white',
    paddingLeft: 20,
    paddingRight: 20
  },
  textInput: {
    height: 40, 
    borderColor: 'white', 
    borderWidth: 1,
    color: 'white',
    paddingLeft: 10,
    paddingRight: 10
  },
  loadingView: {
    flex: 1,
    backgroundColor: STYLE_CONSTS.JEOPARDY_BLUE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paragraphView: {
    paddingLeft: 20,
    paddingRight: 20
  },
  loadingText: {
    color: 'white',
    fontSize: 24
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },
  questionView: {
    flex: 1,
    backgroundColor: STYLE_CONSTS.JEOPARDY_BLUE,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  hyperlink: {
    textDecorationLine: 'underline'
  }

});

AppRegistry.registerComponent('huarte', () => huarte);
// I promise I will actually use things like modules and files once this gets to 1000 lines.
