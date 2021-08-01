import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import MapViewScreen from './app/screens/MapViewScreen';
import CreateNewListingScreen from './app/screens/CreateNewListingScreen';
import ListViewScreen from './app/screens/ListViewScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
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
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs/>
    </NavigationContainer>
  );
}