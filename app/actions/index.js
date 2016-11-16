function requestGame(gameId) { 
  return {
    type: "REQUEST_GAME",
    gameId: gameId
  };
};

function receiveGame(json, gameId) {
  const timeLoaded = new Date()
  return {
    type: "RECEIVE_GAME",
    game: json,
    gameId: gameId,
    timeLoaded
  };
};

function requestSeasons() {
  return {
    type: "REQUEST_SEASONS"
  };
};

function receiveSeasons(json) {
  Object.keys(json.seasons).forEach((seasonId) => {
    let season = json.seasons[seasonId];
    season.gamesLoaded = false;
    season.games = [];
  });
  const timeLoaded = new Date()
  return {
    type: "RECEIVE_SEASONS",
    seasons: json.seasons,
    timeLoaded
  };
};

function requestGameList() {
  return {
    type: "REQUEST_GAME_LIST",
  };
};

function receiveGameList(json, seasonId) {
  Object.keys(json.games).forEach((gameId) => {
    let game = json.games[gameId];
    game.loaded = false;
  });
  const timeLoaded = new Date()
  return {
    type: "RECEIVE_GAME_LIST",
    games: json.games,
    seasonId, 
    timeLoaded
  };
}

function selectQuestion(round, categoryIndex, clueIndex){
  return {
    type: "SELECT_QUESTION",
    round: round,
    categoryIndex: categoryIndex,
    clueIndex: clueIndex
  };
};

function updateScore(delta, wasCorrect) {
  return {
    type: "UPDATE_SCORE",
    delta: delta
  };
};

function nextRound(currentRound) {
  var nextRound;
  if (currentRound === "jeopardy") {
    nextRound = "double_jeopardy";
  } else if (currentRound === "double_jeopardy") {
    nextRound = "final_jeopardy";
  } else if (currentRound === "final_jeopardy") {
    Common.saveSingleGameStatistics(StateHelper.getCurrentGame());
  }

  return {
    type: "NEXT_ROUND",
    nextRound: nextRound
  };
}

function bidFinalJeopardy(bid) {
  return {
     type: "BID_FINAL_JEOPARDY",
     bid: bid
  };
}

function noop() {
  return {
    type: "NOOP"
  };
}

export {
  requestGame,
  receiveGame,
  requestSeasons,
  receiveSeasons,
  requestGameList,
  receiveGameList,
  selectQuestion,
  updateScore,
  nextRound,
  bidFinalJeopardy,
  noop
};