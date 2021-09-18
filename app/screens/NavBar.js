import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Colours from '../config/colours.js';

import MapViewScreen from './MapViewScreen';
import CreateNewListingScreen from './CreateNewListingScreen';
import ListViewScreen from './ListViewScreen';

const Tab = createMaterialBottomTabNavigator();

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
			initialRouteName="Map"
			activeColor={Colours.active}
			labelStyle={{ fontSize: 12 }}
			style={{ backgroundColor: Colours.black }}
		>
			<Tab.Screen
				name="Map"
				component={MapViewScreen}
				options={{
					tabBarLabel: 'Area Map',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons name="map" color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name="Listings"
				component={ListViewScreen}
				options={{
					tabBarLabel: 'Listings',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="bulletin-board"
							color={color}
							size={26}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Create"
				component={CreateNewListingScreen}
				options={{
					tabBarLabel: 'New Listing',
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="tag-plus-outline"
							color={color}
							size={26}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
}

export default NavBar;
