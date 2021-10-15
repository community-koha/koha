import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import firebase from "firebase/app";
import "firebase/firestore";

import Login from '../app/screens/Login.js';

const {act} = TestRenderer;

describe('<Login />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		var treetree = null;
		await act( async () => {
			treetree = renderer.create(<Login />);
		});		

		const tree = treetree.toJSON();
		expect(tree.type).toEqual("RCTScrollView");

		expect(tree.children[0].children[0].children[0].type).toEqual("Image");
		expect(tree.children[0].children[0].children[1].type).toEqual("Modal");
		expect(tree.children[0].children[0].children[2].type).toEqual("Modal");

		expect(tree.children[0].children[0].children[3].children[0].type).toEqual("TextInput");
		expect(tree.children[0].children[0].children[3].children[1].type).toEqual("TextInput");
		expect(tree.children[0].children[0].children[3].children[2].type).toEqual("View");
		expect(tree.children[0].children[0].children[3].children[3].type).toEqual("View");
		expect(tree.children[0].children[0].children[3].children[4].type).toEqual("View");
		expect(tree.children[0].children[0].children[3].children[5].type).toEqual("View");
	});
});
