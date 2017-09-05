import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import HuarteMainMenu from '../app/components/HuarteMainMenu';

test('renders correctly', () => {
  const tree = renderer.create(
    <HuarteMainMenu />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
