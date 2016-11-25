import {StyleSheet} from "react-native";

const STYLE_CONSTS = {
  JEOPARDY_BLUE: "#0000af"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listItem: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
    color: 'white'
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
    textAlign: 'center'
  },
  question: {
    paddingTop: 100,
    fontSize: 20,
    color: 'white',
    paddingLeft: 20,
    paddingRight: 20
  },
  textInput: {
    height: 40, 
    borderColor: 'white', 
    borderWidth: 1,
    color: 'white',
    paddingLeft: 10,
    paddingRight: 10
  },
  loadingView: {
    flex: 1,
    backgroundColor: STYLE_CONSTS.JEOPARDY_BLUE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paragraphView: {
    paddingLeft: 20,
    paddingRight: 20
  },
  loadingText: {
    color: 'white',
    fontSize: 24
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },
  negativeAction: {
    color: 'red',
    fontSize: 18
  },
  questionView: {
    flex: 1,
    backgroundColor: STYLE_CONSTS.JEOPARDY_BLUE,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  hyperlink: {
    textDecorationLine: 'underline'
  }

});

export default styles;