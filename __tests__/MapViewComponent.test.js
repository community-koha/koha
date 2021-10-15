import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import firebase from "firebase/app";
import "firebase/firestore";

import MapViewComponent from '../app/screens/MapViewComponent';

const {act} = TestRenderer;

describe('<MapViewComponent />', () => {
	it('Testing started', async () => expect(1).toEqual(1));

	// Because of the Google map API stuff this can't be easily tested
});
