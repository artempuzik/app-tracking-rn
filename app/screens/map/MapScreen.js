import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, ActivityIndicator, Pressable, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import {LeafletView} from 'react-native-leaflet-view';
import {Image} from "expo-image";
import styles from './styles';
import AppHeader from "../../components/header/AppHeader";
import {useDispatch, useSelector} from "react-redux";
import {getObjectIcons, getObjects, getObjectsStatuses} from "../../store/objects/objectsActions";
import SearchInput from "../../components/search/SearchInput";
import Svg, {Circle, Path} from "react-native-svg";
import i18n from "../../utils/i18";
import {convertDate, getItemIoPointsByItemId, getItemPointByItemId} from "../../utils/helpers";
import Modal from "react-native-modal";
import {PRESSED_COLOR} from "../../config";

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

    const [statuses, setStatuses] = useState([])
    const [icons, setIcons] = useState([]);
    const [objects, setObjects] = useState([]);

    const interval = useRef(null)

    const baseUrl = useSelector(state => state.app.currentServer)

    const getObjectStatuses = useCallback(async () => {
        await dispatch(getObjectsStatuses()).then(async (data) => {
            if(data.response) {
                setStatuses(data.response)
                await dispatch(getObjectIcons()).then((data) => {
                    if(data.response) {
                        setIcons(data.response)
                    }
                })
            }
            if(data.error) {
                setErrorMsg(data.error)
            }
        })
    }, [])

    const getObjectsData = useCallback(async () => {
        await dispatch(getObjects()).then(async (data) =>{
            if(data.response) {
                setObjects(data.response)
                await dispatch(getObjectIcons()).then((data) => {
                    if(data.response) {
                        setIcons(data.response)
                    }
                })
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
        } finally {
            setIsLoading(false)
        }
    }

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

    useEffect(() => {
        fetchData().catch(() => {})
    }, []);

    useEffect(() => {
        interval.current = setInterval(async () => await getObjectStatuses(), refreshInterval)
        return () => {
            console.log('CLOSE MAP SCREEN')
            clearInterval(interval.current)
            interval.current = null
        }
    }, [])

    const markers = useMemo(() => {
        if(!statuses || !objects || !icons) {
            return []
        }
        return statuses?.points?.map((point, idx) => {
            const obj = objects.find(o => o.main.id == point.trackerid)
            const icon = icons.find((ic) => ic.id == obj?.main.iconId)
            if (!icon || !point) {
                return {}
            }
            const url = baseUrl + icon.url
            if(idx === 0) {
                setCurrent(obj.main.id)
            }
            return {
                id: obj.main.id,
                position: {
                    lat: point.lat,
                    lng: point.lng,
                },
                animation: {
                    type: 'spin',
                    duration: icon.rotate ? 5 : 10000,
                    direction: 'reverse',
                    iterationCount: 100,
                },
                icon: url,
                size: [icon.width, icon.height]
            }
        })
    }, [statuses, objects, icons])

    const markerTitle = useMemo(() => {
        if(current === null || !map.current || !statuses || !objects || !icons) {
            return null
        }
        if(location?.timestamp === current) {
            return
        }
        const item = objects.find(obj => obj?.main.id === current)

        const icon = icons.find(i => i.id == item.main.iconId)

        const point = getItemPointByItemId(statuses, item)

        const iopoint = getItemIoPointsByItemId(statuses, item)

        return (
            <View
            style={{
                position: 'absolute',
                alignItems: 'center',
                backgroundColor: 'white',
                paddingHorizontal: 10,
                width: '90%',
                top: (map.current?.height + map.current?.y - 200)/2,
                left: '5%',
                zIndex: 10,
            }}
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
            </View>
        )

    }, [current, map, statuses, objects, icons])

    const selectSearchItem = useCallback((item) => {
        setCurrent(item.main.id)
        setIsSearchModalOpen(false)
    }, [])

    const centerPosition = useMemo(() => {
        if(location?.timestamp === current) {
            return {
                position: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                }
            }
        }
        if(!markers) {
            return null
        }
        return current ? markers.find(m => m.id === current) : markers[0]
    }, [current, markers, location]);

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
            }
        } else {
            setIsTitleOpen(false)
        }
    }, [markers, isTitleOpen])

    const renderMap = useMemo(() => (
        isLoading ? <ActivityIndicator style={{marginTop: 50}} size="large" color="#2060ae" /> : (
            <View
                onLayout={(event) => {
                    map.current = event.nativeEvent.layout;
                }}
                style={styles.container}>
                {
                    location &&  <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                        },
                        styles.locationPoint,
                    ]}
                    onPress={() => {
                        setCurrent(location.timestamp)
                    }}
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
                </Pressable>}
                {markers && (
                    <LeafletView
                        doDebug={false}
                        mapMarkers={markers}
                        onMessageReceived={markerClickHandler}
                        // mapShapes={[
                        //     {
                        //         shapeType: 'Polyline',
                        //         color: "blue",
                        //         id: "3",
                        //         positions: [
                        //             { lat: 38.80118939192329, lng: -74.69604492187501 },
                        //             { lat: 38.19502155795575, lng: -74.65209960937501 },
                        //         ]
                        //     },
                        // ]}
                        // mapShapes={[
                        //     {
                        //         shapeType: 'Circle',
                        //         color: "#123123",
                        //         id: "1",
                        //         center: { lat: 34.225727, lng: -77.94471 },
                        //         radius: 2000
                        //     },
                        //     {
                        //         shapeType: 'CircleMarker',
                        //         color: "red",
                        //         id: "2",
                        //         center: { lat: 38.437424, lng: -78.867912 },
                        //         radius: 15
                        //     },
                        //     {
                        //         shapeType: 'Polygon',
                        //         color: "blue",
                        //         id: "3",
                        //         positions: [
                        //             { lat: 38.80118939192329, lng: -74.69604492187501 },
                        //             { lat: 38.19502155795575, lng: -74.65209960937501 },
                        //             { lat: 39.07890809706475, lng: -71.46606445312501 }
                        //         ]
                        //     },
                        //     {
                        //         shapeType: 'Polygon',
                        //         color: "violet",
                        //         id: "4",
                        //         positions: [
                        //             [
                        //                 { lat: 37.13842453422676, lng: -74.28955078125001 },
                        //                 { lat: 36.4433803110554, lng: -74.26208496093751 },
                        //                 { lat: 36.43896124085948, lng: -73.00964355468751 },
                        //                 { lat: 36.43896124085948, lng: -73.00964355468751 }
                        //             ],
                        //             [
                        //                 { lat: 37.505368263398104, lng: -72.38891601562501 },
                        //                 { lat: 37.309014074275915, lng: -71.96594238281251 },
                        //                 { lat: 36.69044623523481, lng: -71.87805175781251 },
                        //                 { lat: 36.58024660149866, lng: -72.75146484375001 },
                        //                 { lat: 37.36579146999664, lng: -72.88330078125001 }
                        //             ]
                        //         ]
                        //     },
                        //     {
                        //         shapeType: 'Polygon',
                        //         color: "orange",
                        //         id: "5",
                        //         positions: [
                        //             { lat: 35.411438052435486, lng: -78.67858886718751 },
                        //             { lat: 35.9602229692967, lng: -79.18945312500001 },
                        //             { lat: 35.97356075349624, lng: -78.30505371093751 }
                        //         ]
                        //     },
                        //     {
                        //         shapeType: 'Polygon',
                        //         color: "purple",
                        //         id: "5a",
                        //         positions: [
                        //             [
                        //                 { lat: 36.36822190085111, lng: -79.26086425781251 },
                        //                 { lat: 36.659606226479696, lng: -79.28833007812501 },
                        //                 { lat: 36.721273880045004, lng: -79.81018066406251 }
                        //             ],
                        //             [
                        //                 { lat: 35.43381992014202, lng: -79.79370117187501 },
                        //                 { lat: 35.44277092585766, lng: -81.23840332031251 },
                        //                 { lat: 35.007502842952896, lng: -80.837402343750017 }
                        //             ]
                        //         ]
                        //     },
                        //     {
                        //         shapeType: 'Rectangle',
                        //         color: "yellow",
                        //         id: "6",
                        //         bounds: [
                        //             { lat: 36.5, lng: -75.7 },
                        //             { lat: 38.01, lng: -73.13 }
                        //         ]
                        //     }
                        // ]}
                        mapCenterPosition={centerPosition?.position}
                    />
                )}
            </View>
        )
    ), [markers, current, location, centerPosition, isLoading]);

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            <View style={styles.pageHeader}>
                <SearchInput onChange={setQuery} onFocus={() => setIsSearchModalOpen(true)}/>
                    <Modal
                        style={[styles.modalWrapper, {marginTop: map.current?.y}]}
                        transparent={true}
                        visible={!!searchList.length && isSearchModalOpen}
                        onBackdropPress={() => isSearchModalOpen && setIsSearchModalOpen(false)}
                    >
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
                    </Modal>
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : '#d8d8d9',
                        },
                        styles.headerButton,
                    ]}
                    onPress={() => setIsGeozoneOpen(true)}
                >
                    <Svg
                        width={27}
                        height={27}
                        viewBox="0 0 20 20"
                    >
                        <Circle cx="2" cy="16" r="2"  fill="#a7a7aa"/>
                        <Circle cx="16" cy="2" r="2"  fill="#a7a7aa"/>
                        <Circle cx="2" cy="2" r="2"  fill="#a7a7aa"/>
                        <Path fill-rule="evenodd" d="M3 3h12v3h2V1H1v16h7v-2H3V3z" clip-rule="evenodd"  fill="#a7a7aa"/>
                        <Path d="M16.873 18l-.675-2.37h-3.396L12.127 18H10l3.287-10H15.7L19 18h-2.127zm-1.147-4.142c-.624-2.148-.977-3.363-1.057-3.644a12.167 12.167 0 0 1-.166-.668c-.14.582-.541 2.019-1.204 4.312h2.427z"  fill="#a7a7aa"/>
                    </Svg>
                </Pressable>
            </View>
            {isTitleOpen && markerTitle}
            {errorMsg && <Text>{errorMsg}</Text>}
            {renderMap}
        </SafeAreaView>
    );
};

export default ObjectsMapScreen;
