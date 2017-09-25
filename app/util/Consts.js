import { DOMAIN, SECRET } from 'react-native-dotenv';

const URL = DOMAIN;

const CONSTS = {
  JEOPARDY: 'jeopardy',
  DOUBLE_JEOPARDY: 'double_jeopardy',
  FINAL_JEOPARDY: 'final_jeopardy',
  GAME_REQUEST_URL: `${URL}/api/games/`,
  SEASONS_REQUEST_URL: `${URL}/api/`,
  GAME_LIST_REQUEST_URL: `${URL}/api/seasons/`,
  DISPUTE_URL: `${URL}/api/dispute`,
  MILLISECONDS_IN_DAY: 24 * 60 * 60 * 1000,
  SECRET,
};

export default CONSTS;
