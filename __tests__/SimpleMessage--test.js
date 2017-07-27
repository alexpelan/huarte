import 'react-native';
import React from 'react';
import SimpleMessage from '../app/components/SimpleMessage';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(
    <SimpleMessage message={"Some simple text that is centered"} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});