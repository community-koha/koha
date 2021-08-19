import React from 'react';

import NavBar from './app/screens/NavBar';
import FBLogin from './app/screens/FBLogin';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { ResponseType } from 'expo-auth-session';
import { View, StyleSheet, Button, TabBarIOS } from 'react-native';

import Colours from './app/config/colours.js';

import firebase from 'firebase/app';
import 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDnqlnigTMTCV4TFnCpxL2FIJPaSsDcOrI',
	authDomain: 'communitykohaapp.firebaseapp.com',
	databaseURL:
		'https://communitykohaapp-default-rtdb.asia-southeast1.firebasedatabase.app',
	projectId: 'communitykohaapp',
	storageBucket: 'communitykohaapp.appspot.com',
	messagingSenderId: '244543529302',
	appId: '1:244543529302:web:cfdf8da305dd0951e7f6f7',
	measurementId: 'G-YV1GZSDFN1',
};

// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
} else {
	firebase.app(); // if already initialized, use that one
}

// For OAuth
WebBrowser.maybeCompleteAuthSession();

var isSignedIn;
if (firebase.auth().currentUser) {
	isSignedIn = true;
} else {
	isSignedIn = false;
}

const Stack = createStackNavigator();

export default function App() {
	return isSignedIn ? (
		<>
			<NavigationContainer>
				<NavBar></NavBar>
			</NavigationContainer>
		</>
	) : (
		<>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="FBLogin">
					<Stack.Screen
						name="Nav"
						component={NavBar}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="FBLogin"
						component={FBLogin}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
}
