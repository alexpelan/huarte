import React from "react";
import {
  StatusBar,
  ListView,
  Text,
  View
} from "react-native";

import {
  fetchGameList,
  selectGame,
} from "../actions/index";

import CategoryList from "./CategoryList";
import SimpleMessage from "./SimpleMessage";

import styles from "../styles/styles";

import StateHelper from "../util/StateHelper";

class GameList extends React.Component {
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
        const games = StateHelper.getReferences(store, this.props.season.games, "games");
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(StateHelper.transformObjectToListDataSource(games))
        });
      }
    });
    store.dispatch(fetchGameList(store, this.props.season.seasonId));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  hasLoaded = () => {
    return StateHelper.isSeasonLoaded(this.props.store, this.props.season.seasonId);
  };

  selectGame = (game) => {
    const store = this.props.store;
    store.dispatch(selectGame(game));
    this.props.navigator.push({
      title: game.displayName,
      component: CategoryList,
      passProps: {
        game,
        store
      },
    });
  };

  render() {
    StatusBar.setBarStyle('default', true);
    if (!this.hasLoaded()) {
      return (
          <SimpleMessage></SimpleMessage>
      );
    } 
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(game) => this.renderGame(game)}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
        style={styles.listView}/>
      )
  }

  renderGame = (game) => {
    return (
      <Text style={styles.listItem}
        onPress={() => this.selectGame(game)}>
        {game.displayName}
      </Text>
      )
  };
}

export default GameList;