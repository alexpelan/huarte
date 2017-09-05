// see https://github.com/facebook/jest/issues/3707
jest.mock('TextInput', () => {
  const React = require('react'); // eslint-disable-line global-require
  const RealComponent = require.requireActual('TextInput');
  class TextInput extends React.Component {
    render() {
      delete this.props.autoFocus;
      return React.createElement('TextInput', this.props, this.props.children);
    }
  }
  TextInput.propTypes = RealComponent.propTypes;
  return TextInput;
});
