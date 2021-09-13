import React from 'react';

import Gui from '../config/gui.js';

import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Gui.container.backgroundColor,
		alignItems: 'center',
	},
	buttons: {
		justifyContent: 'center',
		alignItems: 'center',
		height: Gui.screen.height*0.4,
		width: Gui.screen.width*0.75,
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
		width: Gui.button.width,
		height: Gui.screen.height,
		borderRadius: Gui.screen.borderRadius,
		borderWidth: Gui.screen.borderWidth,
		borderColor: Gui.screen.borderColor,
		marginBottom: height*0.025,
	},
	loginText: {
		fontSize: Gui.button.fontSize,
		fontWeight: 'bold',
	},
});

export default Home;
