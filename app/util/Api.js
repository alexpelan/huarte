import sha1 from 'sha1';
import CONSTS from './Consts';
import {
  setError,
} from '../actions/index';

const SECRET = CONSTS.SECRET;

const internalAPI = {
  callAPI(url, store, fetchOptions = {}) {
    const time = Date.now();
    const hash = this.computeHash(url, time);
    const fullUrl = `${url}?time=${time}&hash=${hash}`;
    return fetch(fullUrl, fetchOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response);
      })
      .catch((response) => {
        // throwing here means .then() in our thunks won't be executed
        store.dispatch(setError(response.message));
        throw new Error(response);
      });
  },

  computeHash(url, time) {
    const urlWithSecret = url + SECRET + time;
    const fullHash = sha1(urlWithSecret);
    return fullHash;
  },
};

const API = {
  fetchGameList(seasonId, store) {
    return internalAPI.callAPI(CONSTS.GAME_LIST_REQUEST_URL + seasonId, store);
  },

  fetchSeasonsList(store) {
    return internalAPI.callAPI(CONSTS.SEASONS_REQUEST_URL, store);
  },

  fetchGame(gameId, store) {
    return internalAPI.callAPI(CONSTS.GAME_REQUEST_URL + gameId, store);
  },

  disputeQuestion(fetchOptions, store) {
    return internalAPI.callAPI(CONSTS.DISPUTE_URL, store, fetchOptions);
  },

};

export default API;
