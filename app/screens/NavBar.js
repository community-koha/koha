import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from 'react-native-elements';

import Colours from '../config/colours.js';

import MapViewScreen from './MapViewScreen';
import CreateNewListingScreen from './CreateNewListingScreen';
import ListViewScreen from './ListViewScreen';
import Notification from './Notification.js';
import Profile from './Profile.js';

const Tab = createBottomTabNavigator();

function NavBar({ navigation }) {
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
				name="List View"
				component={ListViewScreen}
				options={{
					tabBarLabel: 'List View',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name="view-list-outline" size={24} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Create New Listing"
				component={CreateNewListingScreen}
				options={{
					tabBarLabel: 'New Listing',
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
