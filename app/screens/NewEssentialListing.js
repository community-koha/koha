import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	StatusBar,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Platform,
	Button,
	Image,
	ActivityIndicator
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { LogBox } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';
import API from '../config/api.js';

import firebase from 'firebase/app';

function SubmitForm(
	userID,
	listingType,
	listingTitle,
	description,
	location,
	category,
	condition,
	quantity,
	collectionMethod,
	imageFileName
) {
	const dbh = firebase.firestore();
	
	dbh.collection('listings').add({
		user: dbh.doc('users/' + userID),
		listingType: listingType,
		listingTitle: listingTitle,
		description: description,
		location: location,
		category: category,
		condition: condition,
		quantity: quantity,
		collectionMethod: collectionMethod,
		imageFileName: imageFileName
	});
}

function NewEssentialListing({navigation}){
    // This warning can be ignored since our lists are small
	useEffect(() => {
		LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
	}, []);

	const [web, setWeb] = useState(Platform.OS === 'web');
	const userID = firebase.auth().currentUser.uid;
	const [listingType, setlistingType] = useState('essentialItem');
	const [listingTitle, setListingTitle] = useState(null);
	const [description, setDescription] = useState(null);
	const [location, setLocation] = useState({ lat: 0, lng: 0, name: '' });
	const [category, setCategory] = useState(null);
	const [condition, setCondition] = useState(null);
	const [quantity, setQuantity] = useState(null);
	const [collectionMethod, setCollectionMethod] = useState(null);
	const [imageFileName, setimageFileName] = useState(null);

	const [openCategoryType, setOpenCategoryType] = useState(false);
	const [openConditionType, setOpenConditionType] = useState(false);
	const [openCollectionType, setOpenCollectionType] = useState(false);

	const [categoryItems, setCategoryItems] = useState([
		{ value: 'baby', label: 'Baby Items' },
		{ value: 'household', label: 'Household Essentials' },
		{ value: 'toiletries', label: 'Toiletries' },
		{ value: 'school', label: 'School Items' },
		{ value: 'clothing', label: 'Clothing' },
		{ value: 'misc', label: 'Miscellaneous' },
	]);

	const [categoryCondition, setCategoryCondition] = useState([
		{ value: 'new', label: 'New' },
		{ value: 'used', label: 'Used' },
	]);
	
	const [collectionItems, setCollectionItems] = useState([
		{ value: 'pick_up', label: 'Pick Up' },
		{ value: 'delivery', label: 'Delivery' },
	]);

    function categoryOpened(val) {
		setOpenCategoryType(val);
		setOpenConditionType(false);
		setOpenCollectionType(false);
	}
	function conditionOpened(val) {
		setOpenCategoryType(false);
		setOpenConditionType(val);
		setOpenCollectionType(false);
	}
	function collectionOpened(val) {
		setOpenCategoryType(false);
		setOpenConditionType(false);
		setOpenCollectionType(val);
	}

    function GoBack() {
		// Go back to the map page
		navigation.goBack();
	}

    function CheckInput(
		listingTitle,
		description,
		location,
		category,
        condition,
		quantity,
		collectionMethod,
		imageFileName
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

			case quantity == null || quantity <= 0:
				return false;

			case !collectionMethod in ['pick_up', 'delivery']:
				return false;

			case imageFileName in ['', null]:
				return false;
		}

		console.log('Pass');
		
		SubmitForm(
			userID,
			listingType,
			listingTitle,
			description,
			location,
			category,
			condition,
			quantity,
			collectionMethod,
			imageFileName
		);
	}

    const [image, setImage] = useState(null);
	const [uploading, setUploading] = useState(false);
	

	useEffect(() => {
		(async () => {
		if (Platform.OS !== 'web') {
			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== 'granted') {
			alert('Sorry, we need camera roll permissions to make this work!');
			}
		}
		})();
	}, []);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.All,
		allowsEditing: true,
		aspect: [4, 3],
		quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
		setImage(result.uri);
		}
	};

	const uploadImage = async () =>{
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function() {
			  resolve(xhr.response);
			};
			xhr.onerror = function() {
			  reject(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', image, true);
			xhr.send(null);
		});
		 
		const ref = firebase.storage().ref().child(new Date().toISOString())
		const snapshot = ref.put(blob)

		snapshot.on(
			firebase.storage.TaskEvent.STATE_CHANGED,
			()=>{
				setUploading(true)
			},

			(error) => {
				setUploading(false)
				console.log(error);
				blob.close
				return
			},

			() => {
				snapshot.snapshot.ref.getMetadata().then((data)=>{
					setimageFileName(data.name);
					setUploading(false)
					console.log("Upload successful");
					console.log("Filename", data.name);
					blob.close
					return data;
				});
			}
		)
	}

    return(
        <View style={styles.container} keyboardShouldPersistTaps="always">
			<StatusBar backgroundColor={Colours.white} barStyle='dark-content'/>
			<View>
				<Text style={styles.headerText}>NEW ESSENTIAL ITEM</Text>
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
				<Text style={styles.inputTitle}>Location</Text>
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
						//separator: styles.separator,
						//poweredContainer: styles.poweredContainer,
						//description: styles.description,
						//row: styles.row,
						//powered: styles.powered,
					}}
					zIndex={8000}
					debounce={200}
				/>
				<Text style={styles.inputTitle}>Category</Text>
				<DropDownPicker
					open={openCategoryType}
					items={categoryItems}
					value={category}
					setOpen={(val) => categoryOpened(val)}
					setValue={(val) => setCategory(val)}
					showArrowIcon={!web}
					showTickIcon={false}
					zIndex={5000}
					placeholder="Select..."
					placeholderStyle={styles.dropDownPlaceholderText}
					dropDownContainerStyle={styles.dropDownBody}
					textStyle={styles.dropDownText}
					style={styles.inputText}
				/>
				<Text style={styles.inputTitle}>Condition</Text>
				<DropDownPicker
					open={openConditionType}
					items={categoryCondition}
					value={condition}
					setOpen={(val) => conditionOpened(val)}
					setValue={(val) => setCondition(val)}
					showArrowIcon={!web}
					showTickIcon={false}
					zIndex={3000}
					placeholder="Select..."
					placeholderStyle={styles.dropDownPlaceholderText}
					dropDownContainerStyle={styles.dropDownBody}
					textStyle={styles.dropDownText}
					style={styles.inputText}
				/>
				<Text style={styles.inputTitle}>Quantity</Text>
				<TextInput
					value={quantity}
					onChangeText={(val) => setQuantity(val.replace(/\D/, ''))}
					placeholder="Quantity"
					keyboardType="numeric"
					style={styles.inputText}
				/>
				
				<Text style={styles.inputTitle}>Collection Method</Text>
				<DropDownPicker
					open={openCollectionType}
					items={collectionItems}
					value={collectionMethod}
					setOpen={(val) => collectionOpened(val)}
					setValue={(val) => setCollectionMethod(val)}
					showArrowIcon={!web}
					showTickIcon={false}
					zIndex={1000}
					placeholder="Select..."
					placeholderStyle={styles.dropDownPlaceholderText}
					dropDownContainerStyle={styles.dropDownBody}
					textStyle={styles.dropDownText}
					style={styles.inputText}
				/>

				<Button title="Choose photo" onPress={pickImage}/>
				{image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }}  />}
				{!uploading?<Button title="Upload" onPress={uploadImage}/> : <ActivityIndicator size="large" color="#000"/>}
				

				<TouchableOpacity
					style={styles.submit}
					onPress={() =>
						CheckInput(
							listingTitle,
							description,
							location,
							category,
                            condition,
							quantity,
							collectionMethod,
							imageFileName
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

export default NewEssentialListing;