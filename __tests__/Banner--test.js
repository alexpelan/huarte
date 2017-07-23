import 'react-native';
import React from 'react';
import Banner from '../app/components/Banner';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(
    <Banner errorMessage={"Something has gone wrong!"} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});