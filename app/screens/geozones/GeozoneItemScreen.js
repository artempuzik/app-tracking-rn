import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import {useDispatch, useSelector} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import {useNavigation, useRoute} from "@react-navigation/native";
import {editDriver, getDriverById, getDriverSessionById} from "../../store/drivers/driversActions";
import Svg, {Path} from "react-native-svg";
import AppCalendarFilter from "../../components/calendar/AppCalendarFilter";
import CustomButton from "../../components/button/Button";
import SelectList from "../../components/select/SelectList";
import {getGeozoneById, getGeozones, getObjectHistoryDriversSession} from "../../store/objects/objectsActions";
import i18n from "../../utils/i18";
import {convertDate, getDuration, getMileage} from "../../utils/helpers";
import {Image} from "expo-image";
import {LeafletView} from "react-native-leaflet-view";

const GeozoneItemScreen = ({navigation}) => {
    const route = useRoute();
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)

    const [geoZone, setGeoZone] = useState(null)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            await dispatch(getGeozoneById(route.params.id)).then((data) =>{
                if(data.response) {
                    setGeoZone(data.response)
                }
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData().catch(() => {})
    }, []);

    const points = useMemo(() => {
        const mapPoints = []
        geoZone?.points.split(' ').forEach(point => {
            if(!mapPoints.length) {
                mapPoints.push({lat: point})
            } else {
                const lastPoint = mapPoints[mapPoints.length - 1]
                if(lastPoint.lng) {
                    mapPoints.push({lat: point})
                } else {
                    lastPoint.lng = point
                }
            }
        })

        switch (geoZone?.style.type) {
            case 'point':
                return {
                        shapeType: 'Circle',
                        color: geoZone.style.strokeColor,
                        id: geoZone.id,
                        center: mapPoints[0],
                        radius: geoZone.radius,
                        positions: mapPoints,
                }
            case 'polygon':
                return {
                        shapeType: 'Polygon',
                        color: geoZone.style.strokeColor,
                        id: geoZone.id,
                        positions: mapPoints,
                }
            case 'polyline':
                return {
                        shapeType: 'Polyline',
                        color: geoZone.style.strokeColor,
                        id: geoZone.id,
                        positions: mapPoints,
                }
            default: return null
        }
    }, [geoZone]);

    const lengthIcon = useMemo(() => {
        switch (geoZone?.style.type) {
            case 'point':
            case 'polygon':
                return (
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 16 16"
                    >
                        <Path class="st0" d="M1.4 5.4L0 3.9 4 .1 7.8 4 6.3 5.4 4 2.9z" fill="#a7a7aa"/>
                        <Path class="st0" d="M13 17l-1.4-1.5 2.5-2.4-2.5-2.5L13 9.2l3.9 3.9z" fill="#a7a7aa"/>
                        <Path class="st0" d="M2.8 2.5h2.1v11.6H2.8z" fill="#a7a7aa"/>
                        <Path class="st0" d="M2.8 12h11.6v2.1H2.8z" fill="#a7a7aa"/>
                    </Svg>
                )
            case 'polyline':
                return (
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 13 13"
                    >
                        <Path d="M12 8v4H8" strokeWidth="2" fill="#a7a7aa"/>
                        <Path d="M1 5V1h4" strokeWidth="2" fill="#a7a7aa"/>
                        <Path d="M12.042 10.628l-1.414 1.415L1 2.414 2.414 1z" fill="#a7a7aa"/>
                    </Svg>
                )
            default: return null
        }

    }, [geoZone])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            <View style={styles.container}>
            <View style={styles.pageItemHeader}>
                <View style={styles.rightBlock}>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.headerItemButton,
                        ]}
                        onPress={() => navigation.goBack()}
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
                    <View style={styles.leftBlock}>
                        <View style={styles.mainInfo}>
                            <Text style={{...styles.objectItemTitle, fontWeight: 'normal', fontSize: 12}}>{geoZone?.name}</Text>
                            <Text style={{...styles.subText, fontSize: 12}}>{geoZone?.comment}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.mapContainer}>
                {
                    points && (
                        <LeafletView
                            doDebug={false}
                            mapCenterPosition={points?.positions[0]}
                            mapShapes={[
                                points
                            ]}
                        />
                    )
                }
            </View>
            <View style={{...styles.footer, marginTop: 10, paddingHorizontal: 20}}>
                <View style={styles.footerElement}>
                    {lengthIcon}
                    {/*<Text></Text>*/}
                </View>
                <View style={styles.footerElement}>
                    {
                        !Boolean(+geoZone?.maxSpeed) ? (
                            <Svg
                                width={25}
                                height={25}
                                viewBox="0 0 25 25"
                            >
                                <Path d="M14.4 17.7H7.8c-.4 0-.7.5-.7 1 0 .6.3 1 .7 1h6.6c.4 0 .7-.5.7-1 .1-.5-.3-1-.7-1z" fill="#a7a7aa"/>
                                <Path d="M18.2 16.3L16.6 15c1.7-2.1 2-5 .9-7.5-.5-1.1-1.5-2.1-2.6-2.8-1.1-.7-2.5-1.1-3.8-1.1-1.3 0-2.6.4-3.8 1.1-1.1.7-2 1.7-2.6 2.9-1.1 2.4-.8 5.4.9 7.5L4 16.3c-2.2-2.7-2.6-6.5-1.1-9.6.8-1.5 1.9-2.8 3.4-3.7 1.5-.9 3.1-1.4 4.8-1.4 1.7 0 3.4.5 4.9 1.4 1.4.9 2.6 2.2 3.3 3.8 1.5 3.1 1.1 6.8-1.1 9.5zm-6.4-5l-1.4-1.4 4-4 1.4 1.4-4 4z" fill="#a7a7aa"/>
                                <Path d="M0 3.4L3.4 0 22 18.6 18.6 22 0 3.4z" fill="#a7a7aa"/>
                                <Path d="M1 2.4L2.4 1 21 19.6 19.6 21 1 2.4z" fill="#a7a7aa"/>
                            </Svg>
                        ) : (
                            <Svg
                                style={{marginTop: 5}}
                                width={25}
                                height={25}
                                viewBox="0 0 25 25"
                            >
                                <Path className="st0" d="M12.3 16H5.7c-.4 0-.7.5-.7 1s.3 1 .7 1h6.5c.4 0 .7-.5.7-1s-.2-1-.6-1z" fill="#2060ae"/>
                                <Path className="st0" d="M16 14.6l-1.6-1.3c1.7-2.1 2-5 .9-7.4-.6-1.2-1.5-2.2-2.6-2.9-1.1-.6-2.4-1-3.7-1-1.3 0-2.6.4-3.7 1.1-1.2.7-2 1.7-2.6 2.9-1.2 2.4-.8 5.3.9 7.4L2 14.6C-.2 12-.6 8.2.9 5.1c.7-1.5 1.9-2.8 3.3-3.7C5.6.5 7.3 0 9 0c1.7 0 3.4.5 4.8 1.4 1.4.9 2.6 2.2 3.3 3.7 1.5 3.1 1.1 6.9-1.1 9.5zM9.7 9.7L8.3 8.3l4-4 1.4 1.4-4 4z" fill="#2060ae"/>
                            </Svg>
                        )
                    }
                    <Text>{Number(+geoZone?.maxSpeed).toFixed(1)} {i18n.t('speed_text')}</Text>
                </View>
            </View>
            <View>
                <View style={styles.infoPropRow}>
                    <Text>{i18n.t('in_groups')}</Text>
                    <Text>{geoZone?.groups.length ? i18n.t('yes') : i18n.t('no')}</Text>
                </View>
                <View style={styles.infoPropRow}>
                    <Text>{i18n.t('available_speed')}</Text>
                    <Text>{Number(+geoZone?.maxSpeed).toFixed(1)} {i18n.t('speed_text')}</Text>
                </View>
                <View style={styles.infoPropRow}>
                    <Text>{i18n.t('zone_type')}</Text>
                    <Text>{geoZone?.style.type}</Text>
                </View>
            </View>
        </View>
        </SafeAreaView>
    );
};

export default GeozoneItemScreen;
