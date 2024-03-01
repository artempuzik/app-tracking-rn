import {TextInput, View} from "react-native";
import React from "react";

const Input = ({placeholder, value, onChangeText, multiline, autoCorrect, style, keyboardType}) => {
    return(
        <View style={styles.wrapper}>
            <TextInput
                style={[styles.input, style]}
                onChangeText={onChangeText}
                value={value}
                autoCorrect={autoCorrect}
                multiline={multiline}
                autoCapitalize='none'
                placeholder={placeholder}
                keyboardType={keyboardType}
            />
        </View>)
}

import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    wrapper: {
        borderColor: '#a7a7aa',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
    input: {
        borderWidth: 0,
        paddingVertical: 10,
        paddingRight: 10,
    },
});

export default Input
