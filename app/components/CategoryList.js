import React, {
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

const CategoryList = React.createClass({
   getInitialState: function() {
    var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
    });
    return {
      dataSource: dataSource.cloneWithRows([])
    };
  },

  componentDidMount: function() {
    const store = this.props.store;
    this.unsubscribe = store.subscribe(() => {
      if (this.hasLoaded()) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(StateHelper.getCurrentRound(store).categories)
        });
      }
    });
    store.dispatch(fetchGame(store, this.props.game.id));
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  hasLoaded: function() {
    return StateHelper.getCurrentGame(this.props.store).loaded;
  },

  selectCategory: function(category, categoryIndex) {
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
  },

  render: function() {
    StatusBar.setBarStyle('default', true);
    if(!this.hasLoaded()) {
      return (
          <SimpleMessage></SimpleMessage>
        );
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(category, sectionID, categoryIndex) => this.renderCategory(category, categoryIndex)}
        renderFooter={() => this.renderFooter()}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
        style={styles.listView}/>
    )
  },

  renderCategory: function(category, categoryIndex) {
    return (
      <Text style={styles.listItem}
        onPress={() => this.selectCategory(category, categoryIndex)}>
        {category.name}
      </Text>
    );
  },

  getRoundDisplayName: function() {
    var round = StateHelper.getCurrentGame(this.props.store).currentRound;
    round = round.slice(0,1).toUpperCase() + round.slice(1);
    round = round.replace("_", " ")
    return round
  },

  renderFooter: function() {
    var roundDisplayName = this.getRoundDisplayName();
    const store = this.props.store;
    return (
      <Text style={styles.scoreText}>Current Score: {StateHelper.getCurrentGame(store).score} - {roundDisplayName} Round</Text>
    )
  },

});

export default CategoryList;