import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import firebase from "firebase/app";
import "firebase/firestore";

import ListViewComponent from '../app/screens/ListViewComponent';

const {act} = TestRenderer;

describe('<ListViewComponent />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		var treetree = null;
		await act( async () => {
			treetree = renderer.create(<ListViewComponent 
				listing={[{listingTitle:"title", description:"description", location:{name:"name"}}]}
				watched={[]}
				results={[]}
				searching={false}
				nav={null}/>);			
		});

		
		const tree = treetree.toJSON();		
		
		expect(tree.children.length).toEqual(1);
		
		expect(tree.type).toEqual('RCTScrollView');
		
		expect(tree.children[0].children[0].children[0].children[0].children[0].children[0]).toEqual("title");
		expect(tree.children[0].children[0].children[0].children[0].children[1].children[0]).toEqual("description");
		expect(tree.children[0].children[0].children[0].children[0].children[2].children[0]).toEqual("name");
	});
});
