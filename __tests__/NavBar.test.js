import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import firebase from "firebase/app";
import "firebase/firestore";

import NavBar from '../app/screens/NavBar';

const {act} = TestRenderer;

describe('<NavBar />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	// This screen is no longer used in the application
});
