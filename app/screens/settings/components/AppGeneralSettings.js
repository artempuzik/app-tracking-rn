import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Platform, KeyboardAvoidingView} from 'react-native';
import styles from '../styles'
import {useDispatch, useSelector} from "react-redux";
import SelectList from "../../../components/select/SelectList";
import {CODE_LIST, METRICS_LIST, REFRESH_INTERVAL} from "../../../config";
import CustomButton from "../../../components/button/Button";
import {changeUser, setRefreshStatusInterval} from "../../../store/user/usersActions";
import RangeSlider from "../../../components/Slider/RangeSlider";

const AppGeneralSettings = () => {
    const [language, setLang] = useState('ru')
    const [flags, setFlags] = useState('')
    const [geocoder, setGeocoder] = useState('')
    const [interval, setInterval] = useState(REFRESH_INTERVAL)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const dispatch = useDispatch()

    const user = useSelector(state => state.user.currentUser)

    const languages = useSelector(state => state.app.languages)

    useEffect(() => {
        if(user) {
            setGeocoder(user.geocoder)
            setFlags(user.flags)
            setGeocoder(user.geocoder)
        }
    }, [user])

    const submitHandler = () => {
        try {
            setError('')
            setLoading(true)
            dispatch(changeUser({
                geocoder,
                language,
                flags,
            })).then((response) => {
                setLoading(false)
                if(response.error) {
                    setError(response.error)
                }
                dispatch(setRefreshStatusInterval(interval))
            })
        } catch (e) {
            setLoading(false)
        }
    }

    if(!user) {
        return (
            <View style={styles.settingsContainer}>
                <Text style={styles.error}>
                    Select user
                </Text>
            </View>
        )
    }

    return (
                <View style={styles.settingsContainer}>
                    <ScrollView style={styles.inputContainer}>
                        <KeyboardAvoidingView
                            behavior='padding'
                            enabled={Platform.OS === 'ios'}
                            style={styles.auth}
                        >
                        <View style={styles.block}>
                            <Text style={styles.text}>Язык интерфейса</Text>
                            <SelectList items={languages} value={language} onChange={setLang}/>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>Карта по умолчанию</Text>
                            <SelectList items={METRICS_LIST} value={flags} onChange={setFlags}/>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>Система измерения</Text>
                            <SelectList items={CODE_LIST} value={geocoder} onChange={setGeocoder}/>
                        </View>
                        <RangeSlider onChange={setInterval}/>
                        <Text style={styles.error}>
                            {error}
                        </Text>
                        </KeyboardAvoidingView>
                    </ScrollView>
                    <CustomButton
                        title={'Сохранить'}
                        isLoading={loading}
                        onPress={submitHandler}
                    />
                </View>
    );
};

export default AppGeneralSettings;
