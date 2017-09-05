import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import Banner from '../app/components/Banner';

test('renders correctly', () => {
  const tree = renderer.create(
    <Banner errorMessage={'Something has gone wrong!'} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
