import StateHelper from '../util/StateHelper';
import CONSTS from '../util/Consts';
import api from '../util/Api';
import Common from '../util/Common';

function requestGame(gameId) {
  return {
    type: 'REQUEST_GAME',
    gameId,
  };
}

function receiveGame(json, gameId) {
  const timeLoaded = new Date();
  return {
    type: 'RECEIVE_GAME',
    game: json,
    gameId,
    timeLoaded,
  };
}

function selectGame(game) {
  return {
    type: 'SELECT_GAME',
    gameId: game.id,
  };
}

function requestSeasons() {
  return {
    type: 'REQUEST_SEASONS',
  };
}

function receiveSeasons(json) {
  Object.keys(json.seasons).forEach((seasonId) => {
    const season = json.seasons[seasonId];
    season.gamesLoaded = false;
    season.games = [];
  });
  const timeLoaded = new Date();
  return {
    type: 'RECEIVE_SEASONS',
    seasons: json.seasons,
    timeLoaded,
  };
}

function requestGameList() {
  return {
    type: 'REQUEST_GAME_LIST',
  };
}

function receiveGameList(json, seasonId) {
  Object.keys(json.games).forEach((gameId) => {
    const game = json.games[gameId];
    game.loaded = false;
  });
  const timeLoaded = new Date();
  return {
    type: 'RECEIVE_GAME_LIST',
    games: json.games,
    seasonId,
    timeLoaded,
  };
}

function selectQuestion(round, categoryIndex, clueIndex) {
  return {
    type: 'SELECT_QUESTION',
    round,
    categoryIndex,
    clueIndex,
  };
}

function updateScore(delta) {
  return {
    type: 'UPDATE_SCORE',
    delta,
  };
}

function nextRound(currentRound, store) {
  let nextRoundName;
  if (currentRound === 'jeopardy') {
    nextRoundName = 'double_jeopardy';
  } else if (currentRound === 'double_jeopardy') {
    nextRoundName = 'final_jeopardy';
  } else if (currentRound === 'final_jeopardy') {
    Common.saveSingleGameStatistics(StateHelper.getCurrentGame(store));
  }

  return {
    type: 'NEXT_ROUND',
    nextRoundName,
  };
}

function bidFinalJeopardy(bid) {
  return {
    type: 'BID_FINAL_JEOPARDY',
    bid,
  };
}

function setError(error) {
  return {
    type: 'GLOBAL_SET_ERROR',
    error,
  };
}

function dismissError() {
  return {
    type: 'GLOBAL_DISMISS_ERROR',
  };
}

function noop() {
  return {
    type: 'NOOP',
  };
}

//* ************************
// THUNKS
//* ************************
function fetchGameList(store, seasonId) {
  if (StateHelper.isSeasonLoaded(store, seasonId) &&
    StateHelper.isCacheValid(
      StateHelper.getSeasonById(store, seasonId).timeLoaded,
      CONSTS.MILLISECONDS_IN_DAY)
  ) {
    return noop();
  }

  return function (dispatch) {
    dispatch(requestGameList());

    return api.fetchGameList(seasonId, store)
      .then((json) => {
        dispatch(receiveGameList(json, seasonId));
      })
      .catch(() => {}); // FIXFIX: better way to handle this than empty catch?
    //                   We handle any errors in api.js
  };
}

function fetchSeasons(store) {
  if (StateHelper.isCacheValid(store.getState().seasonsLoadedTime, CONSTS.MILLISECONDS_IN_DAY)) {
    return noop();
  }

  return function (dispatch) {
    dispatch(requestSeasons());

    return api.fetchSeasonsList(store)
      .then((json) => {
        dispatch(receiveSeasons(json));
      })
      .catch(() => {});
  };
}

function fetchGame(store, gameId) {
  if (store.getState().games[gameId] &&
    store.getState().games[gameId].loaded &&
    StateHelper.isCacheValid(
      store.getState().games[gameId].timeLoaded,
      CONSTS.MILLISECONDS_IN_DAY)
  ) {
    return noop();
  }

  return function (dispatch) {
    // first dispatch that we are requesting
    dispatch(requestGame(gameId));

    // return a promise 
    return api.fetchGame(gameId, store)
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
  fetchSeasons,
};
