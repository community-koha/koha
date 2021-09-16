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
            <View style={styles.container}>
                {
                listings.map((item, i) => {
                    return (
                        <ListItem key={i} >
                            <ListItem.Content>
                                <ListItem.Title>{item.listingTitle}</ListItem.Title>
                                <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                                <ListItem.Subtitle>Location: {item.location}</ListItem.Subtitle>
                                <ListItem.Subtitle>Quantity: {item.quantity}</ListItem.Subtitle>
                                <ListItem.Subtitle>Collection Method: {item.collectionMethod}</ListItem.Subtitle>
                                <ListItem.Subtitle>Category: {item.category}</ListItem.Subtitle>
                                <ListItem.Subtitle>Sub Category{item.subCategory}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    );
                    })
                }
            
            </View>
            <View>
                <Button style={styles.button} title="Go Back" onPress={() => navigation.navigate('ListViewScreen')}></Button>
            </View>
        </ScrollView>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 22
       },
    button:{
        height: 45,
        width: '80%',
        color: Colours.white,
        marginTop: 50,
    }
})
  export default ListingDetailScreen;