import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import {REFRESH_INTERVAL} from "../../config";

const RangeSlider = ({onChange}) => {
    const [value, setValue] = useState(REFRESH_INTERVAL/1000);

    useEffect(() => {
        onChange(value*1000)
    }, [value])

    return (
        <View style={styles.container}>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={value}
                onValueChange={(newValue) => setValue(newValue)}
                step={1}
            />
            <Text>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slider: {
        width: '100%',
    },
});

export default RangeSlider;
