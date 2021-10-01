import React, { Component } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

function NewServiceListing({ navigation }) {
	return (
		<View style={styles.container}>
			<Text>New Service Listing</Text>
			<Button title="Back" onPress={() => navigation.navigate('GiveKoha')} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
	},
});

export default NewServiceListing;
