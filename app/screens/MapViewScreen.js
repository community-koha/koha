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
	Keyboard 
} from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

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
	const [keyword, setKeyword] = useState('');

	
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
				//add all docs to listings array
				querySnapshot.forEach((documentSnapshot) => {
					listings.push({
						...documentSnapshot.data(),
						key: documentSnapshot.id,
					});
				});
				//update listings
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

	//customize map style
	var mapStyle = [
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

	function Search(keyword, listings){
		//create new array
		const filteredList = []
		//check each listings title and description
		listings.forEach(function(item) {
			if (item.listingTitle.includes(keyword)){
				filteredList.push(item)
			}
			if (item.description.includes(keyword)){
				filteredList.push(item)
			}
		})
		if (filteredList.length != 0){
			//if there are matches, update listing
			setListings(filteredList);
		}
	}

	function FilterListingType(type){
		
		firebase.firestore()
			.collection('listings')
			// Filter results
			.where('listingType', 'in', type)
			.get()
			.then(querySnapshot => {
				const filteredList = []
				querySnapshot.forEach((documentSnapshot) => {
					filteredList.push({
						...documentSnapshot.data(),
						key: documentSnapshot.id,
					});
				});

				if (filteredList.length != 0){
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
							style={{padding: 12}}
							onPress={() => Search(keyword, listings)}/>
					</View>
					<View style={styles.filterContainer}>
						<Button title="All" onPress={() => FilterListingType(["food", "essentialItem", "event", "service"])}/>
						<Button title="Food" onPress={() => FilterListingType(["food"])}/>
						<Button title="Essentials" onPress={() => FilterListingType(["essentialItem"])}/>
						<Button title="Event" onPress={() => FilterListingType(["event"])}/>
						<Button title="Service" onPress={() => FilterListingType(["service"])}/>
					</View>
					
					<View style={styles.iconContainer}>
						<MaterialCommunityIcons name="view-list-outline"
							size={30}
							color={Colours.default}
							style={{margin: 5}}
							onPress={()=> navigation.navigate('ListViewScreen')}/>
						<MaterialCommunityIcons name="map-marker"
							size={30}
							color={Colours.black}
							style={{margin: 5}}/>
					</View>
					
				</View>
				<MapView
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					region={mapRegion}
					customMapStyle={mapStyle}>
				
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
	searchContainer:{
		height: '21%',
		padding: 20,
	},
	searchBar:{
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 10,
		borderColor: Colours.grey,
		borderWidth: 0.5,
		width: gui.screen.width * 0.9,
	},
	searchInput:{
		fontSize: 16,
		padding: 12,
		borderRadius: 10,
		borderColor: Colours.grey,
		borderWidth: 0,
		width: '85%'
	},
	filterContainer:{
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 10,
	},
	iconContainer:{
		flexDirection: 'row',
		justifyContent: 'flex-end',
		padding: 10,
	},
	map: {
		width: '100%',
		height: '70%',
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
