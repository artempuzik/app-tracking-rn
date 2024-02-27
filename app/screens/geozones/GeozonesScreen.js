import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Pressable, Text, FlatList, RefreshControl} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RadioForm from 'react-native-simple-radio-button';
import styles from './styles';
import SearchInput from "../../components/search/SearchInput";
import Svg, {Path} from "react-native-svg";
import GeozoneItemElement from "./components/GeozoneItemElement";
import {PRESSED_COLOR} from "../../config";
import {useDispatch, useSelector} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import SelectList from "../../components/select/SelectList";
import CustomButton from "../../components/button/Button";
import i18n from "../../utils/i18";
import {getGeozones} from "../../store/objects/objectsActions";
import Checkbox from "expo-checkbox";

const initialFilters = {
    isAll: true,
    selectedGroup: ''
}

const GeozoneItemScreen = ({navigation}) => {
    const dispatch = useDispatch()
    const profile = useSelector(store => store.app.profile)

    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [geoZones, setGeoZones] = useState([])
    const [items, setItems] = useState([])

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const [selectedGroup, setSelectedGroup] = useState('')
    const [isShowPolygon, setIsShowPolygon] = useState(false)
    const [isShowLine, setIsShowLine] = useState(false)
    const [isShowPoint, setIsShowPoint] = useState(false)
    const [isAll, setIsAll] = useState(true);

    const [isFiltersReset, setIsFiltersReset] = useState(false)

    const formatGroups = useMemo(() => {
        if(!profile?.geozonegroups.length) {
            return []
        }
        return profile?.geozonegroups.map(item => ({
            [item.id]: item.name
        }))
    }, [profile])

    const saveFilters = useCallback(() => {
        setIsFiltersOpen(false)
        const withFilter = geoZones.filter(el => {
            if(selectedGroup) {
                return el.groups.includes(+selectedGroup)
            }
            if(isAll) {
                return true
            }
            if(isShowPolygon && el.style.type === 'polygon') {
                return true
            }
            if(isShowPoint && el.style.type === 'point') {
                return true
            }
            if(isShowLine && el.style.type === 'polyline') {
                return true
            }
        })
        setItems(withFilter)
    }, [geoZones, isAll, isShowPoint, isShowPolygon, isShowLine, selectedGroup])

    const filteredArray = useMemo(() => items.filter(el => el.name.toLowerCase().includes(query.toLowerCase())), [items, query]);

    const resetFilters = useCallback(() => {
        setSelectedGroup(initialFilters.selectedGroup)
        setIsAll(initialFilters.isAll)
        setIsShowPolygon(false)
        setIsShowLine(false)
        setIsShowPoint(false)
        setIsFiltersReset(true)
        setTimeout(() => setIsFiltersReset(false))
    },[])
    const fetchData = async () => {
        try {
            setIsLoading(true)
            await dispatch(getGeozones()).then((data) =>{
                if(data.response) {
                    setGeoZones(data.response)
                    setItems(data.response)
                }
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData().catch(() => {})
    }, []);

    const radioButtonsBlock = useMemo(() => (
        <View>
            <View style={styles.radioButtonsContainer}>
                <RadioForm
                    style={styles.radioButtons}
                    radio_props={[
                        {
                            label: i18n.t('all'), value: true,
                        },
                        {
                            label: i18n.t('only_current_type'), value: false,
                        }
                    ]}
                    onPress={(value) => {
                        setIsAll(value);
                    }}
                    formHorizontal={false}
                    labelHorizontal={true}
                    initial={true}
                    selectedButtonColor='#f8642f'
                    buttonColor='#a7a7aa'
                    buttonSize={15}
                    animation={true}
                />
            </View>
            <View style={{marginBottom: 20}}>
                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        disabled={isAll}
                        value={isShowPolygon}
                        onValueChange={setIsShowPolygon}
                        color={isShowPolygon ? '#2060ae' : undefined}
                    />
                    <Text style={styles.paragraph}>{i18n.t('polygon')}</Text>
                </View>
                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        disabled={isAll}
                        value={isShowPoint}
                        onValueChange={setIsShowPoint}
                        color={isShowPoint ? '#2060ae' : undefined}
                    />
                    <Text style={styles.paragraph}>{i18n.t('point')}</Text>
                </View>
                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        disabled={isAll}
                        value={isShowLine}
                        onValueChange={setIsShowLine}
                        color={isShowLine ? '#2060ae' : undefined}
                    />
                    <Text style={styles.paragraph}>{i18n.t('polyline')}</Text>
                </View>
            </View>
        </View>
    ),[isAll, isShowPolygon, isShowLine, isShowPoint])

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
                                items={formatGroups} onChange={setSelectedGroup} value={selectedGroup}
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
                <View style={{paddingHorizontal: 20, marginBottom: 20}}>
                    <CustomButton title={i18n.t('save')} onPress={saveFilters} />
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
                data={filteredArray}
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
                        onPress={() => navigation.navigate('GeozoneItem', {id: item.id})}
                    >
                        <GeozoneItemElement item={item}/>
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
            {
                isFiltersOpen && !isFiltersReset ? filtersBlock : listBlock
            }
        </SafeAreaView>
    );
};

export default GeozoneItemScreen;
