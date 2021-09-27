import React, { Component } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

function NewEventListing({navigation}){

    return(
        <View style={styles.container}>
            <Text>New Event Listing</Text>
            <Button title="Back" onPress={()=>navigation.navigate("GiveKoha")}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    }
})

export default NewEventListing;