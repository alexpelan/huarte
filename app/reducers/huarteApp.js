/* eslint-disable no-case-declarations */
import Common from '../util/Common';

const defaultState = {
  seasons: {},
  games: {},
  currentGameId: undefined,
  seasonsLoaded: false,
  seasonsLoadedTime: undefined,
  error: {
    isError: false,
    errorText: '',
  },
};

function huarteApp(state = defaultState, action) {
  let newState;
  switch (action.type) {
    case 'REQUEST_GAME':
      newState = Object.assign({}, state);
      return newState;
    case 'RECEIVE_GAME':
      newState = Object.assign({}, state);
      newState.games[action.gameId].jeopardy = action.game.jeopardy;
      newState.games[action.gameId].double_jeopardy = action.game.double_jeopardy;
      newState.games[action.gameId].final_jeopardy = action.game.final_jeopardy;
      newState.games[action.gameId].currentRound = 'jeopardy';
      newState.games[action.gameId].score = 0;
      newState.games[action.gameId].numberCorrect = 0;
      newState.games[action.gameId].numberIncorrect = 0;
      newState.games[action.gameId].loaded = true;
      newState.games[action.gameId].timeLoaded = action.timeLoaded;
      return newState;
    case 'SELECT_GAME':
      newState = Object.assign({}, state);
      newState.currentGameId = parseInt(action.gameId, 10);
      return newState;
    case 'REQUEST_SEASONS':
      newState = Object.assign({}, state);
      return newState;
    case 'RECEIVE_SEASONS':
      newState = Object.assign({}, state);
      newState.seasons = action.seasons;
      newState.seasonsLoaded = true;
      newState.seasonsLoadedTime = action.timeLoaded;
      return newState;
    case 'REQUEST_GAME_LIST':
      newState = Object.assign({}, state);
      return newState;
    case 'RECEIVE_GAME_LIST':
      newState = Object.assign({}, state);
      const seasonToUpdate = newState.seasons.find(season => season.seasonId === action.seasonId);
      Object.keys(action.games).forEach((gameId) => {
        newState.games[gameId] = action.games[gameId];
        seasonToUpdate.games.push(gameId);
      });
      seasonToUpdate.gamesLoaded = true;
      seasonToUpdate.timeLoaded = action.timeLoaded;
      return newState;
    case 'SELECT_QUESTION':
      newState = Object.assign({}, state);
      newState.games[state.currentGameId][action.round]
        .categories[action.categoryIndex]
        .clues[action.clueIndex].isCompleted = true;

      const modifiedCategory = newState.games[state.currentGameId][action.round]
        .categories[action.categoryIndex];
      let isCategoryCompleted = true;
      modifiedCategory.clues.forEach((clue) => {
        if (!clue.isCompleted) {
          isCategoryCompleted = false;
        }
      });

      if (isCategoryCompleted) {
        newState.games[state.currentGameId][action.round].categories[action.categoryIndex]
          .isCompleted = true;
      }

      return newState;
    case 'UPDATE_SCORE':
      newState = Object.assign({}, state);
      let wasCorrect = false;
      if (action.delta > 0) {
        wasCorrect = true;
      }

      Common.saveStatistics(wasCorrect, action.delta);

      const currentScore = state.games[state.currentGameId].score;
      newState.games[state.currentGameId].score = currentScore + action.delta;

      if (wasCorrect) {
        const newNumberCorrect = newState.games[state.currentGameId].numberCorrect + 1;
        newState.games[state.currentGameId].numberCorrect = newNumberCorrect;
      } else {
        const newNumberIncorrect = newState.games[state.currentGameId].numberIncorrect + 1;
        newState.games[state.currentGameId].numberIncorrect = newNumberIncorrect;
      }
      return newState;
    case 'NEXT_ROUND':
      newState = Object.assign({}, state);
      newState.games[state.currentGameId].currentRound = action.nextRound;
      return newState;
    case 'BID_FINAL_JEOPARDY':
      newState = Object.assign({}, state);
      newState.games[state.currentGameId].final_jeopardy.categories[0].value = `$${action.bid}`;
      return newState;
    case 'GLOBAL_SET_ERROR':
      newState = Object.assign({}, state);
      newState.error.isError = true;
      newState.error.errorText = action.error;
      return newState;
    case 'GLOBAL_DISMISS_ERROR':
      newState = Object.assign({}, state);
      newState.error.isError = false;
      newState.error.errorText = '';
      return newState;
    default:
      return state;
  }
}

export {
  defaultState,
  huarteApp,
};
