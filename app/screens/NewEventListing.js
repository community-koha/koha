import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	StatusBar,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import { LogBox } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import firebase from 'firebase/app';

const GOOGLE_MAP_API_KEY = '';

function SubmitForm(
	userID,
	listingType,
	listingTitle,
	description,
	location,
	capacity,
	eventDate
) {
	const dbh = firebase.firestore();
	
	dbh.collection('listings').add({
		user: dbh.doc('users/' + userID),
		listingType: listingType,
		listingTitle: listingTitle,
		description: description,
		location: location,
		capacity: capacity,
		eventDate: eventDate
	});
}

function NewEventListing({navigation}){
    // This warning can be ignored since our lists are small
	useEffect(() => {
		LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
	}, []);

	const [web, setWeb] = useState(Platform.OS === 'web');
	const userID = firebase.auth().currentUser.uid;
	const [listingType, setlistingType] = useState('event');
	const [listingTitle, setListingTitle] = useState(null);
	const [description, setDescription] = useState(null);
	const [location, setLocation] = useState({ lat: 0, lng: 0, name: '' });
	const [capacity, setCapacity] = useState(null);
	const [eventDate, seteventDate] = useState(ConvertDate(Date.now()));

	const [showDate, setShowDate] = useState(false);

    function setDate(date) {
		setShowDate(false);
		seteventDate(date);
	}

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

	function GoBack() {
		// Go back to the map page
		navigation.goBack();
	}

    function CheckInput(
		listingTitle,
		description,
		location,
		capacity,
		eventDate,
	) {
		console.log('');
		console.log('Checking');
		switch (true) {
			case listingTitle in ['', null]:
				return false;

			case description in ['', null]:
				return false;

			case location['lat'] == 0 || location['lng'] == 0:
				return false;

			case capacity == null || capacity <= 0:
				return false;

			case eventDate == null:
				return false;

		}

		console.log('Pass');
		
		SubmitForm(
			userID,
			listingType,
			listingTitle,
			description,
			location,
			capacity,
			eventDate,
		);
	}
    return(
        <View style={styles.container} keyboardShouldPersistTaps="always">
			<StatusBar backgroundColor={Colours.white} barStyle='dark-content'/>
			<View>
				<Text style={styles.headerText}>NEW EVENT</Text>
			</View>
			<ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
				
				
				<Text style={styles.inputTitle}>Title</Text>
				<TextInput
					onChangeText={(val) => setListingTitle(val)}
					placeholder="Title"
					style={styles.inputText}
				/>
				<Text style={styles.inputTitle}>Description</Text>
				<TextInput
					onChangeText={(val) => setDescription(val)}
					placeholder="Description"
					multiline={true}
					numberOfLines={3}
					textBreakStrategy={'simple'}
					style={styles.inputTextDescription}
				/>
				<Text style={styles.inputTitle}>Where</Text>
				<GooglePlacesAutocomplete
					placeholder="Search..."
					onFail={(error) => console.error(error)}
					fetchDetails={true}
					onFail={(data, details) => console.error(data, details)}
					onNotFound={(data, details) => console.error(data, details)}
					onPress={(data, details) =>
						setLocation({
							lat: details['geometry']['location']['lat'],
							lng: details['geometry']['location']['lng'],
							name: data['description'],
						})
					}
					query={{
						key: GOOGLE_MAP_API_KEY,
						language: 'en',
						components: 'country:nz',
					}}
					requestUrl={{
						useOnPlatform: 'web',
						url: 'https://thingproxy.freeboard.io/fetch/https://maps.googleapis.com/maps/api', // or any proxy server that hits https://maps.googleapis.com/maps/api
					}}
					styles={{
						textInputContainer: styles.textInputContainer,
						textInput: styles.textInput,
						listView: styles.listView,
						//separator: styles.separator,
						//poweredContainer: styles.poweredContainer,
						//description: styles.description,
						//row: styles.row,
						//powered: styles.powered,
					}}
					zIndex={8000}
					debounce={200}
				/>
                <Text style={styles.inputTitle}>When</Text>
				{web && (
					<DatePicker
						selected={new Date(Date.now())}
						onChange={(val) => setDate(ConvertDate(val))}
						minDate={Date.now()}
						dateFormat="dd/MM/yyyy"
						zIndex={9000}
						customInput={
							<TouchableOpacity
								style={styles.date}
								onPress={() => setShowDate(true)}
							>
								<Text style={styles.dateText}>{eventDate}</Text>
							</TouchableOpacity>
						}
					/>
				)}
				{!web && (
					<TouchableOpacity
						style={styles.date}
						onPress={() => setShowDate(true)}
					>
						<Text style={styles.dateText}>{eventDate}</Text>
					</TouchableOpacity>
				)}
				{!web && showDate && (
					<DateTimePicker
						mode="date"
						dateFormat="day month year"
						minimumDate={Date.now()}
						value={new Date(Date.now())}
						onChange={(val) =>
							setDate(ConvertDate(val['nativeEvent']['timestamp']))
						}
					/>
				)}
				
				<Text style={styles.inputTitle}>Event Capacity</Text>
				<TextInput
					value={capacity}
					onChangeText={(val) => setCapacity(val.replace(/\D/, ''))}
					placeholder="Number of people"
					keyboardType="numeric"
					style={styles.inputText}
				/>
				
				<TouchableOpacity
					style={styles.submit}
					onPress={() =>
						CheckInput(
							listingTitle,
							description,
							location,
							capacity,
							eventDate
						)
					}
				>
					<Text style={styles.submitText}>CREATE LISTING</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.cancel} onPress={() => GoBack()}>
					<Text style={styles.cancelText}>CANCEL</Text>
				</TouchableOpacity>
				<View style={styles.end} />
			</ScrollView>
		</View>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.koha_green, //Gui.container.backgroundColor,
		paddingBottom: '10%',
	},
	scroll: {
		backgroundColor: Colours.white,
		marginTop: Gui.screen.height * 0.01,
	},
	headerText: {
		textAlign: 'left',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.02,
		marginLeft: Gui.screen.width * 0.1,
		fontSize: Gui.screen.height * 0.03,
		height: Gui.screen.height * 0.05,
		width: Gui.screen.width * 0.95,
		color: Colours.white,
		fontWeight: 'bold',
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputTitleFirst: {
		textAlign: 'left',
		textAlignVertical: 'top',
		marginTop: Gui.screen.height * 0.005,
		marginLeft: Gui.screen.width * 0.1,
		fontSize: Gui.screen.height * 0.02,
		height: Gui.screen.height * 0.03,
		width: Gui.screen.width * 0.8,
		color: Colours.default,
	},
	inputTitle: {
		textAlign: 'left',
		textAlignVertical: 'top',
		marginTop: Gui.screen.height * 0.05,
		marginLeft: Gui.screen.width * 0.1,
		fontSize: Gui.screen.height * 0.02,
		height: Gui.screen.height * 0.04,
		width: Gui.screen.width * 0.8,
		color: Colours.default,
	},
	dropDownText: {
		textAlign: 'left',
		textAlignVertical: 'center',
		fontSize: Gui.screen.height * 0.02,
		backgroundColor: Colours.white,
	},
	dropDownPlaceholderText: {
		textAlign: 'left',
		textAlignVertical: 'center',
		fontSize: Gui.screen.height * 0.02,
		color: Colours.grey,
	},
	dropDownBody: {
		textAlign: 'left',
		textAlignVertical: 'center',
		marginLeft: Gui.screen.width * 0.1,
		fontSize: Gui.screen.height * 0.02,
		width: Gui.screen.width * 0.8,
	},
	textInputContainer: {
		marginLeft: Gui.screen.width * 0.1,
		height: Gui.screen.height * 0.055,
		width: Gui.screen.width * 0.8,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: Colours.default,
	},
	textInput: {
		textAlign: 'left',
		textAlignVertical: 'top',
		fontSize: Gui.screen.height * 0.02,
		height: Gui.screen.height * 0.05,
		color: Colours.default,
	},
	listView: {
		marginTop: 1,
		marginLeft: Gui.screen.width * 0.1,
		width: Gui.screen.width * 0.8,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: Colours.default,
	},
	separator: {
		height: 1,
		backgroundColor: Colours.grey,
	},
	poweredContainer: {
		height: Gui.screen.height * 0.045,
		borderColor: Colours.grey,
		borderTopWidth: 1,
	},
	powered: {
		marginTop: -Gui.screen.height * 0.02,
	},
	description: {
		flexShrink: 1,
		marginLeft: Gui.screen.width * 0.01,
		fontSize: Gui.screen.height * 0.025,
	},
	row: {
		padding: 0,
		height: Gui.screen.height * 0.045,
	},
	inputText: {
		textAlign: 'left',
		textAlignVertical: 'center',
		marginLeft: Gui.screen.width * 0.1,
		fontSize: Gui.screen.height * 0.02,
		height: Gui.screen.height * 0.05,
		width: Gui.screen.width * 0.8,
		color: Colours.default,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: Colours.default,
		padding: 10,
	},
	inputTextDescription: {
		textAlign: 'left',
		textAlignVertical: 'top',
		marginLeft: Gui.screen.width * 0.1,
		fontSize: Gui.screen.height * 0.02,
		height: Gui.screen.height * 0.15,
		width: Gui.screen.width * 0.8,
		color: Colours.default,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: Colours.default,
		padding: 10,
	},
	date: {
		textAlign: 'left',
		textAlignVertical: 'center',
		marginTop: Gui.screen.height * 0.005,
		marginLeft: Gui.screen.width * 0.1,
		fontSize: Gui.screen.height * 0.02,
		height: Gui.screen.height * 0.05,
		width: Gui.screen.width * 0.8,
		color: Colours.default,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: Colours.default,
		fontWeight: 'normal',
		padding: 10,
	},
	dateText: {
		fontSize: Gui.screen.height * 0.02,
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
		marginTop: Gui.screen.width * 0.1,
		marginLeft: Gui.screen.width * 0.1,
		marginBottom: Gui.screen.height * 0.02,
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.8,
		height: Gui.screen.height * 0.075,
		borderRadius: Gui.button.borderRadius,
		borderWidth: Gui.button.borderWidth,
		backgroundColor: Colours.koha_green,
		borderColor: Colours.koha_green,
	},
	cancel: {
		marginTop: Gui.screen.width * 0.03,
		marginLeft: Gui.screen.width * 0.1,
		marginBottom: Gui.screen.height * 0.05,
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width * 0.8,
		height: Gui.screen.height * 0.075,
		borderRadius: Gui.button.borderRadius,
		borderWidth: 3,
		borderColor: Colours.koha_green,
	},
	submitText: {
		fontSize: Gui.button.fontSize,
		fontWeight: 'bold',
		color: Colours.white,
	},
	cancelText: {
		color: Colours.koha_green,
		fontSize: Gui.button.fontSize,
		fontWeight: 'bold',
	},
	end: {
		height: '5%',
	},
});

export default NewEventListing;