import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ActivityIndicator,
	ScrollView,
	TouchableOpacity,
	Image,
	Platform
} from 'react-native';
import { ListItem } from 'react-native-elements';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import firebase from 'firebase/app';

var web = Platform.OS === 'web';

function ListingDetailScreen({ route, navigation }) {
	const { listingId } = route.params;
	const [loading, setLoading] = useState(true);
	const [listing, setListing] = useState(null);
	const [watching, setWatching] = useState(false);
	const [user, setUser] = useState(null);
	const [type, setType] = useState('');
	const [image, setImage] = useState('');

	var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			unsubscribe();
			setUser(user);
		}
	});

	useEffect(() => {
		setLoading(true);
		const subscriber = firebase
			.firestore()
			.collection('listings')
			.where(firebase.firestore.FieldPath.documentId(), '==', listingId)
			.onSnapshot((querySnapshot) => {

				querySnapshot.forEach((documentSnapshot) => {
					// Don't show listings that have been deleted or hidden from public view
					if (
						documentSnapshot.data()['deleted'] != true &&
						documentSnapshot.data()['public'] != false
					) {
						setType(documentSnapshot.data()['listingType']);
						setListing({
							...documentSnapshot.data(),
							key: documentSnapshot.id,
						});
					}
				});
				setLoading(false);
			});

		// Unsubscribe from events when no longer in use
		return () => subscriber();
	}, [listingId]);

	useEffect(() => {
		if (user !== null) {
			const subscriber = firebase
				.firestore()
				.collection('users')
				.where(firebase.firestore.FieldPath.documentId(), '==', user['uid'])
				.onSnapshot((querySnapshot) => {
					querySnapshot.forEach((documentSnapshot) => {
						var watching_var = documentSnapshot.data()['watching'];

						setWatching(
							watching_var !== undefined
								? watching_var.includes(listingId)
								: false
						);
					});
				});

			// Unsubscribe from events when no longer in use
			return () => subscriber();
		}
	}, [user]);

	function AddWatching(id) {
		const db = firebase.firestore();
		db.collection('users')
			.doc(user['uid'])
			.update({
				watching: firebase.firestore.FieldValue.arrayUnion(id),
			})
			.then(() => {
				console.log('Added item to watching list');
				setWatching(true);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	function RemoveWatching(id) {
		const db = firebase.firestore();
		db.collection('users')
			.doc(user['uid'])
			.update({
				watching: firebase.firestore.FieldValue.arrayRemove(id),
			})
			.then(() => {
				console.log('Removed item from watching list');
				setWatching(false);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	var storage = firebase.storage().ref(listing == null? "":listing.imageFileName);
	storage.getDownloadURL().then((result) => {setImage(result)});
	console.log(['food', 'essentialItem'].includes(type))

	return (
		<View style={styles.container}>
			<View style={styles.buttons}>
				<TouchableOpacity
					style={[styles.button, styles.backButton]}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Text style={styles.backButtonText}>BACK</Text>
				</TouchableOpacity>
				{['food', 'essentialItem'].includes(type) && watching && (
					<TouchableOpacity
						style={[styles.button, styles.watchButton]}
						onPress={() => {
							RemoveWatching(listingId);
						}}
					>
						<Text style={styles.backButtonText}>UNWATCH</Text>
					</TouchableOpacity>
				)}
				{['food', 'essentialItem'].includes(type) && !watching && (
					<TouchableOpacity
						style={[styles.button, styles.watchButton]}
						onPress={() => {
							AddWatching(listingId);
						}}
					>
						<Text style={styles.backButtonText}>WATCH</Text>
					</TouchableOpacity>
				)}
			</View>
			<ScrollView style={styles.scroll}>
				{loading && (
					<ActivityIndicator size="small" color={Colours.activityIndicator} />
				)}
				{!loading &&
					(
						<View>
							{['food', 'essentialItem'].includes(type) &&
								<Image
									style={styles.listingImage}
									source={{
										uri: image,
									}}
								/>
							}
							<ListItem>
								<ListItem.Content>
									<ListItem.Title>{listing.listingTitle}</ListItem.Title>
									<ListItem.Subtitle>{listing.description}</ListItem.Subtitle>
									<ListItem.Subtitle>
										Location: {listing.location['name']} ({listing.location['lat']},
										{listing.location['lng']})
									</ListItem.Subtitle>
									<ListItem.Subtitle>
										Quantity: {listing.quantity}
									</ListItem.Subtitle>
									<ListItem.Subtitle>
										Collection Method: {listing.collectionMethod}
									</ListItem.Subtitle>
									<ListItem.Subtitle>
										Category: {listing.category}
									</ListItem.Subtitle>
								</ListItem.Content>
							</ListItem>
						</View>
					)				
				}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.white,
	},
	scroll: {
		width: Gui.screen.width * 1,
		height: Gui.screen.height * 0.5,
		backgroundColor: Colours.white,
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		width: Gui.screen.width * 1,
		height: Gui.screen.height * 0.04,
		backgroundColor: Colours.white,
		marginTop: Gui.screen.height * 0.02,
		marginBottom: Gui.screen.height * 0.02,
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.1,
		height: Gui.screen.height * 0.04,
		borderRadius: 5,
		borderWidth: 3,
		borderColor: Colours.koha_navy,
	},
	backButton: {
		backgroundColor: Colours.koha_navy,
		width: Gui.screen.width * 0.1,
	},
	watchButton: {
		borderColor: Colours.koha_green,
		backgroundColor: Colours.koha_green,
		marginLeft: Gui.screen.width * 0.05,
		width: Gui.screen.width * 0.1,
	},
	backButtonText: {
		color: Colours.white,
	},
	listingImage: {
		marginLeft: (Gui.screen.width*0.5 - (web? 500: 250)/2),
		width: web? 500: 250,
    	height: web? 500: 250,
	},
});
export default ListingDetailScreen;
