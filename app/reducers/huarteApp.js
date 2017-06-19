import Common from "../util/Common";

let defaultState = {
    seasons: {},
    games: {},
    currentGameId: undefined,
    seasonsLoaded: false,
    seasonsLoadedTime: undefined
};

function huarteApp(state = defaultState, action) {
  var newState;
  switch(action.type) {
    case "REQUEST_GAME":
      newState = Object.assign({}, state);
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
    case "SELECT_GAME":
      newState = Object.assign({}, state);
      newState.currentGameId = parseInt(action.gameId);
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

      var currentScore = state.games[state.currentGameId].score;
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

}

export default huarteApp;