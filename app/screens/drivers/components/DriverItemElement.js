import React from 'react';
import {View, Text, Pressable, Linking, Alert, Platform} from 'react-native';
import styles from '../styles';
import Svg, {Path} from "react-native-svg";
const DriverItemElement = ({item}) => {
    const callNumber = () => {
        let phoneNumber = item.phone;
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${item.phone}`;
        }
        else  {
            phoneNumber = `tel:${item.phone}`;
        }
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Phone number is not available');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log(err));
    };
    return (
        <View>
                <View style={styles.main}>
                    <View style={styles.leftBlock}>
                        <Svg
                            width={20}
                            height={20}
                            viewBox="0 0 18 18"
                        >
                            <Path d="M8 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="#a7a7aa"/>
                            <Path d="M8 10a8 8 0 0 1 8 8H0a8 8 0 0 1 8-8z" fill="#a7a7aa"/>
                        </Svg>
                        <View style={styles.mainInfo}>
                            <Text style={styles.objectItemTitle}>{item.name}</Text>
                            <Text style={styles.subText}>{item.phone}</Text>
                        </View>
                    </View>
                    <View style={{marginTop: -5}}>
                        <Pressable
                            style={({pressed}) => [
                                {
                                    backgroundColor: pressed ? '#b0b0b2' : 'transparent',
                                },
                                styles.footer,
                            ]}
                            onPress={callNumber}
                        >
                            <Svg
                                width={20}
                                height={20}
                                viewBox="0 0 18 18"
                            >
                                <Path d="M3.6 7.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.5 0 1 .4 1 1V17c0 .5-.5 1-1 1C7.6 18 0 10.4 0 1c0-.5.5-1 1-1h3.5c.6 0 1 .5 1 1 0 1.3.2 2.4.6 3.6.1.3 0 .7-.3 1L3.6 7.8z"
                                      fill="#a7a7aa"/>
                            </Svg>
                        </Pressable>
                    </View>
                </View>
        </View>
);
};

export default DriverItemElement;
