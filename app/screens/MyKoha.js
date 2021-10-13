import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ActivityIndicator,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import firebase from 'firebase/app';
import AppLoading from 'expo-app-loading';

function MyKoha({ navigation }) {
	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState([]);
	const [user, setUser] = useState(null);
	const [showFood, setShowFood] = useState(true);
	const [showItem, setShowItem] = useState(true);
	const [showService, setShowService] = useState(true);
	const [showEvent, setShowEvent] = useState(true);
	const [isReady, setIsReady] = useState(false);
	const LoadFonts = async () => {
		await useFonts();
	};

	var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			setUser(user);
			unsubscribe();
		}
	});

	useEffect(() => {
		setLoading(true);
		const db = firebase.firestore();
		const subscriber = db
			.collection('listings')
			.where('user', '==', user == null ? '' : db.doc('users/' + user.uid))
			.onSnapshot((querySnapshot) => {
				const listings = [];

				querySnapshot.forEach((documentSnapshot) => {
					var index = ['food', 'essentialItem', 'service', 'event'].indexOf(
						documentSnapshot.data().listingType
					);

					if (
						[showFood, showItem, showService, showEvent][index] &&
						documentSnapshot.data()['deleted'] != true
					) {
						listings.push({
							...documentSnapshot.data(),
							key: documentSnapshot.id,
						});
					}
				});

				setListings(listings);
				setLoading(false);
			});
		return () => subscriber();
	}, [user, showFood, showItem, showService, showEvent]);

	if (!isReady) {
		return (
			<AppLoading
				startAsync={LoadFonts}
				onFinish={() => setIsReady(true)}
				onError={() => {}}
			/>
		);
	}
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Koha History</Text>
			</View>
			<View style={styles.buttons}>
				<TouchableOpacity
					style={
						showFood
							? [styles.button, styles.foodButton]
							: [styles.button, styles.foodButton, styles.disableButton]
					}
					onPress={() => {
						setShowFood(!showFood);
					}}
				>
					<Text
						style={
							showFood
								? [styles.buttonText]
								: [styles.buttonText, styles.disableButton]
						}
					>
						FOOD
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={
						showItem
							? [styles.button, styles.itemButton]
							: [styles.button, styles.itemButton, styles.disableButton]
					}
					onPress={() => {
						setShowItem(!showItem);
					}}
				>
					<Text
						style={
							showItem
								? [styles.buttonText]
								: [styles.buttonText, styles.disableButton]
						}
					>
						ITEMS
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={
						showEvent
							? [styles.button, styles.eventButton]
							: [styles.button, styles.eventButton, styles.disableButton]
					}
					onPress={() => {
						setShowEvent(!showEvent);
					}}
				>
					<Text
						style={
							showEvent
								? [styles.buttonText]
								: [styles.buttonText, styles.disableButton]
						}
					>
						EVENTS
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={
						showService
							? [styles.button, styles.serviceButton]
							: [styles.button, styles.serviceButton, styles.disableButton]
					}
					onPress={() => {
						setShowService(!showService);
					}}
				>
					<Text
						style={
							showService
								? [styles.buttonText]
								: [styles.buttonText, styles.disableButton]
						}
					>
						SERVICES
					</Text>
				</TouchableOpacity>
			</View>
			<ScrollView style={styles.scroll}>
				{loading && (
					<ActivityIndicator size="small" color={Colours.activityIndicator} />
				)}
				<View style={styles.contentView}>
					{!loading &&
						listings.length > 0 &&
						listings.map((item, i) => {
							return (
								<ListItem
									key={i}
									bottomDivider
									style={styles.list}
									onPress={() => {
										navigation.navigate('EditListingScreen', {
											listingId: item.key,
										});
									}}
								>
									<ListItem.Content style={styles.content}>
										<ListItem.Title style={styles.contentTitle}>
											{item.listingTitle}
										</ListItem.Title>
										<ListItem.Subtitle style={styles.contentText}>
											{item.description}
										</ListItem.Subtitle>
									</ListItem.Content>
								</ListItem>
							);
						})}
					{!loading && listings.length <= 0 && (
						<View>
							<Text style={styles.emptyText}>No Koha Found</Text>
							<TouchableOpacity
								style={[styles.button, styles.giveButton]}
								onPress={() => {
									navigation.navigate('GiveKoha');
								}}
							>
								<Text style={[styles.buttonText, styles.backButtonText]}>
									GIVE KOHA
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
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
		marginRight: Gui.screen.width * 0.2,
		color: Colours.koha_purple,
	},
	contentView: {
		width: Gui.screen.width * 1,
		height: Gui.screen.height * 0.8,
	},
	title: {
		fontSize: Gui.screen.height * 0.02,
		fontWeight: 'bold',
	},
	subtitle: {
		fontSize: Gui.screen.height * 0.0175,
	},
	contentView: {
		width: Gui.screen.width * 1,
		height: Gui.screen.height * 0.8,
	},
	contentViewItem: {
		alignItems: 'center',
	},
	list: {
		width: Gui.screen.width,
	},
	content:{
		padding: 12,
	},
	contentTitle:{
		fontFamily: "Volte" ,
		fontSize: 20,
		paddingBottom: 5
	},
	contentText:{
		fontFamily: "Volte" ,
		fontSize: 16,
		paddingBottom: 5,
		lineHeight: 20
	},
	scroll: {
		width: Gui.screen.width * 1,
		height: Gui.screen.height * 0.5,
		backgroundColor: Colours.white,
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 1,
		height: Gui.screen.height * 0.04,
		backgroundColor: Colours.white,
		marginTop: Gui.screen.height * 0.02,
		marginBottom: Gui.screen.height * 0.02,
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.22,
		height: Gui.screen.height * 0.04,
		borderRadius: 5,
		borderWidth: 3,
		borderColor: Colours.koha_navy,
	},
	disableButton: {
		backgroundColor: Colours.grey,
		borderColor: Colours.grey,
		color: Colours.white,
	},
	foodButton: {
		marginLeft: Gui.screen.width * 0.02,
	},
	itemButton: {
		marginLeft: Gui.screen.width * 0.02,
	},
	eventButton: {
		marginLeft: Gui.screen.width * 0.02,
	},
	serviceButton: {
		marginLeft: Gui.screen.width * 0.02,
	},
	backButton: {
		backgroundColor: Colours.koha_navy,
		marginLeft: Gui.screen.width * 0.05,
		width: Gui.screen.width * 0.1,
	},
	giveButton: {
		backgroundColor: Colours.koha_navy,
		marginTop: Gui.screen.height * 0.015,
		marginLeft: Gui.screen.width * 0.35,
		width: Gui.screen.width * 0.3,
	},
	buttonText: {
		textAlign: 'center',
		fontSize: 16,
		color: Colours.koha_navy,
		fontFamily: 'Volte',
	},
	emptyText: {
		textAlign: 'center',
		fontSize: 20,
		color: Colours.black,
		fontFamily: 'Volte',
	},
	backButtonText: {
		color: Colours.white,
	},
});
export default MyKoha;
