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
	const [searching, setSearching] = useState(false);

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
		setSearching(true);
		//create new array
		const filteredList = [];
		//check each listings title and description
		listings.forEach(function (item) {
			if (item.listingTitle.includes(keyword)) {
				filteredList.push(item);
			} else if (item.description.includes(keyword)) {
				filteredList.push(item);
			}
		});
		if (filteredList.length != 0) {
			//if there are matches, update listing
			setListings(filteredList);
		}
	}

	function FilterListingType(type) {
		setSearching(false);
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
				<View style={styles.main}>
					{view === 'Map' && (
						<MapViewComponent listing={listings} nav={navigation} />
					)}
					{view === 'List' && (
						<ListViewComponent
							listing={listings}
							watched={watchedListings}
							nav={navigation}
							searching={searching}
						/>
					)}
				</View>
				<View style={styles.topBar}>
					<View style={styles.searchContainer}>
						<View style={styles.searchBar}>
							<TextInput
								style={styles.searchInput}
								value={keyword}
								placeholder="Search listings"
								placeholderTextColor={Colours.black}
								onChangeText={(val) => {
									setKeyword(val);
									keyword
										? Search(keyword, listings)
										: FilterListingType(
												value
													? value
													: ['food', 'essentialItem', 'event', 'service']
										  );
								}}
								returnKeyType="search"
							/>
							<MaterialIcons name="search" size={26} style={{ padding: 12 }} />
						</View>
					</View>
					<View style={styles.filterContainer} pointerEvents={'box-none'}>
						<View style={styles.filterBar} pointerEvents={'box-none'}>
							<DropDownPicker
								open={open}
								items={items}
								value={value}
								setOpen={setOpen}
								setValue={setValue}
								setItems={setItems}
								mode="BADGE"
								style={{
									borderWidth: 0,
									width: '50%',
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
								style={{ padding: 25, marginRight: 25 }}
								color={view === 'List' ? Colours.koha_orange : Colours.black}
								onPress={() => setView('List')}
							/>
							<MaterialCommunityIcons
								name="map-marker"
								size={30}
								style={{ padding: 25 }}
								color={view === 'Map' ? Colours.koha_orange : Colours.black}
								onPress={() => setView('Map')}
							/>
						</View>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		minHeight: gui.screen.height,
		flexDirection: 'column',
		justifyContent: 'space-around',
		backgroundColor: gui.container.backgroundColor,
	},
	topBar: { top: -140 },
	searchContainer: {
		marginTop: 20,
		paddingLeft: 20,
		paddingRight: 20,
		zIndex: 3,
		elevation: 3,
	},
	searchBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 10,
		backgroundColor: Colours.white,
	},
	searchInput: {
		fontFamily: 'Volte',
		fontSize: 16,
		padding: 12,
		borderRadius: 10,
		borderWidth: 0,
		width: '85%',
	},
	filterContainer: {
		marginTop: 10,
		marginBottom: 20,
		zIndex: 5,
		elevation: 5,
	},
	filterBar: {
		marginLeft: 50,
		marginRight: 40,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		top: -220,
		elevation: 3,
		minHeight: 500,
	},
	main: {
		height: gui.screen.height - 200,
		bottom: 135,
		width: gui.screen.width,
		position: 'absolute',
		zIndex: 4,
		elevation: 4,
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
