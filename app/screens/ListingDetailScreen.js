import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ListItem } from 'react-native-elements';
import Colours from '../config/colours.js';
import firebase from 'firebase/app';

function ListingDetailScreen({route, navigation}){
    const {listingId} = route.params;

    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);
  
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