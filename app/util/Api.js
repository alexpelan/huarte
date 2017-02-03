import CONSTS from "./Consts";
import sha1 from "sha1";

const SECRET = "DEFINITELY_NOT_USING_THIS_FOR_PRODUCTION";

const internalAPI = {
	callAPI: function(url) {
		const hash = this.computeHash(url);
		const fullUrl = url + "?hash=" + hash;
		return fetch(fullUrl);
	},

	computeHash: function(url) {
		const urlWithSecret = url + SECRET + Date.now();
		const fullHash = sha1(urlWithSecret);
		return fullHash;
	}
};

const API = {
	fetchGameList: function(seasonId) {
		return internalAPI.callAPI(CONSTS.GAME_LIST_REQUEST_URL + seasonId);
	}
};

export default API;