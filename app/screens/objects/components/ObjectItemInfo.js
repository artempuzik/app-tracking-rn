import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, Pressable, ActivityIndicator} from 'react-native';
import Svg, {Path} from "react-native-svg";
import styles from '../styles';
import {LeafletView} from "react-native-leaflet-view";
import {useNavigation} from "@react-navigation/native";
import {getObjectStatusById} from "../../../store/objects/objectsActions";
import {useDispatch, useSelector} from "react-redux";

const ObjectItemInfo = ({object, status}) => {
    const navigation = useNavigation();

    const icons = useSelector(state => state.objects.icons)
    const baseUrl = useSelector(state => state.app.currentServer)

    const point = useMemo(() => {
        return status?.points[0]
    }, [object, status])

    const iopoints = useMemo(() => {
        const engine = object?.trends.find(t => t.flags === 'ENGINE')
        console.log(engine)
        return status?.iopoints?.find(p => p.trendid == engine?.id)
    }, [object, status])

    const points = useMemo(() => {
        if(!status) {
            return []
        }
        const icon = icons.find((ic) => ic.id === object.main.iconId)
        return status?.points?.map(point => ({
            position: {
                lat: point.lat,
                lng: point.lng,
            },
            animation: {
                type: 'spin',
                duration: icon.rotate ? 5 : 10000,
            },
            icon: baseUrl + icon.url,
            size: [icon.width, icon.height]
        }))
    }, [status])

    return (
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
                        <Svg
                            width={30}
                            height={30}
                            viewBox="0 0 313 512.52"
                        >
                            <Path d="M42.3 110.94c2.22 24.11 2.48 51.07 1.93 79.75-13.76.05-24.14 1.44-32.95 6.69-4.96 2.96-8.38 6.28-10.42 12.15-1.37 4.3-.36 7.41 2.31 8.48 4.52 1.83 22.63-.27 28.42-1.54 2.47-.54 4.53-1.28 5.44-2.33.55-.63 1-1.4 1.35-2.31 1.49-3.93.23-8.44 3.22-12.08.73-.88 1.55-1.37 2.47-1.61-1.46 62.21-6.21 131.9-2.88 197.88 0 43.41 1 71.27 43.48 97.95 41.46 26.04 117.93 25.22 155.25-8.41 32.44-29.23 30.38-50.72 30.38-89.54 5.44-70.36 1.21-134.54-.79-197.69.69.28 1.32.73 1.89 1.42 2.99 3.64 1.73 8.15 3.22 12.08.35.91.8 1.68 1.35 2.31.91 1.05 2.97 1.79 5.44 2.33 5.79 1.27 23.9 3.37 28.42 1.54 2.67-1.07 3.68-4.18 2.31-8.48-2.04-5.87-5.46-9.19-10.42-12.15-8.7-5.18-18.93-6.6-32.44-6.69-.75-25.99-1.02-51.83-.01-77.89C275.52-48.32 29.74-25.45 42.3 110.94zm69.63-90.88C83.52 30.68 62.75 48.67 54.36 77.59c21.05-15.81 47.13-39.73 57.57-57.53zm89.14-4.18c28.41 10.62 49.19 28.61 57.57 57.53-21.05-15.81-47.13-39.73-57.57-57.53zM71.29 388.22l8.44-24.14c53.79 8.36 109.74 7.72 154.36-.15l7.61 22.8c-60.18 28.95-107.37 32.1-170.41 1.49zm185.26-34.13c5.86-34.1 4.8-86.58-1.99-120.61-12.64 47.63-9.76 74.51 1.99 120.61zM70.18 238.83l-10.34-47.2c45.37-57.48 148.38-53.51 193.32 0l-12.93 47.2c-57.58-14.37-114.19-13.21-170.05 0zM56.45 354.09c-5.86-34.1-4.8-86.58 1.99-120.61 12.63 47.63 9.76 74.51-1.99 120.61z"
                                  fill={object?.main.color || "#a7a7aa"}/>
                        </Svg>
                        <View style={styles.mainInfo}>
                            <Text style={{...styles.objectItemTitle, fontWeight: 'normal', fontSize: 12}}>{object?.main.name}</Text>
                            <Text style={{...styles.subText, fontSize: 12}}>{object?.main.comment}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.mapContainer}>
                <LeafletView
                    doDebug={false}
                    mapMarkers={points}
                    mapCenterPosition={points[0]?.position}
                />
            </View>
            <View style={{...styles.footer, marginTop: 20, paddingHorizontal: 20}}>
                <View style={styles.footerElement}>
                    <Svg
                        style={{marginTop: 5}}
                        width={25}
                        height={25}
                        viewBox="0 0 25 25"
                    >
                        <Path d="M12.336 0C9.204 0 7.2 2.868 7.2 6c0 .672-.396.996-.204 1.668L0 14.664V18h3.6v-2.4H6v-1.2l1.332-.396 3-3c.6.204.936-.204 1.668-.204 3.132 0 6-2.004 6-5.136A5.664 5.664 0 0 0 12.336 0zm.164 7.8a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8z"
                              fill={!!iopoints?.value ? "#2060ae" : "#a7a7aa"}/>
                    </Svg>
                    <Text>{!!iopoints?.value ? 'Вкл.' : 'Выкл.'}</Text>
                </View>
                <View style={styles.footerElement}>
                    {
                        !!point?.speed ? (
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
                    <Text>{point?.speed} km/h</Text>
                </View>
                <View style={styles.footerElement}>
                    <Svg
                        style={{marginTop: 5}}
                        width={25}
                        height={25}
                        viewBox="0 0 25 25"
                    >
                        <Path d="M8.7 17c-2.1 0-4.2-.8-5.9-2.4-.6-.7-.6-1.7 0-2.4l9.4-9.5c.4-.3.8-.5 1.2-.5.4 0 .8.2 1.1.5 3.2 3.2 3.2 8.5 0 11.8-1.6 1.7-3.7 2.5-5.8 2.5zm-4.2-3.6c2.5 2.2 6.3 2.1 8.7-.2 2.3-2.4 2.4-6.2.2-8.7l-8.9 8.9z"
                              fill={!!point?.online ? "#31a903" : "#a7a7aa"}/>
                        <Path d="M.1 6.9c0-.1-.4-2.8 1.3-4.8C2.5.7 4.4 0 6.8 0v2C5 2 3.7 2.5 2.9 3.4 1.8 4.7 2 6.6 2 6.6l-1.9.3zm5.4-.1h-2C3.5 5 5 3.5 6.8 3.5v2c-.7 0-1.3.6-1.3 1.3z"
                              fill={!!point?.online ? "#31a903" : "#a7a7aa"}/>
                    </Svg>
                    {
                        !!point?.online ? <Text>В сети</Text> : <Text>Не в сети</Text>
                    }
                </View>
            </View>
            <View>
                <View style={styles.infoPropRow}>
                    <Text>Power</Text>
                    <Text>{object?.vehicleSpecifications.enginePower} V</Text>
                </View>
                <View style={styles.infoPropRow}>
                    <Text>Engine</Text>
                    <Text>{!!object?.vehicleSpecifications.enginePower ? 'On' : 'Off'}</Text>
                </View>
                <View style={styles.infoPropRow}>
                    <Text>Mileage</Text>
                    <Text>{status?.stat[0].mileage} km</Text>
                </View>
                <View style={styles.infoPropRow}>
                    <Text>EngineHours</Text>
                    <Text>{status?.stat[0].motohours} h</Text>
                </View>
                <View style={styles.infoPropRow}>
                    <Text>Phone number</Text>
                    <Text>{object?.main.phone} V</Text>
                </View>
            </View>
            <View style={styles.sendBtnContainer}>
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                        },
                        styles.sendCommentButton,
                    ]}
                    onPress={() => navigation.navigate('ObjectSendCommand', {id: object.main.id})}
                >
                    <Text style={styles.commentText}>{'</>'}</Text>
                    <Text style={styles.commentText}>Отпр. команду</Text>
                </Pressable>
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                        },
                        styles.sendCommentButton,
                    ]}
                    onPress={() => navigation.navigate('ObjectTask', {id: object.main.id})}
                >
                    <Text style={styles.commentText}>{'</>'}</Text>
                    <Text style={styles.commentText}>Создать задачу</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default ObjectItemInfo;
