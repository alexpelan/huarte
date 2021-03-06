import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import FinalJeopardyBid from '../app/components/FinalJeopardyBid';
import Factory from '../testHelpers/Factory';
import Recipes from '../testHelpers/Recipes';

test('renders correctly', () => {
  const store = Factory.createNewStore();
  const game = Recipes.loadSingleGame(store);

  const tree = renderer.create(
    <FinalJeopardyBid store={store} category={game.jeopardy.categories[0]} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
