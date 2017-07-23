import 'react-native';
import React from 'react';
import Link from '../app/components/Link';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(
    <Link text={"Click me!"} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});