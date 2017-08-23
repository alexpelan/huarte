import CONSTS from "./Consts";
import sha1 from "sha1";
import {
  setError
} from "../actions/index";

const SECRET = "DEFINITELY_NOT_USING_THIS_IN_PRODUCTION";

const internalAPI = {
	callAPI: function(url, store, fetchOptions={}) {
		const time = Date.now();
		const hash = this.computeHash(url, time);
		const fullUrl = url + "?time=" + time + "&hash=" + hash;
		return fetch(fullUrl, fetchOptions)
			.then((response) => {
				if (response.ok){
					return response.json();
				}
				throw new Error(response);
			})
			.catch((response) => {
				// throwing here means .then() in our thunks won't be executed
				store.dispatch(setError(response.message));
				throw new Error (response);
			});
	},

	computeHash: function(url, time) {
		const urlWithSecret = url + SECRET + time;
		const fullHash = sha1(urlWithSecret);
		return fullHash;
	}
};

const API = {
	fetchGameList: function(seasonId, store) {
		return internalAPI.callAPI(CONSTS.GAME_LIST_REQUEST_URL + seasonId, store);
	},

	fetchSeasonsList: function(store) {
		return internalAPI.callAPI(CONSTS.SEASONS_REQUEST_URL, store);
	},

	fetchGame: function(gameId, store) {
		return internalAPI.callAPI(CONSTS.GAME_REQUEST_URL + gameId, store);
	},

	disputeQuestion: function(fetchOptions, store) {
		return internalAPI.callAPI(CONSTS.DISPUTE_URL, store, fetchOptions);
	}

};

export default API;