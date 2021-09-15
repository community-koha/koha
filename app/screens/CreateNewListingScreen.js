import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, StatusBar, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { LogBox } from 'react-native';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import firebase from 'firebase/app';
import colours from '../config/colours.js';

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

  const [userType, setUserType] = useState(null);
  const [donationType, setOpenDonationType] = useState(null);
  const [listingTitle, setListingTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState(null);
  const [subCategory, setSubcategory] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [collectionMethod, setCollectionMethod] = useState(null);

  const [showDate, setShowDate] = useState(false);
  const [openUserType, setOpenUserType] = useState(false);
  const [openItemType, setOpenItemType] = useState(false);
  const [openCategoryType, setOpenCategoryType] = useState(false);
  const [openSubcategoryType, setOpenSubcategoryType] = useState(false);
  const [openCollectionType, setOpenCollectionType] = useState(false);

  const [typeUserItems, setUserTypeItems] = useState([
    { value: 'business', label: 'A Business' },
    { value: 'individual', label: 'An Individual' }
  ]);
  const [typeItems, setTypeItems] = useState([
    { value: 'food', label: 'Food' },
    { value: 'essential_item', label: 'Essential Items' }
  ]);
  const [categoryItems, setCategoryItems] = useState([
    { value: 'fruit', label: 'Fruit' },
    { value: 'canned', label: 'Canned Goods' },
    { value: 'cooked', label: 'Cooked Meals' },
    { value: 'misc', label: 'Miscellaneous' },
  ]);
  const [subcategoryItems, setSubcategoryItems] = useState([
    { value: '01', label: 'Subcategory #1' },
    { value: '02', label: 'Subcategory #2' },
    { value: '03', label: 'Subcategory #3' },
    { value: '04', label: 'Subcategory #4' },
  ]);
  const [collectionItems, setCollectionItems] = useState([
    { value: 'walk', label: 'Pick-Up' },
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
    setExpiryDate(date["nativeEvent"]["timestamp"]);
  };

  function ConvertDate(seconds) {
    if (seconds != null)
    {
      var local = new Date(seconds)
      var date = new Date(local.getTime());
      return ((date.getDate()<10) ? "0"+date.getDate() : date.getDate()) + "/" + ((date.getMonth()+1<10) ? "0"+(date.getMonth()+1) : (date.getMonth()+1)) + "/" + date.getFullYear() 
    }
    return "01/01/1970"
  };

  return (
  <View style={styles.container}>
    <StatusBar backgroundColor={Colours.statusbar} />            
    <View>
        <Text style={styles.headerText}>CREATE NEW LISTING</Text>
    </View>
    <ScrollView style={styles.scroll}>
        <Text style={styles.inputTitleFirst}>I am...</Text>
        <DropDownPicker
            open={openUserType}
            items={typeUserItems}
            setOpen={(val) => userTypeOpened(val)}
            setValue={(val) => setUserType(val)}
            showArrowIcon={true}
            showTickIcon={false}
            zIndex={5000}
            placeholder="Select..."
            placeholderStyle={styles.dropDownPlaceholderText}
            dropDownContainerStyle={styles.dropDownBody}
            textStyle={styles.dropDownText}
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >I'm giving...</Text>
        <DropDownPicker
            open={openItemType}
            items={typeItems}
            setOpen={(val) => donationTypeOpened(val)}
            setValue={(val) => setOpenDonationType(val)}
            showArrowIcon={true}
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
            placeholder=' Title'
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >Listing Description</Text>
        <TextInput
            onChangeText={val => setDescription(val)}
            placeholder=' Description'
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >Pickup Location</Text>
        <TextInput
            onChangeText={val => setLocation(val)}
            placeholder=' Location'
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >Listing Category</Text>
        <DropDownPicker
            open={openCategoryType}
            items={categoryItems}
            setOpen={(val) => categoryOpened(val)}
            setValue={(val) => setCategory(val)}
            showArrowIcon={true}
            showTickIcon={false}
            zIndex={3000}
            placeholder="Select..."
            placeholderStyle={styles.dropDownPlaceholderText}
            dropDownContainerStyle={styles.dropDownBody}
            textStyle={styles.dropDownText}
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >Listing Sub-Category</Text>
        <DropDownPicker
            open={openSubcategoryType}
            items={subcategoryItems}
            setOpen={(val) => subcategoryOpened(val)}
            setValue={(val) => setSubcategory(val)}
            showArrowIcon={true}
            showTickIcon={false}
            zIndex={3000}
            placeholder="Select..."
            placeholderStyle={styles.dropDownPlaceholderText}
            dropDownContainerStyle={styles.dropDownBody}
            textStyle={styles.dropDownText}
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >Quantity</Text>
        <TextInput
            onChangeText={val => setQuantity(val)}
            placeholder=' Quantity'
            keyboardType='numeric'
            style={styles.inputText}/>
        <Text style={styles.inputTitle} >Expiry Date</Text>
        <TouchableOpacity
            style={styles.date}
            onPress={() => setShowDate(true)}>
            <Text style={styles.dateText}>{ConvertDate(expiryDate)}</Text>
        </TouchableOpacity>
        {
            showDate
            &&
            (
                <DateTimePicker
                    mode="date"
                    dateFormat="day month year"
                    minimumDate={Date.now()}
                    value={new Date(Date.now())}
                    onChange={(val) => setDate(val)}
                />
            )
        }
        <Text style={styles.inputTitle} >Collection Method</Text>
        <DropDownPicker
            open={openCollectionType}
            items={collectionItems}
            setOpen={(val) => collectionOpened(val)}
            setValue={(val) => setCollectionMethod(val)}
            showArrowIcon={true}
            showTickIcon={false}
            zIndex={3000}
            placeholder="Select..."
            placeholderStyle={styles.dropDownPlaceholderText}
            dropDownContainerStyle={styles.dropDownBody}
            textStyle={styles.dropDownText}
            style={styles.inputText}/>
        <TouchableOpacity
            style={styles.submit}
            onPress={() => SubmitForm(userType, donationType, listingTitle, description, location, category, subCategory, quantity, expiryDate, collectionMethod)}>
            <Text style={styles.submitText}>CREATE LISTING</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.cancel}
            onPress={() => navigation.navigate('Map')}>
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
    marginTop: Gui.screen.height*0.03,
  },
  headerText: {
    textAlign: 'left',
    textAlignVertical: 'center',
    top: Gui.screen.height*0.02,
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
  inputTextDay: {
    textAlign: 'left',
    textAlignVertical: 'center',
    marginTop: Gui.screen.height*0.005,
    marginLeft: Gui.screen.width*0.1,
    fontSize: Gui.screen.height*0.03,
		height: Gui.screen.height*0.05,
		width: Gui.screen.width*0.2,
    color: Colours.black,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colours.black
	},
  inputTextMonth: {
    textAlign: 'left',
    textAlignVertical: 'center',
    marginTop: Gui.screen.height*0.005,
    fontSize: Gui.screen.height*0.03,
		height: Gui.screen.height*0.05,
		width: Gui.screen.width*0.2,
    color: Colours.black,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colours.black
	},
  inputTextYear: {
    textAlign: 'left',
    textAlignVertical: 'center',
    marginTop: Gui.screen.height*0.005,
    fontSize: Gui.screen.height*0.03,
		height: Gui.screen.height*0.05,
		width: Gui.screen.width*0.4,
    color: Colours.black,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colours.black
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
    marginTop: Gui.screen.width*0.1,
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
    marginTop: Gui.screen.width*0.1,
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