import React from "react";
import {
  StatusBar,
  ListView,
  Text,
  View
} from "react-native";

import {fetchGame} from "../actions/index";

import DollarAmountList from "./DollarAmountList";
import SimpleMessage from "./SimpleMessage";

import styles from "../styles/styles";

import CONSTS from "../util/Consts";
import StateHelper from "../util/StateHelper";

class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      dataSource: dataSource.cloneWithRows([])
    };
  }

  componentDidMount() {
    const store = this.props.store;
    this.unsubscribe = store.subscribe(() => {
      if (this.hasLoaded()) {
        this.setState({
            dataSource: new ListView.DataSource({
              rowHasChanged: (row1, row2) => row1 !== row2
            })
        });
    
      }
    });
    store.dispatch(fetchGame(store, this.props.game.id));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  hasLoaded = () => {
    return StateHelper.getCurrentGame(this.props.store).loaded;
  };

  selectCategory = (category, categoryIndex) => {
    const store = this.props.store;
    if (StateHelper.getCurrentGame(store).currentRound === CONSTS.FINAL_JEOPARDY) {
      this.props.navigator.push({
        title: "Final Jeopardy",
        navigationBarHidden: true,
        component: FinalJeopardyBid,
        passProps: {
          category
        }
      })

    } else {

      this.props.navigator.push({
        title: category.name,
        component: DollarAmountList,
        passProps: {
          category,
          categoryIndex,
          store
        },
      });

    }
  };

  render() {
    StatusBar.setBarStyle('default', true);
    if(!this.hasLoaded()) {
      return (
          <SimpleMessage></SimpleMessage>
        );
    }
    const store = this.props.store;
    const dataSource = this.state.dataSource.cloneWithRows(StateHelper.getCurrentRound(store).categories);
    return (
      <ListView
        dataSource={dataSource}
        renderRow={(category, sectionID, categoryIndex) => this.renderCategory(category, categoryIndex)}
        renderFooter={() => this.renderFooter()}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
        style={styles.listView}/>
    )
  }

  renderCategory = (category, categoryIndex) => {
    return (
      <Text style={[styles.listItem, category.isCompleted && styles.listItemDisabled]}
        onPress={() => this.selectCategory(category, categoryIndex)}>
        {category.name}
      </Text>
    );
  };

  getRoundDisplayName = () => {
    let round = StateHelper.getCurrentGame(this.props.store).currentRound;
    round = round.slice(0,1).toUpperCase() + round.slice(1);
    round = round.replace("_", " ")
    return round
  };

  renderFooter = () => {
    var roundDisplayName = this.getRoundDisplayName();
    const store = this.props.store;
    return (
      <Text style={styles.scoreText}>Current Score: {StateHelper.getCurrentGame(store).score} - {roundDisplayName} Round</Text>
    )
  };
}

export default CategoryList;