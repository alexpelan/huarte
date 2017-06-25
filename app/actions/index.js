import StateHelper from "../util/StateHelper";
import CONSTS from "../util/Consts";
import api from "../util/Api";

function requestGame(gameId) { 
  return {
    type: "REQUEST_GAME",
    gameId: gameId
  };
}

function receiveGame(json, gameId) {
  const timeLoaded = new Date();
  return {
    type: "RECEIVE_GAME",
    game: json,
    gameId: gameId,
    timeLoaded
  };
}

function selectGame(game) {
  return {
    type: "SELECT_GAME",
    gameId: game.id
  };
}

function requestSeasons() {
  return {
    type: "REQUEST_SEASONS"
  };
}

function receiveSeasons(json) {
  Object.keys(json.seasons).forEach((seasonId) => {
    let season = json.seasons[seasonId];
    season.gamesLoaded = false;
    season.games = [];
  });
  const timeLoaded = new Date();
  return {
    type: "RECEIVE_SEASONS",
    seasons: json.seasons,
    timeLoaded
  };
}

function requestGameList() {
  return {
    type: "REQUEST_GAME_LIST",
  };
}

function receiveGameList(json, seasonId) {
  Object.keys(json.games).forEach((gameId) => {
    let game = json.games[gameId];
    game.loaded = false;
  });
  const timeLoaded = new Date();
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

function setError(error) {
  return {
    type: "GLOBAL_SET_ERROR",
    error: error
  };
}

function dismissError() {
  return {
    type: "GLOBAL_DISMISS_ERROR"
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
function fetchGameList(store, seasonId) {
  if (StateHelper.isSeasonLoaded(store, seasonId) && StateHelper.isCacheValid(store.getState().seasons[seasonId].timeLoaded, CONSTS.MILLISECONDS_IN_DAY)) {
    return noop();
  }

  return function(dispatch) {
    dispatch(requestGameList());

    return api.fetchGameList(seasonId, store)
      .then((json) => {
        dispatch(receiveGameList(json, seasonId));
      })
      .catch(() => {}); //FIXFIX: better way to handle this than empty catch? We handle any errors in api.js
  };
}

function fetchSeasons(store) {
  if (StateHelper.isCacheValid(store.getState().seasonsLoadedTime, CONSTS.MILLISECONDS_IN_DAY)) {
    return noop();
  }

  return function(dispatch) {
    dispatch(requestSeasons());

    return api.fetchSeasonsList(store)
      .then((json) => {
        dispatch(receiveSeasons(json));
      })
      .catch(() => {});
  };
}

function fetchGame(store, gameId) {
  if (store.getState().games[gameId].loaded && StateHelper.isCacheValid(store.getState().games[gameId].timeLoaded, CONSTS.MILLISECONDS_IN_DAY)) {
    return noop();
  }

  return function(dispatch) {
    //first dispatch that we are requesting
    dispatch(requestGame(gameId));

    //return a promise 
    return  api.fetchGame(gameId, store)
      .then((json) => {
        dispatch(receiveGame(json, gameId));
      })
      .catch(() => {});

  };  
}

export {
  requestGame,
  receiveGame,
  selectGame,
  requestSeasons,
  receiveSeasons,
  requestGameList,
  receiveGameList,
  selectQuestion,
  updateScore,
  nextRound,
  bidFinalJeopardy,
  setError,
  dismissError,
  noop,
  fetchGame,
  fetchGameList,
  fetchSeasons
};