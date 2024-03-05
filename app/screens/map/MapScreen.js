import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, ActivityIndicator, Pressable, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import {LeafletView} from 'react-native-leaflet-view';
import {Image} from "expo-image";
import styles from './styles';
import AppHeader from "../../components/header/AppHeader";
import {useDispatch, useSelector} from "react-redux";
import {getGeozones, getObjects, getObjectsStatuses} from "../../store/objects/objectsActions";
import SearchInput from "../../components/search/SearchInput";
import Svg, {Circle, Path} from "react-native-svg";
import i18n from "../../utils/i18";
import {convertDate, getItemIoPointsByItemId, getItemPointByItemId} from "../../utils/helpers";
import {PRESSED_COLOR} from "../../config";

//const FOREGROUND_LOCATION_ACCURACY = Location.Accuracy.BestForNavigation;

const meIcon = 'https://cdn-icons-png.flaticon.com/512/25/25613.png'
const ObjectsMapScreen = ({navigation}) => {
    const dispatch = useDispatch()
    const refreshInterval = useSelector(state => state.user.refreshInterval)
    const [location, setLocation] = useState(null);

    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null);

    const map = useRef(null)

    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
    const [isTitleOpen, setIsTitleOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [isGeozoneOpen, setIsGeozoneOpen] = useState(false)
    const [current, setCurrent] = useState(null)

    const [statuses, setStatuses] = useState(null)
    const [objects, setObjects] = useState([]);

    const interval = useRef(null)

    const baseUrl = useSelector(state => state.app.currentServer)
    const icons = useSelector(state => state.objects.icons)

    const [geoZones, setGeoZones] = useState(null)

    const subscribeLocation = useCallback(async () => {
        // await Location.watchPositionAsync(
        //     {
        //         accuracy: FOREGROUND_LOCATION_ACCURACY,
        //         distanceInterval: 0,
        //         timeInterval: 10000,
        //     },
        //     (_location) => {
        //         console.log('got foreground location subscription update');
        //     },
        // );
    }, [])

    const getObjectGeozones = async () => {
        try {
            await dispatch(getGeozones()).then((data) =>{
                if(data.response) {
                    setGeoZones(data.response)
                }
            })
        } finally {
        }
    }

    const getObjectStatuses = useCallback(async () => {
        try {
            await dispatch(getObjectsStatuses()).then(async (data) => {
                if(data.response) {
                    setStatuses(data.response)
                }
                if(data.error) {
                    setErrorMsg(data.error)
                }
            })
        } finally {
        }
    }, [])

    const getObjectsData = useCallback(async () => {
        await dispatch(getObjects()).then(async (data) =>{
            if(data.response) {
                setObjects(data.response)
            }
        })
    }, [])

    const searchList = useMemo(() => {
        return objects.filter(object => object.main.name.toLowerCase().includes(query.toLowerCase()))
    }, [query]);

    const fetchData = async () => {
        try {
            setIsLoading(true)
            await getObjectsData()
            await getObjectStatuses()
            await getObjectGeozones()
        } finally {
            setIsLoading(false)
        }
    }

    const getLocation = useCallback(async () => {
            setIsLoading(true)
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setIsLoading(false)
    }, []);

    useEffect(() => {
        fetchData().then(() => getLocation()).catch(() => {})
    }, []);

    useEffect(() => {
        if(!query) {
            setCurrent(0)
        }
    }, [query]);

    useEffect(() => {
        if(current === 0) {
            return () => {
                clearInterval(interval.current)
                interval.current = null
            }
        }
        interval.current = setInterval(async () => await getObjectStatuses(), refreshInterval)
        return () => {
            clearInterval(interval.current)
            interval.current = null
        }
    }, [current])

    const markers = useMemo(() => {
        if(!statuses || !objects || !icons) {
            return []
        }
        const mrks = statuses?.points?.map((point, idx) => {
            const obj = objects.find(o => o.main.id == point.trackerid)
            const icon = icons.find((ic) => ic.id == obj?.main.iconId)
            if (!icon || !point) {
                return {}
            }
            const url = baseUrl + icon.url

            return {
                id: obj.main.id,
                position: {
                    lat: point.lat,
                    lng: point.lng,
                },
                icon: url,
                size: [icon.width, icon.height]
            }
        })

        if (location) {
           if(current === null) {
               setCurrent(0)
           }
           mrks.push({
               id: 0,
               position: {
                   lat: location.coords.latitude,
                   lng: location.coords.longitude,
               },
               icon: meIcon,
               size: [30, 30]
           })
        } else {
            if(current === null && idx === 0) {
                setCurrent(obj.main.id)
            }
        }
        return mrks
    }, [statuses, objects, icons, location, current])

    const shapes = useMemo(() => {
        if(!geoZones || !isGeozoneOpen) {
            return []
        }
        return geoZones.map(zone => {
            const mapPoints = []
            zone?.points.split(' ').forEach(point => {
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

            switch (zone?.style.type) {
                case 'point':
                    return {
                        shapeType: 'Circle',
                        color: zone.style.strokeColor,
                        id: zone.id,
                        center: mapPoints[0],
                        radius: zone.radius,
                        positions: mapPoints,
                    }
                case 'polygon':
                    return {
                        shapeType: 'Polygon',
                        color: zone.style.strokeColor,
                        id: zone.id,
                        positions: mapPoints,
                    }
                case 'polyline':
                    return {
                        shapeType: 'Polyline',
                        color: zone.style.strokeColor,
                        id: zone.id,
                        positions: mapPoints,
                    }
                default: return null
            }
        })
    }, [geoZones, isGeozoneOpen]);

    const markerTitle = useMemo(() => {
        if(current === null || !map.current || !statuses || !objects || !icons) {
            return null
        }
        if(0 === current) {
            return
        }
        const item = objects.find(obj => obj?.main.id === current)

        const icon = icons.find(i => i.id == item?.main?.iconId)

        const point = getItemPointByItemId(statuses, item)

        const iopoint = getItemIoPointsByItemId(statuses, item)

        return (
            <Pressable
                style={({pressed}) => [
                    {
                        backgroundColor: pressed ? PRESSED_COLOR : 'white',
                    },
                    {
                        position: 'absolute',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        width: '90%',
                        top: (map.current?.height + map.current?.y - 200)/2,
                        left: '5%',
                        zIndex: 10,
                    }
                ]}
                onPress={() => navigation.navigate('ObjectItem', {id: item.main.id})}
            >
                <View style={styles.main}>
                    <Image
                            style={styles.image}
                            height={icon?.height}
                            width={icon?.width}
                            source={baseUrl + icon?.url}
                            contentFit="fill"
                    />
                    <View style={styles.mainInfo}>
                        <Text style={styles.objectItemTitle}>{item.main.name}</Text>
                        <Text style={styles.subText}>{convertDate(point?.time)}</Text>
                    </View>
                </View>
                <View style={styles.footer}>
                    <View style={styles.footerElement}>
                        <Svg
                            style={{marginTop: 5}}
                            width={25}
                            height={25}
                            viewBox="0 0 25 25"
                        >
                            <Path d="M12.336 0C9.204 0 7.2 2.868 7.2 6c0 .672-.396.996-.204 1.668L0 14.664V18h3.6v-2.4H6v-1.2l1.332-.396 3-3c.6.204.936-.204 1.668-.204 3.132 0 6-2.004 6-5.136A5.664 5.664 0 0 0 12.336 0zm.164 7.8a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8z"
                                  fill={!!Number(iopoint?.value) ? "#2060ae" : "#a7a7aa"}/>
                        </Svg>
                        <Text>{!!Number(iopoint?.value) ? i18n.t('on') : i18n.t('off')}</Text>
                    </View>
                    <View style={styles.footerElement}>
                        {
                            !Boolean(+point?.speed) && !Number(iopoint?.value) ? (
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
                        <Text>{Number(point?.speed).toFixed(1)} {i18n.t('speed_text')}</Text>
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
                            !!point?.online ? <Text>{i18n.t('online')}</Text> : <Text>{i18n.t('offline')}</Text>
                        }
                    </View>
                </View>
                <View style={[{
                    top: 20,
                    width: 0,
                    height: 0,
                    backgroundColor: 'transparent',
                    borderStyle: 'solid',
                    borderLeftWidth: 20,
                    borderRightWidth: 20,
                    borderBottomWidth: 20,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: 'white',
                    transform: [{ rotate: '180deg' }]
                }]} />
            </Pressable>
        )

    }, [current, map, statuses, objects, icons])

    const selectSearchItem = useCallback((item) => {
        setCurrent(item.main.id)
        setQuery(item.main.name)
        setIsSearchModalOpen(false)
    }, [])

    const centerPosition = useMemo(() => {
        if(!markers) {
            return null
        }
        return current !== null ? markers.find(m => m.id === current) : markers[0]
    }, [current, markers]);

    const goToMe = useCallback(() => {
        setCurrent(null)
        setTimeout(() => setCurrent(0))
    }, [centerPosition])

    const markerClickHandler = useCallback((message) => {
        const {payload, event} = message;
        if(!payload) {
            return
        }
        if(event === 'onMapMarkerClicked') {
            setIsTitleOpen(true)
            const id = payload.mapMarkerID
            if(typeof id === 'number') {
                setCurrent(id)
                if(id !== 0) {
                    const obj = objects.find(o => o.main.id == id)
                    setQuery(obj.main.name)
                }
            }
        } else {
            setIsTitleOpen(false)
        }
    }, [markers, isTitleOpen])

    const renderMap = useMemo(() => (
            <View
                onLayout={(event) => {
                    map.current = event.nativeEvent.layout;
                }}
                style={styles.container}>
                {
                    location &&  (
                        <View style={styles.locationPoint}>
                            <Pressable
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                                    },
                                ]}
                                onPress={subscribeLocation}
                            >
                                {
                                    current ? (
                                        <Svg
                                            width={30}
                                            height={30}
                                            viewBox="0 0 16 16"
                                        >
                                            <Path
                                                d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM9 8.466V7H7.5A1.5 1.5 0 0 0 6 8.5V11H5V8.5A2.5 2.5 0 0 1 7.5 6H9V4.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L9.41 8.658A.25.25 0 0 1 9 8.466"
                                                fill="#2060ae"/>
                                        </Svg>
                                    ) : null
                                }
                            </Pressable>
                            <Pressable
                                style={({pressed}) => [
                                    {
                                        backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                                    },
                                ]}
                                onPress={goToMe}
                            >
                                <Svg
                                    width={30}
                                    height={30}
                                    viewBox="0 0 16 16"
                                >
                                    <Path
                                        d="M8.5.5a.5.5 0 0 0-1 0v.518A7 7 0 0 0 1.018 7.5H.5a.5.5 0 0 0 0 1h.518A7 7 0 0 0 7.5 14.982v.518a.5.5 0 0 0 1 0v-.518A7 7 0 0 0 14.982 8.5h.518a.5.5 0 0 0 0-1h-.518A7 7 0 0 0 8.5 1.018zm-6.48 7A6 6 0 0 1 7.5 2.02v.48a.5.5 0 0 0 1 0v-.48a6 6 0 0 1 5.48 5.48h-.48a.5.5 0 0 0 0 1h.48a6 6 0 0 1-5.48 5.48v-.48a.5.5 0 0 0-1 0v.48A6 6 0 0 1 2.02 8.5h.48a.5.5 0 0 0 0-1zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
                                        fill="#a7a7aa"/>
                                </Svg>
                            </Pressable>
                        </View>
                    )
                }
                {
                    isSearchModalOpen ? (
                        <Pressable onPress={() => setIsSearchModalOpen(false)} style={styles.modalWrapper}>
                            <ScrollView style={styles.searchModal}>
                                {
                                    searchList.map(item => (
                                        <Pressable
                                            style={({pressed}) => [
                                                {
                                                    backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                                                },
                                                styles.searchElement,
                                            ]}
                                            onPress={() => selectSearchItem(item)}
                                            key={item.main.id}
                                        >
                                            <Text>{item.main.name}</Text>
                                        </Pressable>
                                    ))
                                }
                            </ScrollView>
                        </Pressable>
                    ) : null
                }
                <LeafletView
                    doDebug={false}
                    mapMarkers={markers}
                    mapShapes={shapes}
                    onMessageReceived={markerClickHandler}
                    mapCenterPosition={centerPosition?.position}
                    androidHardwareAccelerationDisabled={false}
                />
            </View>
    ), [markers, current, location, centerPosition, isSearchModalOpen, searchList, shapes, query]);

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            <View style={styles.pageHeader}>
                    <SearchInput
                        onChange={setQuery}
                        onFocus={() => setIsSearchModalOpen(true)}
                    />
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : '#d8d8d9',
                        },
                        styles.headerButton,
                    ]}
                    onPress={() => setIsGeozoneOpen(prev => !prev)}
                >
                    <Svg
                        width={27}
                        height={27}
                        viewBox="0 0 20 20"
                    >
                        <Circle cx="2" cy="16" r="2"
                                fill={isGeozoneOpen ? "#2060ae" : "#a7a7aa"}/>
                        <Circle cx="16" cy="2" r="2"
                                fill={isGeozoneOpen ? "#2060ae" : "#a7a7aa"}/>
                        <Circle cx="2" cy="2" r="2"
                                fill={isGeozoneOpen ? "#2060ae" : "#a7a7aa"}/>
                        <Path fillRule="evenodd" d="M3 3h12v3h2V1H1v16h7v-2H3V3z" clipRule="evenodd"
                              fill={isGeozoneOpen ? "#2060ae" : "#a7a7aa"}/>
                        <Path d="M16.873 18l-.675-2.37h-3.396L12.127 18H10l3.287-10H15.7L19 18h-2.127zm-1.147-4.142c-.624-2.148-.977-3.363-1.057-3.644a12.167 12.167 0 0 1-.166-.668c-.14.582-.541 2.019-1.204 4.312h2.427z"
                              fill={isGeozoneOpen ? "#2060ae" : "#a7a7aa"}/>
                    </Svg>
                </Pressable>
            </View>
            {isTitleOpen && markerTitle}
            {errorMsg && <Text>{errorMsg}</Text>}
            {isLoading ? <ActivityIndicator style={{marginTop: 50}} size="large" color="#2060ae" /> : renderMap}
        </SafeAreaView>
    );
};

export default ObjectsMapScreen;
