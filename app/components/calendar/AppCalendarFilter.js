import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Alert, Pressable, Text, View} from "react-native";
import i18n from "../../utils/i18";
import styles from "./styles";
import Svg, {Path} from "react-native-svg";
import AppModal from "../modal/AppModal";
import DateTimePicker from "react-native-ui-datepicker";
import CustomButton from "../button/Button";

const AppCalendarFilter = ({
                               isCalendarOpen,
                               setIsCalendarOpen,
                               setCalendarProperties,
                               interval
}) => {
    const [minDate, setMinDate] = useState(interval.from)
    const [maxDate, setMaxDate] = useState(interval.till)

    const [minTime, setMinTime] = useState(interval.from)
    const [maxTime, setMaxTime] = useState(interval.till)

    const [isOpenMinDateModal, setIsOpenMinDateModal] = useState(false)
    const [isOpenMaxDateModal, setIsOpenMaxDateModal] = useState(false)
    const [isOpenMinTimeModal, setIsOpenMinTimeModal] = useState(false)
    const [isOpenMaxTimeModal, setIsOpenMaxTimeModal] = useState(false)

    const saveCalendar = useCallback(() => {
        const from_h = new Date(minTime).getHours()
        const from_m = new Date(minTime).getMinutes()
        const till_h = new Date(maxTime).getHours()
        const till_m = new Date(maxTime).getMinutes()
        const from = new Date(minDate).setHours(from_h, from_m)
        const till = new Date(maxDate).setHours(till_h, till_m)

        const differenceInTime = new Date(till).getTime() - new Date(from).getTime();

        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        if (differenceInDays < 31) {
            setIsCalendarOpen(false)
            setCalendarProperties({
                from,
                till,
            });
        } else {
            Alert.alert("The selected range exceeds 30 days. Please select a range less than 31 days.");
        }
    }, [minDate, maxDate, minTime, maxTime])

    const formatMinDate = useMemo(() => {
        return minDate ? `${new Date(minDate).toLocaleDateString()}`.substring(-10, 10) : `${new Date().toISOString()}`.substring(-10, 10)
    }, [minDate])

    const formatMaxDate = useMemo(() => {
        return maxDate ? `${new Date(maxDate).toLocaleDateString()}`.substring(-10, 10) : `${new Date().toISOString()}`.substring(-10, 10)
    }, [maxDate])

    const formatMinTime = useMemo(() => {
        return minTime ? `${new Date(minTime).toLocaleTimeString()}`.substring(-2, 5) : `${new Date().toLocaleTimeString()}`.substring(-2, 5)
    }, [minTime])

    const formatMaxTime = useMemo(() => {
        return maxTime ? `${new Date(maxTime).toLocaleTimeString()}`.substring(-2, 5) : `${new Date().toLocaleTimeString()}`.substring(-2, 5)
    }, [maxTime])

    const getMonday = (d) => {

        const day = d.getDay();
        const diff = d.getDate() - day + (day == 0 ? -6:1);
        d.setDate(diff);
        d.setHours(0,0,0,0);
        return d;
    }
    const setToday = useCallback(() => {
        setMinDate(new Date())
        setMaxDate(new Date())
        setMinTime(new Date().setHours(0,0))
        setMaxTime(new Date().setHours(23,59))
    }, [])

    const setYesterday = useCallback(() => {
        const today = new Date().getDate()
        const yesterday = new Date().setDate(today-1)
        setMinDate(new Date(yesterday))
        setMaxDate(new Date(yesterday))
        setMinTime(new Date(yesterday).setHours(0,0))
        setMaxTime(new Date(yesterday).setHours(23,59))
    }, [])

    const setThisWeek = useCallback(() => {
        const monday = getMonday(new Date())
        setMinDate(new Date(monday))
        setMaxDate(new Date())
        setMinTime(new Date(monday).setHours(0,0))
        setMaxTime(new Date().setHours(23,59))
    }, [])

    const setMonth = useCallback(() => {
        setMinDate(new Date().setDate(1))
        setMaxDate(new Date())
        setMinTime(new Date(new Date().setDate(1)).setHours(0,0))
        setMaxTime(new Date().setHours(23,59))
    }, [])

    const setPrevMonth = useCallback(() => {
        const prevMonth = new Date().setMonth(new Date().getMonth()-1)
        setMinDate(new Date(prevMonth).setDate(1))
        setMaxDate(new Date().setDate(-1))
        setMinTime(new Date(new Date(prevMonth).setDate(1)).setHours(0,0))
        setMaxTime(new Date(new Date().setDate(-1)).setHours(23,59))
    }, [])

    return (
        <View style={{...styles.filtersContainer, display: isCalendarOpen ? 'flex' : 'none'}}>
            <View style={styles.screenTitle}>
                <Text>{i18n.t('select_interval')}</Text>
                <Pressable
                    style={styles.headerButton}
                    onPress={() => setIsCalendarOpen(false)}
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
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.filterRow,
                        ]}
                        onPress={() => setIsOpenMinDateModal(true)}
                    >
                        <Svg
                            width={20}
                            height={20}
                            viewBox="0 0 19 14"
                        >
                            <Path d="M5 0h4v4H5zm5 0h4v4h-4zm5 0h4v4h-4zM5 5h4v4H5zM0 5h4v4H0zm10 0h4v4h-4zm-5 5h4v4H5zm-5 0h4v4H0zm10 0h4v4h-4zm5-5h4v4h-4z"
                                  fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.filterRowText}>{formatMinDate}</Text>
                        <AppModal isModalOpen={isOpenMinDateModal} setIsModalOpen={setIsOpenMinDateModal}>
                            <DateTimePicker
                                mode="date"
                                value={minDate}
                                onValueChange={setMinDate}
                            />
                        </AppModal>
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.filterRow,
                        ]}
                        onPress={() => setIsOpenMinTimeModal(true)}
                    >
                        <Svg
                            width={20}
                            height={20}
                            viewBox="0 0 19 14"
                        >
                            <Path d="M5 0h4v4H5zm5 0h4v4h-4zm5 0h4v4h-4zM5 5h4v4H5zM0 5h4v4H0zm10 0h4v4h-4zm-5 5h4v4H5zm-5 0h4v4H0zm10 0h4v4h-4zm5-5h4v4h-4z"
                                  fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.filterRowText}>{formatMinTime}</Text>
                        <AppModal isModalOpen={isOpenMinTimeModal} setIsModalOpen={setIsOpenMinTimeModal}>
                            <DateTimePicker
                                mode="time"
                                value={minTime}
                                onValueChange={setMinTime}
                            />
                        </AppModal>
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.filterRow,
                        ]}
                        onPress={() => setIsOpenMaxDateModal(true)}
                    >
                        <Svg
                            width={20}
                            height={20}
                            viewBox="0 0 19 14"
                        >
                            <Path d="M5 0h4v4H5zm5 0h4v4h-4zm5 0h4v4h-4zM5 5h4v4H5zM0 5h4v4H0zm10 0h4v4h-4zm-5 5h4v4H5zm-5 0h4v4H0zm10 0h4v4h-4zm5-5h4v4h-4z"
                                  fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.filterRowText}>{formatMaxDate}</Text>
                        <AppModal isModalOpen={isOpenMaxDateModal} setIsModalOpen={setIsOpenMaxDateModal}>
                            <DateTimePicker
                                mode="date"
                                value={maxDate}
                                onValueChange={setMaxDate}
                            />
                        </AppModal>
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.filterRow,
                        ]}
                        onPress={() => setIsOpenMaxTimeModal(true)}
                    >
                        <Svg
                            width={20}
                            height={20}
                            viewBox="0 0 19 14"
                        >
                            <Path d="M5 0h4v4H5zm5 0h4v4h-4zm5 0h4v4h-4zM5 5h4v4H5zM0 5h4v4H0zm10 0h4v4h-4zm-5 5h4v4H5zm-5 0h4v4H0zm10 0h4v4h-4zm5-5h4v4h-4z"
                                  fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.filterRowText}>{formatMaxTime}</Text>
                        <AppModal isModalOpen={isOpenMaxTimeModal} setIsModalOpen={setIsOpenMaxTimeModal}>
                            <DateTimePicker
                                mode="time"
                                value={maxTime}
                                onValueChange={setMaxTime}
                            />
                        </AppModal>
                    </Pressable>
                    <View style={styles.buttonsDaysBlock}>
                        <View style={{width: '32%'}}>
                            <CustomButton title={i18n.t('today')} onPress={setToday} />
                        </View>
                        <View style={{width: '32%'}}>
                            <CustomButton title={i18n.t('yesterday')} onPress={setYesterday} />
                        </View>
                        <View style={{width: '32%'}}>
                            <CustomButton title={i18n.t('this_week')} onPress={setThisWeek} />
                        </View>
                    </View>
                    <View style={styles.buttonsDaysBlock}>
                        <View style={{width: '48%'}}>
                            <CustomButton title={i18n.t('this_month')} onPress={setMonth} />
                        </View>
                        <View style={{width: '48%'}}>
                            <CustomButton title={i18n.t('previous_month')} onPress={setPrevMonth} />
                        </View>
                    </View>
                </View>
                <View style={{paddingHorizontal: 20, marginBottom: 20}}>
                    <CustomButton title={i18n.t('apply')} onPress={saveCalendar} />
                </View>
            </View>
        </View>
    )
}

export default AppCalendarFilter
