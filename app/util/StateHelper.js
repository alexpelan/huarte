const StateHelper = {

  isSeasonLoaded: function (store, seasonId) {
    return store.getState().seasons[seasonId].gamesLoaded;
  },

  getReferences: function (store, listOfIds, keyName) {
    var references = {};
    listOfIds.forEach((id) => {
      references[id] = store.getState()[keyName][id];
    });
    return references;
  },

  transformObjectToListDataSource: function(obj) {
    var list = [];
    for (var property in obj) {
      var listItem = obj[property];
      listItem.id = property;
      list.push(listItem);
    }
    return list.sort(function(a, b){
      return b.id - a.id;
    });
  },

  getCurrentGame: function(store) {
    var state = store.getState();
    if (state.currentGameId) {
      var game = state.games[state.currentGameId];
      return game;
    } else {
      return {};
    }
  },

  getCurrentRound: function(store) {
    var game = this.getCurrentGame(store);
    return game[game.currentRound];
  },

  isCacheValid: function(time, expirationTime) {
    return (new Date() - expirationTime) < time;
  },

  getHighestBidForCurrentGame: function(store) {
    var currentRound = this.getCurrentRound(store);
    return currentRound.highestDollarAmount;
  }
};

export default StateHelper;