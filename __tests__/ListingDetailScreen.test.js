import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import firebase from "firebase/app";
import "firebase/firestore";

import ListingDetailScreen from '../app/screens/ListingDetailScreen';

const {act} = TestRenderer;

describe('<ListingDetailScreen />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		var treetree = null;
		await act( async () => {
			treetree = renderer.create(<ListingDetailScreen />);			
		});

		const tree = treetree.toJSON();		
		expect(tree.children.length).toEqual(3);

		expect(tree.children[2].type).toEqual('RCTScrollView');

		expect(tree.children[2].children[0].children[0].children[0].children[0].children[0].children[0].children[0]).toEqual("title");
		expect(tree.children[2].children[0].children[0].children[0].children[0].children[0].children[1].children[0]).toEqual("description");
		expect(tree.children[2].children[0].children[0].children[0].children[0].children[0].children[2].children[1]).toEqual("name");
	});
});
