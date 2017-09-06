import 'react-native';
// Note: test renderer must be required after react-native.
import { defaultState, huarteApp } from '../app/reducers/huarteApp';

test('reducer tests', () => {
  expect(huarteApp(defaultState, 'REQUEST_GAME')).toMatchSnapshot();
  expect(huarteApp(defaultState, 'RECEIVE_GAME')).toMatchSnapshot();
  expect(huarteApp(defaultState, 'SELECT_GAME')).toMatchSnapshot();
  expect(huarteApp(defaultState, 'REQUEST_SEASONS')).toMatchSnapshot();
  expect(huarteApp(defaultState, 'RECEIVE_SEASONS')).toMatchSnapshot();
  expect(huarteApp(defaultState, 'REQUEST_GAME_LIST')).toMatchSnapshot();
  expect(huarteApp(defaultState, 'RECEIVE_GAME_LIST')).toMatchSnapshot();
  expect(huarteApp(defaultState, 'SELECT_QUESTION')).toMatchSnapshot();
  expect(huarteApp(defaultState, 'UPDATE_SCORE')).toMatchSnapshot();
  expect(huarteApp(defaultState, 'NEXT_ROUND')).toMatchSnapshot();
  expect(huarteApp(defaultState, 'BID_FINAL_JEOPARDY')).toMatchSnapshot();
  expect(huarteApp(defaultState, 'GLOBAL_SET_ERROR')).toMatchSnapshot();
  expect(huarteApp(defaultState, 'GLOBAL_DISMISS_ERROR')).toMatchSnapshot();
});
