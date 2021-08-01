import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

import MapViewScreen from './app/screens/MapViewScreen';

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


function Listings() {
  return (
    <View style={styles.container}>
      <Text>Listings WIP</Text>
    </View>
  );
}

function Create() {
  return (
    <View style={styles.container}>
      <Text>Create WIP</Text>
    </View>
  );
}

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
        component={Listings}
        options={{
          tabBarLabel: 'Listings',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bulletin-board" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={Create}
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