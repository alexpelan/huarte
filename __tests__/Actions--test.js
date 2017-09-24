import 'react-native';
import MockDate from 'mockdate';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Factory from '../testHelpers/Factory';
import { defaultState } from '../app/reducers/huarteApp';

import {
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
  fetchGameList,
  fetchSeasons,
  fetchGame,
} from '../app/actions/index';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore(defaultState);

const game = Factory.game();
const gameList = Factory.gameList();
const seasonList = Factory.seasonList();


it('creates a REQUEST_GAME action', () => {
  expect(requestGame('5401')).toMatchSnapshot();
});

it('creates a RECEIVE_GAME action', () => {
  MockDate.set(1434319925275);
  expect(receiveGame(game, '5401')).toMatchSnapshot();
  MockDate.reset();
});

it('creates a SELECT_GAME action', () => {
  expect(selectGame(game)).toMatchSnapshot();
});

it('creates a REQUEST_SEASONS action ', () => {
  expect(requestSeasons()).toMatchSnapshot();
});

it('creates a RECEIVE_SEASONS action', () => {
  MockDate.set(1434319925275);
  expect(receiveSeasons(seasonList)).toMatchSnapshot();
  MockDate.reset();
});

it('creates a REQUEST_GAME_LIST action', () => {
  expect(requestGameList()).toMatchSnapshot();
});

it('creates a RECEIVE_GAME_LIST action', () => {
  MockDate.set(1434319925275);
  expect(receiveGameList(gameList, '33')).toMatchSnapshot();
  MockDate.reset();
});

it('creates a SELECT_QUESTION action', () => {
  expect(selectQuestion('jeopardy', 0, 0)).toMatchSnapshot();
});

it('creates an UPDATE_SCORE action', () => {
  expect(updateScore(-200)).toMatchSnapshot();
});

it('creates a NEXT_ROUND action', () => {
  expect(nextRound('jeopardy')).toMatchSnapshot();
  expect(nextRound('double_jeopardy')).toMatchSnapshot();
});

it('creates a BID_FINAL_JEOPARDY action', () => {
  expect(bidFinalJeopardy(2000)).toMatchSnapshot();
});

it('creates a GLOBAL_SET_ERROR action', () => {
  expect(setError('Network error')).toMatchSnapshot();
});

it('creates a GLOBAL_DISMISS_ERROR action', () => {
  expect(dismissError()).toMatchSnapshot();
});

it('creates a NOOP action', () => {
  expect(noop()).toMatchSnapshot();
});

it('fetchGameList uses a thunk to request then receive the game list', async () => {
  fetch.mockResponseSuccess(Factory.gameList());
  await store.dispatch(fetchGameList(store, '33'));
  expect(store.getActions()).toMatchSnapshot();
});

it('fetchSeasons uses a thunk to request then receive the seasons list', async () => {
  fetch.mockResponseSuccess(Factory.seasonList());
  await store.dispatch(fetchSeasons(store));
  expect(store.getActions()).toMatchSnapshot();
});

it('fetchGame uses a thunk to request then receive an individual game', async () => {
  fetch.mockResponseSuccess(Factory.game());
  await store.dispatch(fetchGame(store, Factory.game().id));
  expect(store.getActions()).toMatchSnapshot();
});
