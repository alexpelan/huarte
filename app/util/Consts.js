const DOMAIN = "http://localhost:3001";

const CONSTS = {
	JEOPARDY: "jeopardy",
	DOUBLE_JEOPARDY: "double_jeopardy",
	FINAL_JEOPARDY: "final_jeopardy",
	GAME_REQUEST_URL: DOMAIN + '/api/games/',
	SEASONS_REQUEST_URL: DOMAIN + "/api/",
	GAME_LIST_REQUEST_URL: DOMAIN + "/api/seasons/",
	DISPUTE_URL: DOMAIN + "/api/dispute",
	MILLISECONDS_IN_DAY: 24 * 60 * 60 * 1000,
};

export default CONSTS;