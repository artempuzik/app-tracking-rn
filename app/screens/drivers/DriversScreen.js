import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Pressable, Text, ScrollView, ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RadioForm from 'react-native-simple-radio-button';
import styles from './styles';
import SearchInput from "../../components/search/SearchInput";
import Svg, {Path} from "react-native-svg";
import DriverItemElement from "./components/DriverItemElement";
import {DRIVERS_OPTIONS, PRESSED_COLOR} from "../../config";
import {useDispatch} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import SelectList from "../../components/select/SelectList";
import {getDriverGroups, getDrivers, getDriverSessionById} from "../../store/drivers/driversActions";
import CustomButton from "../../components/button/Button";
import i18n from "../../utils/i18";
import ObjectItemElement from "../objects/components/ObjectItemElement";

const initialFilters = {
    isAll: null,
    selectedGroup: ''
}

const DriversScreen = ({navigation}) => {
    const dispatch = useDispatch()

    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [drivers, setDrivers] = useState([])
    const [driverGroups, setDriverGroups] = useState([])

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const [selectedGroup, setSelectedGroup] = useState('')
    const [isAll, setIsAll] = useState(null);

    const formatGroups = useMemo(() => {
        if(!driverGroups.length) {
            return []
        }
        return driverGroups.map(item => ({
            [item.id]: item.name
        }))
    }, [driverGroups])

    const items = useMemo(() => {
        if(!drivers.length) {
            return []
        }
        return drivers.filter(el => el.name.includes(query))
    }, [query, drivers])

    const resetFilters = useCallback(() => {
        setSelectedGroup(initialFilters.selectedGroup)
        setIsAll(initialFilters.isAll)
    },[])
    const fetchData = async () => {
        try {
            setIsLoading(true)
            await dispatch(getDrivers()).then((data) =>{
                if(data.response) {
                    setDrivers(data.response)
                }
            })
            await dispatch(getDriverGroups()).then((data) =>{
                if(data.response) {
                    setDriverGroups(data.response)
                }
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData().catch(() => {})
    }, []);

    const onRefresh = useCallback(() => {
        fetchData().catch(() => {})
    }, [])

    const radioButtonsBlock = useMemo(() => (
        <View>
            <View style={styles.radioButtonsContainer}>
                <RadioForm
                    style={styles.radioButtons}
                    radio_props={DRIVERS_OPTIONS}
                    onPress={(value) => {
                        setIsAll(value);
                    }}
                    formHorizontal={false}
                    labelHorizontal={true}
                    initial={isAll}
                    selectedButtonColor={isAll !== null ? '#f8642f' : '#a7a7aa'}
                    buttonColor={'#a7a7aa'}
                    buttonSize={15}
                    animation={true}
                />
            </View>
        </View>
    ),[isAll])

    const filtersBlock = useMemo(() => {
        return (
            <View style={styles.filtersContainer}>
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
                                <Path d="M12.6 14L8.4 9.8l1.4-1.4 4.2 4.2-1.4 1.4zM1.4 14L0 12.6 12.6 0 14 1.4 1.4 14zm2.8-8.4L0 1.4 1.4 0l4.2 4.2-1.4 1.4z" fill="#a7a7aa" />
                            </Svg>
                        </Pressable>
                    </View>
                    <View style={{paddingHorizontal: 20}}>
                        <View style={styles.selectContainer}>
                            <SelectList
                                items={formatGroups} onChange={setSelectedGroup}
                            />
                        </View>
                        {radioButtonsBlock}
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
                </View>
                <View style={{paddingHorizontal: 20}}>
                    <CustomButton title={'Сохранить'} onPress={() => {}} />
                </View>
            </View>
        )
    }, [selectedGroup, resetFilters, radioButtonsBlock])

    const listBlock = useMemo(() => (
        <View style={{flex: 1}}>
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
                data={items}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text style={styles.emptyList}>{i18n.t('empty_list')}</Text>}
                ListFooterComponent={() => (<View style={{height: 130}}></View>)}
                enableEmptySections={true}
                renderItem={({item}) => (
                    <Pressable
                        key={item.id}
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                            },
                            styles.objectsItem,
                        ]}
                        onPress={() => navigation.navigate('DriverItem', {id: item.id})}
                    >
                        <DriverItemElement item={item}/>
                    </Pressable>
                )}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                }
            />
        </View>
), [items, isLoading])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            {
                isFiltersOpen ? filtersBlock : listBlock
            }
        </SafeAreaView>
    );
};

export default DriversScreen;
