import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App.js';

describe('<App />', () =>
{
    it("Testing started", () => expect(1).toEqual(1));
    it('Children check', async () => 
    {
        const tree = renderer.create(<App />).toJSON();
        expect(tree.children.length).toEqual(1);
    });
});