import React, {
  StatusBar,
  ListView,
  Text,
  View
} from "react-native";

import {selectQuestion} from "../actions/index";

import Question from "./Question";
import SimpleMessage from "./SimpleMessage";

import styles from "../styles/styles";

import StateHelper from "../util/StateHelper";

const DollarAmountList = React.createClass({
  getInitialState: function () {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row !== row2
    });
    return {
      dataSource: dataSource.cloneWithRows(this.props.category.clues)
    };
  },

  selectClue: function(clue, clueIndex) {
    const store = this.props.store;
    const categoryName = this.props.category.name;
    store.dispatch(selectQuestion(StateHelper.getCurrentGame(store).currentRound, this.props.categoryIndex, clueIndex));

    if (clue.isDailyDouble) {
      this.props.navigator.push({
        title: "Daily Double!",
        component: DailyDoubleBid,
        passProps: {
          clue,
          clueIndex,
          store,
          categoryName
        }
      })

    } else {
      this.props.navigator.push({
        title: clue.value,
        navigationBarHidden: true,
        component: Question,
        passProps: {
          clue,
          isSkippable: true,
          store,
          categoryName
        }
      });  
    }



  },

  render: function() {
    StatusBar.setBarStyle('default', true);
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(clue, sectionId, clueIndex) => this.renderClue(clue, clueIndex)}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
        style={styles.listView}/>
    )
  },

  renderClue: function(clue, clueIndex){
    return (
      <Text style={[styles.listItem, clue.isCompleted && styles.listItemDisabled]}
        onPress={() => {
            if(!clue.isCompleted) {
              this.selectClue(clue, clueIndex)
            }
          }
        }>
        {clue.value}
      </Text>
    );
  }

});

export default DollarAmountList;