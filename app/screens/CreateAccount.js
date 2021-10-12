import React, { useEffect, useState } from 'react';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import {
	View,
	StyleSheet,
	Text,
	StatusBar,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Platform,
	ActivityIndicator,
	Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import firebase from 'firebase/app';

function CreateAccount({ navigation }) {
	const [web, setWeb] = useState(Platform.OS === 'web');
	const [name, setName] = useState('');
	const [dob, setDob] = useState(ConvertDate(Date.now()));
	const [email, setEmail] = useState(global.email);
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [showDate, setShowDate] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalText, setModalText] = useState(false);

	function ConvertDate(seconds) {
		if (seconds == null) {
			seconds = Date.now();
		}
		var local = new Date(seconds);
		var date = new Date(local.getTime());
		return (
			(date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
			'/' +
			(date.getMonth() + 1 < 10
				? '0' + (date.getMonth() + 1)
				: date.getMonth() + 1) +
			'/' +
			date.getFullYear()
		);
	}

	function setDate(date) {
		setShowDate(false);
		setDob(date);
	}

	function SubmitData(
		name = '',
		dob = 0,
		email = '',
		password = '',
		confirm = ''
	) {
		switch (true) {
			case name === '':
				setModalText('Please enter a display name');
				setModalVisible(true);
				return false;

			case dob == '':
				setModalText('Please enter your date of birth');
				setModalVisible(true);
				return false;

			case email == '':
				setModalText('Please enter your email');
				setModalVisible(true);
				return false;

			case password == '':
				setModalText('Please enter a password');
				setModalVisible(true);
				return false;

			case confirm == '':
				setModalText('Please enter your password again');
				setModalVisible(true);
				return false;

			case password != confirm:
				setModalText('Your passwords do not match');
				setModalVisible(true);
				return false;
		}
		setSubmitted(true);

		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				var user = userCredential.user;
				console.log("User '" + user.uid + "' created successfully!");

				// Add the user to the users database
				var db = firebase.firestore();
				db.collection('users')
					.doc(user.uid)
					.set(
						{
							created: new Date(Date.now()).toISOString(),
							email: email,
							dob: dob,
							name: name,
							uid: user.uid,
						},
						{ merge: true }
					)
					.then(() => {
						console.log(
							"User's displayname set to '" + name + "' successfully!"
						);
					})
					.catch((error) => {
						console.error(error.code + ': ' + error.message);
					});

				user
					.updateProfile({
						displayName: name,
					})
					.catch((error) => {
						console.error(error.code + ': ' + error.message);
					});

				// Send the email verification
				user.sendEmailVerification().catch((error) => {
					console.log(error.code + ': ' + error.message);
					setModalText(error.message);
					setModalVisible(true);
				});

				// Navigate to the verify email screen
				navigation.navigate('VerifyEmail');
			})
			.catch((error) => {
				console.log(error.code + ': ' + error.message);
				setModalText(error.message);
				setModalVisible(true);
				setSubmitted(false);
				return false;
			});
		return true;
	}

	let icon = (
		<MaterialCommunityIcons
			name="arrow-left"
			size={Gui.screen.height * 0.05}
			color={Colours.default}
			style={web ? styles.headerIconWeb : styles.headerIcon}
		/>
	);
	if (process.env.JEST_WORKER_ID !== undefined) {
		icon = '';
	}

	// I've blocked entering special characters in the displayname section
	// to avoid accidental breaks with the user type definition used
	return (
		<View style={styles.container}>
			<StatusBar backgroundColor={Colours.white} barStyle="dark-content" />
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(false);
				}}
			>
				<View style={styles.modalCenter}>
					<View style={styles.modalView}>
						<View style={styles.modalViewText}>
							<Text style={styles.modalText}>{modalText}</Text>
						</View>
						<TouchableOpacity
							style={[styles.modalButton]}
							onPress={() => {
								setModalVisible(false);
							}}
						>
							<Text style={styles.modalButtonText}>OK</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			<View>
				<Text style={web ? styles.headerTextWeb : styles.headerText}>
					CREATE ACCOUNT
				</Text>
				<TouchableOpacity
					onPress={() => navigation.navigate('Entry')}
					style={styles.backButton}
				>
					{icon}
				</TouchableOpacity>
			</View>
			<ScrollView style={styles.scroll}>
				<Text style={styles.inputTitle}>Display Name</Text>
				<TextInput
					onChangeText={(name) =>
						setName(name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()|\\]/g, ''))
					}
					value={name}
					placeholder="Display Name"
					autoCompleteType="name"
					editable={!submitted}
					style={styles.inputText}
				/>
				<Text style={styles.inputTitle}>Date of Birth</Text>
				{web && (
					<DatePicker
						selected={new Date(Date.now())}
						onChange={(val) => setDate(ConvertDate(val))}
						maxDate={Date.now()}
						dateFormat="dd/MM/yyyy"
						zIndex={5000}
						editable={!submitted}
						customInput={
							<TouchableOpacity
								style={styles.date}
								onPress={() => setShowDate(true)}
							>
								<Text style={styles.dateText}>{dob}</Text>
							</TouchableOpacity>
						}
					/>
				)}
				{!web && (
					<TouchableOpacity
						style={styles.date}
						onPress={() => setShowDate(!submitted)}
					>
						<Text style={styles.dateText}>{dob}</Text>
					</TouchableOpacity>
				)}
				{!submitted && !web && showDate && (
					<DateTimePicker
						mode="date"
						dateFormat="day month year"
						maximumDate={Date.now()}
						value={new Date(Date.now())}
						onChange={(val) =>
							setDate(ConvertDate(val['nativeEvent']['timestamp']))
						}
					/>
				)}
				<Text style={styles.inputTitle}>Email Address</Text>
				<TextInput
					onChangeText={(email) => setEmail(email)}
					value={email}
					placeholder="Email"
					keyboardType="email-address"
					autoCompleteType="email"
					editable={!submitted}
					style={styles.inputText}
				/>
				<Text style={styles.inputTitle}>Password</Text>
				<TextInput
					onChangeText={(password) => setPassword(password)}
					placeholder="Password"
					editable={!submitted}
					style={styles.inputText}
					secureTextEntry={true}
				/>
				<Text style={styles.inputTitle}>Confirm Password</Text>
				<TextInput
					onChangeText={(confirm) => setConfirm(confirm)}
					placeholder="Confirm Password"
					editable={!submitted}
					style={styles.inputText}
					secureTextEntry={true}
				/>
				<View style={styles.errorView}>
					<Text style={styles.errorText}></Text>
				</View>
				{!submitted && (
					<TouchableOpacity
						style={styles.submit}
						onPress={() => SubmitData(name, dob, email, password, confirm)}
					>
						<Text style={styles.submitText}>CREATE ACCOUNT</Text>
					</TouchableOpacity>
				)}
				{submitted && (
					<ActivityIndicator size="large" color={Colours.activityIndicator} />
				)}
				<View style={styles.end} />
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Gui.container.backgroundColor,
		flexDirection: 'column',
	},
	header: {
		flex: 1,
		backgroundColor: Gui.container.backgroundColor,
		flexDirection: 'row',
		height: 0,
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: -Gui.screen.height * 0.05,
		marginBottom: Gui.screen.height * 0.02,
		height: Gui.screen.height * 0.08,
		width: Gui.screen.width * 0.2,
	},
	scroll: {
		marginTop: -Gui.screen.height * 0.02,
	},
	headerIconWeb: {
		marginTop: -Gui.screen.height * 0.025,
		marginLeft: Gui.screen.width * 0.05,
		height: Gui.screen.height * 0.05,
	},
	headerIcon: {
		marginTop: Gui.screen.height * 0.015,
		marginLeft: Gui.screen.width * 0.05,
		height: Gui.screen.height * 0.05,
	},
	headerText: {
		textAlign: 'center',
		textAlignVertical: 'center',
		top: Gui.screen.height * 0.02,
		fontSize: Gui.screen.height * 0.03,
		height: Gui.screen.height * 0.05,
		width: Gui.screen.width * 1,
		fontWeight: 'bold',
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerTextWeb: {
		textAlign: 'center',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.04,
		fontSize: Gui.screen.height * 0.03,
		height: Gui.screen.height * 0.05,
		width: Gui.screen.width * 1,
		fontWeight: 'bold',
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputTitle: {
		textAlign: 'left',
		textAlignVertical: 'top',
		marginTop: Gui.screen.height * 0.025,
		marginLeft: Gui.screen.width * 0.1,
		fontSize: Gui.screen.height * 0.025,
		height: Gui.screen.height * 0.03,
		width: Gui.screen.width * 0.8,
		color: Colours.default,
	},
	inputText: {
		textAlign: 'left',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.005,
		marginLeft: Gui.screen.width * 0.1,
		fontSize: Gui.screen.height * 0.03,
		height: Gui.screen.height * 0.05,
		width: Gui.screen.width * 0.8,
		color: Colours.default,
		borderRadius: 3,
		borderWidth: 1,
		borderColor: Colours.default,
	},
	date: {
		textAlign: 'left',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.005,
		marginLeft: Gui.screen.width * 0.1,
		fontSize: Gui.screen.height * 0.03,
		height: Gui.screen.height * 0.05,
		width: Gui.screen.width * 0.8,
		color: Colours.default,
		borderRadius: 3,
		borderWidth: 1,
		borderColor: Colours.default,
		fontWeight: 'normal',
	},
	dateText: {
		fontSize: Gui.screen.height * 0.03,
	},
	errorView: {
		flexDirection: 'row',
		marginLeft: Gui.screen.width * 0.1,
		marginBottom: Gui.screen.height * 0.01,
		width: Gui.screen.width * 0.8,
		alignContent: 'center',
	},
	errorText: {
		textAlign: 'center',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.005,
		marginBottom: Gui.screen.height * 0.005,
		fontSize: Gui.screen.height * 0.02,
		height: Gui.screen.height * 0.1,
		width: Gui.screen.width * 1,
		color: Colours.red,
		flex: 1,
		flexWrap: 'wrap',
	},
	submit: {
		marginLeft: Gui.screen.width * 0.1,
		marginBottom: -Gui.screen.height * 0.02,
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.8,
		height: Gui.screen.height * 0.075,
		borderRadius: 3,
		borderWidth: 1,
		borderColor: Colours.default,
	},
	submitText: {
		fontSize: Gui.screen.height * 0.023,
		fontWeight: 'bold',
	},
	end: {
		height: Gui.screen.height * 0.0375,
	},
	modalCenter: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		backgroundColor: Colours.white,
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.9,
		height: Gui.screen.height * 0.275,
		borderWidth: 5,
		borderRadius: 5,
		shadowColor: Colours.black,
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 24,
	},
	modalViewText: {
		justifyContent: 'center',
		width: Gui.screen.width * 0.75,
		height: Gui.screen.height * 0.275 * 0.66,
	},
	modalText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: Gui.screen.height * 0.275 * 0.1,
	},
	modalButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.5,
		height: Gui.button.height,
		borderRadius: Gui.button.borderRadius,
		borderWidth: 2,
		borderColor: Colours.koha_navy,
		backgroundColor: Colours.koha_navy,
	},
	modalButtonText: {
		fontSize: Gui.screen.height * 0.25 * 0.12,
		color: Colours.white,
		fontWeight: 'bold',
	},
});

export default CreateAccount;
