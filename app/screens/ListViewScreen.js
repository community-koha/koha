import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	ActivityIndicator,
	Image, 
	ScrollView,
	TouchableWithoutFeedback,
	Button,
	Keyboard,
	Text,
	Platform
} from 'react-native';
import { ListItem } from 'react-native-elements';
import Colours from '../config/colours.js';
import gui from '../config/gui.js';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import firebase from 'firebase/app';

function ListViewScreen({route, navigation}) {
	
	const [loading, setLoading] = useState(true); // Set loading to true on component mount
	const [listings, setListings] = useState([]); // Initial empty array of users
	const [watchedListings, setWatchedListings] = useState([]); // Initial empty array of users
	const [keyword, setKeyword] = useState('');
	const [noResults, setNoResults] = useState(false);

	useEffect(() => {		
		// Get watched listings
		var subscriber = firebase
			.firestore()
			.collection('users')
			.where(firebase.firestore.FieldPath.documentId(), '==', user["uid"])
			.onSnapshot((querySnapshot) => {
				querySnapshot.forEach((documentSnapshot) => {
					const watching = documentSnapshot.data()["watching"] == undefined? []: documentSnapshot.data()["watching"];

					subscriber = firebase
					.firestore()
					.collection('listings')
					.onSnapshot((querySnapshot) => {
						const listings = [];
						const watchedListings = [];

						querySnapshot.forEach((documentSnapshot) => {
							// Don't show listings that have been deleted or hidden from public view
							if (documentSnapshot.data()["deleted"] != true && documentSnapshot.data()["public"] != false)
							{
								if (watching.includes(documentSnapshot.id)) {
									watchedListings.push({
										...documentSnapshot.data(),
										key: documentSnapshot.id,
									});
								}
								else
								{
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
	
	if (loading) {
		return <ActivityIndicator size="small" color={Colours.activityIndicator}/>;
	}

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
		else{
			setNoResults(true);
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
		setNoResults(false);
		
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
							returnKeyType='search'
							onSubmitEditing={() => 
								{
									keyword ? Search(keyword, listings) : FilterListingType(["food", "essentialItem", "event", "service"])
								}}
							/>
						<MaterialIcons
							name="search"
							size={26}
							style={{padding: 12}}
							/>
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
				<ScrollView keyboardShouldPersistTaps='handled'>
				{watchedListings.map((item, i) => {
					return (
						<ListItem
							style={styles.list}
							key={i}
							bottomDivider
							onPress={() =>
								navigation.navigate('ListingDetailScreen', {
									listingId: item.key,
								})
							}
						>
							<ListItem.Content>
								<ListItem.Title>Liked: {item.listingTitle}</ListItem.Title>
								<ListItem.Subtitle>{item.description}</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
					);
				})}
				{ noResults ? <View><Text style={styles.noListings}>No listings found</Text></View> :
					listings.map((item, i) => {
						return (
							<ListItem
								style={styles.list}
								key={i}
								bottomDivider
								onPress={() =>
									navigation.navigate('ListingDetailScreen', {
										listingId: item.key,
									})
								}
							>
								<ListItem.Content>
									<ListItem.Title>{item.listingTitle}</ListItem.Title>
									<ListItem.Subtitle>{item.description}</ListItem.Subtitle>
								</ListItem.Content>
							</ListItem>
						);
					})
				}
			</ScrollView>
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
		paddingTop: Platform.OS === "ios" ? 20 : 0
	},
	noListings:{
		fontSize: 22,
		padding: '10%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
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
	list:{
		width: gui.screen.width * 1
	},
});

export default ListViewScreen;
