import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

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


// generic notif view
function NotifScreen() {
  return (
    <View style={styles.container}>
      <Text>{global.e}</Text>
    </View>
  );
}

function Map() {
  // states and modifiers
  const [mapRegion, setRegion] = useState(null)
  const [hasLocationPermissions, setLocationPermission] = useState(false)

  // do after render
  useEffect(() => {
    const getLocationAsync = async () => {

      // check permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if ('granted' === status) {
        setLocationPermission(true);

        // get location
        let { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({})

        // initial region set (happens once per app load)
        setRegion({ latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
      }
    }
    // wait for permissions
    if (hasLocationPermissions === false) {
      getLocationAsync()
    }
  })

  if (hasLocationPermissions === false) {
    global.e = "Error: Please Enable Location Permissions";
    return (<NotifScreen />);
  }

  if (mapRegion === null) {
    global.e = "Loading Local Area";
    return (<NotifScreen />);
  }
  
  return (
    <MapView
      style={styles.container}
      region={mapRegion}
    >
    </MapView>
  );
}

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
        component={Map}
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