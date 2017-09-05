import React from 'react';
import {
  StatusBar,
  ListView,
  Text,
} from 'react-native';

import GameList from './GameList';
import SimpleMessage from './SimpleMessage';

import {
  fetchSeasons,
} from '../actions/index';

import StateHelper from '../util/StateHelper';
import styles from '../styles/styles';

class SeasonList extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource: dataSource.cloneWithRows([]),
    };
  }

  componentDidMount() {
    const store = this.props.store;
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state.seasonsLoaded) {
        const dataSource = this.state.dataSource.cloneWithRows(
          StateHelper.transformObjectToListDataSource(state.seasons),
        );
        this.setState({
          dataSource,
        });
      }
    });
    store.dispatch(fetchSeasons(store));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  selectSeason = (season) => {
    const store = this.props.store;
    this.props.navigator.push({
      title: season.displayName,
      component: GameList,
      passProps: {
        season,
        store,
      },
    });
  };

  renderSeason = season => (
    <Text
      style={styles.listItem}
      onPress={() => this.selectSeason(season)}
    >
      {season.displayName}
    </Text>
  );

  render() {
    StatusBar.setBarStyle('default', true);
    if (!this.props.store.getState().seasonsLoaded) {
      return (
        <SimpleMessage />
      );
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={season => this.renderSeason(season)}
        automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
        style={styles.listView}
      />
    );
  }
}

export default SeasonList;
