import 'react-native';
// Note: test renderer must be required after react-native.
import { defaultState, huarteApp } from '../app/reducers/huarteApp';
import Factory from '../testHelpers/Factory';

const game = Factory.game();
const gameList = Factory.gameList();
const seasonList = Factory.seasonList();
const timeLoaded = new Date(1989, 6, 25);

test('reducer test - REQUEST_GAME', () => {
  const action = {
    type: 'REQUEST_GAME',
  };
  expect(huarteApp(defaultState, action)).toMatchSnapshot();
});

test('reducer test - RECEIVE_GAME', () => {
  const action = {
    type: 'RECEIVE_GAME',
    game,
    timeLoaded,
    gameId: game.id,
  };

  expect(huarteApp(defaultState, action)).toMatchSnapshot();
});

test('reducer test - SELECT_GAME', () => {
  const action = {
    type: 'SELECT_GAME',
    gameId: game.id,
  };

  expect(huarteApp(defaultState, action)).toMatchSnapshot();
});

test('reducer test - REQUEST_SEASONS', () => {
  const action = {
    type: 'REQUEST_SEASONS',
  };
  expect(huarteApp(defaultState, action)).toMatchSnapshot();
});

test('reducer test - RECEIVE_SEASONS', () => {
  const action = {
    type: 'RECEIVE_SEASONS',
    seasons: seasonList.seasons,
  };
  expect(huarteApp(defaultState, action)).toMatchSnapshot();
});

test('reducer test - REQUEST_GAME_LIST', () => {
  const action = {
    type: 'REQUEST_GAME_LIST',
  };
  expect(huarteApp(defaultState, action)).toMatchSnapshot();
});

test('reducer test - RECEIVE_GAME_LIST', () => {
  // it is assumed that we will first have done RECEIVE_SEASONS, so emulate that here
  const seasons = seasonList.seasons;
  seasons.forEach((season) => {
    season.games = []; // eslint-disable-line no-param-reassign
  });

  const receiveSeasonsAction = {
    type: 'RECEIVE_SEASONS',
    seasons: seasonList.seasons,
  };
  const result = huarteApp(defaultState, receiveSeasonsAction);

  const action = {
    type: 'RECEIVE_GAME_LIST',
    seasonId: '33',
    games: gameList.games,
    timeLoaded,
  };

  expect(huarteApp(result, action)).toMatchSnapshot();
});

test('reducer test - GLOBAL_SET_ERROR', () => {
  const action = {
    type: 'GLOBAL_SET_ERROR',
    error: 'Something went wrong',
  };

  expect(huarteApp(defaultState, action)).toMatchSnapshot();
});

test('reducer test - GLOBAL_DISMISS_ERROR', () => {
  const action = {
    type: 'GLOBAL_DISMISS_ERROR',
  };
  expect(huarteApp(defaultState, action)).toMatchSnapshot();
});

