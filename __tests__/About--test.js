import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import About from '../app/components/About';

test('renders correctly', () => {
  const tree = renderer.create(
    <About />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
