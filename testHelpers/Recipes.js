import { receiveSeasons, receiveGameList, receiveGame, selectGame } from '../app/actions/index';
import Factory from './Factory';

class Recipes {
  static loadSingleGame(store) {
    const seasonList = Factory.seasonList();
    const gameList = Factory.gameList();
    store.dispatch(receiveSeasons(seasonList));
    store.dispatch(receiveGameList(gameList, '33'));
    const game = Factory.game();
    store.dispatch(selectGame(game));
    store.dispatch(receiveGame(game, game.id));
    return game;
  }
}

export default Recipes;
