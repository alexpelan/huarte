'use strict';
//Vendor imports
import React from "react";
import {
  AppRegistry,
  NavigatorIOS,
  Text,
  View
} from 'react-native';

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
//import { Client } from 'bugsnag-react-native';

// App imports
import Banner from "./app/components/Banner";
import HuarteMainMenu from "./app/components/HuarteMainMenu";

import huarteApp from "./app/reducers/huarteApp";

import styles from "./app/styles/styles";

const loggerMiddleware = createLogger();
//const bugsnag = new Client();
const huarte = React.createClass({

  getInitialState: function() {
    return {
      errorMessage: ""
    };
  },

  componentWillMount: function() {
    this.store = createStore(huarteApp, applyMiddleware(thunkMiddleware, loggerMiddleware));
    this.unsubscribe = this.store.subscribe(() => {
      if (this.store.getState().error.errorText != this.state.errorMessage) {
        this.setState({
          errorMessage: this.store.getState().error.errorText
        });
      }
    });
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  render: function() {
    let banner;
    const store = this.store;

    if (store.getState().error.isError) {
      banner = <Banner errorMessage={store.getState().error.errorText} store={store} />
    }

    return (
        <View style={styles.container}>
          <NavigatorIOS
            ref="nav"
            style={styles.container}
            initialRoute={{
              title: 'Huarte',
              component: HuarteMainMenu,
              passProps: {
                store
              }
            }}>
          </NavigatorIOS>
          {banner}
        </View>

    );
  }
});

AppRegistry.registerComponent('huarte', () => huarte);