import React from 'react';
import { StyleSheet, View, Text, Platform, StatusBar, ScrollView, Button, TextInput } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Colours from '../config/colours.js';

function CreateNewListingScreen() {
  
  return (
    <View style={styles.background}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.screenTitle}>CREATE NEW LISTING</Text>
        <Text>What are you?</Text>
        <TextInput style={styles.input}
          onChangeText = {(val) => setUserType(val)}
        />
        <Text>What are you giving?</Text>
        <TextInput style={styles.input}
          onChangeText = {(val) => setDonationType(val)}
        />
        <Text>Title</Text>
        <TextInput style={styles.input}
          onChangeText = {(val) => setListingTitle(val)}
        />
        <Text>Description</Text>
        <TextInput style={styles.input}
          onChangeText = {(val) => setDescription(val)}
        />
        <Text>Location</Text>
        <TextInput style={styles.input}
          onChangeText = {(val) => setLocation(val)}
        />
        <Text>Category</Text>
        <TextInput style={styles.input}
          onChangeText = {(val) => setCategory(val)}
        />
        <Text>Sub category</Text>
        <TextInput style={styles.input}
          onChangeText = {(val) => setSubCategory(val)}
        />
        <Text>Quantity</Text>
        <TextInput style={styles.input}
          onChangeText = {(val) => setQuantity(val)}
        />
        <Text>Expiry Date</Text>
        <TextInput style={styles.input}
          onChangeText = {(val) => setExpiryDate(val)}
        />
        <Text>Collection Method</Text>
        <TextInput style={styles.input}
          onChangeText = {(val) => setCollectionMethod(val)}
        />
        <View style={styles.buttonContainer}>
        <View style={styles.button}><Button title="Submit" onPress={SubmitForm}/>
          </View>
          <View style={styles.button}><Text>Cancel</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
    
    background: {
      flex: 1,
      backgroundColor: Colours.white,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
      paddingLeft: 30,
      paddingRight: 30,
      
    },
    screenTitle: {
      alignItems: "center",
      fontSize: 26,
      fontWeight: "600",
      paddingTop: 40,
      paddingBottom: 40
    },
    heading: {
      fontSize: 24,
      fontWeight: "500",
      paddingBottom: 40
    },
    
    iconContainer:{
      flexDirection: "row",
      paddingBottom: 40,
      justifyContent: "space-evenly"
    },
    icon:{
      fontSize: 100
    },
    button:{
      padding: 10,
      height: 50,
      width: "80%",
      backgroundColor: Colours.white,
      alignItems: 'center',
      borderRadius: 10,
      borderColor: Colours.primary,
      borderWidth: 2
    },
    buttonContainer:{
      justifyContent: "space-between",
      alignItems: "center",
      height: 120,
      marginBottom: 50
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    scrollView: {
      backgroundColor: Colours.white,
      marginHorizontal: 0,
    },
    
})

export default CreateNewListingScreen;