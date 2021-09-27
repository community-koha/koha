import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableHighlight, Image, Button } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import Colours from '../config/colours.js';
import firebase from 'firebase/app';
import gui from '../config/gui.js';

// generic notif view
function NotifScreen() {
	return (
		<View style={styles.container}>
			<Text>{global.e}</Text>
		</View>
	);
}

function MapViewScreen({navigation}) {
	// states and modifiers
	const [hasLocationPermissions, setLocationPermission] = useState(false);
	const [mapRegion, setRegion] = useState(null);
	
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
		
		return () => getLocationAsync();
		
	}, []);

	const [loading, setLoading] = useState(true); // Set loading to true on component mount
	const [listings, setListings] = useState([]); // Initial empty array of users
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

	if (hasLocationPermissions === false) {
		global.e = 'Error: Please Enable Location Permissions';
		return <NotifScreen />;
	}

	if (mapRegion === null) {
		global.e = 'Loading Local Area';
		return <NotifScreen />;
	}

	if (loading) {
		return <ActivityIndicator />;
	}

	return (
		<MapView
		 provider={PROVIDER_GOOGLE}
		 style={styles.map}
		 region={mapRegion}>
		 {/* options=
			{{
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true,
				styles: 
				[
					{
						featureType: "administrative",
						elementType: "geometry",
						stylers: [{visibility: "off"}]
					},
					{
						featureType: "poi",
						stylers: [{visibility: "off"}]
					},
					{
						featureType: "road",
						elementType: "labels.icon",
						stylers: [{visibility: "off"}]
					},
					{
						featureType: "transit",
						stylers: [{visibility: "off"}]
					}
				]
			}} */}
		 
			{listings.map((item, i) => {
				return(
					<MapView.Marker
						key={i}
						coordinate={{
							latitude: item.location.lat,
							longitude: item.location.lng
						}}
						title={item.listingTitle}
						description={item.description}
					>
						<MapView.Callout tooltip
							onPress={() => navigation.navigate('ListingDetailScreen', {
								listingId: item.key,
							})}
						>
							<View>
							<View style={styles.bubble}>
								<View>
									<Image style={styles.photo} source={require('../assets/logo.png')} onPress={() => navigation.navigate('ListingDetailScreen', {
											listingId: item.key,
										})}/>
								</View>
								<View>
									<Text style={styles.calloutText}>{item.listingTitle}</Text>
									<Text style={styles.calloutText}>{item.description}</Text>
									<Text style={styles.calloutText}>Organisation Name</Text>
									<Text style={styles.calloutText}>View Details</Text>
								</View>
								
								
							</View>
							</View>
						</MapView.Callout>
					</MapView.Marker>
				);
			})}
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
	calloutText:{
		fontSize: 16,
	},
	bubble:{
		borderRadius: 10,
		backgroundColor: Colours.white,
		padding: 20,
		width: gui.screen.width * 0.8,
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
	},
	photo:{
		height: 80,
		width: 80,
		justifyContent: 'flex-start',
		marginRight: 20
	}
});

export default MapViewScreen;
