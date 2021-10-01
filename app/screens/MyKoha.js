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

function MyKoha({ navigation }) {
	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState([]);
	const [user, setUser] = useState(null);

	var unsubscribe = firebase.auth().onAuthStateChanged(user =>
	{
		if (user)
		{
			setUser(user);
			unsubscribe();
		}
	})

	useEffect(() => {
		setLoading(true);
		const db = firebase.firestore();
		const subscriber = db
			.collection('listings')
			.where('user', '==', user == null ? "": db.doc('users/' + user.uid))
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
		return () => subscriber();
	}, [user]);

	return (
		<View style={styles.container}>
			<ScrollView>
			
				{loading && <ActivityIndicator size="small" color={Colours.activityIndicator}/>}
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
export default MyKoha;
