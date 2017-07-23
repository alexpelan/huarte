const API = require.requireActual("../Api");


// When you want to mock the API to not do anything on the network
API.fetchGame = function() { return Promise.reject(); };
API.fetchGameList = function() { return Promise.reject(); };
API.fetchSeasonList = function() { return Promise.reject(); };

export default API;