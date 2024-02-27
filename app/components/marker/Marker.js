import React from 'react';
import { Image } from 'react-native';

const Marker = ({ source, size }) => {
    return (
        <Image
            source={source}
            style={{
                width: size[0],
                height: size[1],
            }}
        />
    );
};

export default Marker;
