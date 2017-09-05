import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import SeasonList from '../app/components/SeasonList';
import Factory from '../testHelpers/Factory';
import { receiveSeasons } from '../app/actions/index';

jest.mock('../app/util/Api');

test('initially renders a loading screen', () => {
  const store = Factory.createNewStore();

  const tree = renderer.create(
    <SeasonList store={store} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders a list of seasons after the seasons have been received', () => {
  const store = Factory.createNewStore();
  const seasonList = Factory.seasonList();
  store.dispatch(receiveSeasons(seasonList));

  const tree = renderer.create(
    <SeasonList store={store} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
