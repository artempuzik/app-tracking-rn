import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, Pressable, TextInput, ScrollView} from 'react-native';
import Svg, {Path} from "react-native-svg";
import {useNavigation, useRoute} from "@react-navigation/native";
import i18n from "../../../utils/i18";
import styles from '../styles';
import RadioForm from "react-native-simple-radio-button";
import {PARKING_OPTIONS} from "../../../config";
import AppCalendarFilter from "../../../components/calendar/AppCalendarFilter";
import CustomButton from "../../../components/button/Button";
import {useDispatch, useSelector} from "react-redux";
import {getObjectHistory} from "../../../store/objects/objectsActions";
import {getDuration} from "../../../utils/helpers";
import {Image} from "expo-image";

const initialFilters = {
    minParking: '',
    showParkingOptions: null,
}
const ObjectItemParking = ({object}) => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [interval, setInterval] = useState({
        from: 0,
        till: 0,
    })

    const [history, setHistory] = useState([])
    const [minParking, setMinParking] = useState(initialFilters.minParking)

    const [showParkingOptions, setShowParkingOptions] = useState(initialFilters.showParkingOptions);

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
        const int = history?.trends ? history.trends.map(t => t.intervals).flat() : []
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
        fetchData().catch(() => {})
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
            </View>
                <ScrollView>
                    {
                        parkings.map((h, index) => (
                            <View
                                key={h.from + index}
                                style={styles.parkingItem}
                            >
                                <View style={styles.parkingNumber}>
                                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
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
                                                {new Date(+h.from).toLocaleString()}
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
                                                {new Date(+h.till).toLocaleString()}
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
                            </View>
                        ))
                    }
                </ScrollView>
            <View style={styles.total}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>{i18n.t('total')}:</Text>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>{total}</Text>
            </View>
        </View>
    ), [parkings, interval, history])

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
                            onChangeText={setMinParking}
                            value={minParking}
                            autoCorrect={false}
                            autoCapitalize='none'
                            placeholder="Minimum drive / km"
                        />
                    </View>
                    <View style={styles.radioButtonsContainer}>
                        <RadioForm
                            style={styles.radioButtons}
                            radio_props={PARKING_OPTIONS}
                            onPress={(value) => {
                                setShowParkingOptions(value);
                            }}
                            formHorizontal={false}
                            labelHorizontal={true}
                            initial={showParkingOptions}
                            selectedButtonColor={showParkingOptions !== null ? '#f8642f' : '#a7a7aa'}
                            buttonColor={'#a7a7aa'}
                            buttonSize={15}
                            animation={true}
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
    ), [minParking, showParkingOptions, isFiltersOpen])

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

export default ObjectItemParking;
