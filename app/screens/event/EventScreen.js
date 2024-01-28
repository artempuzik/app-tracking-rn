import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Pressable, Text, ScrollView, ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RadioForm from 'react-native-simple-radio-button';
import styles from './styles';
import SearchInput from "../../components/search/SearchInput";
import Svg, {Path} from "react-native-svg";
import {MOVE_OPTIONS, PRESSED_COLOR, STATUS_OPTIONS, WITH_IGNITION_OPTIONS} from "../../config";
import {useDispatch, useSelector} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import SelectList from "../../components/select/SelectList";
import {
    getObjectEvents,
    getObjectIcons,
    getObjects,
    getObjectsStatuses,
    getTransactions
} from "../../store/objects/objectsActions";
import CustomButton from "../../components/button/Button";
import AppCalendarFilter from "../../components/calendar/AppCalendarFilter";
import {getDriverSessionById} from "../../store/drivers/driversActions";
import EventItemElement from "./components/EventItemElement";
import ObjectItemElement from "../objects/components/ObjectItemElement";

const initialFilters = {
    selectedStation: null
}

const EventScreen = ({navigation}) => {
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)

    const [query, setQuery] = useState('')

    const [events, setEvents] = useState([])
    const [objects, setObjects] = useState([])
    const [icons, setIcons] = useState([])

    const [interval, setInterval] = useState({
        from: 0,
        till: 0,
    })

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const [selectedStation, setSelectedStation] = useState(initialFilters.selectedStation)

    const filteredArray = useMemo(() => {
        if(!events.length) {
            return []
        }
        // const withIconAndMainFilter = selectedStation ? events.filter(e => e.objectID === selectedStation) : mainArray
        return events.filter(el => JSON.stringify(el).includes(query))
    }, [events, query])

    const saveFilters = useCallback(() => {
        setIsFiltersOpen(false)
    }, [])

    const resetFilters = useCallback(() => {
        setSelectedStation(initialFilters.selectedStation)
    },[])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            await dispatch(getObjectEvents()).then((data) => {
                if(data.response) {
                    setEvents(data.response.events)
                }
            })
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
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
       fetchData().catch(() => {})
    }, [])

    const selectElement = useMemo(() => (
        <View style={{...styles.selectContainer, paddingHorizontal: 20}}>
            {/*<SelectList*/}
            {/*    items={formatStation} onChange={setSelectedStation}*/}
            {/*/>*/}
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
                <FlatList
                    data={filteredArray}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<Text style={styles.emptyList}>Empty list</Text>}
                    enableEmptySections={true}
                    renderItem={({item}) => (
                        <Pressable
                            style={({pressed}) => [
                                {
                                    backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                                },
                                styles.objectsItem,
                            ]}
                            onPress={() => navigation.navigate('ObjectItem', {id: item.trackerid})}
                        >
                            <EventItemElement item={item} icons={icons} objects={objects}/>
                        </Pressable>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
                    }
                />
            </View>
    ), [filteredArray, isLoading, icons, objects])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            {filtersBlock}
            {
                !isFiltersOpen && !isCalendarOpen ? listBlock : null
            }
        </SafeAreaView>
    );
};

export default EventScreen;
