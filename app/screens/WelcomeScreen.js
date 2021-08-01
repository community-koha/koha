import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
        backgroundColor: "#fff"
    }
})
export default WelcomeScreen;