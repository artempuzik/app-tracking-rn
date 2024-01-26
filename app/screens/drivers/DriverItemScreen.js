import React, {useEffect, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';;
import {useDispatch} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import {useRoute} from "@react-navigation/native";
import {getDriverById} from "../../store/drivers/driversActions";
import Svg, {Path} from "react-native-svg";

const DriverItemScreen = ({navigation}) => {
    const route = useRoute();
    const [driver, setDriver] = useState(null)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getDriverById(route.params.id)).then((data) => {
            if(data.response) {
                setDriver(data.response)
            }
        })
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            <View style={styles.pageItemHeader}>
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                        },
                        styles.headerItemButton,
                    ]}
                    onPress={() => navigation.navigate('Drivers')}
                >
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 15 15"
                    >
                        <Path d="M10 4H3l4-4H5L0 5l5 5h2L3 6h7V4z" fill="#a7a7aa"/>
                        <Path d="M0-54v36" fill="#a7a7aa"/>
                        <Path d="M-54 0h36" fill="#a7a7aa"/>
                        <Path d="M-54 10h36" fill="#a7a7aa"/>
                        <Path d="M0 64V28" fill="#a7a7aa"/>
                        <Path d="M12-54v36" fill="#a7a7aa"/>
                        <Path d="M66 0H30" fill="#a7a7aa"/>
                        <Path d="M66 10H30" fill="#a7a7aa"/>
                        <Path d="M12 64V28" fill="#a7a7aa"/>
                    </Svg>
                </Pressable>
                {
                    driver && (
                        <View style={styles.mainInfo}>
                            <Text style={{...styles.objectItemTitle, fontWeight: 'normal', fontSize: 12}}>{driver?.name}</Text>
                        </View>
                    )
                }
            </View>
        </SafeAreaView>
    );
};

export default DriverItemScreen;
