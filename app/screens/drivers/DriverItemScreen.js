import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import {useDispatch, useSelector} from "react-redux";
import AppHeader from "../../components/header/AppHeader";
import {useRoute} from "@react-navigation/native";
import {editDriver, getDriverById, getDriverSessionById} from "../../store/drivers/driversActions";
import Svg, {Path} from "react-native-svg";
import AppCalendarFilter from "../../components/calendar/AppCalendarFilter";
import CustomButton from "../../components/button/Button";
import SelectList from "../../components/select/SelectList";
import {getToken} from "../../store/app/appActions";

const DriverItemScreen = ({navigation}) => {
    const route = useRoute();
    const [driver, setDriver] = useState(null)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [sessions, setSessions] = useState([])
    const [interval, setInterval] = useState({
        from: 0,
        till: 0,
    })

    const [isEditBlockOpen, setIsEditBlockOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [driverGroups, setDriverGroups] = useState([])

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [category, setCategory] = useState('')
    const [license, setLicense] = useState('')
    const [rank, setRank] = useState('')

    const dispatch = useDispatch()

    const groups = useSelector(state => state.app.profile?.objectgroups)

    const removeGroups = useCallback((id) => {
        const filteredGroups = driverGroups.filter(g => g.id !== id)
        setDriverGroups(filteredGroups)
    })

    const addGroup = useCallback(() => {
        if(selectedGroup) {
            const isExist = !!driverGroups.find(g => g.id === selectedGroup)
            if(isExist) {
                return;
            }
            const selected = groups.find(g => g.id === selectedGroup)
            setDriverGroups([...driverGroups, selected])
            setIsGroupModalOpen(false)
        }
    },[selectedGroup, driverGroups])

    const fetchSessionData = async () => {
        try {
            setError('')
            setLoading(true)
            await dispatch(getDriverSessionById({
                from: interval.from,
                till: interval.till,
                driverID: route.params.id,
            })).then((data) => {
                if(data.response) {
                    setSessions(data.response)
                    console.log(data.response)
                }
            })
        } catch (err) {
            setError(err.message)
        }
    }

    const fetchData = async () => {
        try {
            setError('')
            setLoading(true)
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
            fetchSessionData().catch(() => {})
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

    const formatGroupArray = useMemo(() => {
        if(!groups) {
            return []
        }
        return groups.map(item => ({
            [item.id]: item.name
        }))
    }, [groups])

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
            })
        } catch (e) {
            setLoading(false)
        }
    }

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
                        <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={setName}
                                value={name}
                                autoCorrect={false}
                                autoCapitalize='none'
                                placeholder="Driver"
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={setPhone}
                                value={phone}
                                autoCorrect={false}
                                autoCapitalize='none'
                                placeholder="Phone"
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={setLicense}
                                value={license}
                                autoCorrect={false}
                                autoCapitalize='none'
                                placeholder="License"
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={setCategory}
                                value={category}
                                autoCorrect={false}
                                autoCapitalize='none'
                                placeholder="Category"
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={setRank}
                                value={rank}
                                autoCorrect={false}
                                autoCapitalize='none'
                                placeholder="Rank"
                            />
                        </View>
                        <View style={{marginVertical: 10,}}>
                            <Text>Группы в которых состоит водитель</Text>
                            <View>
                                {
                                    driverGroups.map(g =>(
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}} key={g.id}>
                                            <Text>{g.name}</Text>
                                            <Pressable
                                                style={({pressed}) => [
                                                    {
                                                        backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                                                    },
                                                    styles.headerButton,
                                                ]}
                                                onPress={() => removeGroups(g.id)}
                                            >
                                                <Svg
                                                    width={20}
                                                    height={20}
                                                    viewBox="0 0 12 15"
                                                >
                                                    <Path className="st0" d="M1 14s.1 1 1 1h8c.6 0 1-.4 1-1V4H1v10z"
                                                          fill="#a7a7aa" />
                                                    <Path className="st0" d="M12 1H9L8 0H4L3 1H0v2h12z"
                                                          fill="#a7a7aa" />
                                                </Svg>
                                            </Pressable>
                                        </View>
                                    ))
                                }

                            </View>
                        </View>
                        {
                            isGroupModalOpen ? (
                                <View style={{marginVertical: 10,}}>
                                    <SelectList items={formatGroupArray} onChange={setSelectedGroup}/>
                                    <Pressable
                                        style={({pressed}) => [
                                            {
                                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                                            },
                                            styles.resetButton,
                                            {marginTop: 10}
                                        ]}
                                        onPress={addGroup}
                                    >
                                        <Text style={styles.resetButtonText}>Добавить группу</Text>
                                    </Pressable>
                                </View>
                            ) : (
                                <Pressable
                                    style={({pressed}) => [
                                        {
                                            backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                                        },
                                        styles.resetButton,
                                    ]}
                                    onPress={() => setIsGroupModalOpen(true)}
                                >
                                    <Text style={styles.resetButtonText}>Добавить группу</Text>
                                </Pressable>
                            )
                        }
                    </KeyboardAvoidingView>
                </ScrollView>
                <Text style={styles.error}>
                    {error}
                </Text>
                <CustomButton title={'Сохранить'} onPress={saveDriver} isLoading={loading}/>
            </View>
        </View>
    ), [ isEditBlockOpen, isGroupModalOpen, selectedGroup, driverGroups, name, phone, license, rank, category])

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
        </View>
    ), [driver])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            {editBlock}
            <AppCalendarFilter isCalendarOpen={isCalendarOpen} setIsCalendarOpen={setIsCalendarOpen} setCalendarProperties={setInterval}/>
            {
                !isEditBlockOpen && !isCalendarOpen ? pageBlock : null
            }
        </SafeAreaView>
    );
};

export default DriverItemScreen;
