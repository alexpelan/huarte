import "react-native";
import React from "react";
import CategoryList from "../app/components/CategoryList";
import Factory from "../testHelpers/Factory";
import {receiveSeasons, receiveGameList, receiveGame, selectGame} from "../app/actions/index";

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock("../app/util/Api");

test('initially renders a loading view', () => {
	let store = Factory.createNewStore();
	const seasonList = Factory.seasonList();
	const gameList = Factory.gameList();
	store.dispatch(receiveSeasons(seasonList))
	store.dispatch(receiveGameList(gameList, "33"));
	const game = Factory.game();
	store.dispatch(selectGame(game))
	const tree = renderer.create(
		<CategoryList store={store} game={game} />
	).toJSON();
	expect(tree).toMatchSnapshot();
});

test('renders correctly after data has been loaded', () => {
	let store = Factory.createNewStore();
	const seasonList = Factory.seasonList();
	const gameList = Factory.gameList();
	store.dispatch(receiveSeasons(seasonList));
	store.dispatch(receiveGameList(gameList, "33"));
	const game = Factory.game();
	store.dispatch(selectGame(game));
	store.dispatch(receiveGame(game, game.id));
	const tree = renderer.create(
		<CategoryList store={store} game={game} />
	).toJSON();
	expect(tree).toMatchSnapshot();
});