import React, { useState } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from 'react-native-elements';

import Colours from '../config/colours.js';

import MapViewScreen from './MapViewScreen';
import ListViewScreen from './ListViewScreen';
import Notification from './Notification.js';
import Profile from './Profile.js';
import GiveKoha from './GiveKoha.js';
import MyKoha from './MyKoha.js';
import firebase from 'firebase/app';
import roles from '../config/roles.js';

const Tab = createBottomTabNavigator();

function NavBar({ navigation }) {
	const [user, setUser] = useState(null);
	const [prefix, setPrefix] = useState("My");
	var unsubscribe = firebase.auth().onAuthStateChanged(user =>
	{
		if (user)
		{
			setUser(user);
			setPrefix(user.displayName[0] != roles.donateBusiness? "My":"Our");
			unsubscribe();
		}
	})

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
				tabBarActiveTintColor: Colours.default,
				tabBarInactiveTintColor: Colours.grey,
				tabBarStyle: { position: 'absolute', backgroundColor: Colours.koha_beige, padding: 10 },
				
			}}
		>
			
			<Tab.Screen
				name="Map View"
				component={MapViewScreen}
				options={{
					tabBarLabel: 'Map View',
					tabBarIcon: ({color}) => (
						<MaterialCommunityIcons name="map-search-outline" size={24} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name={prefix+" Koha"}
				component={MyKoha}
				options={{
					tabBarLabel: prefix+" Koha",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name="gift-outline" size={24} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Give Koha"
				component={GiveKoha}
				options={{
					tabBarLabel: 'Give Koha',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name="plus-circle-outline" size={24} color={color} />
					),
				}}
			/>
			
			<Tab.Screen
				name="Notification"
				component={Notification}
				options={{
					tabBarLabel: 'Notification',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name="bell-outline" size={24} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={Profile}
				options={{
					tabBarLabel: 'Profile',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name="account-circle-outline" size={24} color={color} />
					),
				}}
			/>
		</Tab.Navigator>
		
	);
}

export default NavBar;
