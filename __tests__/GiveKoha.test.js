import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import firebase from "firebase/app";
import "firebase/firestore";

import GiveKoha from '../app/screens/GiveKoha';

const {act} = TestRenderer;

describe('<GiveKoha />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		var treetree = null;
		await act( async () => {
			treetree = renderer.create(<GiveKoha />);			
		});

		const tree = treetree.toJSON();
		
		expect(tree.children.length).toEqual(3);

		expect(tree.children[1].type).toEqual('View');

		// Make sure all the inputs, text, and buttons are there
		expect(tree.children[1].children[0].children[0].children[0]).toEqual("Food");
		expect(tree.children[1].children[1].children[0].children[0]).toEqual("Essentials");
		expect(tree.children[1].children[2].children[0].children[0].children[0]).toEqual("Event");
		expect(tree.children[1].children[2].children[1].children[0].children[0]).toEqual("Services");
	});
});
