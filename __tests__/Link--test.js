import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import Link from '../app/components/Link';

test('renders correctly', () => {
  const tree = renderer.create(
    <Link text={'Click me!'} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
