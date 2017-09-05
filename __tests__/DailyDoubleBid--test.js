import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import DailyDoubleBid from '../app/components/DailyDoubleBid';
import Factory from '../testHelpers/Factory';
import Recipes from '../testHelpers/Recipes';

jest.mock('../app/util/Api');

test('renders correctly', () => {
  const store = Factory.createNewStore();
  const game = Recipes.loadSingleGame(store);
  const tree = renderer.create(
    <DailyDoubleBid store={store} game={game} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
