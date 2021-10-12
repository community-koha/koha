import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
	TextInput,
	Image,
	TouchableWithoutFeedback,
	Button,
	Keyboard,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import Colours from '../config/colours.js';
import gui from '../config/gui.js';

const MapViewComponent = (props) => {
	// states and modifiers
	const [hasLocationPermissions, setLocationPermission] = useState(false);
	const [mapRegion, setRegion] = useState(null);
	const [listings] = useState(props.listing);
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

	//customize map style
	var mapStyle = [
		{
			featureType: 'administrative',
			elementType: 'geometry',
			stylers: [{ visibility: 'off' }],
		},
		{
			featureType: 'poi',
			stylers: [{ visibility: 'off' }],
		},
		{
			featureType: 'road',
			elementType: 'labels.icon',
			stylers: [{ visibility: 'off' }],
		},
		{
			featureType: 'transit',
			stylers: [{ visibility: 'off' }],
		},
	];

	if (!mapRegion) {
		return <ActivityIndicator size="small" color={Colours.activityIndicator} />;
	}

	return (
		<MapView
			provider={PROVIDER_GOOGLE}
			style={styles.map}
			region={mapRegion}
			customMapStyle={mapStyle}
			showsUserLocation={true}
			maxZoomLevel={17}
			options={{ disableDefaultUI: true }}
		>
			{listings.map((item, i) => {
				return (
					<MapView.Marker
						key={i}
						coordinate={{
							latitude: item.location.lat,
							longitude: item.location.lng,
						}}
						title={item.listingTitle}
						description={item.description}
					>
						<MapView.Callout
							tooltip
							onPress={() =>
								navigation.navigate('ListingDetailScreen', {
									listingId: item.key,
								})
							}
						>
							<View>
								<View style={styles.bubble}>
									<View>
										<Image
											style={styles.photo}
											source={require('../assets/logo.png')}
											onPress={() =>
												navigation.navigate('ListingDetailScreen', {
													listingId: item.key,
												})
											}
										/>
									</View>
									<View>
										<Text style={styles.calloutText}>{item.listingTitle}</Text>
										<Text style={styles.calloutText}>{item.description}</Text>
										<Text style={styles.calloutText}></Text>
										<Text style={styles.calloutText}>View Details</Text>
									</View>
								</View>
							</View>
						</MapView.Callout>
					</MapView.Marker>
				);
			})}
		</MapView>
	);
};

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
		padding: 10,
	},
	map: {
		width: '100%',
		height: '73%',
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

export default MapViewComponent;
