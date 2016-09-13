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
      let wasCorrect = false;
      if (action.delta > 0) {
        wasCorrect = true;
      } 

      Common.saveStatistics(wasCorrect, action.delta);

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
  saveStatistics: function(wasCorrect, delta) { 
    this.changeNumericAsyncStorage("total_winnings", delta);
    if (wasCorrect) {
      this.changeNumericAsyncStorage("total_correct", 1);
    } else {
      this.changeNumericAsyncStorage("total_incorrect", 1);
    }
  },

  getStatistics: function() {
    return AsyncStorage.multiGet(["total_winnings", "total_correct", "total_incorrect"])
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
  },
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
    StatusBar.setBarStyle('light-content', true);
    var state = store.getState();


     return (
      <View style={styles.questionView}>
        <Text style={styles.question}>
          What is your bid? You have {state.score} to wager.
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
    var state = store.getState();


     return (
      <View style={styles.questionView}>
        <Text style={styles.question}>
          What is your bid? You have {state.score} to wager.
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
    StatusBar.setBarStyle('default', true);
    if(!store.getState().gameLoaded) {
      return (
          <SimpleMessage></SimpleMessage>
        );
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
      <Text style={styles.scoreText}>Current Score: {store.getState().score} - {roundisplayName} Round</Text>
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
    StatusBar.setBarStyle('default', true);
    if (!store.getState().gameListLoaded) {
      return (
          <SimpleMessage></SimpleMessage>
      );
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

const STATISTIC_DISPLAY_NAMES = {
  "total_winnings": "Total Winnings",
  "total_correct": "Total Correct",
  "total_incorrect": "Total Incorrect"
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
            <Text style={styles.scoreText} key={statistic[0]}> {STATISTIC_DISPLAY_NAMES[statistic[0]]}: {[statistic[1]]}</Text>
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
    color: '#ececec'
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
