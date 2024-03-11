import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';
import Svg, {Path} from "react-native-svg";
import {useNavigation, useRoute} from "@react-navigation/native";
import i18n from "../../../utils/i18";
import styles from '../styles';
import {PRESSED_COLOR} from "../../../config";
import AppCalendarFilter from "../../../components/calendar/AppCalendarFilter";
import CustomButton from "../../../components/button/Button";
import {useDispatch, useSelector} from "react-redux";
import {getObjectHistory} from "../../../store/objects/objectsActions";
import {convertDate, getDuration, parsePointString} from "../../../utils/helpers";
import {Image} from "expo-image";
import {LeafletView} from "react-native-leaflet-view";
import Input from "../../../components/input/Input";

const parkingIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 3C0 1.34315 1.34315 0 3 0H21C22.6569 0 24 1.34315 24 3V21C24 22.6569 22.6569 24 21 24H3C1.34315 24 0 22.6569 0 21V3Z" fill="black"/>
<path d="M7 18V5H12.9148C13.9319 5 14.8218 5.19043 15.5846 5.57129C16.3473 5.95215 16.9406 6.48747 17.3644 7.17725C17.7881 7.86702 18 8.67318 18 9.5957C18 10.5267 17.7814 11.3328 17.3443 12.0142C16.9116 12.6955 16.3027 13.2202 15.5176 13.5884C14.737 13.9565 13.8248 14.1406 12.781 14.1406H9.24818V11.3984H12.0316C12.4688 11.3984 12.8412 11.3265 13.149 11.1826C13.4613 11.0345 13.6999 10.825 13.865 10.5542C14.0345 10.2834 14.1192 9.96387 14.1192 9.5957C14.1192 9.22331 14.0345 8.90592 13.865 8.64355C13.6999 8.37695 13.4613 8.17383 13.149 8.03418C12.8412 7.8903 12.4688 7.81836 12.0316 7.81836H10.7202V18H7Z" fill="white"/>
</svg>`

const initialFilters = {
    minParking: '',
    showParkingOptions: null,
}
const ObjectItemParking = ({object, interval, setInterval}) => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isShowMap, setIsShowMap] = useState(false)

    const [history, setHistory] = useState([])
    const [minParking, setMinParking] = useState(initialFilters.minParking)

    const [showParkingOptions, setShowParkingOptions] = useState(initialFilters.showParkingOptions);
    const [idx, setIdx] = useState(null)
    const icons = useSelector(state => state.objects.icons)
    const baseUrl = useSelector(state => state.app.currentServer)
    const icon = useMemo(() => {
        return icons.find((ic) => ic.id === object?.main.iconId)
    }, [object, icons])

    const getHistory = useCallback(async () => {
        await dispatch(getObjectHistory({
            from: interval.from,
            till: interval.till,
            objectID: route.params.id,
        })).then(async (data) =>{
            if(data.response) {
                setHistory(data.response)
            }
        })
    }, [route.params.id, interval])

    const parkings = useMemo(() => {
        const minTimeFilter = minParking * 1000 * 60
        const int = history?.track ?
            history?.track.intervals.filter( el => el.point)
            : []
        return int.filter(i => {
            if(!minTimeFilter) {
                return true
            }
            return (Number(i.till) - Number(i.from)) > minTimeFilter ? true : false
        })
    }, [history, minParking])

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

    const saveFilters = useCallback(() => {
        setIsFiltersOpen(false)
    }, [minParking])

    const resetFilters = useCallback(() => {
        setMinParking('')
    },[])

    const total = useMemo(() => {
        const time = parkings.reduce( (acc, p) => {
            acc += Number(p.till) - Number(p.from)
            return acc
        }, 0)
        return getDuration(0, time)
    }, [parkings])

    const markers = useMemo(() => {
        if (idx === null) {
            const array = parkings.map(p => parsePointString(p?.point)).flat()
            return array.map( el => ({
                position: {
                    lat: el.lat,
                    lng: el.lng,
                },
                icon: parkingIcon,
                size: [30, 30]
            }))
        } else {
            const array = parsePointString(parkings[idx]?.point)
            return array.map( el => ({
                position: {
                    lat: el.lat,
                    lng: el.lng,
                },
                icon: parkingIcon,
                size: [30, 30]
            }))
        }
    }, [parkings, idx, isShowMap])

    const renderMapScreen = useMemo(() => {
        if(!markers) return
        return (
            <View style={styles.container}>
                <LeafletView
                    doDebug={false}
                    mapMarkers={markers}
                    mapCenterPosition={markers[0]?.position}
                />
            </View>
        )}, [markers, idx, isShowMap])

    const getIndex = (index) => {
        return index < 9 ? `0${index + 1}` : index +1
    }

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
                    !isShowMap ? (
                        <View style={styles.rightBlock}>
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
                                    <Path d="M7.527 9.45c.21.23.325.527.325.836v9.095c0 .547.66.825 1.052.44l2.537-2.907c.34-.408.526-.61.526-1.013v-5.613c0-.308.118-.607.325-.835l7.28-7.9C20.118.962 19.698 0 18.892 0H.927a.926.926 0 0 0-.681 1.554l7.28 7.897z"
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
                                    <Path d="M5 0h4v4H5zm5 0h4v4h-4zm5 0h4v4h-4zM5 5h4v4H5zM0 5h4v4H0zm10 0h4v4h-4zm-5 5h4v4H5zm-5 0h4v4H0zm10 0h4v4h-4zm5-5h4v4h-4z"
                                          fill="#2060ae"/>
                                </Svg>
                            </Pressable>
                        </View>
                    ) : null
                }
            </View>
            {
                !isShowMap ?
                    (
                        <ScrollView>
                            {
                                parkings.map((h, index) => (
                                    <Pressable
                                        key={h.from + index}
                                        style={({pressed}) => [
                                            {
                                                backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                                            },
                                            styles.parkingItem,
                                        ]}
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
                                            <View style={[styles.parkingRowBlock, {backgroundColor: '#d3d1d1', padding: 5}]}>
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
            </Pressable>
        </View>
    ), [parkings, interval, history, idx, isShowMap])

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
                        <Input
                            onChangeText={setMinParking}
                            value={minParking}
                            autoCorrect={false}
                            multiline={true}
                            placeholder={i18n.t('min_parking_min')}
                        />
                    {/*<View style={styles.radioButtonsContainer}>*/}
                    {/*    <RadioForm*/}
                    {/*        style={styles.radioButtons}*/}
                    {/*        radio_props={PARKING_OPTIONS}*/}
                    {/*        onPress={(value) => {*/}
                    {/*            setShowParkingOptions(value);*/}
                    {/*        }}*/}
                    {/*        formHorizontal={false}*/}
                    {/*        labelHorizontal={true}*/}
                    {/*        initial={showParkingOptions}*/}
                    {/*        selectedButtonColor={showParkingOptions !== null ? '#f8642f' : '#a7a7aa'}*/}
                    {/*        buttonColor={'#a7a7aa'}*/}
                    {/*        buttonSize={15}*/}
                    {/*        animation={true}*/}
                    {/*    />*/}
                    {/*</View>*/}
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
                <View style={{marginHorizontal: 20, marginBottom: 20}}>
                    <CustomButton title={i18n.t('save')} onPress={saveFilters} />
                </View>
            </View>
        </View>
    ), [minParking, showParkingOptions, isFiltersOpen])

    return (
        <View style={[styles.container]}>
            {filtersBlock}
            <AppCalendarFilter interval={interval} isCalendarOpen={isCalendarOpen} setIsCalendarOpen={setIsCalendarOpen} setCalendarProperties={setInterval}/>
            {
                !isFiltersOpen && !isCalendarOpen ? pageBlock : null
            }
        </View>
    );
};

export default ObjectItemParking;
