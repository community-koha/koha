import React from 'react';
import renderer from 'react-test-renderer';

import Home from '../app/screens/Home.js';

jest.useFakeTimers();

describe('<Home />', () =>
{
    it("Testing started", () => expect(1).toEqual(1));
    it('Children check', () => 
    {
        const tree = renderer.create(<Home />).toJSON();
        expect(tree.children.length).toEqual(3);

        // Check that the image exists
        expect(tree.children[0].type).toEqual("Image");

        // Check that the title is correct
        expect(tree.children[1].type).toEqual("Text");
        expect(tree.children[1].children).toEqual([ 'Community', '\n', 'Koha' ]);

        // Check first button
        expect(tree.children[2].children[0].props.focusable).toEqual(true);
        expect(tree.children[2].children[0].children[0].type).toEqual("Text");
        expect(tree.children[2].children[0].children[0].children[0]).toEqual("LOG IN");

        // Check second button
        expect(tree.children[2].children[1].props.focusable).toEqual(true);
        expect(tree.children[2].children[1].children[0].type).toEqual("Text");
        expect(tree.children[2].children[1].children[0].children[0]).toEqual("CREATE ACCOUNT");
    });
});