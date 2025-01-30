import React from 'react';
import {StyleSheet, Text, View} from 'react-native';


export const Games = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Games directory</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
});
