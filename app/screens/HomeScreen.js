import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	TouchableWithoutFeedback,
	Button,
	Keyboard,
	ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import AppLoading from 'expo-app-loading';
import DropDownPicker from 'react-native-dropdown-picker';

import Colours from '../config/colours.js';
import firebase from 'firebase/app';
import gui from '../config/gui.js';
import MapViewComponent from './MapViewComponent.js';
import ListViewComponent from './ListViewComponent.js';

import useFonts from '../config/useFonts';

function HomeScreen({ navigation }) {
	const [isReady, setIsReady] = useState(false);

	const [keyword, setKeyword] = useState('');
	const [listings, setListings] = useState([]); // Initial empty array of listings
	const [loading, setLoading] = useState(true); // Set loading to true on component mount
	const [watchedListings, setWatchedListings] = useState([]); // Initial empty array of users
	const [view, setView] = useState('Map');
	const [noResults, setNoResults] = useState(false);

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [items, setItems] = useState([
		{
			label: 'All',
			value: ['food', 'essentialItem', 'event', 'service'],
		},
		{ label: 'Food', value: ['food'] },
		{ label: 'Essentials', value: ['essentialItem'] },
		{ label: 'Event', value: ['event'] },
		{ label: 'Service', value: ['service'] },
	]);
	const LoadFonts = async () => {
		await useFonts();
	};
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
			else if (item.description.includes(keyword)) {
				filteredList.push(item);
			}
		});
		if (filteredList.length != 0) {
			//if there are matches, update listing
			setListings(filteredList);
		} else {
			setNoResults(true);
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
		setNoResults(false);
	}

	if (loading) {
		return (
			<ActivityIndicator
				size="large"
				color={Colours.activityIndicator}
				style={styles.loading}
			/>
		);
	}
	if (!isReady) {
		return (
			<AppLoading
				startAsync={LoadFonts}
				onFinish={() => setIsReady(true)}
				onError={() => {}}
			/>
		);
	}

	return (
		<TouchableWithoutFeedback
			onPress={() => (Keyboard.dismiss, setOpen(false))}
		>
			<View style={styles.container}>
				<View style={styles.searchContainer}>
					<View style={styles.searchBar}>
						<TextInput
							style={styles.searchInput}
							value={keyword}
							placeholder="Search listings"
							placeholderTextColor={Colours.black}
							onChangeText={(val) => setKeyword(val)}
							returnKeyType="search"
							onSubmitEditing={() => {
								keyword
									? Search(keyword, listings)
									: FilterListingType([
											'food',
											'essentialItem',
											'event',
											'service',
									  ]);
							}}
						/>
						<MaterialIcons name="search" size={26} style={{ padding: 12 }} />
					</View>
				</View>
				<View style={styles.filterContainer}>
					<View style={styles.filterBar}>
						<DropDownPicker
							style={styles.dropdown}
							open={open}
							items={items}
							value={value}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
							mode="BADGE"
							style={{
								borderWidth: 0,
								width: 150,
							}}
							textStyle={{
								fontFamily: 'Volte',
								fontSize: 16,
							}}
							placeholder="All"
							placeholderStyle={{
								color: Colours.black,
							}}
							onChangeValue={(value) => FilterListingType(value)}
						/>
						<MaterialCommunityIcons
							name="view-list-outline"
							size={30}
							color={view === 'List' ? Colours.koha_orange : Colours.black}
							style={{ marginRight: 60 }}
							onPress={() => setView('List')}
						/>
						<MaterialCommunityIcons
							name="map-marker"
							size={30}
							color={view === 'Map' ? Colours.koha_orange : Colours.black}
							onPress={() => setView('Map')}
							style={{ marginRight: 60 }}
						/>
					</View>
				</View>
				<View style={styles.main}>
					{view === 'Map' && (
						<MapViewComponent listing={listings} nav={navigation} />
					)}
					{view === 'List' && (
						<ListViewComponent
							listing={listings}
							watched={watchedListings}
							results={noResults}
							nav={navigation}
						/>
					)}
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		minHeight: gui.screen.height,
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: gui.container.backgroundColor,
	},
	searchContainer: {
		marginTop: 30,
		paddingLeft: 20,
		paddingRight: 20,
		zIndex: 3,
	},
	searchBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 10,
		width: gui.screen.width * 0.9,
		backgroundColor: Colours.white,
	},
	searchInput: {
		fontFamily: 'Volte',
		fontSize: 16,
		padding: 12,
		borderRadius: 10,
		borderColor: Colours.grey,
		borderWidth: 0,
		width: '85%',
	},
	filterContainer: {
		paddingLeft: 20,
		paddingRight: 20,
	},
	filterBar: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		width: gui.screen.width * 0.9,
		minHeight: 500,
		marginTop: -210,
		marginLeft: 30,
		padding: 15,
		zIndex: 2,
	},
	dropdown: {
		width: '40%',
	},
	main: {
		height: gui.screen.height - 210,
		justifyContent: 'flex-end',
		marginBottom: 80,
		marginTop: -200,
	},
	calloutText: {
		fontSize: 16,
	},
	bubble: {
		borderRadius: 10,
		backgroundColor: Colours.white,
		padding: 20,
		width: gui.screen.width * 0.8,
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
	loading: {
		marginTop: gui.screen.height * 0.3,
	},
});

export default HomeScreen;
