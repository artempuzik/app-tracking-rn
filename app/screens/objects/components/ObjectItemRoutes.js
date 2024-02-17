import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, Pressable, TextInput, ScrollView, Platform} from 'react-native';
import Svg, {Path} from "react-native-svg";
import {useNavigation, useRoute} from "@react-navigation/native";
import styles from '../styles';
import AppCalendarFilter from "../../../components/calendar/AppCalendarFilter";
import CustomButton from "../../../components/button/Button";
import i18n from "../../../utils/i18";
import {getObjectHistory} from "../../../store/objects/objectsActions";
import {useDispatch, useSelector} from "react-redux";
import {calculateDistance, convertDate, getDuration, parsePointString} from "../../../utils/helpers";
import {Image} from "expo-image";
import {LeafletView} from "react-native-leaflet-view";

const androidIcon = 'https://cdn-icons-png.flaticon.com/512/25/25613.png'

const startIcon = Platform.OS === 'android' ? androidIcon : `<img src="../../../../assets/start.svg" alt="start"/>`
const finishIcon = Platform.OS === 'android' ? androidIcon : `<img src="../../../../assets/finish.svg" alt="finish"/>`

const ObjectItemRoutes = ({object}) => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [isShowMap, setIsShowMap] = useState(false)

    const [minTimeDrive, setMinTimeDrive] = useState('')
    const [minTripDrive, setMinTripDrive] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [interval, setInterval] = useState({
        from: 0,
        till: 0,
    })

    const [idx, setIdx] = useState(null)

    const [history, setHistory] = useState([])

    const [routes, setRoutes] = useState([])

    const saveFilters = useCallback(() => {
        const timeFilter = minTimeDrive * 1000 * 60
        const tripFilter = minTripDrive * 1000
        const int = history?.track ?
            history?.track.intervals.filter( el => el.points)
            : []
        const result =  int.filter(i => {
            if(!timeFilter && !tripFilter) {
                return true
            }
            const timeResult = timeFilter ? (Number(i.till) - Number(i.from)) > timeFilter : true
            return tripFilter ? timeResult && Number(i.length) > +tripFilter : timeResult
        })
        setRoutes(result)
        setIsFiltersOpen(false)
    }, [history, minTimeDrive, minTripDrive])

    const resetFilters = useCallback(() => {
        setMinTimeDrive('')
        setMinTripDrive('')
    },[])

    const getHistory = useCallback(async () => {
        await dispatch(getObjectHistory({
            from: interval.from,
            till: interval.till,
            objectID: route.params.id,
        })).then(async (data) =>{
            if(data.response) {
                setHistory(data.response)
                const int = data.response.track.intervals.filter( el => el.points)
                setRoutes(int)
            }
        })
    }, [route.params.id, interval])

    const icons = useSelector(state => state.objects.icons)
    const baseUrl = useSelector(state => state.app.currentServer)
    const icon = useMemo(() => {
        return icons.find((ic) => ic.id === object?.main.iconId)
    }, [object, icons])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            await getHistory()
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(interval.from && interval.till) {
            fetchData().catch(() => {})
        }
    }, [interval])

    const total = useMemo(() => {
        const time = routes.reduce( (acc, p) => {
            acc += Number(p.till) - Number(p.from)
            return acc
        }, 0)
        return getDuration(0, time)
    }, [routes])

    const getIndex = (index) => {
        return index < 9 ? `0${index + 1}` : index +1
    }

    const totalMileage = useMemo(() => {
        let result = 0
        for (const point of routes) {
            result += calculateDistance(point)
        }
        return result.toFixed(2)
    }, [routes])

    const renderMapScreen = useMemo(() => {
            let coordinates = [];
            let markers = [];
            if (idx !== null) {
                const array = parsePointString(routes[idx]?.points);
                const first = array[0]
                const last = array[array.length - 1]
                markers = [
                    {
                        position: {
                            lat: first.lat,
                            lng: first.lng,
                        },
                        icon: startIcon,
                        size: [30, 30]
                    },
                    {
                        position: {
                            lat: last.lat,
                            lng: last.lng,
                        },
                        icon: finishIcon,
                        size: [30, 30]
                    }
                ]
                for(let i = 1; i < array.length - 1; i++) {
                    const prev = array[i -1]
                    const next = array[i]
                    coordinates.push({
                            shapeType: 'Polyline',
                            color: object.main.color,
                            id: i,
                            positions: [
                                { lat: prev.lat, lng: prev.lng },
                                { lat: next.lat, lng: next.lng },
                            ]
                        })
                }
            } else {
                const array = routes.map(rout => parsePointString(rout.points));
                const routeArray = array.flat();
                for(let i = 1; i < array.length - 1; i++) {
                    const first = array[i][0]
                    const last = array[i][array[i].length - 1]
                    markers.push({
                        position: {
                            lat: first.lat,
                            lng: first.lng,
                        },
                        icon: startIcon,
                        size: [30, 30]
                    })
                    markers.push({
                        position: {
                            lat: last.lat,
                            lng: last.lng,
                        },
                        icon: finishIcon,
                        size: [30, 30]
                    })
                }
                for(let i = 1; i < routeArray.length - 1; i++) {
                    const prev = routeArray[i -1]
                    const next = routeArray[i]
                    coordinates.push({
                        shapeType: 'Polyline',
                        color: object.main.color,
                        id: i,
                        positions: [
                            { lat: prev.lat, lng: prev.lng },
                            { lat: next.lat, lng: next.lng },
                        ]
                    })
                }
            }
        return (
            <View style={styles.container}>
                <LeafletView
                    doDebug={false}
                    mapShapes={coordinates}
                    mapMarkers={markers}
                    mapCenterPosition={coordinates[0]?.positions[0]}
                    zoom={13}
                />
            </View>
        )}, [idx, isShowMap, routes])

    const pageBlock = useMemo(() => (
        <View style={{flex: 1}}>
            <View style={styles.pageItemHeader}>
                <View style={styles.rightBlock}>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.headerItemButton,
                        ]}
                        onPress={
                        isShowMap   ?
                            () => {
                            setIsShowMap(false)
                            setIdx(null)
                            } :
                            () => navigation.goBack()}
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
                        <Image
                            style={styles.image}
                            height={icon?.height}
                            width={icon?.width}
                            source={baseUrl + icon?.url}
                            contentFit="fill"
                        />
                        <View style={styles.mainInfo}>
                            <Text style={{...styles.objectItemTitle, fontWeight: 'normal', fontSize: 12}}>{object?.main.name}</Text>
                            <Text style={{...styles.subText, fontSize: 12}}>{object?.main.comment}</Text>
                        </View>
                    </View>
                </View>
                {
                    !isShowMap ? (<View style={styles.rightBlock}>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.headerRightButton,
                        ]}
                        onPress={() => setIsFiltersOpen(true)}
                    >
                        <Svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                        >
                            <Path
                                d="M7.527 9.45c.21.23.325.527.325.836v9.095c0 .547.66.825 1.052.44l2.537-2.907c.34-.408.526-.61.526-1.013v-5.613c0-.308.118-.607.325-.835l7.28-7.9C20.118.962 19.698 0 18.892 0H.927a.926.926 0 0 0-.681 1.554l7.28 7.897z"
                                fill="#a7a7aa"/>
                        </Svg>
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.headerRightButton,
                        ]}
                        onPress={() => setIsCalendarOpen(true)}
                    >
                        <Svg
                            width={20}
                            height={20}
                            viewBox="0 0 19 14"
                        >
                            <Path
                                d="M5 0h4v4H5zm5 0h4v4h-4zm5 0h4v4h-4zM5 5h4v4H5zM0 5h4v4H0zm10 0h4v4h-4zm-5 5h4v4H5zm-5 0h4v4H0zm10 0h4v4h-4zm5-5h4v4h-4z"
                                fill="#2060ae"/>
                        </Svg>
                    </Pressable>
                </View>): null
                }
            </View>
                {
                    !isShowMap ? (
                        <ScrollView>
                            {
                                routes.map((h, index) => (
                                    <Pressable
                                        key={h.from + index}
                                        style={styles.parkingItem}
                                        onPress={() => {
                                            setIsShowMap(true)
                                            setIdx(index)
                                        }}
                                    >
                                        <View style={styles.parkingNumber}>
                                            <Text style={{color: '#fff', fontWeight: 'bold'}}>
                                                {getIndex(index)}
                                            </Text>
                                        </View>
                                        <View>
                                            <View style={styles.parkingRowBlock}>
                                                <View>
                                                    <Text style={{opacity: 0.6, fontWeight: 'bold'}}>
                                                        {i18n.t('from')}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text>
                                                        {convertDate(h.from)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.parkingRowBlock}>
                                                <View>
                                                    <Text style={{opacity: 0.6, fontWeight: 'bold'}}>
                                                        {i18n.t('to')}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text>
                                                        {convertDate(h.till)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.parkingRowBlock}>
                                                <View>
                                                    <Text style={{opacity: 0.6, fontWeight: 'bold'}}>
                                                        {i18n.t('duration')}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text>
                                                        {getDuration(h.from, h.till)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={[styles.parkingRowBlock, {backgroundColor: '#d3d1d1', padding: 5}]}>
                                                <View>
                                                    <Text style={{opacity: 0.6, fontWeight: 'bold'}}>
                                                        {i18n.t('mileage')}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text>
                                                        {Math.round(+h.length)/1000}
                                                        {` ${i18n.t('km')}`}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </Pressable>
                                ))
                            }
                        </ScrollView>
                    ) : renderMapScreen
                }
            <Pressable
                onPress={() => {
                    if(idx === null) {
                        setIsShowMap(prev => !prev)
                    }
                    setIdx(null)
                }}
                style={({pressed}) => [
                    {
                        backgroundColor: pressed ? 'rgba(32,96,174,0.41)' : '#2060ae',
                    },
                    styles.total,
                ]}
            >
                <Text style={{color: '#fff', fontWeight: 'bold'}}>{i18n.t('total')}:</Text>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>{total}</Text>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>{totalMileage}{` ${i18n.t('km')}`}</Text>
            </Pressable>
        </View>
    ), [routes, idx, isShowMap])

    const filtersBlock = useMemo(() => (
            <View style={{...styles.filtersContainer, display: isFiltersOpen ? 'flex' : 'none'}}>
                <View style={styles.screenTitle}>
                    <Text>Фильтры</Text>
                    <Pressable
                        style={styles.headerButton}
                        onPress={() => setIsFiltersOpen(false)}
                    >
                        <Svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                        >
                            <Path d="M12.6 14L8.4 9.8l1.4-1.4 4.2 4.2-1.4 1.4zM1.4 14L0 12.6 12.6 0 14 1.4 1.4 14zm2.8-8.4L0 1.4 1.4 0l4.2 4.2-1.4 1.4z"
                                  fill="#a7a7aa" />
                        </Svg>
                    </Pressable>
                </View>
                <View style={styles.filtersMainContainer}>
                    <View style={{paddingHorizontal: 20}}>
                        <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={setMinTimeDrive}
                                value={minTimeDrive}
                                autoCorrect={false}
                                autoCapitalize='none'
                                placeholder="Minimum drive / min"
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={setMinTripDrive}
                                value={minTripDrive}
                                autoCorrect={false}
                                autoCapitalize='none'
                                placeholder="Minimum drive / km"
                            />
                        </View>
                        <Pressable
                            style={({pressed}) => [
                                {
                                    backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                                },
                                styles.resetButton,
                            ]}
                            onPress={resetFilters}
                        >
                            <Text style={styles.resetButtonText}>{i18n.t('reset_filters')}</Text>
                        </Pressable>
                    </View>
                    <View style={{marginHorizontal: 20}}>
                        <CustomButton title={'Сохранить'} onPress={saveFilters} />
                    </View>
                </View>
            </View>
        ), [minTimeDrive, minTripDrive, isFiltersOpen])

    return (
        <View style={styles.container}>
            {filtersBlock}
            <AppCalendarFilter isCalendarOpen={isCalendarOpen} setIsCalendarOpen={setIsCalendarOpen} setCalendarProperties={setInterval}/>
            {
                !isFiltersOpen && !isCalendarOpen ? pageBlock : null
            }
        </View>
    );
};

export default ObjectItemRoutes;
