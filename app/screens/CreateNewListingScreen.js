import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Colours from '../config/colours.js';

function CreateNewListingScreen() {
    return (
      <View style={styles.container}>
        <Text>Create WIP</Text>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.white,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default CreateNewListingScreen;