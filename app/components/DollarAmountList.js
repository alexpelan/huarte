import React from 'react';
import {
  StatusBar,
  ListView,
  Text,
} from 'react-native';

import { selectQuestion } from '../actions/index';

import DailyDoubleBid from './DailyDoubleBid';
import Question from './Question';

import styles from '../styles/styles';

import StateHelper from '../util/StateHelper';

class DollarAmountList extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(props.category.clues),
    };
  }

  selectClue = (clue, clueIndex) => {
    const store = this.props.store;
    const categoryName = this.props.category.name;
    store.dispatch(
      selectQuestion(
        StateHelper.getCurrentGame(store).currentRound,
        this.props.categoryIndex,
        clueIndex,
      ),
    );
    if (clue.isDailyDouble) {
      this.props.navigator.push({
        title: 'Daily Double!',
        component: DailyDoubleBid,
        passProps: {
          clue,
          clueIndex,
          store,
          categoryName,
          isSkippable: false,
        },
      });
    } else {
      this.props.navigator.push({
        title: clue.value,
        navigationBarHidden: true,
        component: Question,
        passProps: {
          clue,
          isSkippable: true,
          store,
          categoryName,
        },
      });
    }
  };

  renderClue = (clue, clueIndex) => (
    <Text
      style={[styles.listItem, clue.isCompleted && styles.listItemDisabled]}
      onPress={() => {
        if (!clue.isCompleted) {
          this.selectClue(clue, clueIndex);
        }
      }
      }
    >
      {clue.value}
    </Text>
  );

  render() {
    StatusBar.setBarStyle('default', true);
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(clue, sectionId, clueIndex) => this.renderClue(clue, clueIndex)}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
        style={styles.listView}
      />
    );
  }
}

export default DollarAmountList;
