import React from 'react';

import Colours from '../config/colours.js';

import { Dimensions, View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

function Home({navigation}) {
	return(
		<View style={styles.container}>
			<Image
				style={styles.logo}
				source={require('../assets/home_logo.png')}
			/>
			<Text style={styles.name}>Community{"\n"}Koha</Text>
			<View style={styles.buttons}>
				<TouchableOpacity
					style={styles.login}
					onPress={() => navigation.navigate('Login')}>
					<Text style={styles.loginText}>LOG IN</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.login}
					onPress={() => navigation.navigate('CreateAccount')}>
					<Text style={styles.loginText}>CREATE ACCOUNT</Text>
				</TouchableOpacity>	
			</View>
		</View>
	);
}

var {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.white,
		alignItems: 'center',
	},
	buttons: {
		justifyContent: 'center',
		alignItems: 'center',
		height: height*0.4,
		width: width*0.75,
	},
	logo: {
		resizeMode: 'contain',
		top: height*0.1,
		width: width*0.75,
		height: height*0.2
	},
	name: {
		paddingTop: height*0.175,
		fontSize: height*0.06,
		textAlign: 'center',
	},
	login: {
		justifyContent: 'center',
		alignItems: 'center',
		width: width*0.75,
		height: height*0.05,
		borderRadius:3,
		borderWidth: 1,
		borderColor: Colours.black,
		marginBottom: height*0.025,
	},
	loginText: {
		fontSize: height*0.03,
		fontWeight: 'bold',
	},
});

export default Home;
