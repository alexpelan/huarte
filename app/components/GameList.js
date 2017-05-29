import React from "react";
import {
  StatusBar,
  ListView,
  Text,
  View
} from "react-native";

import {fetchGameList} from "../actions/index";

import CategoryList from "./CategoryList";
import SimpleMessage from "./SimpleMessage";

import styles from "../styles/styles";

import StateHelper from "../util/StateHelper";

const GameList = React.createClass({
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
        const games = StateHelper.getReferences(store, this.props.season.games, "games");
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(StateHelper.transformObjectToListDataSource(games))
        });
      }
    });
    store.dispatch(fetchGameList(store, this.props.season.seasonId));
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  hasLoaded: function() {
    return StateHelper.isSeasonLoaded(this.props.store, this.props.season.seasonId);
  },

  selectGame: function(game, gameIndex) {
    const store = this.props.store;
    this.props.navigator.push({
      title: game.displayName,
      component: CategoryList,
      passProps: {
        game,
        gameIndex,
        store
      },
    });
  },

  render: function() {
    StatusBar.setBarStyle('default', true);
    if (!this.hasLoaded()) {
      return (
          <SimpleMessage></SimpleMessage>
      );
    } 
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(game, sectionID, gameIndex) => this.renderGame(game, gameIndex)}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
        style={styles.listView}/>
      )
  },

  renderGame: function(game, gameIndex) {
    return (
      <Text style={styles.listItem}
        onPress={() => this.selectGame(game, gameIndex)}>
        {game.displayName}
      </Text>
      )
  }
});

export default GameList;