import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import GameList from '../app/components/GameList';
import Factory from '../testHelpers/Factory';
import { receiveSeasons, receiveGameList } from '../app/actions/index';

jest.mock('../app/util/Api');

test('initially renders a loading screen', () => {
  const store = Factory.createNewStore();
  const seasonList = Factory.seasonList();
  store.dispatch(receiveSeasons(seasonList));
  const seasonModel = store.getState().seasons.find(season => season.seasonId === '33');

  const tree = renderer.create(
    <GameList store={store} season={seasonModel} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders a list of games after the games have been received', () => {
  const store = Factory.createNewStore();
  const seasonList = Factory.seasonList();
  const gameList = Factory.gameList();
  store.dispatch(receiveSeasons(seasonList));
  const seasonModel = store.getState().seasons.find(season => season.seasonId === '33');
  store.dispatch(receiveGameList(gameList, '33'));

  const tree = renderer.create(
    <GameList store={store} season={seasonModel} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
