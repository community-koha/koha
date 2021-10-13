import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StatusBar,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import { LogBox } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Colours from '../config/colours.js';
import { FormStyle } from '../config/styles.js';
import API from '../config/api.js';

import firebase from 'firebase/app';

function NewEventListing({ navigation }) {
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
	const [eventDate, setEventDate] = useState(ConvertDate(Date.now()));
	const [success, setSuccess] = useState(false);

	const [showDate, setShowDate] = useState(false);

	function setDate(date) {
		setShowDate(false);
		setEventDate(date);
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
		eventDate
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
			eventDate
		);
	}

	function ShowSuccess() {
		return (
			<View style={styles.message}>
				<Text
					style={{ color: Colours.white, fontSize: 20, fontFamily: 'Volte' }}
				>
					Success! New event listing has been created.
				</Text>
			</View>
		);
	}

	function ClearInput() {
		setListingTitle(null);
		setDescription(null);
		setLocation({ lat: 0, lng: 0, name: '' });
		setCapacity(null);
		setEventDate(ConvertDate(Date.now()));
	}

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
			eventDate: eventDate,
		});

		ClearInput();
		setSuccess(true);
	}

	return (
		<View style={styles.container} keyboardShouldPersistTaps="always">
			<StatusBar backgroundColor={Colours.white} barStyle="dark-content" />
			{success ? ShowSuccess() : <View></View>}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>New Event Listing</Text>
			</View>
			<ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
				<Text style={styles.inputTitle}>Title</Text>
				<TextInput
					value={listingTitle}
					onChangeText={(val) => setListingTitle(val)}
					placeholder="Title"
					style={styles.inputText}
				/>
				<Text style={styles.inputTitle}>Description</Text>
				<TextInput
					value={description}
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
					value={location}
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
						key: API.google_map,
						language: 'en',
						components: 'country:nz',
					}}
					requestUrl={{
						useOnPlatform: 'web',
						url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api', // or any proxy server that hits https://maps.googleapis.com/maps/api
					}}
					styles={{
						textInputContainer: styles.textInputContainer,
						textInput: styles.textInput,
						listView: styles.listView,
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
					returnKeyType='done'
					style={styles.inputText}
				/>

				<TouchableOpacity
					style={styles.submit}
					onPress={() =>
						CheckInput(listingTitle, description, location, capacity, eventDate)
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

const styles = FormStyle();

export default NewEventListing;
