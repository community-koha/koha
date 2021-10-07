import React, { useEffect, useState, useRef } from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import {
	View,
	StyleSheet,
	Image,
	StatusBar,
	ActivityIndicator,
	Platform,
} from 'react-native';

import firebase from 'firebase/app';
import 'firebase';

function Splash({ navigation }) {

	if (Platform.OS !== 'web') {
		registerForPushNotificationsAsync().then(
			(token) => {
				console.log(token)
			}		
		);
	}

	var unsubscribe = firebase.auth().onAuthStateChanged(user =>
	{
		var navigationTarget = 'Entry';
		if (user)
		{
			navigationTarget = 'UserType';
			if (user.displayName.substring(1, 2) == '|')
			{
				navigationTarget = 'Nav';				
			}
			else if (!user.emailVerified)
			{
				navigationTarget = 'VerifyEmail';
			}

			// Add the user to the users database
			var db = firebase.firestore();
			db.collection("users").doc(user.uid).set(
			{
				created: (new Date(parseInt(user.metadata.a)).toISOString()),
				email: user.email,
				name: user.displayName[2,1] == "|" ? user.displayName.slice(2, 9999): user.displayName,
				uid: user.uid
			}, {merge: true}).catch((error) => {
				console.error(error);
			});
		}		
		
		var id = setInterval(() => 
		{
			navigation.navigate(navigationTarget)
			clearInterval(id);
		}, 1000);
		unsubscribe()
	})	

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor={Colours.white} barStyle='dark-content'/>			
			<Image style={styles.logo} source={require('../assets/logo.png')}/>
			<ActivityIndicator size="large" color={Colours.activityIndicator} style={styles.loading}/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Gui.container.backgroundColor,
		alignItems: 'center',
	},
	logo: {
		resizeMode: 'contain',
		top: Gui.screen.height * 0.18,
		width: Gui.screen.width * 0.6,
		height: Gui.screen.height * 0.3,
	},
	loading: {
		marginTop: Gui.screen.height * 0.3,
	},
});

export default Splash;

async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			console.log("Can't get permission for push notifications")
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
	} else {
		console.log("This is not a physical device")
	}

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	return token;
}