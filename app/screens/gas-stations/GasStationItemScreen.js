import React, {useMemo} from 'react';
import {View, ScrollView, Pressable, Text, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import {useSelector} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import styles from './styles';
import {LeafletView} from "react-native-leaflet-view";
import Svg, {Path} from "react-native-svg";
import i18n from "../../utils/i18";
import {convertDate, getDuration} from "../../utils/helpers";

const gasIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.6386 5.06675L17.9757 5.75431L18.957 6.7735V8.74568H20.8276V19.5783C20.8276 20.8889 20.0233 21.0401 19.4189 21.0401C18.292 21.0401 18.0496 19.8906 18.0124 19.66V11.5136H14.6539V1.77739C14.6539 0.795162 13.888 0 12.9418 0H3.71324C2.76705 0 2 0.794059 2 1.77739V22.2215C2 23.2032 2.76705 24 3.71324 24H12.9418C13.888 24 14.6539 23.2043 14.6539 22.2215V12.4853H17.0747V19.6959L17.0795 19.7593C17.1794 20.5385 17.7971 22.0113 19.4189 22.0113C20.8882 22.0113 21.7647 21.1019 21.7647 19.5767V8.3103L18.6386 5.06675ZM19.4253 8.25788V7.2591L20.3874 8.25788H19.4253ZM12.7791 11.1886H4.03165V2.10793H12.7796L12.7791 11.1886Z" fill="black"/>
</svg>`

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
            icon: gasIcon,
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
