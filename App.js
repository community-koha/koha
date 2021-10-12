import React from 'react';

import useFonts from './app/config/useFonts.js';
import NavBar from './app/screens/NavBar';
import Entry from './app/screens/Entry';
import Splash from './app/screens/Splash';
import Login from './app/screens/Login';
import CreateAccount from './app/screens/CreateAccount';
import VerifyEmail from './app/screens/VerifyEmail';
import UserTypeScreen from './app/screens/UserTypeScreen';
import HomeScreen from './app/screens/HomeScreen';
import ListingDetailScreen from './app/screens/ListingDetailScreen';
import EditListingScreen from './app/screens/EditListingScreen';
import GiveKoha from './app/screens/GiveKoha';
import MyKoha from './app/screens/MyKoha';
import NewFoodListing from './app/screens/NewFoodListing';
import NewEssentialListing from './app/screens/NewEssentialListing';
import NewEventListing from './app/screens/NewEventListing';
import NewServiceListing from './app/screens/NewServiceListing';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as WebBrowser from 'expo-web-browser';
import firebase from 'firebase/app';

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer for a long period of time']);

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

var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
	console.log(user ? 'User is logged in' : 'User is logged out');
	global.user = user;
});

// For OAuth
WebBrowser.maybeCompleteAuthSession();

// For fading the splash screen
const forFade = ({ current }) => ({
	cardStyle: {
		opacity: current.progress,
	},
});

const Stack = createStackNavigator();
export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Splash"
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen
					name="Splash"
					component={Splash}
					options={{ cardStyleInterpolator: forFade }}
				/>
				<Stack.Screen name="Entry" component={Entry} />
				<Stack.Screen name="Nav" component={NavBar} />
				<Stack.Screen name="Search" component={HomeScreen} />
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="CreateAccount" component={CreateAccount} />
				<Stack.Screen name="VerifyEmail" component={VerifyEmail} />
				<Stack.Screen name="UserType" component={UserTypeScreen} />
				<Stack.Screen
					name="ListingDetailScreen"
					component={ListingDetailScreen}
				/>
				<Stack.Screen name="EditListingScreen" component={EditListingScreen} />
				<Stack.Screen name="GiveKoha" component={GiveKoha} />
				<Stack.Screen name="MyKoha" component={MyKoha} />
				<Stack.Screen name="NewFoodListing" component={NewFoodListing} />
				<Stack.Screen
					name="NewEssentialListing"
					component={NewEssentialListing}
				/>
				<Stack.Screen name="NewEventListing" component={NewEventListing} />
				<Stack.Screen name="NewServiceListing" component={NewServiceListing} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
