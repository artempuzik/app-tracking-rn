import React from 'react';
import {Pressable, Text, StyleSheet, ActivityIndicator} from 'react-native';

const CustomButton = ({
                          title,
                          onPress,
                          isLoading = false,
                          pressedColor = '#58749d',
                          btnColor = '#2060ae',
                          color = 'white'
}) => {
    return (
        <Pressable
            style={({ pressed }) => [
                {
                    backgroundColor: pressed ? pressedColor : btnColor,
                    borderRadius: 10,
                    padding: 10,
                },
                styles.button,
            ]}
            onPress={onPress}
        >
            {
                isLoading ? <ActivityIndicator size="small" color="#0000ff" /> : <Text style={{color: color}}>{title}</Text>
            }
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        width: '100%',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 5,
        alignItems: 'center',
    },
});

export default CustomButton;
