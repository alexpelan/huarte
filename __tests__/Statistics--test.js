import 'react-native';
import React from 'react';
import Statistics from '../app/components/Statistics';
import MockStorage from '../testHelpers/MockStorage';

const storageCache = {};
const AsyncStorage = new MockStorage(storageCache);

jest.setMock('AsyncStorage', AsyncStorage);

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// FIXFIX: Right now this doesn't re-render in time to render the statistics
test('renders correctly', () => {
  const tree = renderer.create(
    <Statistics />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});