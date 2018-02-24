import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import InputWithButton from '../app/components/InputWithButton';

test('renders correctly', () => {
  const tree = renderer.create(
    <InputWithButton
      text="Some sample text"
      onSubmit={() => true}
      onChangeText={() => true}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
