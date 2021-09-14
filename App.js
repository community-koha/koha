import React from 'react';

import NavBar from './app/screens/NavBar';
import Login from './app/screens/Login';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as WebBrowser from 'expo-web-browser';
import firebase from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyDnqlnigTMTCV4TFnCpxL2FIJPaSsDcOrI',
	authDomain: 'communitykohaapp.firebaseapp.com',
	databaseURL:'https://communitykohaapp-default-rtdb.asia-southeast1.firebasedatabase.app',
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

var routeName;
if (firebase.auth().currentUser) {
	routeName = 'Nav';
} else {
	routeName = 'Login';
}

const Stack = createStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName={routeName}>
				<Stack.Screen
					name="Nav"
					component={NavBar}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Login"
					component={Login}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
