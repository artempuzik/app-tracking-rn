import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {LeafletView} from 'react-native-leaflet-view';
import * as Location from 'expo-location';
import styles from './styles';
import AppHeader from "../../components/header/AppHeader";

const DEFAULT_COORDINATE = {
    lat: 37.78825,
    lng: -122.4324,
};
const ObjectsMapScreen = ({navigation}) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const zoomToGeoJSONFuncRef = useRef();

    const coords = useMemo(() => {
        if(!location) {
            return DEFAULT_COORDINATE
        }
        return {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
        }

    }, [location])

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            {
                errorMsg && <Text>{errorMsg}</Text>
            }
            <View style={styles.container}>
                <LeafletView
                    doDebug={false}
                    mapMarkers={[
                        {
                            position: coords,
                            icon: '📍',
                            size: [32, 32],
                        },
                    ]}
                    mapCenterPosition={coords}
                />
            </View>
        </SafeAreaView>
    );
};

export default ObjectsMapScreen;
