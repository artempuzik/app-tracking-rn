import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Pressable, Text, RefreshControl, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RadioForm from 'react-native-simple-radio-button';
import styles from './styles';
import SearchInput from "../../components/search/SearchInput";
import Svg, {Path} from "react-native-svg";
import ObjectItemElement from "./components/ObjectItemElement";
import {MOVE_OPTIONS, PRESSED_COLOR, STATUS_OPTIONS, WITH_IGNITION_OPTIONS} from "../../config";
import {useDispatch, useSelector} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import SelectList from "../../components/select/SelectList";
import {getObjectIcons, getObjects, getObjectsStatuses} from "../../store/objects/objectsActions";
import CustomButton from "../../components/button/Button";
import ObjectsMap from "./components/ObjectsMap";
import {getProfileData} from "../../store/app/appActions";
import {getUsers, refreshUserToken} from "../../store/user/usersActions";
import {getItemIoPointsByItemId, getItemPointByItemId} from "../../utils/helpers";

const initialFilters = {
    withIgnition: null,
    isMove: null,
    isOnline: null,
    selectedGroup: null
}

const ObjectsScreen = ({navigation}) => {
    const dispatch = useDispatch()

    const refreshInterval = useSelector(state => state.user.refreshInterval)

    const [isLoading, setIsLoading] = useState(false)

    const [query, setQuery] = useState('')

    const interval = useRef(null)

    const [objects, setObjects] = useState([])
    const [icons, setIcons] = useState([])
    const [statuses, setStatuses] = useState([])
    const [profile, setProfile] = useState(null)

    const [isMapOpen, setMapOpen] = useState(false)

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const [isFiltersReset, setIsFiltersReset] = useState(false)

    const [items, setItems] = useState([])

    const [selectedGroup, setSelectedGroup] = useState(initialFilters.selectedGroup)
    const [withIgnition, setWithIgnition] = useState(initialFilters.withIgnition);
    const [isMove, setIsMove] = useState(initialFilters.isMove);
    const [isOnline, setIsOnline] = useState(initialFilters.isOnline);

    const formatGroups = useMemo(() => {
        if(!profile) {
            return []
        }
        return profile.objectgroups.map(item => ({
            [item.id]: item.name
        }))
    }, [profile])

    useEffect(() => {
        if(objects.length) {
            setItems(objects.filter(el => el.main.name.includes(query)))
        }
    }, [query, objects])

    const saveFilters = useCallback(() => {
        const withGroupFilter = objects.filter(el => {
            if(selectedGroup !== null) {
                return el.groups.includes(+selectedGroup)
            }
            return el
        })
        const withEngineFilter = withGroupFilter.filter(el => {
            if(withIgnition !== null) {
                const iopoints = getItemIoPointsByItemId(statuses, el)
                return withIgnition ? Boolean(iopoints?.value) : !Boolean(iopoints?.value)
            }
            return el
        })

        const withMoveFilter = withEngineFilter.filter(el => {
            if(isMove !== null) {
                const point = getItemPointByItemId(statuses, el)
                return isMove ? Boolean(+point?.speed) : !Boolean(+point?.speed)
            }
            return el
        })

        const withOnlineFilter = withMoveFilter.filter(el => {
            if(isOnline !== null) {
                const point = getItemPointByItemId(statuses, el)
                return isOnline ? Boolean(point?.online) : !Boolean(point?.online)
            }
            return el
        })
        setItems(withOnlineFilter)
        setIsFiltersOpen(false)
    }, [items, selectedGroup, statuses, withIgnition, isOnline, isMove])

    const resetFilters = useCallback(() => {
        setSelectedGroup(initialFilters.selectedGroup)
        setWithIgnition(initialFilters.withIgnition)
        setIsMove(initialFilters.isMove)
        setIsOnline(initialFilters.isOnline)
        setIsFiltersReset(true)
        setTimeout(() => setIsFiltersReset(false))
    },[])

    const getObjectStatuses = useCallback(async () => {
        await dispatch(getObjectsStatuses()).then((data) => {
            if(data.response) {
                setStatuses(data.response)
            }
        })
    }, [])

    const getProfile = useCallback(async () => {
        await dispatch(getProfileData()).then((data) => {
            if(data.response) {
                setProfile(data.response)
            }
        })
    }, [])

    const getUserData = useCallback(async () => {
        await dispatch(getUsers())
    }, [])

    const refreshToken = useCallback(async () => {
        await dispatch(refreshUserToken())
    }, [])

    const onRefresh = useCallback(async () => {
        try {
            setIsLoading(true)
            await getObjectStatuses()
            await refreshToken()
        } finally {
            setIsLoading(false)
        }
    })

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

    const fetchData = async () => {
        try {
            setIsLoading(true)
            await getObjectsData()
            await getProfile()
            await getObjectStatuses()
            await getUserData()
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData().catch(() => {})
    }, []);

    useEffect(() => {
        interval.current = setInterval(async () => await getObjectStatuses(), refreshInterval)
        return () => {
            console.log('CLOSE OBJECT SCREEN')
            clearInterval(interval.current)
            interval.current = null
        }
    })

    const selectElement = useMemo(() => (
        <View style={{...styles.selectContainer, paddingHorizontal: 20}}>
            <SelectList
                items={formatGroups} onChange={setSelectedGroup} value={selectedGroup}
            />
        </View>
    ), [selectedGroup])

    const radioButtonsBlock = useMemo(() => (
        <View style={{paddingHorizontal: 20 }}>
            <View style={styles.radioButtonsContainer}>
                <Text>Только объекты с включенным двигателем</Text>
                <RadioForm
                    style={styles.radioButtons}
                    radio_props={WITH_IGNITION_OPTIONS}
                    onPress={(value) => {
                        setWithIgnition(value);
                    }}
                    formHorizontal={true}
                    labelHorizontal={true}
                    initial={withIgnition}
                    selectedButtonColor={withIgnition !== null ? '#f8642f' : '#a7a7aa'}
                    buttonColor={'#a7a7aa'}
                    buttonSize={15}
                    animation={true}
                />
            </View>
            <View style={styles.radioButtonsContainer}>
                <Text>Отобразить только объекты:</Text>
                <RadioForm
                    style={styles.radioButtons}
                    radio_props={MOVE_OPTIONS}
                    onPress={(value) => {
                        setIsMove(value);
                    }}
                    formHorizontal={true}
                    labelHorizontal={true}
                    initial={isMove}
                    selectedButtonColor={isMove !== null ? '#f8642f' : '#a7a7aa'}
                    buttonColor={'#a7a7aa'}
                    buttonSize={15}
                    animation={true}
                />
            </View>
            <View style={styles.radioButtonsContainer}>
                <Text>Отобразить только объекты со статусом:</Text>
                <RadioForm
                    style={styles.radioButtons}
                    radio_props={STATUS_OPTIONS}
                    onPress={(value) => {
                        setIsOnline(value);
                    }}
                    formHorizontal={true}
                    labelHorizontal={true}
                    initial={isOnline}
                    selectedButtonColor={isOnline !== null ? '#f8642f' : '#a7a7aa'}
                    buttonColor={'#a7a7aa'}
                    buttonSize={15}
                    animation={true}
                />
            </View>
        </View>
    ),[withIgnition, isOnline, isMove])

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
                        <Text style={styles.resetButtonText}>Сбросить фильтры</Text>
                    </Pressable>
                </View>
                <View style={{paddingHorizontal: 20}}>
                    <CustomButton title={'Сохранить'} onPress={saveFilters} />
                </View>
            </View>
        )
    }, [selectedGroup, resetFilters, radioButtonsBlock, isFiltersOpen, selectElement, saveFilters])

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
                        onPress={() => setMapOpen(true)}
                    >
                        <Svg
                            width={25}
                            height={25}
                            viewBox="0 0 20 20"
                        >
                            <Path d="M17.071 2.929A9.934 9.934 0 0 1 20 10a9.935 9.935 0 0 1-2.929 7.071A9.935 9.935 0 0 1 10 20a9.935 9.935 0 0 1-7.071-2.929A9.935 9.935 0 0 1 0 10.001a9.934 9.934 0 0 1 2.929-7.072A9.935 9.935 0 0 1 10 0a9.935 9.935 0 0 1 7.071 2.929zm-.884 13.258a8.69 8.69 0 0 0 2.388-4.435c-.263.388-.514.532-.67-.336-.16-1.414-1.46-.51-2.276-1.013-.86.58-2.791-1.126-2.463.798.506.867 2.734-1.161 1.624.674-.708 1.282-2.59 4.12-2.346 5.591.031 2.144-2.19.447-2.955-.264-.515-1.424-.176-3.913-1.522-4.61-1.46-.064-2.715-.197-3.28-1.83-.342-1.169.362-2.908 1.614-3.177 1.833-1.151 2.488 1.349 4.207 1.395.534-.558 1.989-.736 2.11-1.362-1.129-.199 1.43-.948-.109-1.375-.849.1-1.396.88-.945 1.543-1.645.383-1.698-2.381-3.28-1.51-.04 1.38-2.582.448-.879.168.585-.256-.954-.996-.122-.862.408-.022 1.783-.504 1.411-.828.766-.475 1.41 1.139 2.16-.037.54-.903-.228-1.07-.906-.612-.382-.428.675-1.353 1.608-1.753.31-.133.608-.205.835-.185.47.543 1.339.637 1.384-.065A8.717 8.717 0 0 0 10 1.25c-1.907 0-3.72.606-5.22 1.726.402.185.631.415.243.71-.302.899-1.527 2.106-2.602 1.935a8.653 8.653 0 0 0-1.083 3.136c.9.298 1.108.887.914 1.085-.458.4-.74.967-.886 1.588a8.685 8.685 0 0 0 2.447 4.757A8.693 8.693 0 0 0 10 18.75c2.337 0 4.534-.91 6.187-2.563z"
                                  fill="#a7a7aa"/>
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
                <FlatList
                    data={items}
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
                            onPress={() => navigation.navigate('ObjectItem', {id: item.main.id})}
                        >
                            <ObjectItemElement item={item} icons={icons} statuses={statuses}/>
                            <View style={styles.line}></View>
                        </Pressable>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                    }
                />
            </View>
    ), [items, icons, statuses, isLoading])

    if(isMapOpen) {
        return (
            <SafeAreaView style={styles.container}>
                <AppHeader canGoBack={true} />
                <ObjectsMap objects={items} icons={icons}/>
            </SafeAreaView>
        )
    }

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

export default ObjectsScreen;
