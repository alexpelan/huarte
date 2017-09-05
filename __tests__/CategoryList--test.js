import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import CategoryList from '../app/components/CategoryList';
import Factory from '../testHelpers/Factory';
import Recipes from '../testHelpers/Recipes';
import { receiveSeasons, receiveGameList, selectGame } from '../app/actions/index';

jest.mock('../app/util/Api');

test('initially renders a loading view', () => {
  const store = Factory.createNewStore();
  const seasonList = Factory.seasonList();
  const gameList = Factory.gameList();
  store.dispatch(receiveSeasons(seasonList));
  store.dispatch(receiveGameList(gameList, '33'));
  const game = Factory.game();
  store.dispatch(selectGame(game));
  const tree = renderer.create(
    <CategoryList store={store} game={game} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly after data has been loaded', () => {
  const store = Factory.createNewStore();
  const game = Recipes.loadSingleGame(store);
  const tree = renderer.create(
    <CategoryList store={store} game={game} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
