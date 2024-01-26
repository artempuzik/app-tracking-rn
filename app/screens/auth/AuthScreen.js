import {
    ImageBackground,
    Text,
    TextInput,
    View,
    Image,
    Pressable,
    SafeAreaView,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import React, {useEffect, useMemo, useState} from "react";
import styles from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {changeServer, getToken} from "../../store/app/appActions";
import {BASE_URL, LANGUAGE_LIST, SERVERS} from "../../config";
import CustomButton from "../../components/button/Button";
import RNPickerSelect from "react-native-picker-select";
import {setLanguage} from "../../store/app";
import axios from "../../api/instance";

const background = require('../../../assets/bg_auth.png')
const logo = require('../../../assets/logo.png')
export default function AuthScreen({navigation}) {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [language, setLang] = useState('ru')
    const [error, setError] = useState('')

    const [host, setHost] = useState(BASE_URL)

    const dispatch = useDispatch();

    const servers = useSelector(state => state.app.servers)

    const languages = useSelector(state => state.app.languages)

    useEffect(() => {
        dispatch(setLanguage(language))
    }, [language]);

    useEffect(() => {
        if(host) {
            changeServer(host).catch((err) => setError(err.message))
        }
    }, [host]);

    const pressRegistrationBtnHandler = () => {
        navigation.navigate('Registration')
    }

    const goToResetPasswordScreen = () => {
        navigation.navigate('ResetPassword')
    }

    const formatLangArray = useMemo(() => {
        return languages.map(item => ({
            label: Object.values(item)[0], value: Object.keys(item)[0]
        }))
    }, [])

    const formatServerArray = useMemo(() => {
        if(servers.length) {
            setHost(servers[0])
        }
        return servers.map(item => ({
            label: item, value: item
        }))
    }, [servers])

    const submitHandler = () => {
        if(!userName || !password) {
            return
        }
        try {
            setError('')
            setLoading(true)
            dispatch(getToken({
                userName,
                password,
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

    return (
        <SafeAreaView style={styles.container}>
                <ImageBackground
                    source={background}
                    style={styles.background}
                    resizeMode={'cover'}
                >
                    <View style={styles.mainContainer}>
                        <Image
                            source={logo}
                            style={styles.logo}
                            alt="logotype"
                            resizeMode={'contain'}
                        />
                        <ScrollView style={{flex: 1, marginTop: '20%'}}>
                            <KeyboardAvoidingView
                                behavior='padding'
                                enabled={Platform.OS === 'ios'}
                                style={styles.auth}
                            >
                                <Text style={styles.title}>
                                    Авторизация
                                </Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={setUserName}
                                        autoCorrect={false}
                                        autoCapitalize='none'
                                        placeholder="Пользователь"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={setPassword}
                                        autoCorrect={false}
                                        autoCapitalize='none'
                                        placeholder="Пароль"
                                        secureTextEntry={true}
                                    />
                                </View>
                                <Text style={styles.error}>
                                    {error}
                                </Text>
                                <View style={styles.inputContainer}>
                                    <RNPickerSelect
                                        onValueChange={(itemValue) => setHost(itemValue)}
                                        items={formatServerArray}
                                        style={pickerSelectStylesServers}
                                        value={host}
                                    />
                                </View>
                                <CustomButton
                                    title={'Войти'}
                                    isLoading={loading}
                                    btnColor={'#FFA500'}
                                    onPress={submitHandler}
                                />
                                <View style={{ marginTop: 20 }}>
                                    <Pressable
                                        onPress={goToResetPasswordScreen}
                                    >
                                        <Text style={styles.links}>Забыли пароль?</Text>
                                    </Pressable>
                                </View>
                                <View style={{ marginTop: 20, ...styles.row }}>
                                    <Text style={styles.text}>Нет аккаунта?</Text>
                                    <Pressable
                                        onPress={pressRegistrationBtnHandler}
                                    >
                                        <Text style={styles.links}>Зарегистрироваться</Text>
                                    </Pressable>
                                </View>
                        <View style={{ marginTop: 20, marginBottom: 50, ...styles.row }}>
                        <Text style={styles.text}>Язык интерфейса:</Text>
                            <RNPickerSelect
                                onValueChange={(itemValue) => setLang(itemValue)}
                                items={formatLangArray}
                                style={pickerSelectStylesLanguage}
                                value={language}
                            />
                    </View>
                            </KeyboardAvoidingView>
                        </ScrollView>
                    </View>
                </ImageBackground>
        </SafeAreaView>
    );
}

const pickerSelectStylesLanguage = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingHorizontal: 10,
        color: 'white',
        paddingRight: 30,
        backgroundColor: 'transparent',
        fontWeight: 'bold',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingRight: 30,
        fontWeight: 'bold',
        color: 'white',
    },
});

const pickerSelectStylesServers = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#a7a7aa',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        backgroundColor: 'white',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: '#a7a7aa',
        borderRadius: 8,
        paddingRight: 30,
        backgroundColor: 'white',
    },
});
