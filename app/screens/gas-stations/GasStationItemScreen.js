import React, {useMemo, useState} from 'react';
import {View, ActivityIndicator, ScrollView, Pressable, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import {useSelector} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import styles from './styles';
import {LeafletView} from "react-native-leaflet-view";
import Svg, {Path} from "react-native-svg";
import i18n from "../../utils/i18";
import {convertDate, getDuration} from "../../utils/helpers";

const GasStationItemScreen = ({navigation}) => {
    const route = useRoute();

    const transactions = useSelector(state => state.objects.transactions)

    const transaction = useMemo(() => transactions.find(t => t.objectID == route.params.id), [transactions])

    const points = useMemo(() => {
        if(!transaction) {
            return []
        }
        return [{
            position: {
                lat: transaction.lat,
                lng: transaction.lng,
            },
            icon: "https://s1.geotek.online/ico/geotek/iconH18.png",
            size: [32, 32]
        }]
    }, [transaction])

    const duration = useMemo(() => {
        if(!transaction) {
            return ''
        }
        return getDuration(transaction?.time, transaction?.finishTime);
    }, [transaction]);

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
                        onPress={() => navigation.navigate('GasStation')}
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
                    doDebug={false}
                    mapMarkers={points}
                    mapCenterPosition={points[0]?.position}
                />
            </View>
            <ScrollView style={{flex: 1}}>
                <View>
                    <View style={styles.infoPropRow}>
                        <Text>{i18n.t('date')}</Text>
                        <Text>{convertDate(transaction?.time)}</Text>
                    </View>
                    <View style={styles.infoPropRow}>
                        <Text>{i18n.t('duration')}</Text>
                        <Text>{duration}</Text>
                    </View>
                    <View style={styles.infoPropRow}>
                        <Text>{i18n.t('station')}</Text>
                        <Text>{transaction?.objectName}</Text>
                    </View>
                    <View style={styles.infoPropRow}>
                        <Text>{i18n.t('pump')}</Text>
                        <Text>{transaction?.pump}</Text>
                    </View>
                    <View style={styles.infoPropRow}>
                        <Text>{i18n.t('fuel_amount')}</Text>
                        <Text>{transaction?.value}</Text>
                    </View>
                    <View style={styles.infoPropRow}>
                        <Text>{i18n.t('vehicle')}</Text>
                        <Text>{transaction?.keyName}</Text>
                    </View>
                    <View style={styles.infoPropRow}>
                        <Text>{i18n.t('limit')}</Text>
                        <Text>{transaction?.tagLimit}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default GasStationItemScreen;
