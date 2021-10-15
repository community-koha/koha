import React, { Component, useEffect, useState } from 'react';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	Platform,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'firebase/app';
import AppLoading from 'expo-app-loading';

function Notification({ navigation }) {
	const [loading, setLoading] = useState(true);
	const [notifications, setNotifications] = useState([]);
	const [user, setUser] = useState(null);
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

	function DeleteNotification(id) {
		const db = firebase.firestore();
		db.collection('notifications')
			.doc(id)
			.delete()
			.then(() => {
				console.log('Notification successfully deleted!');
			})
			.catch((error) => {
				console.error(error);
			});
	}

	function DeleteAllNotifications() {
		const db = firebase.firestore();
		var notifications = db
			.collection('notifications')
			.where('uid', '==', user.uid);
		notifications.get().then(function (querySnapshot) {
			querySnapshot.forEach(function (doc) {
				doc.ref.delete();
			});
		});
		console.log('Successfully deleted all notifications!');
	}

	useEffect(() => {
		setLoading(true);
		const db = firebase.firestore();
		const subscriber = db
			.collection('notifications')
			.where('uid', '==', user == null ? '' : user.uid)
			.onSnapshot((querySnapshot) => {
				const notifications = [];
				querySnapshot.forEach((documentSnapshot) => {
					notifications.push({
						...documentSnapshot.data(),
						key: documentSnapshot.id,
					});
				});
				setNotifications(notifications);
				setLoading(false);
			});
		return () => subscriber();
	}, [user]);

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
				<Text style={styles.headerTitle}>Notifications</Text>
			</View>
			{notifications.length > 0 && (
				<View style={styles.buttons}>
					<TouchableOpacity
						style={[styles.button, styles.clearButton]}
						onPress={() => {
							DeleteAllNotifications(1);
						}}
					>
						<Text style={styles.buttonText}>CLEAR NOTIFICATIONS</Text>
					</TouchableOpacity>
				</View>
			)}
			<ScrollView style={styles.scroll}>
				{loading && (
					<ActivityIndicator size="large" color={Colours.activityIndicator} />
				)}
				<View style={styles.contentView}>
					{!loading &&
						notifications.length > 0 &&
						notifications.map((item, i) => {
							return (
								<ListItem key={i} style={styles.listStyle}>
									<ListItem.Content style={styles.contentViewItem}>
										<ListItem.Title style={styles.title}>
											The watched listing '{item.title}' has been removed by the
											poster
										</ListItem.Title>
										<ListItem.Subtitle style={styles.subtitle}>
											The listing has been removed by the poster, and was
											automatically removed from your watched listings. It will
											no longer appear in your watched listings.
										</ListItem.Subtitle>
										<TouchableOpacity
											style={[styles.button, styles.clearItemButton]}
											onPress={() => {
												DeleteNotification(item.key);
											}}
										>
											<Text style={[styles.buttonText, styles.clearItemText]}>
												DELETE NOTIFICATION
											</Text>
										</TouchableOpacity>
									</ListItem.Content>
								</ListItem>
							);
						})}
					{!loading && notifications.length <= 0 && (
						<View>
							<Text style={styles.emptyText}>No Notifications Found</Text>
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
	contentView: {
		width: Gui.screen.width * 1,
		height: Gui.screen.height * 0.8,
	},
	title: {
		fontSize: Gui.screen.height * 0.018,
		maxWidth: Gui.screen.width * 0.5,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	subtitle: {
		fontSize: Gui.screen.height * 0.0175,
		maxWidth: Gui.screen.width * 0.5,
		textAlign: 'center',
	},
	contentView: {
		width: Gui.screen.width * 1,
		height: Gui.screen.height * 0.8,
		marginBottom: Gui.screen.height * 0.25,
	},
	contentViewItem: {
		paddingLeft: Gui.screen.width * 0.02,
		paddingRight: Gui.screen.width * 0.02,
		width: Gui.screen.width * 0.8,
		alignItems: 'center',
	},
	listStyle: {
		padding: 0,
		marginBottom: 0,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderRadius: 1,
		borderColor: Colours.grey,
		width: Gui.screen.width * 1,
		marginLeft: Gui.screen.width * 0,
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
		width: Gui.screen.width * 0.1,
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
	clearButton: {
		backgroundColor: Colours.koha_peach,
		borderColor: Colours.koha_peach,
		width: Gui.screen.width * 0.25,
	},
	clearItemButton: {
		backgroundColor: Colours.koha_navy,
		borderColor: Colours.koha_navy,
		marginTop: 20,
		width: Gui.screen.width * 0.2,
		height: Gui.screen.height * 0.03,
	},
	buttonText: {
		textAlign: 'center',
		fontSize: Gui.button.fontSize,
		color: Colours.white,
		fontFamily: 'Volte',
	},
	clearItemText: {
		fontSize: Gui.button.fontSize * 0.85,
	},
	emptyText: {
		textAlign: 'center',
		fontSize: Gui.button.fontSize,
		color: Colours.black,
		fontFamily: 'Volte',
		paddingTop: Gui.screen.height * 0.08,
	},
});

export default Notification;
