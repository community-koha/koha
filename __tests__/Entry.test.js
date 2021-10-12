import React from 'react';
import { render } from 'react-dom';
import renderer from 'react-test-renderer';

import Entry from '../app/screens/Entry.js';

describe('<Entry />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		const treetree = renderer.create(<Entry />);
		setTimeout(() => {
			const tree = treetree.toJSON();
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
		}, 5000);
	});
});
