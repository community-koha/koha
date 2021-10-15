import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import firebase from "firebase/app";
import "firebase/firestore";

import UserTypeScreen from '../app/screens/UserTypeScreen';

const {act} = TestRenderer;

describe('<UserTypeScreen />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		var treetree = null;
		await act( async () => {
			treetree = renderer.create(<UserTypeScreen />);			
		});

		const tree = treetree.toJSON();
		
		expect(tree.children.length).toEqual(3);
		
		expect(tree.children[0].type).toEqual('Image');
		expect(tree.children[1].type).toEqual('Text');
		expect(tree.children[2].type).toEqual('View');

		expect(tree.children[2].children[0].children[0].children[0]).toEqual('IN NEED');
		expect(tree.children[2].children[1].children[0].children[0]).toEqual('DONATING');
		expect(tree.children[2].children[2].children[0].children[0]).toEqual('DONATING AS A BUSINESS');
		expect(tree.children[2].children[3].children[0].children[0]).toEqual('BACK');
	});
});
