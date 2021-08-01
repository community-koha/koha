import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

function ListViewScreen() {
    return (
        <View style={styles.container}>
            <Text>Listings WIP</Text>
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

export default ListViewScreen;