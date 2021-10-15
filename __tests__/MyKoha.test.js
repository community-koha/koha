import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import firebase from "firebase/app";
import "firebase/firestore";

import MyKoha from '../app/screens/MyKoha';

const {act} = TestRenderer;

describe('<MyKoha />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		var treetree = null;
		await act( async () => {
			treetree = renderer.create(<MyKoha />);			
		});

		const tree = treetree.toJSON();
		
		expect(tree.children.length).toEqual(3);

		expect(tree.children[1].type).toEqual('View');
		expect(tree.children[2].type).toEqual('RCTScrollView');

		expect(tree.children[1].children[0].children[0].children[0]).toEqual("FOOD");
		expect(tree.children[1].children[1].children[0].children[0]).toEqual("ITEMS");
		expect(tree.children[1].children[2].children[0].children[0]).toEqual("EVENTS");
		expect(tree.children[1].children[3].children[0].children[0]).toEqual("SERVICES");
	});
});
