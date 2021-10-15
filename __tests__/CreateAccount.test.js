import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
const {act} = TestRenderer;

import CreateAccount from '../app/screens/CreateAccount.js';

describe('<CreateAccount />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		var treetree = null;
		await act( async () => {
			treetree = renderer.create(<CreateAccount />);
		});
		
		const tree = treetree.toJSON();		
		expect(tree.children.length).toEqual(3);

		// Check that the modal exists
		expect(tree.children[0].type).toEqual('Modal');

		// Check that the scroll area exists
		expect(tree.children[2].type).toEqual('RCTScrollView');

		// Make sure all the inputs, text, and buttons are there
		expect(tree.children[2].children[0].children.length).toEqual(12);
	});
});
