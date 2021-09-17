import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, StatusBar, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { LogBox } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import firebase from 'firebase/app';
import colours from '../config/colours.js';

const GOOGLE_MAP_API_KEY='';

function SubmitForm(userType, donationType, listingTitle, description, location, category, subCategory, quantity, expiryDate, collectionMethod)  {
  const dbh = firebase.firestore();
  dbh.collection("listings").add({
    userType: userType,
    donationType: donationType,
    listingTitle: listingTitle,
    description: description,
    location: location,
    category: category,
    subCategory: subCategory,
    quantity: quantity,
    expiryDate: expiryDate,
    collectionMethod: collectionMethod
  })
}

function CreateNewListingScreen({navigation}) {
  // This warning can be ignored since our lists are small
  useEffect(() => { LogBox.ignoreLogs(['VirtualizedLists should never be nested']); }, [])

  const [web, setWeb] = useState(Platform.OS === 'web')
  const [userType, setUserType] = useState(null);
  const [donationType, setDonationType] = useState(null);
  const [listingTitle, setListingTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [location, setLocation] = useState({"lat": 0,"lng": 0});
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [expiryDate, setExpiryDate] = useState(ConvertDate(Date.now()));
  const [collectionMethod, setCollectionMethod] = useState(null);

  const [showDate, setShowDate] = useState(false);
  const [openUserType, setOpenUserType] = useState(false);
  const [openDonationType, setOpenDonationType] = useState(false);
  const [openCategoryType, setOpenCategoryType] = useState(false);
  const [openSubcategoryType, setOpenSubcategoryType] = useState(false);
  const [openCollectionType, setOpenCollectionType] = useState(false);

  const [typeUserItems, setUserTypeItems] = useState([
    { value: 'business', label: 'A Business' },
    { value: 'individual', label: 'An Individual' }
  ]);
  const [donationItems, setDonationTypeItems] = useState([
    { value: 'food', label: 'Food' },
    { value: 'essential_item', label: 'Essential Items' }
  ]);
  const [categoryFood, setCategoryFood] = useState([
    { value: 'fruit', label: 'Fruit' },
    { value: 'canned', label: 'Canned Goods' },
    { value: 'cooked', label: 'Cooked Meals' },
    { value: 'misc', label: 'Miscellaneous' },
  ]);
  const [categoryItems, setCategoryItems] = useState([
    { value: 'baby', label: 'Baby Items' },
    { value: 'bedding', label: 'Bedding' },
    { value: 'heating', label: 'Heating' },
    { value: 'school', label: 'School Items' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'misc', label: 'Miscellaneous' },
  ]);
  const [subcategoryItems, setSubcategoryItems] = useState([
    { value: '01', label: 'Subcategory #1' },
    { value: '02', label: 'Subcategory #2' },
    { value: '03', label: 'Subcategory #3' },
    { value: '04', label: 'Subcategory #4' },
  ]);
  const [collectionItems, setCollectionItems] = useState([
    { value: 'pick_up', label: 'Pick Up' },
    { value: 'delivery', label: 'Delivery' }
  ]);

  function userTypeOpened(val)
  {
    setOpenUserType(val);
    setOpenDonationType(false);
    setOpenCategoryType(false);
    setOpenSubcategoryType(false);
    setOpenCollectionType(false);
  }
  function donationTypeOpened(val)
  {
    setOpenUserType(false);
    setOpenDonationType(val);
    setOpenCategoryType(false);
    setOpenSubcategoryType(false);
    setOpenCollectionType(false);
  }
  function categoryOpened(val)
  {
    setOpenUserType(false);
    setOpenDonationType(false);
    setOpenCategoryType(val);
    setOpenSubcategoryType(false);
    setOpenCollectionType(false);
  }
  function subcategoryOpened(val)
  {
    setOpenUserType(false);
    setOpenDonationType(false);
    setOpenCategoryType(false);
    setOpenSubcategoryType(val);
    setOpenCollectionType(false);
  }
  function collectionOpened(val)
  {
    setOpenUserType(false);
    setOpenDonationType(false);
    setOpenCategoryType(false);
    setOpenSubcategoryType(false);
    setOpenCollectionType(val);
  }

  function setDate(date) {
    setShowDate(false);
    setExpiryDate(date);
  };

  function ConvertDate(seconds) {
    if (seconds == null) {seconds = Date.now()}    
    var local = new Date(seconds)
    var date = new Date(local.getTime());
    return ((date.getDate()<10) ? "0"+date.getDate() : date.getDate()) + "/" + ((date.getMonth()+1<10) ? "0"+(date.getMonth()+1) : (date.getMonth()+1)) + "/" + date.getFullYear() 
  };

  function GoBack()  {
    // Go back to the map page
    navigation.navigate('Map')
  }

  function CheckInput(userType, donationType, listingTitle, description, location, category, subCategory, quantity, expiryDate, collectionMethod)  {
    console.log("")
    console.log("Checking")
    switch(true)
    { 
        case (!userType in ['business','individual']):               
            return false;

        case (!donationType in ['food','essential_item']):
            return false;

        case (listingTitle in ["",null]):
            return false;

        case (description in ["",null]):
            return false;

        case (location["lat"] == 0 || location["lng"] == 0):
            return false;

        case (donationType == "food" && !category in ['fruit','canned','cooked','misc']):
            return false;

        case (donationType == "essential_item" && !category in ['baby','bedding','heating','school','clothing','misc']):
          return false;

        case (quantity == null || quantity <= 0 ):
          return false;

        case (expiryDate == null):
          return false;

        case (!collectionMethod in ['pick_up','delivery']):
            return false;
    }
    
    console.log("Pass")
    SubmitForm(userType, donationType, listingTitle, description, location, category, subCategory, quantity, expiryDate, collectionMethod)
  }

  return (
  <View style={styles.container} keyboardShouldPersistTaps="always">
    <StatusBar backgroundColor={Colours.statusbar} />            
    <View>
        <Text style={styles.headerText}>CREATE NEW LISTING</Text>
    </View>
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="always">
        <Text style={styles.inputTitleFirst}>I am...</Text>
        <DropDownPicker
            open={openUserType}
            items={typeUserItems}
            value={userType}
            setOpen={(val) => userTypeOpened(val)}
            setValue={(val) => setUserType(val)}
            showArrowIcon={!web}
            showTickIcon={false}
            zIndex={5000}
            placeholder="Select..."
            placeholderStyle={styles.dropDownPlaceholderText}
            dropDownContainerStyle={styles.dropDownBody}
            textStyle={styles.dropDownText}
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >I'm giving...</Text>
        <DropDownPicker
            open={openDonationType}
            items={donationItems}
            value={donationType}
            setOpen={(val) => donationTypeOpened(val)}
            setValue={(val) => setDonationType(val)}
            showArrowIcon={!web}
            showTickIcon={false}
            zIndex={4000}
            placeholder="Select..."
            placeholderStyle={styles.dropDownPlaceholderText}
            dropDownContainerStyle={styles.dropDownBody}
            textStyle={styles.dropDownText}
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >Listing Title</Text>
        <TextInput
            onChangeText={val => setListingTitle(val)}
            placeholder='Title'
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >Listing Description</Text>
        <TextInput
            onChangeText={val => setDescription(val)}
            placeholder='Description'
            multiline={true}
            numberOfLines={4}
            textBreakStrategy={"simple"}
            style={styles.inputTextDescription}/>
        <Text style={styles.inputTitle} >Location</Text>
        <GooglePlacesAutocomplete
            placeholder='Search...'
            onFail={error => console.error(error)}
            fetchDetails={true}
            onFail={(data, details) => console.error(data, details)}
            onNotFound={(data, details) => console.error(data, details)}
            onPress={(data, details) => setLocation(details["geometry"]["location"])}
            query={{
                key: GOOGLE_MAP_API_KEY,
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
            debounce={200}/>
        <Text style={styles.inputTitle} >Listing Category</Text>
        <DropDownPicker
            open={openCategoryType}
            items={(donationType=="food") ? categoryFood:categoryItems}
            value={category}
            setOpen={(val) => categoryOpened(val)}
            setValue={(val) => setCategory(val)}
            showArrowIcon={!web}
            showTickIcon={false}
            zIndex={3000}
            placeholder="Select..."
            placeholderStyle={styles.dropDownPlaceholderText}
            dropDownContainerStyle={styles.dropDownBody}
            textStyle={styles.dropDownText}
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >Listing Subcategory</Text>
        <DropDownPicker
            open={openSubcategoryType}
            items={subcategoryItems}
            value={subcategory}
            setOpen={(val) => subcategoryOpened(val)}
            setValue={(val) => setSubcategory(val)}
            showArrowIcon={!web}
            showTickIcon={false}
            zIndex={2000}
            placeholder="Select..."
            placeholderStyle={styles.dropDownPlaceholderText}
            dropDownContainerStyle={styles.dropDownBody}
            textStyle={styles.dropDownText}
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >Quantity</Text>
        <TextInput
            value={quantity}
            onChangeText={val => setQuantity(val.replace(/\D/,''))}
            placeholder='Quantity'
            keyboardType='numeric'
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >Expiry Date</Text>
        {
            web
            &&
            (
            <DatePicker
                selected={new Date(Date.now())}
                onChange={(val) => setDate(ConvertDate(val))}
                minDate={Date.now()}
                dateFormat="dd/MM/yyyy"
                zIndex={9000}
                customInput={
                <TouchableOpacity
                    style={styles.date}
                    onPress={() => setShowDate(true)}>
                    <Text style={styles.dateText}>{expiryDate}</Text>
                </TouchableOpacity>}/>
            )
        }
        {
            !web
            &&
            (
                <TouchableOpacity
                    style={styles.date}
                    onPress={() => setShowDate(true)}>
                    <Text style={styles.dateText}>{expiryDate}</Text>
                </TouchableOpacity>
            )
        }
        {
            !web && showDate
            &&
            (
                <DateTimePicker
                    mode="date"
                    dateFormat="day month year"
                    minimumDate={Date.now()}
                    value={new Date(Date.now())}
                    onChange={(val) => setDate(ConvertDate(val["nativeEvent"]["timestamp"]))}
                />
            )
        }
        <Text style={styles.inputTitle} >Collection Method</Text>
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
            style={styles.inputText}/>
        <TouchableOpacity
            style={styles.submit}
            onPress={() => CheckInput(userType, donationType, listingTitle, description, location, category, subcategory, quantity, expiryDate, collectionMethod)}>
            <Text style={styles.submitText}>CREATE LISTING</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.cancel}
            onPress={() => GoBack()}>
            <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
        <View style={styles.end}/>
    </ScrollView>
  </View>
  );
}


const styles = StyleSheet.create({
  container: {
		flex: 1,
		backgroundColor: Colours.koha_green,//Gui.container.backgroundColor,
	},
  scroll: {
    backgroundColor: Colours.white,
    marginTop: Gui.screen.height*0.01,
  },
  headerText: {
    textAlign: 'left',
    textAlignVertical: 'center',
    marginTop: Gui.screen.height*0.02,
    marginLeft: Gui.screen.width*0.1,
    fontSize: Gui.screen.height*0.03,
		height: Gui.screen.height*0.05,
		width: Gui.screen.width*0.95,
    color: Colours.white,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems:'center',
	},
  inputTitleFirst: {
    textAlign: 'left',
    textAlignVertical: 'top',
    marginTop: Gui.screen.height*0.005,
    marginLeft: Gui.screen.width*0.1,
    fontSize: Gui.screen.height*0.025,
		height: Gui.screen.height*0.03,
		width: Gui.screen.width*0.8,
    color: Colours.black
	},
  inputTitle: {
    textAlign: 'left',
    textAlignVertical: 'top',
    marginTop: Gui.screen.height*0.025,
    marginLeft: Gui.screen.width*0.1,
    fontSize: Gui.screen.height*0.025,
		height: Gui.screen.height*0.04,
		width: Gui.screen.width*0.8,
    color: Colours.black
	},
  dropDownText: {
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: Gui.screen.height*0.03,
    backgroundColor: colours.white,
  },
  dropDownPlaceholderText: {
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: Gui.screen.height*0.03,
    color: colours.placeholder,
  },
  dropDownBody: {
    textAlign: 'left',
    textAlignVertical: 'center',
    marginLeft: Gui.screen.width*0.1,
    fontSize: Gui.screen.height*0.03,
		width: Gui.screen.width*0.8
  },
  textInputContainer: {
    marginLeft: Gui.screen.width*0.1,
		height: Gui.screen.height*0.055,
		width: Gui.screen.width*0.8,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colours.black
	},
  textInput: {
		textAlign: 'left',
    textAlignVertical: 'top',
    fontSize: Gui.screen.height*0.025,
    height: Gui.screen.height*0.05,
    color: Colours.black,
	},
  listView: {
    marginTop: 1,
    marginLeft: Gui.screen.width*0.1,
    width: Gui.screen.width*0.8,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colours.black,
	},
  separator: {
    height: 1,
    backgroundColor: Colours.placeholder
	},
  poweredContainer: {
    height: Gui.screen.height*0.045,
    borderColor: Colours.placeholder,
    borderTopWidth: 1,
  },
  powered: {
    marginTop: -Gui.screen.height*0.02,
  },
  description: {
    flexShrink: 1,
    marginLeft: Gui.screen.width*0.01,
    fontSize: Gui.screen.height*0.025,
  },
  row: {
    padding: 0,
    height: Gui.screen.height*0.045,
  },
  inputText: {
    textAlign: 'left',
    textAlignVertical: 'center',
    marginLeft: Gui.screen.width*0.1,
    fontSize: Gui.screen.height*0.03,
		height: Gui.screen.height*0.05,
		width: Gui.screen.width*0.8,
    color: Colours.black,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colours.black
	},
  inputTextDescription: {
    textAlign: 'left',
    textAlignVertical: 'top',
    marginLeft: Gui.screen.width*0.1,
    fontSize: Gui.screen.height*0.03,
		height: Gui.screen.height*0.15,
		width: Gui.screen.width*0.8,
    color: Colours.black,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colours.black
	},
  date: {
    textAlign: 'left',
    textAlignVertical: 'center',
    marginTop: Gui.screen.height*0.005,
    marginLeft: Gui.screen.width*0.1,
    fontSize: Gui.screen.height*0.03,
		height: Gui.screen.height*0.05,
		width: Gui.screen.width*0.8,
    color: Colours.black,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colours.black,
    fontWeight: 'normal'
	},
  dateText: {
    fontSize: Gui.screen.height*0.03
	},
  errorView: {
    flexDirection:'row',
    marginLeft: Gui.screen.width*0.1,
    marginBottom: Gui.screen.height*0.01,
    width: Gui.screen.width*0.8,
    alignContent: 'center'
	},
  errorText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: Gui.screen.height*0.005,
    marginBottom: Gui.screen.height*0.005,
    fontSize: Gui.screen.height*0.02,
		height: Gui.screen.height*0.1,
		width: Gui.screen.width*1,
    color: Colours.red,
    flex: 1,
    flexWrap: 'wrap'
	},
  submit: {
    marginTop: Gui.screen.width*0.05,
    marginLeft: Gui.screen.width*0.1,
    marginBottom: -Gui.screen.height*0.02,        
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width*0.8,
		height: Gui.screen.height*0.075,    
		borderRadius: Gui.button.borderRadius,
		borderWidth: Gui.button.borderWidth,
    backgroundColor: Colours.koha_green,
		borderColor: Colours.koha_green,
	},
  cancel: {
    marginTop: Gui.screen.width*0.05,
    marginLeft: Gui.screen.width*0.1,
    marginBottom: -Gui.screen.height*0.02,        
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width*0.8,
		height: Gui.screen.height*0.075,
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
		height: Gui.screen.height*0.0375
	},
});

export default CreateNewListingScreen;