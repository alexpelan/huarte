import 'react-native';
import React from 'react';
import HuarteMainMenu from '../app/components/HuarteMainMenu';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(
    <HuarteMainMenu />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});