import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import firebase from "firebase/app";
import "firebase/firestore";

import Profile from '../app/screens/Profile';

const {act} = TestRenderer;

describe('<Profile />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		var treetree = null;
		await act( async () => {
			treetree = renderer.create(<Profile />);			
		});

		const tree = treetree.toJSON();
		
		expect(tree.children[0].children.length).toEqual(2);

		expect(tree.children[0].children[0].type).toEqual('Modal');
		expect(tree.children[0].children[1].type).toEqual('Modal');
	});
});
