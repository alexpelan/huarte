import { StyleSheet } from 'react-native';

const STYLE_CONSTS = {
  JEOPARDY_BLUE: '#0000af',
  ERROR_BACKGROUND: '#ff0033',
};

const styles = StyleSheet.create({
  bid: {
    paddingTop: 100,
    fontSize: 20,
    color: 'white',
    paddingLeft: 20,
    paddingRight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listItem: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
    color: 'white',
  },
  listItemDisabled: {
    color: STYLE_CONSTS.JEOPARDY_BLUE,
  },
  listView: {
    paddingTop: 70,
    backgroundColor: STYLE_CONSTS.JEOPARDY_BLUE,
  },
  questionHeader: {
    paddingTop: 40,
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  question: {
    paddingTop: '5%',
    fontSize: 20,
    color: 'white',
    paddingLeft: 20,
    paddingRight: 20,
  },
  textInput: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
  textInputWithButton: {
    width: '80%',
  },
  buttonWithTextinput: {
    width: '20%',
  },
  button: {
    color: 'white',
  },
  questionTextInput: {
    marginTop: 20,
  },
  loadingView: {
    flex: 1,
    backgroundColor: STYLE_CONSTS.JEOPARDY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paragraphView: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 24,
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  negativeAction: {
    color: 'red',
    fontSize: 18,
  },
  questionView: {
    flex: 1,
    backgroundColor: STYLE_CONSTS.JEOPARDY_BLUE,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hyperlink: {
    textDecorationLine: 'underline',
  },
  popover: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  errorPopover: {
    backgroundColor: STYLE_CONSTS.ERROR_BACKGROUND,
    color: 'white',
    fontSize: 18,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  keyboardSpacerHidden: {
    position: 'absolute',
    bottom: -15,
  },
  flexRow: {
    flexDirection: 'row',
  },
});

export default styles;
