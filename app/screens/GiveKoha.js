import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';
import firebase from 'firebase/app';
import roles from '../config/roles.js';
import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import { FormStyle } from '../config/styles.js';

function ShowBusinessOptions({ navigation }) {
	const userType = firebase.auth().currentUser.displayName[0];
	if (userType == roles.donateBusiness) {
		return (
			<View>
				
				<TouchableOpacity
					style={styles.submit}
					onPress={() => navigation.navigate('NewEventListing')}
				>
					<Text style={styles.submitText}>Event</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.submit}
					onPress={() => navigation.navigate('NewServiceListing')}
				>
					<Text style={styles.submitText}>Services</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

function GiveKoha({ navigation }) {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Give Koha</Text>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.submit}
					onPress={() => navigation.navigate('NewFoodListing')}
				>
					<Text style={styles.submitText}>Food</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.submit}
					onPress={() => navigation.navigate('NewEssentialListing')}
				>
					<Text style={styles.submitText}>Essentials</Text>
				</TouchableOpacity>
				
				{ShowBusinessOptions({ navigation })}
			</View>
			<View style={{marginTop: 100}}>
				<TouchableOpacity
					style={styles.cancel}
					onPress={() => navigation.goBack()}
				>
					<Text style={styles.cancelText}>Go Back</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = FormStyle();

export default GiveKoha;
