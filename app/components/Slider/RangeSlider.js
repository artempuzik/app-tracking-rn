import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import {REFRESH_INTERVAL} from "../../config";
import {useSelector} from "react-redux";

const RangeSlider = ({onChange}) => {
    const refreshInterval = useSelector(state => state.user.refreshInterval)
    const [value, setValue] = useState(refreshInterval/1000);

    useEffect(() => {
        onChange(value*1000)
    }, [value])

    return (
        <View style={styles.container}>
            <Slider
                style={styles.slider}
                minimumValue={5}
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
