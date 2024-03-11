import React, {useEffect, useMemo, useState} from 'react';
import {KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import {useDispatch} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import {useRoute} from "@react-navigation/native";
import {editDriver, getDriverById} from "../../store/drivers/driversActions";
import Svg, {Path} from "react-native-svg";
import AppCalendarFilter from "../../components/calendar/AppCalendarFilter";
import CustomButton from "../../components/button/Button";
import {getObjectHistoryDriversSession} from "../../store/objects/objectsActions";
import i18n from "../../utils/i18";
import {convertDate, getDuration, getMileage} from "../../utils/helpers";
import Input from "../../components/input/Input";

const DriverItemScreen = ({navigation}) => {
    const route = useRoute();
    const [driver, setDriver] = useState(null)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [sessions, setSessions] = useState(null)
    const [interval, setInterval] = useState({
        from: new Date().setHours(0,0),
        till: +new Date(),
    })

    const [isEditBlockOpen, setIsEditBlockOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [driverGroups, setDriverGroups] = useState([])

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [category, setCategory] = useState('')
    const [license, setLicense] = useState('')
    const [rank, setRank] = useState('')

    const dispatch = useDispatch()

    const fetchHistoryData = async () => {
        try {
            setError('')
            await dispatch(getObjectHistoryDriversSession({
                from: interval.from,
                till: interval.till,
                objectID: 0,
            })).then((data) => {
                if(data.response) {
                    setSessions(data.response.driversessions?.filter(r => r.driverid == route.params.id))
                }
            })
        } catch (err) {
            setError(err.message)
        }
    }

    const fetchData = async () => {
        try {
            setError('')
            await dispatch(getDriverById(route.params.id)).then((data) => {
                    if(data.response) {
                        setDriver(data.response)
                    }
                })
        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        fetchData().catch(() => {})
    }, [])

    useEffect(() => {
        if(interval.from && interval.till) {
            fetchHistoryData().catch(() => {})
        }
    }, [interval.from, interval.till])

    useEffect(() => {
        if(driver) {
            setName(driver.name)
            setPhone(driver.phone)
            setCategory(driver.category)
            setLicense(driver.license)
            setRank(driver.rank)
            setDriverGroups(driver.groups)
        }
    }, [driver])

    const saveDriver = () => {
        try {
            setError('')
            setLoading(true)
            const ids = driverGroups.map(g => +g.id)
            dispatch(editDriver({
                ...driver,
                name,
                phone,
                rank,
                license,
                category,
                groups: ids,
            })).then((response) => {
                setLoading(false)
                if(response.error) {
                    setError(response.error)
                }
            }).finally(() => setLoading(false))
        } catch (e) {

        }
    }

    const totalMileage = useMemo(() => sessions?.reduce((acc, s) => acc +=+s.length, 0), [sessions])
    const totalIdle = useMemo(() => sessions?.reduce((acc, s) => acc +=+s.idletime, 0), [sessions])
    const totalFuel = useMemo(() => sessions?.reduce((acc, s) => acc +=+s.driverpenalty, 0), [sessions])
    const totalEngineH = useMemo(() => sessions?.reduce((acc, s) => acc +=+s.enginehours, 0), [sessions])
    const violationcount = useMemo(() => sessions?.reduce((acc, s) => acc +=+s.violationcount, 0), [sessions])
    const driverpenalty = useMemo(() => sessions?.reduce((acc, s) => acc +=+s.driverpenalty, 0), [sessions])
    const maxspeed = useMemo(() => {
        const result = sessions?.map((s) => +s.maxspeed)
        return Math.max.apply(Math, result);
    }, [sessions])
    const avgspeed = useMemo(() => {
        const result = sessions?.map((s) => +s.avgspeed)
        return result ? result.reduce((acc, s) => acc +=+s, 0)/result.length : 0
    }, [sessions])

    const editBlock = useMemo(() => (
        <View style={{...styles.filtersContainer, display: isEditBlockOpen ? 'flex' : 'none'}}>
            <View style={styles.screenTitle}>
                <Text>Редактирование</Text>
                <Pressable
                    style={styles.headerButton}
                    onPress={() => setIsEditBlockOpen(false)}
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
                <ScrollView>
                    <KeyboardAvoidingView
                        behavior='padding'
                        enabled={Platform.OS === 'ios'}
                        style={styles.auth}
                    >
                            <Input
                                onChangeText={setName}
                                value={name}
                                autoCorrect={false}
                                multiline={true}
                                placeholder="Driver"
                            />
                            <Input
                                onChangeText={setPhone}
                                value={phone}
                                autoCorrect={false}
                                multiline={true}
                                placeholder="Phone"
                            />
                            <Input
                                onChangeText={setLicense}
                                value={license}
                                autoCorrect={false}
                                multiline={true}
                                placeholder="License"
                            />
                            <Input
                                onChangeText={setCategory}
                                value={category}
                                autoCorrect={false}
                                multiline={true}
                                placeholder="Category"
                            />
                            <Input
                                onChangeText={setRank}
                                value={rank}
                                autoCorrect={false}
                                multiline={true}
                                placeholder="Rank"
                            />
                    </KeyboardAvoidingView>
                </ScrollView>
                <Text style={styles.error}>
                    {error}
                </Text>
                <View style={{marginBottom: 20}}>
                    <CustomButton title={i18n.t('save')} onPress={saveDriver} isLoading={loading}/>
                </View>
            </View>
        </View>
    ), [ isEditBlockOpen, name, phone, license, rank, category])

    const report = useMemo(() => (
        <View style={{...styles.container, padding: 20}}>
            <View style={styles.subInfoRow}><Text>{i18n.t('report_interval')}:</Text></View>
            <View style={styles.subInfoRow}><Text>{convertDate(interval.from)}-{convertDate(interval.till)}</Text></View>
            <View style={styles.mainInfoRow}><Text>{i18n.t('general')}</Text></View>
            <View style={styles.subInfoRow}>
                <Text>{i18n.t('mileage')}</Text>
                {
                    sessions ? <Text>{getMileage(totalMileage)}{` ${i18n.t('km')}`}</Text> : <Text>0</Text>
                }
            </View>
            <View style={styles.subInfoRow}>
                <Text>{i18n.t('engine_hours')}</Text>
                {
                    sessions ? <Text>{getDuration(0, totalEngineH)}</Text> : <Text>0</Text>
                }
            </View>
            <View style={styles.subInfoRow}>
                <Text>{i18n.t('idle')}</Text>
                {
                    sessions ? <Text>{getDuration(0, totalIdle)}</Text> : <Text>0</Text>
                }
            </View>
            <View style={styles.mainInfoRow}><Text>{i18n.t('speed')}</Text></View>
            <View style={styles.subInfoRow}>
                <Text>{i18n.t('max_speed')}</Text>
                {
                    sessions ? <Text>{maxspeed}{` ${i18n.t('speed_text')}`}</Text> : <Text>0</Text>
                }
            </View>
            <View style={styles.subInfoRow}>
                <Text>{i18n.t('average_speed')}</Text>
                {
                    sessions ? <Text>{avgspeed}{` ${i18n.t('speed_text')}`}</Text> : <Text>0</Text>
                }
            </View>
            <View style={styles.mainInfoRow}><Text>{i18n.t('fuel')}</Text></View>
            <View style={styles.subInfoRow}>
                <Text>{i18n.t('fuel_consumption')}</Text>
                {
                    sessions ? <Text>{totalFuel}{` ${i18n.t('l')}`}</Text> : <Text>0</Text>
                }
            </View>
            <View style={styles.mainInfoRow}><Text>{i18n.t('drive')}</Text></View>
            <View style={styles.subInfoRow}>
                <Text>{i18n.t('number_of_violations')}</Text>
                {
                    sessions ? <Text>{violationcount}</Text> : <Text>0</Text>
                }
            </View>
            <View style={styles.subInfoRow}>
                <Text>{i18n.t('fines')}</Text>
                <Text>{driverpenalty}</Text>
            </View>
        </View>
    ), [sessions, interval])

    const pageBlock = useMemo(() => (
        <View style={styles.container}>
            <View style={styles.pageItemHeader}>
                <View style={styles.rightBlock}>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.headerItemButton,
                        ]}
                        onPress={() => navigation.navigate('Drivers')}
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
                    {
                        driver && (
                            <View style={styles.mainInfo}>
                                <Text style={{...styles.objectItemTitle, fontWeight: 'normal', fontSize: 12}}>{driver?.name}</Text>
                            </View>
                        )
                    }
                </View>
                <View style={styles.rightBlock}>
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
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.headerRightButton,
                        ]}
                        onPress={() => setIsEditBlockOpen(true)}
                    >
                        <Svg
                            width={20}
                            height={20}
                            viewBox="0 0 18 18"
                        >
                            <Path d="M0 14.3V18h3.8l11-11.1-3.7-3.7L0 14.3zM17.7 4c.4-.4.4-1 0-1.4L15.4.3c-.4-.4-1-.4-1.4 0l-1.8 1.8 3.7 3.8L17.7 4z"
                                  fill="#a7a7aa"/>
                        </Svg>
                    </Pressable>
                </View>
            </View>
            <ScrollView>
                {report}
            </ScrollView>
        </View>
    ), [driver, sessions, interval])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            {editBlock}
            <AppCalendarFilter interval={interval} isCalendarOpen={isCalendarOpen} setIsCalendarOpen={setIsCalendarOpen} setCalendarProperties={setInterval}/>
            {
                !isEditBlockOpen && !isCalendarOpen ? pageBlock : null
            }
        </SafeAreaView>
    );
};

export default DriverItemScreen;
