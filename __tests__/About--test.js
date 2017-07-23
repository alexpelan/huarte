import 'react-native';
import React from 'react';
import About from '../app/components/About';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(
    <About />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});