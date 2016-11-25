import {
  AsyncStorage
} from "react-native";

const Common = {
  saveStatistics: function(wasCorrect, delta) { 
    this.changeNumericAsyncStorage("total_winnings", delta);
    if (wasCorrect) {
      this.changeNumericAsyncStorage("total_correct", 1);
    } else {
      this.changeNumericAsyncStorage("total_incorrect", 1);
    }
  },

  saveSingleGameStatistics: function(game) {
    this.changeNumericAsyncStorage("games_completed", 1);
    this.changeNumericAsyncStorage("total_winnings_completed_games", game.score);
    this.changeNumericAsyncStorage("total_correct_completed_games", game.numberCorrect);
    this.changeNumericAsyncStorage("total_incorrect_completed_games", game.numberIncorrect);
  },

  getStatistics: function() {
    return AsyncStorage.multiGet(["total_winnings", "total_correct", "total_incorrect", "games_completed", "total_winnings_completed_games",
                                  "total_correct_completed_games", "total_incorrect_completed_games"]);
  },

  // used to take existing value and apply a change to it, not to set a new value
  changeNumericAsyncStorage: function(key, delta) {
    AsyncStorage.getItem(key).then((value) => {

      if (!value) {
        value = 0;
      } else {
        value = parseInt(value);
      }

      value = value + delta;
      value = value.toString();

      AsyncStorage.setItem(key, value);

    }).done();
  }
};

export default Common;