import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ActivityIndicator,
	ScrollView,
	TouchableOpacity,
	Image,
	Platform,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import AppLoading from 'expo-app-loading';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import firebase from 'firebase/app';
import { FormStyle } from '../config/styles.js';

var web = Platform.OS === 'web';

function ListingDetailScreen({ route, navigation }) {
	const testListing = {listingTitle:"title",description:"description",location:{lat:0,lng:0,name:"name"}}
	const { listingId } = process.env.JEST_WORKER_ID !== undefined? {listingId:""}:route.params;
	const [loading, setLoading] = useState(process.env.JEST_WORKER_ID !== undefined? false: true);
	const [listing, setListing] = useState(process.env.JEST_WORKER_ID !== undefined? testListing: null);
	const [watching, setWatching] = useState(false);
	const [user, setUser] = useState(null);
	const [type, setType] = useState('');
	const [image, setImage] = useState('');
	const [isReady, setIsReady] = useState(false);

	const LoadFonts = async () => {
		await useFonts();
	};

	var unsubscribe = process.env.JEST_WORKER_ID !== undefined? null: firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			unsubscribe();
			setUser(user);
		}
	});

	if (process.env.JEST_WORKER_ID === undefined) {
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
	}

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

	if (process.env.JEST_WORKER_ID === undefined) {
		var storage = firebase
			.storage()
			.ref(listing == null ? '' : listing.imageFileName);
		storage.getDownloadURL().then((result) => {
			setImage(result);
		});
		console.log(['food', 'essentialItem'].includes(type));

		if (!isReady) {
			return (
				<AppLoading
					startAsync={LoadFonts}
					onFinish={() => setIsReady(true)}
					onError={() => {}}
				/>
			);
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Listing Details</Text>
			</View>
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
				{!loading && (
					<View>
						{['food', 'essentialItem'].includes(type) && (
							<Image
								style={styles.listingImage}
								source={{
									uri: image,
								}}
							/>
						)}
						<ListItem style={styles.list} bottomDivider>
							<ListItem.Content style={styles.content}>
								<ListItem.Title style={styles.contentTitle}>{listing.listingTitle}</ListItem.Title>
								<ListItem.Subtitle style={styles.contentText}>{listing.description}</ListItem.Subtitle>
								<ListItem.Subtitle style={styles.contentText}>
									Location: {listing.location['name']} 
								</ListItem.Subtitle>
								{ listing.listingType == 'food' ?
									<ListItem.Subtitle style={styles.contentText}>
										Allergen: { listing.allergen }
									</ListItem.Subtitle> :
									<View></View>
								}
								{ listing.listingType == 'essentialItem' ?
									<ListItem.Subtitle style={styles.contentText}>
										Condition: { listing.condition }
									</ListItem.Subtitle> :
									<View></View>
								}
								{ listing.category ?
									<ListItem.Subtitle style={styles.contentText}>
										Category: { listing.category }
									</ListItem.Subtitle> :
									<View></View>
								}
								{ listing.quantity ?
									<ListItem.Subtitle style={styles.contentText}>
										Quantity: {listing.quantity}
								</ListItem.Subtitle> :
									<View></View>
								}
								{ listing.collectionMethod ?
									<ListItem.Subtitle style={styles.contentText}>
										Collection Method: {listing.collectionMethod == "pick_up" ? "Pick up" : "Delivery"}
									</ListItem.Subtitle> :
									<View></View>
								}
								{ listing.eventDate ?
									<ListItem.Subtitle style={styles.contentText}>
										Date: {listing.eventDate}
									</ListItem.Subtitle> :
									<View></View>
								}
								{ listing.capacity ?
									<ListItem.Subtitle style={styles.contentText}>
										Event Capacity: {listing.capacity}
									</ListItem.Subtitle> :
									<View></View>
								}
								
								
								
							</ListItem.Content>
						</ListItem>
					</View>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.white,
	},
	header: {
		paddingTop: Platform.OS === 'ios' ? 50 : 0,
		paddingLeft: Gui.screen.width * 0.1,
		paddingRight: Gui.screen.width * 0.1,
		zIndex: 3,
		backgroundColor: Gui.container.backgroundColor,
		height: Gui.screen.height * 0.12,
		flexDirection: 'row',
		alignContent: 'space-between',
	},
	headerTitle: {
		alignItems: 'center',
		textAlign: 'center',
		textAlignVertical: 'center',
		fontFamily: 'Volte',
		fontSize: Gui.screen.height * 0.05,
		color: Colours.koha_purple,
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
		width: Gui.screen.width * 0.3,
		height: Gui.screen.height * 0.04,
		borderRadius: 5,
	},
	backButton: {
		backgroundColor: Colours.koha_navy,
	},
	watchButton: {
		borderColor: Colours.koha_purple,
		backgroundColor: Colours.koha_purple,
		marginLeft: Gui.screen.width * 0.05,
	},
	backButtonText: {
		color: Colours.white,
		fontFamily: 'Volte',
		fontSize: Gui.screen.width * 0.05,
	},
	listingImage: {
		marginLeft: Gui.screen.width * 0.5 - (web ? 500 : 250) / 2,
		width: web ? 500 : 250,
		height: web ? 500 : 250,
	},
	list: {
		width: Gui.screen.width,
	},
	content: {
		padding: 12,
	},
	contentTitle: {
		fontFamily: 'Volte',
		fontSize: 28,
		paddingBottom: 8,
	},
	contentText: {
		fontFamily: 'Volte',
		fontSize: 24,
		paddingBottom: 8,
		lineHeight: 30,
	},
});
export default ListingDetailScreen;
