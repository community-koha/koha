import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import firebase from "firebase/app";
import "firebase/firestore";

import NewEventListing from '../app/screens/NewEventListing';

const {act} = TestRenderer;

describe('<NewEventListing />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		var treetree = null;
		await act( async () => {
			treetree = renderer.create(<NewEventListing />);			
		});

		const tree = treetree.toJSON();
		
		expect(tree.children.length).toEqual(3);

		expect(tree.children[1].type).toEqual('View');
		expect(tree.children[2].type).toEqual('RCTScrollView');

		expect(tree.children[2].children[0].children.length).toEqual(13);
	});
});
