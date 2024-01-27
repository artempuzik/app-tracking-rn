import React, {useMemo, useState} from 'react';
import {View, ActivityIndicator, ScrollView, Pressable, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import {useSelector} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import styles from './styles';
import {LeafletView} from "react-native-leaflet-view";
import Svg, {Path} from "react-native-svg";

const GasItemScreen = ({navigation}) => {
    const route = useRoute();

    const transactions = useSelector(state => state.objects.transactions)
    //const icons = useSelector(state => state.objects.icons)

    const transaction = useMemo(() => transactions.find(t => t.objectID == route.params.id), [transactions])

    const points = useMemo(() => {
        if(!transaction) {
            return []
        }
        //const icon = icons.find((ic) => ic.id === object.main.iconId)
        return {
            position: {
                lat: transaction.lat,
                lng: transaction.lng,
            },
            icon: "https://s1.geotek.online/ico/geotek/iconH18.png",
            size: [32, 32]
        }
    }, [transaction])

    const duration = useMemo(() => {
        const milliseconds = transaction?.finishTime - transaction?.time;

        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }, [transaction]);

    console.log(points)

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            <View style={styles.pageItemHeader}>
                <View style={styles.rightBlock}>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.headerItemButton,
                        ]}
                        onPress={() => navigation.navigate('Gas')}
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
                    <Text style={styles.idsBlock}>{transaction?.objectID}</Text>
                    <Text style={{...styles.itemText, marginLeft: 10,}}>{transaction?.objectName}</Text>
                </View>
            </View>
            <View style={styles.mapContainer}>
                <LeafletView
                    doDebug={true}
                    mapMarkers={points}
                    mapCenterPosition={points?.position}
                />
            </View>
            <ScrollView style={{flex: 1}}>
                <View>
                    <View style={styles.infoPropRow}>
                        <Text>Date</Text>
                        <Text>{new Date(transaction?.time).toLocaleString()}</Text>
                    </View>
                    <View style={styles.infoPropRow}>
                        <Text>Duration</Text>
                        <Text>{duration}</Text>
                    </View>
                    <View style={styles.infoPropRow}>
                        <Text>Station</Text>
                        <Text>{transaction?.objectName}</Text>
                    </View>
                    <View style={styles.infoPropRow}>
                        <Text>Pump</Text>
                        <Text>{transaction?.pump}</Text>
                    </View>
                    <View style={styles.infoPropRow}>
                        <Text>Fuel amount</Text>
                        <Text>{transaction?.value}</Text>
                    </View>
                    <View style={styles.infoPropRow}>
                        <Text>Vehicle</Text>
                        <Text>{transaction?.keyName}</Text>
                    </View>
                    <View style={styles.infoPropRow}>
                        <Text>Limit</Text>
                        <Text>{transaction?.tagLimit}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default GasItemScreen;
