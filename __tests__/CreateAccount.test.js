import React from 'react';
import renderer from 'react-test-renderer';

import CreateAccount from '../app/screens/CreateAccount.js';

jest.useFakeTimers();

describe('<CreateAccount />', () =>
{
    it("Testing started", () => expect(1).toEqual(1));
    it('Children check', () => 
    {
        const tree = renderer.create(<CreateAccount />).toJSON();
        expect(tree.children.length).toEqual(2);

        // Make sure there are two children in the first section
        expect(tree.children[0].children.length).toEqual(2);

        // First child is the 'Create Account' text
        expect(tree.children[0].children[0].type).toEqual("Text");

        // Second child is a view type
        expect(tree.children[0].children[1].type).toEqual("View");
        expect(tree.children[0].children[1].children[0].type).toEqual("Text");

        // Make sure there are fifteen children for the main section
        expect(tree.children[1].children[0].children.length).toEqual(15);
        
        // Make sure each of the input label and sections are correct
        const types =
        [
            'Text', 'TextInput',
            'Text', 'View',
            'Text', 'TextInput',
            'Text', 'TextInput',
            'Text', 'TextInput',
            'Text', 'TextInput'
        ];
        for (let i = 0; i < (tree.children[1].children[0].children.length-3); i++)
        {
            expect(tree.children[1].children[0].children[i].type).toEqual(types[i])
        }

        // Error Text
        expect(tree.children[1].children[0].children[12].children[0].type).toEqual('Text')

        // Create Account Button Text
        expect(tree.children[1].children[0].children[13].children[0].type).toEqual('Text')
    });
});