import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import firebase from "firebase/app";
import "firebase/firestore";

import Notification from '../app/screens/Notification';

const {act} = TestRenderer;

describe('<Notification />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		var treetree = null;
		await act( async () => {
			treetree = renderer.create(<Notification />);			
		});

		const tree = treetree.toJSON();
		
		expect(tree.children.length).toEqual(2);

		expect(tree.children[0].type).toEqual('View');
		expect(tree.children[1].type).toEqual('RCTScrollView');

		expect(tree.children[1].children[0].children[0].children[0].children[0].children[0]).toEqual("No Notifications Found");
	});
});
