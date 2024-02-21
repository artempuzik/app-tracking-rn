import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Pressable, Text, FlatList, RefreshControl} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import SearchInput from "../../components/search/SearchInput";
import Svg, {Path} from "react-native-svg";
import {MOVE_OPTIONS, PRESSED_COLOR, STATUS_OPTIONS, WITH_IGNITION_OPTIONS} from "../../config";
import {useDispatch, useSelector} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import {
    getObjectEvents,
} from "../../store/objects/objectsActions";
import CustomButton from "../../components/button/Button";
import EventItemElement from "./components/EventItemElement";
import i18n from "../../utils/i18";
import CalendarFilter from "./components/CalendarFilter";
import RadioForm from "react-native-simple-radio-button";
import SelectList from "../../components/select/SelectList";

const initialFilters = {
    selectedObject: null,
    showAll: true,
    date: null,
}

const EventScreen = ({navigation}) => {
    const dispatch = useDispatch()

    const profile = useSelector(state => state.app.profile)
    const icons = useSelector(state => state.objects.icons)

    const [isLoading, setIsLoading] = useState(false)

    const [query, setQuery] = useState('')

    const [events, setEvents] = useState([])

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isFiltersReset, setIsFiltersReset] = useState(false)

    const [date, setDate] = useState(initialFilters.date)
    const [selectedObject, setSelectedObject] = useState(initialFilters.selectedObject)
    const [showAll, setShowAll] = useState(initialFilters.showAll)

    const filteredArray = useMemo(() => {
        if(!events.length) {
            return []
        }
        const withObjects = selectedObject !== null ? events.filter(e => selectedObject === e.trackerid) : events
        const withStatus = showAll !== null ? withObjects.filter(e => !showAll ? e.status === '0' : true) : withObjects
        const withDate = date ? withStatus.filter(e => +e.time <= +date + 3600000 && +e.time >= +date - 3600000) : withStatus
        return withDate.filter(el => JSON.stringify(el).toLowerCase().includes(query.toLowerCase()))
    }, [events, query, date, showAll, selectedObject])
    const formatObjects = useMemo(() => {
        if(!profile?.objects.length) {
            return []
        }
        return profile?.objects.map( obj => ({[obj.id]: obj.name}))
    }, [profile])

    const saveFilters = useCallback(() => {
        setIsFiltersOpen(false)
    }, [])

    const resetFilters = useCallback(() => {
        setDate(initialFilters.date)
        setSelectedObject(initialFilters.selectedObject)
        setShowAll(initialFilters.showAll)
        setIsFiltersReset(true)
        setTimeout(() => setIsFiltersReset(false))
    },[])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            await dispatch(getObjectEvents()).then((data) => {
                if(data.response) {
                    setEvents(data.response.events)
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
            <SelectList
                items={formatObjects} onChange={setSelectedObject}
            />
        </View>
    ), [])

    const radioButtonsBlock = useMemo(() => (
        <View style={{paddingHorizontal: 20 }}>
            <View style={styles.radioButtonsContainer}>
                <RadioForm
                    style={styles.radioButtons}
                    radio_props={[
                        {
                            label: i18n.t('all'), value: true,
                        },
                        {
                            label: i18n.t('only_important'), value: false,
                        }
                    ]}
                    onPress={(value) => {
                        setShowAll(value);
                    }}
                    labelHorizontal={true}
                    initial={showAll}
                    selectedButtonColor={showAll !== null ? '#f8642f' : '#a7a7aa'}
                    buttonColor={'#a7a7aa'}
                    buttonSize={15}
                    animation={true}
                />
            </View>
        </View>
    ),[showAll])

    const filtersBlock = useMemo(() => {
        return (
            <View style={{...styles.filtersContainer, display: isFiltersOpen ? 'flex' : 'none'}}>
                <View style={{flex: 1}}>
                    <View style={styles.screenTitle}>
                        <Text>{i18n.t('filters')}</Text>
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
                    <CalendarFilter setCalendarProperties={setDate}/>
                    {radioButtonsBlock}
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
                        <Text style={styles.resetButtonText}>{i18n.t('reset_filters')}</Text>
                    </Pressable>
                </View>
                <View style={{paddingHorizontal: 20}}>
                    <CustomButton title={i18n.t('save')} onPress={saveFilters} />
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
                    ListFooterComponent={() => (<View style={{height: 130}}></View>)}
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
                            <EventItemElement item={item} icons={icons} profile={profile}/>
                        </Pressable>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
                    }
                />
            </View>
    ), [filteredArray, isLoading])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            {!isFiltersReset && filtersBlock}
            {
                !isFiltersOpen ? listBlock : null
            }
        </SafeAreaView>
    );
};

export default EventScreen;
