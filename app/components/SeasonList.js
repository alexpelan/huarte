import React from "react";
import {
  StatusBar,
  ListView,
  Text
} from "react-native";

import GameList from "./GameList";
import SimpleMessage from "./SimpleMessage";

import {
  fetchSeasons
} from "../actions/index";

import StateHelper from "../util/StateHelper";
import styles from "../styles/styles";

const SeasonList = React.createClass({
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
      var state = store.getState();
      if (state.seasonsLoaded) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(StateHelper.transformObjectToListDataSource(state.seasons))
        });
      }
    });
    store.dispatch(fetchSeasons(store));
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  selectSeason: function(season) {
    const store = this.props.store;
    this.props.navigator.push({
      title: season.displayName,
      component: GameList,
      passProps: {
        season,
        store
      },
    });
  },

  render: function() {
    StatusBar.setBarStyle('default', true);
    if(!this.props.store.getState().seasonsLoaded) {
      return (
          <SimpleMessage></SimpleMessage>
      );
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(season, sectionID) => this.renderSeason(season)}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
        style={styles.listView}/>
    )
  },

  renderSeason: function(season) {
    return (
      <Text style={styles.listItem}
        onPress={() => this.selectSeason(season)}>
        {season.displayName}
      </Text>
    );
  }
});

export default SeasonList;