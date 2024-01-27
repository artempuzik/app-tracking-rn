import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Pressable, Text, ScrollView, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RadioForm from 'react-native-simple-radio-button';
import styles from './styles';
import SearchInput from "../../components/search/SearchInput";
import Svg, {Path} from "react-native-svg";
import {MOVE_OPTIONS, PRESSED_COLOR, STATUS_OPTIONS, WITH_IGNITION_OPTIONS} from "../../config";
import {useDispatch, useSelector} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import SelectList from "../../components/select/SelectList";
import {getObjectIcons, getObjects, getObjectsStatuses, getTransactions} from "../../store/objects/objectsActions";
import CustomButton from "../../components/button/Button";
import AppCalendarFilter from "../../components/calendar/AppCalendarFilter";
import {getDriverSessionById} from "../../store/drivers/driversActions";
import GasItemElement from "./components/GasItemElement";

const initialFilters = {
    selectedStation: null
}

const GasScreen = ({navigation}) => {
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)

    const [query, setQuery] = useState('')

    const [transactions, setTransactions] = useState([])

    const [interval, setInterval] = useState({
        from: 0,
        till: 0,
    })

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const [error, setError] = useState('')

    const [selectedStation, setSelectedStation] = useState(initialFilters.selectedStation)

    const filteredArray = useMemo(() => {
        if(!transactions.length) {
            return []
        }
        const withStationFilter = selectedStation ? transactions.filter(t => t.objectID === selectedStation) : transactions
        return withStationFilter.filter(el => JSON.stringify(el).includes(query))
    }, [transactions, query])

    const formatStation = useMemo(() => {
        if(!transactions.length) {
            return []
        }
        return transactions.map(item => ({
            [item.objectID]: item.objectName
        }))
    }, [transactions])

    const saveFilters = useCallback(() => {
        setIsFiltersOpen(false)
    }, [])

    const resetFilters = useCallback(() => {
        setSelectedStation(initialFilters.selectedStation)
    },[])

    const fetchData = async () => {
        try {
            setError('')
            setIsLoading(true)
            await dispatch(getTransactions({
                from: interval.from,
                till: interval.till,
                driverID: 0,
            })).then((data) => {
                if(data.response) {
                    setTransactions(data.response)
                }
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(interval.from && interval.till) {
            fetchData().catch(() => {})
        }
    }, [interval.from, interval.till])

    const selectElement = useMemo(() => (
        <View style={{...styles.selectContainer, paddingHorizontal: 20}}>
            <SelectList
                items={formatStation} onChange={setSelectedStation}
            />
        </View>
    ), [])

    const filtersBlock = useMemo(() => {
        return (
            <View style={{...styles.filtersContainer, display: isFiltersOpen ? 'flex' : 'none'}}>
                <View style={{flex: 1}}>
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
                    {selectElement}
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.resetButton,
                            { marginHorizontal: 20 }
                        ]}
                        onPress={resetFilters}
                    >
                        <Text style={styles.resetButtonText}>Сбросить фильтры</Text>
                    </Pressable>
                </View>
                <View style={{paddingHorizontal: 20}}>
                    <CustomButton title={'Сохранить'} onPress={saveFilters} />
                </View>
            </View>
        )
    }, [resetFilters, isFiltersOpen, selectElement, saveFilters])

    const listBlock = useMemo(() => (
            <View>
                <View style={styles.pageHeader}>
                    <SearchInput onChange={setQuery}/>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : '#d8d8d9',
                            },
                            styles.headerButton,
                        ]}
                        onPress={() => setIsCalendarOpen(true)}
                    >
                        <Svg
                            width={25}
                            height={25}
                            viewBox="0 0 19 14"
                        >
                            <Path d="M5 0h4v4H5zm5 0h4v4h-4zm5 0h4v4h-4zM5 5h4v4H5zM0 5h4v4H0zm10 0h4v4h-4zm-5 5h4v4H5zm-5 0h4v4H0zm10 0h4v4h-4zm5-5h4v4h-4z"
                                  fill="#2060ae"/>
                        </Svg>
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : '#d8d8d9',
                            },
                            styles.headerButton,
                        ]}
                        onPress={() => setIsFiltersOpen(true)}
                    >
                        <Svg
                            width={25}
                            height={25}
                            viewBox="0 0 25 25"
                        >
                            <Path d="M7.527 9.45c.21.23.325.527.325.836v9.095c0 .547.66.825 1.052.44l2.537-2.907c.34-.408.526-.61.526-1.013v-5.613c0-.308.118-.607.325-.835l7.28-7.9C20.118.962 19.698 0 18.892 0H.927a.926.926 0 0 0-.681 1.554l7.28 7.897z"
                                  fill="#a7a7aa"/>
                        </Svg>
                    </Pressable>
                </View>
                {
                    isLoading ? <ActivityIndicator style={{marginTop: 50}} size="large" color="#2060ae" /> :
                        (
                            <ScrollView>
                                {
                                    filteredArray.length ? filteredArray.map(item => (
                                        <Pressable
                                            key={item.objectID + item.time}
                                            style={({pressed}) => [
                                                {
                                                    backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                                                },
                                                styles.objectsItem,
                                            ]}
                                            onPress={() => navigation.navigate('GasItem', {id: item.objectID})}
                                        >
                                            <GasItemElement item={item}/>
                                        </Pressable>
                                    )) : <Text style={styles.emptyList}>Empty list</Text>
                                }
                            </ScrollView>
                        )
                }
            </View>
    ), [filteredArray, isLoading])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            {filtersBlock}
            <AppCalendarFilter isCalendarOpen={isCalendarOpen} setIsCalendarOpen={setIsCalendarOpen} setCalendarProperties={setInterval}/>
            {
                !isFiltersOpen && !isCalendarOpen ? listBlock : null
            }
        </SafeAreaView>
    );
};

export default GasScreen;
