import React from 'react';
import renderer from 'react-test-renderer';

import Entry from '../app/screens/Entry.js';

describe('<Entry />', () => {
	it('Testing started', () => expect(1).toEqual(1));
	it('Children check', () => {
		const tree = renderer.create(<Entry />).toJSON();
		expect(tree.children.length).toEqual(2);

		// Check that the image exists
		expect(tree.children[0].type).toEqual('Image');

		// Check first button
		expect(tree.children[1].children[0].props.focusable).toEqual(true);
		expect(tree.children[1].children[0].children[0].type).toEqual('Text');
		expect(tree.children[1].children[0].children[0].children[0]).toEqual(
			'LOG IN'
		);

		// Check second button
		expect(tree.children[1].children[1].props.focusable).toEqual(true);
		expect(tree.children[1].children[1].children[0].type).toEqual('Text');
		expect(tree.children[1].children[1].children[0].children[0]).toEqual(
			'CREATE ACCOUNT'
		);
	});
});
