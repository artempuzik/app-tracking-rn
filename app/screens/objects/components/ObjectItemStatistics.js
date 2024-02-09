import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';
import Svg, {Path} from "react-native-svg";
import {useNavigation, useRoute} from "@react-navigation/native";
import styles from '../styles';
import SelectList from "../../../components/select/SelectList";
import {getFuelReport} from '../../../store/objects/objectsActions';
import {REPORTS_LIST} from "../../../config";
import AppCalendarFilter from "../../../components/calendar/AppCalendarFilter";
import CustomButton from "../../../components/button/Button";
import i18n from "../../../utils/i18";
import {Image} from "expo-image";
import {useDispatch, useSelector} from "react-redux";
import {convertDate, getDuration, getMileage} from "../../../utils/helpers";

const ObjectItemStatistics = ({object}) => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const [reportType, setReportType] = useState('general')

    const [isLoading, setIsLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [interval, setInterval] = useState({
        from: 0,
        till: 0,
    })

    const icons = useSelector(state => state.objects.icons)
    const baseUrl = useSelector(state => state.app.currentServer)

    const icon = useMemo(() => {
        return icons.find((ic) => ic.id === object?.main.iconId)
    }, [object, icons])

    const getReport = useCallback(async () => {
        await dispatch(getFuelReport({
            from: interval.from,
            till: interval.till,
            objectID: route.params.id,
            trendID: object?.trends[1].id
        })).then(async (data) =>{
            if(data.response) {
                setReport(data.response)
            }
        })
    }, [route.params.id, interval])
    const fetchData = async () => {
        try {
            setIsLoading(true)
            await getReport()
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
    }, [])

    const resetFilters = useCallback(() => {
        setReportType('')
    },[])

    const fuelReport = useMemo(() =>(
        <View style={{paddingHorizontal: 20}}>
            <View style={styles.mainStatRow}>
                <Text>{i18n.t('mileage')}</Text>
                <Text>
                    {getMileage(report?.track?.mileage)}
                    {` ${i18n.t('km')}`}
                </Text>
            </View>
            <View style={styles.mainStatRow}>
                <Text>{i18n.t('time')}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('engine_hours')}</Text>
                <Text>{getDuration(0, +report?.workingtime)}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('idle')}</Text>
                <Text>{getDuration(0, +report?.idletime)}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('drive')}</Text>
                <Text>{getDuration(0, +report?.track.movingtime)}</Text>
            </View>
            <View style={styles.mainStatRow}>
                <Text>{i18n.t('fuel')}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('level_at_the_beginning')}</Text>
                <Text>{report?.fuel.startvolume}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('level_at_the_ending')}</Text>
                <Text>{report?.fuel.finishvolume}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('fuel_consumption')}</Text>
                <Text>{report?.fuel.usedvolume}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('consumption_for_100_km')}</Text>
                <Text>{report?.fuel.valueperkm}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('consumption_for_one_hour')}</Text>
                <Text>{report?.fuel.valueperh}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('consumption_on_the_move')}</Text>
                <Text>{report?.fuel.workingvolume}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('idle_consumption')}</Text>
                <Text>{report?.fuel.idlevolume}</Text>
            </View>
            <View style={styles.mainStatRow}>
                <Text>{i18n.t('gas')}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('total_refills')}</Text>
                <Text>{report?.fuel.fuelingtotal}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('total_drains')}</Text>
                <Text>{report?.fuel.draintotal}</Text>
            </View>
            {
                report?.actions?.length
                && report?.actions.map(action => (
                    <View style={{borderBottomColor: '#a7a7aa', borderBottomWidth: 1}}>
                        <View style={styles.subStatRow}>
                            <Text>{i18n.t(action.type.toLowerCase())}</Text>
                        </View>
                        <View style={styles.subStatRow}>
                            <Text>{i18n.t('volume')}</Text>
                            <Text>{action?.volume}</Text>
                        </View>
                        <View style={styles.subStatRow}>
                            <Text>{i18n.t('time')}</Text>
                            <Text>{convertDate(action?.time)}</Text>
                        </View>
                    </View>
                ))
            }
        </View>
    ), [report])

    const totalReport = useMemo(() =>(
        <View style={{paddingHorizontal: 20}}>
            <View style={styles.mainStatRow}>
                <Text>{i18n.t('mileage')}</Text>
                <Text>
                    {getMileage(report?.track?.mileage)}
                    {` ${i18n.t('km')}`}
                </Text>
            </View>
            <View style={styles.mainStatRow}>
                <Text>{i18n.t('time')}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('engine_hours')}</Text>
                <Text>{getDuration(0, +report?.workingtime)}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('idle')}</Text>
                <Text>{getDuration(0, +report?.idletime)}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('parking')}</Text>
                <Text>{getDuration(0, +report?.track.parkingtime)}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('drive')}</Text>
                <Text>{getDuration(0, +report?.track.movingtime)}</Text>
            </View>
            <View style={styles.mainStatRow}>
                <Text>{i18n.t('fuel')}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('fuel_consumption')}</Text>
                <Text>{report?.fuel.usedvolume}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('consumption_for_100_km')}</Text>
                <Text>{report?.fuel.valueperkm}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('consumption_for_one_hour')}</Text>
                <Text>{report?.fuel.valueperh}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('consumption_on_the_move')}</Text>
                <Text>{report?.fuel.workingvolume}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('idle_consumption')}</Text>
                <Text>{report?.fuel.idlevolume}</Text>
            </View>
            <View style={styles.mainStatRow}>
                <Text>{i18n.t('gas')}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('total_refills')}</Text>
                <Text>{report?.fuel.fuelingtotal}</Text>
            </View>
            <View style={styles.subStatRow}>
                <Text>{i18n.t('total_drains')}</Text>
                <Text>{report?.fuel.draintotal}</Text>
            </View>
        </View>
    ), [report])

    const pageBlock = useMemo(() => (
        <View>
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
                            <Text style={{...styles.objectItemTitle, fontWeight: 'normal'}}>{object?.main.name}</Text>
                            {
                                object?.main.comment && <Text style={{...styles.subText, fontSize: 12}}>{object?.main.comment}</Text>
                            }
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
                {report && reportType === 'fuel' ? fuelReport : totalReport}
            </ScrollView>
        </View>
), [report, reportType])

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
                    <View style={styles.selectContainer}>
                        <SelectList
                            items={REPORTS_LIST}
                            onChange={setReportType}
                            value={reportType}
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
    ), [report, isFiltersOpen])

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

export default ObjectItemStatistics;
