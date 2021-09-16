import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ListItem } from 'react-native-elements';
import Colours from '../config/colours.js';
import firebase from 'firebase/app';

function ListingDetailScreen({route, navigation}){
    const {listingId} = route.params;

    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);
  
    useEffect(() => {
        const subscriber = firebase.firestore()
          .collection('listings')
          .onSnapshot(querySnapshot => {
              const listings = [];
        
              querySnapshot.forEach(documentSnapshot => {
                listings.push({
                  ...documentSnapshot.data(),
                  key: documentSnapshot.id,
                });
              });
        
              setListings(listings);
              setLoading(false);
            });
    
        // Unsubscribe from events when no longer in use
        return () => subscriber();
      }, []);
    
      if (loading) {
        return <ActivityIndicator />;
      }

    return (
        <ScrollView>
            
            </ScrollView>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 22
       },
    
})
  export default ListingDetailScreen;