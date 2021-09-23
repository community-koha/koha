import React, { Component, useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Button,
	ActivityIndicator,
	ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ListItem } from 'react-native-elements';
import Colours from '../config/colours.js';
import firebase from 'firebase/app';

function ListingDetailScreen({ route, navigation }) {
	const { listingId } = route.params;
	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState([]);

	useEffect(() => {
		setLoading(true);
		const subscriber = firebase
			.firestore()
			.collection('listings')
			.where(firebase.firestore.FieldPath.documentId(), '==', listingId)
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
	}, [listingId]);

	return (
		<View style={styles.container}>
			<ScrollView>
			
				{loading && <ActivityIndicator />}
				{!loading &&
					listings.map((item, i) => {
						return (
							<ListItem key={i}>
								<ListItem.Content>
									<ListItem.Title>{item.listingTitle}</ListItem.Title>
									<ListItem.Subtitle>{item.description}</ListItem.Subtitle>
									<ListItem.Subtitle>
										Location: {item.location['name']} ({item.location['lat']},
										{item.location['lng']})
									</ListItem.Subtitle>
									<ListItem.Subtitle>
										Quantity: {item.quantity}
									</ListItem.Subtitle>
									<ListItem.Subtitle>
										Collection Method: {item.collectionMethod}
									</ListItem.Subtitle>
									<ListItem.Subtitle>
										Category: {item.category}
									</ListItem.Subtitle>
									<ListItem.Subtitle>
										Sub Category{item.subCategory}
									</ListItem.Subtitle>
								</ListItem.Content>
							</ListItem>
						);
					})}
			
			
				<Button
					style={styles.button}
					title="Go Back"
					onPress={() => navigation.goBack()}
				></Button>
			
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: '10%',
		paddingBottom: '5%'
	},
	button: {
		height: 45,
		width: '80%',
		color: Colours.white,
		marginTop: 50,
	},
});
export default ListingDetailScreen;
