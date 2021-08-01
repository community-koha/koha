import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import MapViewScreen from './MapViewScreen';
import CreateNewListingScreen from './CreateNewListingScreen';
import ListViewScreen from './ListViewScreen';

const Tab = createMaterialBottomTabNavigator();

function NavBar() {
    return (
      <NavigationContainer>
        <Tab.Navigator
            initialRouteName="Map"
            activeColor="#FF8782"
            labelStyle={{ fontSize: 12 }}
            style={{ backgroundColor: '#fff' }}
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
                    <MaterialCommunityIcons name="bulletin-board" color={color} size={26} />
                ),
                }}
            />
            <Tab.Screen
                name="Create"
                component={CreateNewListingScreen}
                options={{
                tabBarLabel: 'New Listing',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="tag-plus-outline" color={color} size={26} />
                ),
                }}
            />
        </Tab.Navigator>
      </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    
})

export default NavBar;