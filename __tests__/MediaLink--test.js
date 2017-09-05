import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import MediaLink from '../app/components/MediaLink';

test('audio link', () => {
  const tree = renderer.create(
    <MediaLink media={{ type: 'audio', url: 'https://www.google.com/myFile.mp3' }} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('image link', () => {
  const tree = renderer.create(
    <MediaLink media={{ type: 'image', url: 'https://www.google.com/myFile.jpg' }} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
