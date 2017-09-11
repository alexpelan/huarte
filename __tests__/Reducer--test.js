import 'react-native';
// Note: test renderer must be required after react-native.
import { defaultState, huarteApp } from '../app/reducers/huarteApp';
import Factory from '../testHelpers/Factory';

const game = Factory.game();
const gameList = Factory.gameList();
const seasonList = Factory.seasonList();
const timeLoaded = new Date(Date.UTC(1989, 6, 25));

test('reducer test - REQUEST_GAME', () => {
  const initialState = Object.assign({}, defaultState);
  const action = {
    type: 'REQUEST_GAME',
  };
  expect(huarteApp(initialState, action)).toMatchSnapshot();
});

test('reducer test - RECEIVE_GAME', () => {
  const initialState = Object.assign({}, defaultState);
  const action = {
    type: 'RECEIVE_GAME',
    game,
    timeLoaded,
    gameId: game.id,
  };

  expect(huarteApp(initialState, action)).toMatchSnapshot();
});

test('reducer test - SELECT_GAME', () => {
  const initialState = Object.assign({}, defaultState);
  const action = {
    type: 'SELECT_GAME',
    gameId: game.id,
  };

  expect(huarteApp(initialState, action)).toMatchSnapshot();
});

test('reducer test - REQUEST_SEASONS', () => {
  const initialState = Object.assign({}, defaultState);
  const action = {
    type: 'REQUEST_SEASONS',
  };
  expect(huarteApp(initialState, action)).toMatchSnapshot();
});

test('reducer test - RECEIVE_SEASONS', () => {
  const initialState = Object.assign({}, defaultState);
  const action = {
    type: 'RECEIVE_SEASONS',
    seasons: seasonList.seasons,
  };
  expect(huarteApp(initialState, action)).toMatchSnapshot();
});

test('reducer test - REQUEST_GAME_LIST', () => {
  const initialState = Object.assign({}, defaultState);
  const action = {
    type: 'REQUEST_GAME_LIST',
  };
  expect(huarteApp(initialState, action)).toMatchSnapshot();
});

test('reducer test - RECEIVE_GAME_LIST', () => {
  const initialState = Object.assign({}, defaultState);
  // it is assumed that we will first have done RECEIVE_SEASONS, so emulate that here
  const seasons = seasonList.seasons;
  seasons.forEach((season) => {
    season.games = []; // eslint-disable-line no-param-reassign
  });

  const receiveSeasonsAction = {
    type: 'RECEIVE_SEASONS',
    seasons: seasonList.seasons,
  };
  const result = huarteApp(initialState, receiveSeasonsAction);

  const action = {
    type: 'RECEIVE_GAME_LIST',
    seasonId: '33',
    games: gameList.games,
    timeLoaded,
  };

  expect(huarteApp(result, action)).toMatchSnapshot();
});

test('reducer test - GLOBAL_SET_ERROR', () => {
  const initialState = Object.assign({}, defaultState);
  const action = {
    type: 'GLOBAL_SET_ERROR',
    error: 'Something went wrong',
  };

  expect(huarteApp(initialState, action)).toMatchSnapshot();
});

test('reducer test - GLOBAL_DISMISS_ERROR', () => {
  const initialState = Object.assign({}, defaultState);
  const action = {
    type: 'GLOBAL_DISMISS_ERROR',
  };
  expect(huarteApp(initialState, action)).toMatchSnapshot();
});

test('reducer test - SELECT_QUESTION', () => {
  // assumes a game has been selected and received from the server as a prequisite
  const initialState = Object.assign({}, defaultState);

  const selectGameAction = {
    type: 'SELECT_GAME',
    gameId: game.id,
  };
  let state = huarteApp(initialState, selectGameAction);

  const receiveGameAction = {
    type: 'RECEIVE_GAME',
    game,
    timeLoaded,
    gameId: game.id,
  };
  state = huarteApp(state, receiveGameAction);

  const action = {
    type: 'SELECT_QUESTION',
    round: 'jeopardy',
    categoryIndex: 0,
    clueIndex: 0,
  };
  expect(huarteApp(state, action)).toMatchSnapshot();
});

test('reducer test - UPDATE_SCORE', () => {
  // assumes a game has been selected and received from the server as a prequisite
  const initialState = Object.assign({}, defaultState);

  const selectGameAction = {
    type: 'SELECT_GAME',
    gameId: game.id,
  };
  let state = huarteApp(initialState, selectGameAction);

  const receiveGameAction = {
    type: 'RECEIVE_GAME',
    game,
    timeLoaded,
    gameId: game.id,
  };
  state = huarteApp(state, receiveGameAction);

  const action = {
    type: 'UPDATE_SCORE',
    delta: 200,
  };

  expect(huarteApp(state, action)).toMatchSnapshot();
});

test('reducer test - NEXT_ROUND', () => {
  // assumes a game has been selected and received from the server as a prequisite
  const initialState = Object.assign({}, defaultState);

  const selectGameAction = {
    type: 'SELECT_GAME',
    gameId: game.id,
  };
  let state = huarteApp(initialState, selectGameAction);

  const receiveGameAction = {
    type: 'RECEIVE_GAME',
    game,
    timeLoaded,
    gameId: game.id,
  };
  state = huarteApp(state, receiveGameAction);

  const action = {
    type: 'NEXT_ROUND',
    nextRound: 'double_jeopardy',
  };

  expect(huarteApp(state, action)).toMatchSnapshot();
});

test('reducer test - BID_FINAL_JEOPARDY', () => {
  // assumes a game has been selected and received from the server as a prequisite
  const initialState = Object.assign({}, defaultState);

  const selectGameAction = {
    type: 'SELECT_GAME',
    gameId: game.id,
  };
  let state = huarteApp(initialState, selectGameAction);

  const receiveGameAction = {
    type: 'RECEIVE_GAME',
    game,
    timeLoaded,
    gameId: game.id,
  };
  state = huarteApp(state, receiveGameAction);

  // might as well, to make it more realistic
  const nextRoundAction = {
    type: 'NEXT_ROUND',
    nextRound: 'final_jeopardy',
  };
  state = huarteApp(state, nextRoundAction);

  const action = {
    type: 'BID_FINAL_JEOPARDY',
    bid: 1500,
  };

  expect(huarteApp(state, action)).toMatchSnapshot();
});

