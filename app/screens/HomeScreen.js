import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableWithoutFeedback,
	Button,
	Keyboard,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import Colours from '../config/colours.js';
import firebase from 'firebase/app';
import gui from '../config/gui.js';
import MapViewComponent from './MapViewComponent.js';
import ListViewComponent from './ListViewComponent.js';

// generic notif view
function NotifScreen() {
	return (
		<View style={styles.container}>
			<Text>{global.e}</Text>
		</View>
	);
}

function HomeScreen({ navigation }) {
	const [keyword, setKeyword] = useState('');
	const [listings, setListings] = useState([]); // Initial empty array of listings
	const [loading, setLoading] = useState(true); // Set loading to true on component mount
	const [watchedListings, setWatchedListings] = useState([]); // Initial empty array of users
	const [view, setView] = useState('Map');

	//subscribe from firestore
	useEffect(() => {
		// Get watched listings
		var subscriber = firebase
			.firestore()
			.collection('users')
			.where(firebase.firestore.FieldPath.documentId(), '==', user['uid'])
			.onSnapshot((querySnapshot) => {
				querySnapshot.forEach((documentSnapshot) => {
					const watching =
						documentSnapshot.data()['watching'] == undefined
							? []
							: documentSnapshot.data()['watching'];

					subscriber = firebase
						.firestore()
						.collection('listings')
						.onSnapshot((querySnapshot) => {
							const listings = [];
							const watchedListings = [];

							querySnapshot.forEach((documentSnapshot) => {
								// Don't show listings that have been deleted or hidden from public view
								if (
									documentSnapshot.data()['deleted'] != true &&
									documentSnapshot.data()['public'] != false
								) {
									if (watching.includes(documentSnapshot.id)) {
										watchedListings.push({
											...documentSnapshot.data(),
											key: documentSnapshot.id,
										});
									} else {
										listings.push({
											...documentSnapshot.data(),
											key: documentSnapshot.id,
										});
									}
								}
							});

							setListings(listings);
							setWatchedListings(watchedListings);
							setLoading(false);
						});
				});
			});

		// Unsubscribe from events when no longer in use
		return () => subscriber();
	}, []);

	function Search(keyword, listings) {
		//create new array
		const filteredList = [];
		//check each listings title and description
		listings.forEach(function (item) {
			if (item.listingTitle.includes(keyword)) {
				filteredList.push(item);
			}
			if (item.description.includes(keyword)) {
				filteredList.push(item);
			}
		});
		if (filteredList.length != 0) {
			//if there are matches, update listing
			setListings(filteredList);
		}
	}

	function FilterListingType(type) {
		firebase
			.firestore()
			.collection('listings')
			// Filter results
			.where('listingType', 'in', type)
			.get()
			.then((querySnapshot) => {
				const filteredList = [];
				querySnapshot.forEach((documentSnapshot) => {
					// Don't show listings that have been deleted or hidden from public view
					if (
						documentSnapshot.data()['deleted'] != true &&
						documentSnapshot.data()['public'] != false
					) {
						filteredList.push({
							...documentSnapshot.data(),
							key: documentSnapshot.id,
						});
					}
				});

				if (filteredList.length != 0) {
					setListings(filteredList);
				}
			});
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.container}>
				<View style={styles.searchContainer}>
					<View style={styles.searchBar}>
						<TextInput
							style={styles.searchInput}
							value={keyword}
							placeholder="Search listings"
							onChangeText={(val) => setKeyword(val)}
						/>
						<MaterialIcons
							name="search"
							size={26}
							style={{ padding: 12 }}
							onPress={() => Search(keyword, listings)}
						/>
					</View>
					<View style={styles.filterContainer}>
						<Button
							title="All"
							onPress={() =>
								FilterListingType(['food', 'essentialItem', 'event', 'service'])
							}
						/>
						<Button title="Food" onPress={() => FilterListingType(['food'])} />
						<Button
							title="Essentials"
							onPress={() => FilterListingType(['essentialItem'])}
						/>
						<Button
							title="Event"
							onPress={() => FilterListingType(['event'])}
						/>
						<Button
							title="Service"
							onPress={() => FilterListingType(['service'])}
						/>
					</View>

					<View style={styles.iconContainer}>
						<MaterialCommunityIcons
							name="view-list-outline"
							size={30}
							color={Colours.default}
							style={{ margin: 5 }}
							onPress={() => setView('List')}
						/>
						<MaterialCommunityIcons
							name="map-marker"
							size={30}
							color={Colours.black}
							style={{ margin: 5 }}
							onPress={() => setView('Map')}
						/>
					</View>
				</View>
				{view === 'Map' && (
					<MapViewComponent listing={listings} loading={loading} />
				)}
				{view === 'List' && (
					<ListViewComponent
						listing={listings}
						loading={loading}
						watched={watchedListings}
					/>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.white,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	searchContainer: {
		height: '21%',
		padding: 20,
	},
	searchBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 10,
		borderColor: Colours.grey,
		borderWidth: 0.5,
		width: gui.screen.width * 0.9,
	},
	searchInput: {
		fontSize: 16,
		padding: 12,
		borderRadius: 10,
		borderColor: Colours.grey,
		borderWidth: 0,
		width: '85%',
	},
	filterContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 10,
	},
	iconContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	calloutText: {
		fontSize: 16,
	},
	bubble: {
		borderRadius: 10,
		backgroundColor: Colours.white,
		padding: 20,
		width: gui.screen.width * 0.8,
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
	},
	photo: {
		height: 80,
		width: 80,
		justifyContent: 'flex-start',
		marginRight: 20,
	},
});

export default HomeScreen;
