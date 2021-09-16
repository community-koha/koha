import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Colours from '../config/colours.js';
import firebase from 'firebase/app';


function ListViewScreen(){
    
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [listings, setListings] = useState([]); // Initial empty array of users
  
    
    }
    return (
            <View style={styles.container}>
            
            </View>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 22
       }
    
})

export default ListViewScreen;