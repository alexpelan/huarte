const StateHelper = {

  isSeasonLoaded(store, seasonId) {
    const seasonResult = store.getState().seasons.find(season => season.seasonId === seasonId);
    return seasonResult.gamesLoaded;
  },

  getReferences(store, listOfIds, keyName) {
    const references = {};
    listOfIds.forEach((id) => {
      references[id] = store.getState()[keyName][id];
    });
    return references;
  },

  transformObjectToListDataSource(obj) {
    const list = [];
    Object.keys(obj).forEach((property) => {
      const listItem = obj[property];
      listItem.id = property;
      list.push(listItem);
    });
    return list.sort((a, b) => b.id - a.id);
  },

  getCurrentGame(store) {
    const state = store.getState();
    if (state.currentGameId) {
      const game = state.games[state.currentGameId];
      return game;
    }
    return {};
  },

  getCurrentRound(store) {
    const game = this.getCurrentGame(store);
    return game[game.currentRound];
  },

  getSeasonById(store, seasonId) {
    return store.getState().seasons.find(season => season.seasonId === seasonId);
  },

  isCacheValid(time, expirationTime) {
    return (new Date() - expirationTime) < time;
  },

  getHighestBidForCurrentGame(store) {
    const currentRound = this.getCurrentRound(store);
    return currentRound.highestDollarAmount;
  },
};

export default StateHelper;
