import React, { useState } from 'react';

import Colours from '../config/colours.js';
import Gui from '../config/gui.js';

import { View, StyleSheet, Text, StatusBar, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';


function CreateAccount({navigation}) {
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState(Date.now());
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showDate, setShowDate] = useState(false);

    function setDate(date) {
        setShowDate(false);
        setDob(date["nativeEvent"]["timestamp"]);
    }

    function ConvertDate(seconds) {
        if (seconds != null)
        {
            var local = new Date(seconds)
            var date = new Date(local.getTime());
            return ((date.getDate()<10) ? "0"+date.getDate() : date.getDate()) + "/" + ((date.getMonth()+1<10) ? "0"+(date.getMonth()+1) : (date.getMonth()+1)) + "/" + date.getFullYear() 
        }
        return "01/01/1970"
    }

    function SubmitData(name='', dob=0, email='', username='', password='', confirm='') {
        setError("");
        switch(true)
        { 
            case (name === ""):
                act(() => {
                    setError("Please enter your name");
                });                
                return false;

            case (dob == 0):
                setError("Please enter your date of birth");
                return false;

            case (email == ""):
                setError("Please enter your email");
                return false;

            case (username == ""):
                setError("Please enter your username");
                return false;

            case (password != confirm):
                setError("Your passwords do not match");
                return false;
        }
        dob = ConvertDate(dob)

        // TODO


        console.log("Name: " + name);
        console.log("DOB: " + dob);
        console.log("Email: " + email);
        console.log("Username: " + username);
        console.log("Password Length: " + password.length);
        console.log("Confirm Length: " + confirm.length);
        console.log("Passwords Match: " + (password == confirm));
        return true;   
    }

	return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colours.statusbar} />            
            <View>
                <Text style={styles.headerText}>CREATE ACCOUNT</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={Gui.screen.height*0.05} color={Colours.black} style={styles.headerIcon} />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scroll}>
                <Text style={styles.inputTitle}>Name</Text>
                <TextInput
                    onChangeText={name => setName(name)}
                    placeholder=' Name'
                    autoCompleteType="name"
                    style={styles.inputText}/>
                <Text style={styles.inputTitle} >Date of Birth</Text>
                <TouchableOpacity
                    style={styles.date}
                    onPress={() => setShowDate(true)}>
                    <Text style={styles.dateText}>{ConvertDate(dob)}</Text>
                </TouchableOpacity>
                {
                    showDate
                    &&
                    (
                        <DateTimePicker
                            mode="date"
                            dateFormat="day month year"
                            maximumDate={Date.now()}
                            value={new Date()}
                            onChange={(date) => setDate(date)}
                        />
                    )
                }
                <Text style={styles.inputTitle}>Email Address</Text>
                <TextInput
                    onChangeText={email => setEmail(email)}
                    placeholder=' Email'
                    keyboardType='email-address'
                    autoCompleteType="email"
                    style={styles.inputText}/>
                <Text style={styles.inputTitle}>Username</Text>
                <TextInput
                    onChangeText={username => setUsername(username)}
                    placeholder=' Username'
                    style={styles.inputText}/>
                <Text style={styles.inputTitle}>Password</Text>
                <TextInput                    
                    onChangeText={password => setPassword(password)}
                    placeholder=' Password'
                    style={styles.inputText}
                    secureTextEntry={true}/>
                <Text style={styles.inputTitle}>Confirm Password</Text>
                <TextInput
                    onChangeText={confirm => setConfirm(confirm)}
                    placeholder=' Confirm Password'
                    style={styles.inputText}
                    secureTextEntry={true}/>
                <View style={styles.errorView}> 
                    <Text style={styles.errorText}>{error}</Text>
                </View>
                <TouchableOpacity
                    style={styles.submit}
                    onPress={() => SubmitData(name, dob, email, username, password, confirm)}>
                    <Text style={styles.submitText}>CREATE ACCOUNT</Text>
                </TouchableOpacity>
                <View style={styles.end}/>
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
    backButton:
    {
        flexDirection: 'row',
        alignItems:'center',
        marginTop: -Gui.screen.height*0.05,
        marginBottom: Gui.screen.height*0.02,
        height: Gui.screen.height*0.08,
        width: Gui.screen.width*0.2,
    },
    scroll: {
        marginTop: -
        Gui.screen.height*0.02,
    },
    headerIcon: {
        marginTop: Gui.screen.height*0.01,
        marginLeft: Gui.screen.width*0.05,
        height: Gui.screen.height*0.05,
	},
    headerText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        top: Gui.screen.height*0.02,
        marginLeft: Gui.screen.width*0.05,
        fontSize: Gui.screen.height*0.03,
		height: Gui.screen.height*0.05,
		width: Gui.screen.width*0.95,
        fontWeight: 'bold',
        flexDirection: 'row',
        alignItems:'center',
	},
    inputTitle: {
        textAlign: 'left',
        textAlignVertical: 'top',
        marginTop: Gui.screen.height*0.025,
        marginLeft: Gui.screen.width*0.1,
        fontSize: Gui.screen.height*0.025,
		height: Gui.screen.height*0.03,
		width: Gui.screen.width*0.8,
        color: Colours.black
	},    
    inputText: {
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
        marginLeft: Gui.screen.width*0.1,
        marginBottom: -Gui.screen.height*0.02,        
		justifyContent: 'center',
		alignItems: 'center',
		width: Gui.screen.width*0.8,
		height: Gui.screen.height*0.075,
		borderRadius: Gui.button.borderRadius,
		borderWidth: Gui.button.borderWidth,
		borderColor: Colours.black,
	},
    submitText: {
		fontSize: Gui.button.fontSize,
		fontWeight: 'bold',
	},
    end: {
		height: Gui.screen.height*0.0375
	},
});

export default CreateAccount;