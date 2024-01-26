import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Platform, KeyboardAvoidingView} from 'react-native';
import styles from '../styles'
import {useDispatch, useSelector} from "react-redux";
import SelectList from "../../../components/select/SelectList";
import {CODE_LIST, LANGUAGE_LIST, METRICS_LIST} from "../../../config";
import CustomButton from "../../../components/button/Button";
import {setLanguage} from "../../../store/app";
import {changeUser} from "../../../store/user/usersActions";

const AppGeneralSettings = () => {
    const [language, setLang] = useState('ru')
    const [flags, setFlags] = useState('')
    const [geocoder, setGeocoder] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setLanguage(language))
    }, [language]);

    const user = useSelector(state => state.user.currentUser)

    const languages = useSelector(state => state.app.languages)

    useEffect(() => {
        if(user) {
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
            })).then((response) => {
                console.log(response)
                setLoading(false)
                if(response.error) {
                    setError(response.error)
                }
            })
        } catch (e) {
            setLoading(false)
        }
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
                            <SelectList items={languages} value={user.language} onChange={setLang}/>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>Карта по умолчанию</Text>
                            <SelectList items={METRICS_LIST} value={user.flags} onChange={setFlags}/>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>Система измерения</Text>
                            <SelectList items={CODE_LIST} value={user.geocoder} onChange={setGeocoder}/>
                        </View>
                        <Text style={styles.error}>
                            {error}
                        </Text>
                        </KeyboardAvoidingView>
                    </ScrollView>
                    <CustomButton
                        title={'Сохранить'}
                        isLoading={loading}
                    />
                </View>
    );
};

export default AppGeneralSettings;
