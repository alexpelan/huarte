import "react-native";
import React from "react";
import FinalJeopardyBid from "../app/components/FinalJeopardyBid";
import Factory from "../testHelpers/Factory";
import Recipes from "../testHelpers/Recipes";

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('renders correctly', () => {
	let store = Factory.createNewStore();
	const game = Recipes.loadSingleGame(store);

	const tree = renderer.create(
		<FinalJeopardyBid store={store} category={game.jeopardy.categories[0]} />
	).toJSON();
	expect(tree).toMatchSnapshot();
});