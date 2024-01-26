import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Platform, KeyboardAvoidingView} from 'react-native';
import styles from '../styles'
import {useDispatch, useSelector} from "react-redux";
import SelectList from "../../../components/select/SelectList";
import {CODE_LIST, METRICS_LIST} from "../../../config";
import CustomButton from "../../../components/button/Button";
import {changeUser} from "../../../store/user/usersActions";

const AppGeneralSettings = () => {
    const [language, setLang] = useState('ru')
    const [flags, setFlags] = useState('')
    const [geocoder, setGeocoder] = useState('')
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
            })
        } catch (e) {
            setLoading(false)
        }
    }

    if(!user) {
        return null
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
