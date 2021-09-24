import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import Colours from '../config/colours.js';
import firebase from 'firebase/app';

// generic notif view
function NotifScreen() {
	return (
		<View style={styles.container}>
			<Text>{global.e}</Text>
		</View>
	);
}

function MapViewScreen() {
	// states and modifiers
	const [mapRegion, setRegion] = useState(null);
	const [hasLocationPermissions, setLocationPermission] = useState(false);
	const [loading, setLoading] = useState(true); // Set loading to true on component mount
	const [listings, setListings] = useState([]); // Initial empty array of users

	// do after render
	useEffect(() => {
		const getLocationAsync = async () => {
			// check permissions
			let { status } = await Location.requestForegroundPermissionsAsync();
			if ('granted' === status) {
				setLocationPermission(true);

				// get location
				let {
					coords: { latitude, longitude },
				} = await Location.getCurrentPositionAsync({});

				// initial region set (happens once per app load)
				setRegion({
					latitude,
					longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				});
			}
		};
		// wait for permissions
		if (hasLocationPermissions === false) {
			getLocationAsync();
		}
	});

	if (hasLocationPermissions === false) {
		global.e = 'Error: Please Enable Location Permissions';
		return <NotifScreen />;
	}

	if (mapRegion === null) {
		global.e = 'Loading Local Area';
		return <NotifScreen />;
	}


	//subscribe from firestore
	useEffect(() => {
		const subscriber = firebase
			.firestore()
			.collection('listings')
			.onSnapshot((querySnapshot) => {
				const listings = [];

				querySnapshot.forEach((documentSnapshot) => {
					listings.push({
						...documentSnapshot.data(),
						key: documentSnapshot.id,
					});
				});

				setListings(listings);
				setLoading(false);
			});

		// Unsubscribe from events when no longer in use
		return () => subscriber();
	}, []);

	if (loading) {
		return <ActivityIndicator />;
	}

	return (
		<MapView style={styles.map} region={mapRegion}>
			
		</MapView>);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
	map: {
		width: '100%',
		height: '100%',
	},
});

export default MapViewScreen;
