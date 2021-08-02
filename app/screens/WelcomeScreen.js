import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Colours from '../config/colours.js';

function WelcomeScreen(props) {
    return (
        <View style = {styles.background}>
            <Text>
                Logo/Background placeholder
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: Colours.white
    }
})
export default WelcomeScreen;