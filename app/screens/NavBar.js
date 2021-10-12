import React, { useState } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import Colours from '../config/colours.js';

import MapViewScreen from './MapViewScreen';
import ListViewScreen from './ListViewScreen';
import Notification from './Notification.js';
import Profile from './Profile.js';
import GiveKoha from './GiveKoha.js';
import MyKoha from './MyKoha.js';
import firebase from 'firebase/app';
import roles from '../config/roles.js';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

const Tab = createBottomTabNavigator();

function NavBar({ navigation }) {
	const [user, setUser] = useState(null);
	const [prefix, setPrefix] = useState('My');
	var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			unsubscribe();
			setUser(user);
			setPrefix(user.displayName[0] != roles.donateBusiness ? 'My' : 'Our');

			// Push notifications are not avaliable on web or emulators
			if (Platform.OS !== 'web') {
				registerForPushNotificationsAsync().then((token) => {
					if (token !== undefined) {
						const db = firebase.firestore();
						db.collection('users')
							.doc(user.uid)
							.update({
								notificationToken: token,
							})
							.then(() => {
								console.log(
									"Updated user's push notification token in database"
								);
							})
							.catch((error) => {
								console.error(error);
							});
					}
				});
			}
		}
	});

	React.useEffect(
		() =>
			navigation.addListener('beforeRemove', (e) => {
				e.preventDefault();
			}),
		[navigation]
	);
	return (
		<Tab.Navigator
			initialRouteName="Map View"
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: Colours.default,
				tabBarInactiveTintColor: Colours.grey,
				tabBarStyle: {
					position: 'absolute',
					backgroundColor: Colours.koha_beige,
					padding: 10,
				},
			}}
		>
			<Tab.Screen
				name="Search"
				component={MapViewScreen}
				options={{
					tabBarLabel: 'Search',
					tabBarIcon: ({ color }) => (
						<MaterialIcons name="search" size={24} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name={prefix + ' Koha'}
				component={MyKoha}
				options={{
					tabBarLabel: prefix + ' Koha',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="gift-outline"
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Give Koha"
				component={GiveKoha}
				options={{
					tabBarLabel: 'Give Koha',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="plus-circle-outline"
							size={24}
							color={color}
						/>
					),
				}}
			/>

			<Tab.Screen
				name="Notification"
				component={Notification}
				options={{
					tabBarLabel: 'Notification',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="bell-outline"
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={Profile}
				options={{
					tabBarLabel: 'Profile',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="account-circle-outline"
							size={24}
							color={color}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
}

export default NavBar;

async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			console.log("Can't get permission for push notifications");
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
	} else {
		console.log('This is not a physical device');
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
