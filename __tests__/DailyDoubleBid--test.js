import "react-native";
import React from "react";
import DailyDoubleBid from "../app/components/DailyDoubleBid";
import Factory from "../testHelpers/Factory";
import Recipes from "../testHelpers/Recipes";

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock("../app/util/Api");

test('renders correctly', () => {
	let store = Factory.createNewStore();
	const game = Recipes.loadSingleGame(store);
	const tree = renderer.create(
		<DailyDoubleBid store={store} game={game} />
	).toJSON();
	expect(tree).toMatchSnapshot();
});