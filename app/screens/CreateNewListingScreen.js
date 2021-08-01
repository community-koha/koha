import React from 'react';
import {StyleSheet} from 'react-native';

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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default CreateNewListingScreen;