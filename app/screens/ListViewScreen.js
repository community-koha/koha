import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	ActivityIndicator,
	ScrollView,
	TouchableWithoutFeedback,
	Keyboard
} from 'react-native';
import { ListItem } from 'react-native-elements';
import Colours from '../config/colours.js';
import gui from '../config/gui.js';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase/app';
import { MaterialIcons } from '@expo/vector-icons';

function ListViewScreen({navigation}) {
	const [loading, setLoading] = useState(true); // Set loading to true on component mount
	const [listings, setListings] = useState([]); // Initial empty array of users
	const [search, setSearch] = useState('');

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
		return <ActivityIndicator size="small" color={Colours.activityIndicator}/>;
	}
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.container}>
				<View style={styles.searchContainer}>
					<TextInput
						style={styles.searchBar}
						value={search}
						placeholder="Search listings"
						/>
					<View style={styles.iconContainer}>
						<MaterialCommunityIcons name="view-list"
							size={30}
							color={Colours.default}
							style={{margin: 5}} />
						<MaterialCommunityIcons name="map-marker-outline"
							size={30}
							color={Colours.grey}
							style={{margin: 5}}
							onPress={()=> navigation.navigate('Map')} />
					</View>
					
				</View>
				<ScrollView keyboardShouldPersistTaps='handled'>
			{listings.map((item, i) => {
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
			})}
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

	},
	searchContainer:{
		height: '21%',
		padding: 20,
	},
	searchBar:{
		fontSize: 16,
		padding: 12,
		borderRadius: 10,
		borderColor: Colours.grey,
		borderWidth: 0.5,
		width: gui.screen.width * 0.9,
	},
	iconContainer:{
		flexDirection: 'row',
		justifyContent: 'flex-end',
		padding: 10,
	},
	list:{
		width: gui.screen.width * 1
	}
});

export default ListViewScreen;
