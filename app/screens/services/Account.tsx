import React from 'react';
import {StyleSheet, Text, View} from 'react-native';


export const Account = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0D0505',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 30,
        paddingBottom: 10,
        flex: 1,
    },
    title: {
        color: "#ffe6cc",
        fontSize: 24,
        fontWeight: '900',
    },
});

export default Account;