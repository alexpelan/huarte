import React from "react";
import {
  StatusBar,
  ListView,
  Text
} from "react-native";

import SeasonList from "./SeasonList";
import Statistics from "./Statistics";
import About from "./About";

import styles from "../styles/styles";

const HUARTE_MENU_DATASOURCE = [
  {
    displayName: "Play",
    component: SeasonList
  },
  {
    displayName: "Statistics",
    component: Statistics
  },
  {
    displayName: "About",
    component: About
  }
];

class HuarteMainMenu extends React.Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(HUARTE_MENU_DATASOURCE)
    };
  }

  render() {
    StatusBar.setBarStyle('default', true);
    return (
        <ListView
          dataSource = {this.state.dataSource}
          renderRow={(menuItem) => this.renderMenuRow(menuItem)}
          automaticallyAdjustContentInsets={false} // ????? https://github.com/facebook/react-native/issues/721
          style={styles.listView}/>
        )

  }

  renderMenuRow = (menuItem) => {
    return (
      <Text style={styles.listItem}
        onPress={() => this.selectMenuItem(menuItem)}>
        {menuItem.displayName}
      </Text>
    );
  };

  selectMenuItem = (menuItem) => {
    const store = this.props.store;
    this.props.navigator.push({
      title: menuItem.displayName,
      component: menuItem.component,
      passProps: {
        store
      }
    })
  };
}

export default HuarteMainMenu;