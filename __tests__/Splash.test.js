import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import firebase from "firebase/app";
import "firebase/firestore";

import Splash from '../app/screens/Splash';

const {act} = TestRenderer;

describe('<Splash />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		var treetree = null;
		await act( async () => {
			treetree = renderer.create(<Splash />);			
		});

		const tree = treetree.toJSON();
				
		expect(tree.children.length).toEqual(2);
		
		expect(tree.children[0].type).toEqual('Image');
		expect(tree.children[1].type).toEqual('ActivityIndicator');
	});
});
