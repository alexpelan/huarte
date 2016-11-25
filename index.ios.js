'use strict';
//Vendor imports
import React, {
  AppRegistry,
  NavigatorIOS
} from 'react-native';

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

// App imports
import HuarteMainMenu from "./app/components/HuarteMainMenu";

import huarteApp from "./app/reducers/huarteApp";

import styles from "./app/styles/styles";

const loggerMiddleware = createLogger();

const huarte = React.createClass({
  render: function() {
    const store = createStore(huarteApp, applyMiddleware(thunkMiddleware, loggerMiddleware));

    return (
        <NavigatorIOS
          ref="nav"
          style={styles.container}
          initialRoute={{
            title: 'Huarte',
            component: HuarteMainMenu,
            passProps: {
              store
            }
          }}/>
    );
  }
});

AppRegistry.registerComponent('huarte', () => huarte);