import "react-native";
import React from "react";
import Question from "../app/components/Question";
import Factory from "../testHelpers/Factory";
import Recipes from "../testHelpers/Recipes";

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('renders correctly', () => {
	let store = Factory.createNewStore();
	const game = Recipes.loadSingleGame(store);

	const tree = renderer.create(
		<Question store={store} categoryName={game.jeopardy.categories[0].name} clue={game.jeopardy.categories[0].clues[0]} />
	).toJSON();
	expect(tree).toMatchSnapshot();
});