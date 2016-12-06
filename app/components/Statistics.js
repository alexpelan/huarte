import React from "react";
import {
  StatusBar,
  ListView,
  Text,
  View
} from "react-native";

import SimpleMessage from "./SimpleMessage";

import styles from "../styles/styles";

import Common from "../util/Common";

const STATISTIC_METADATA = {
  total_winnings: {
    displayName: "Total Winnings",
  },
  total_correct: {
    displayName: "Total Correct",
  },
  total_incorrect: {
    displayName: "Total Incorrect",
  },
  games_completed: {
    displayName: "Games Completed",
  },
  total_winnings_completed_games: {
    displayName: "Average Winnings",
    divisor: "games_completed"
  },
  total_correct_completed_games: {
    displayName: "Average Correct",
    divisor: "games_completed"
  },
  total_incorrect_completed_games: {
    displayName: "Average Incorrect",
    divisor: "games_completed"
  }
};

const Statistics = React.createClass({
  getInitialState: function() {
    return {
      hasLoaded: false,
      statistics: []
    };
  },

  componentDidMount: function() {
    Common.getStatistics().then((statistics) => {
      statistics.forEach((stat) => {
        if (!stat[1]) {
          stat[1] = 0;
        }

        if (STATISTIC_METADATA[stat[0].divisor]) {
          const divisor = statistics[stats[0].divisor][1];
          if (divisor !== 0) {
            stat[1] = stat[1] / divisor;
          }
        }

      });

      this.setState({
        hasLoaded: true,
        statistics: statistics
      })
    })
  },

  render: function() {
    StatusBar.setBarStyle('default', true);
    if (!this.state.hasLoaded) {
      return (
          <SimpleMessage></SimpleMessage>
      );
    }

    return (
      <View style={[styles.loadingView, styles.paragraphView]}>
        <Text style={styles.loadingText}> Statistics </Text>
        {this.state.statistics.map((statistic) => {
          return (
            <Text style={styles.scoreText} key={statistic[0]}> {STATISTIC_METADATA[statistic[0]].displayName}: {[statistic[1]]}</Text>
            );
        })}
      </View>
      )
  }
});

export default Statistics;