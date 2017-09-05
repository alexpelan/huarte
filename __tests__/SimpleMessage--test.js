import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import SimpleMessage from '../app/components/SimpleMessage';

test('renders correctly', () => {
  const tree = renderer.create(
    <SimpleMessage message={'Some simple text that is centered'} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
