import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import Question from '../app/components/Question';
import Factory from '../testHelpers/Factory';
import Recipes from '../testHelpers/Recipes';


test('renders correctly', () => {
  const store = Factory.createNewStore();
  const game = Recipes.loadSingleGame(store);
  const categoryName = game.jeopardy.categories[0].name;
  const clue = game.jeopardy.categories[0].clues[0];

  const tree = renderer.create(
    <Question store={store} categoryName={categoryName} clue={clue} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
