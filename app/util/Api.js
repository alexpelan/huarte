import CONSTS from "./Consts";
import sha1 from "sha1";

const SECRET = "DEFINITELY_NOT_USING_THIS_IN_PRODUCTION";

const internalAPI = {
	callAPI: function(url) {
		const time = Date.now();
		const hash = this.computeHash(url, time);
		const fullUrl = url + "?time=" + time + "&hash=" + hash;
		return fetch(fullUrl);
	},

	computeHash: function(url, time) {
		const urlWithSecret = url + SECRET + time;
		const fullHash = sha1(urlWithSecret);
		return fullHash;
	}
};

const API = {
	fetchGameList: function(seasonId) {
		return internalAPI.callAPI(CONSTS.GAME_LIST_REQUEST_URL + seasonId);
	},

	fetchSeasonsList: function() {
		return internalAPI.callAPI(CONSTS.SEASONS_REQUEST_URL);
	},

	fetchGame: function(gameId) {
		return internalAPI.callAPI(CONSTS.GAME_REQUEST_URL + gameId);
	}

};

export default API;