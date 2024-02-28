import {
    ImageBackground,
    Text,
    View,
    Image,
    SafeAreaView,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import {TextInput} from 'react-native-paper';
import React, {useEffect, useMemo, useState} from "react";
import i18n from '../../utils/i18'
import styles from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {changeServer, getToken, reloadApp, setAppLanguage} from "../../store/app/appActions";
import CustomButton from "../../components/button/Button";
import RNPickerSelect from "react-native-picker-select";
import Loading from "../../components/loading/Loading";

const background = require('../../../assets/bg_auth.png')
const logo = require('../../../assets/logo.png')
export default function AuthScreen({navigation}) {
    const servers = useSelector(state => state.app.servers)
    const currentServer = useSelector(state => state.app.currentServer)
    const languages = useSelector(state => state.app.languages)
    const lang = useSelector(state => state.app.language)

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [hidePass, setHidePass] = useState(true);
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState('')

    const [host, setHost] = useState()

    const dispatch = useDispatch();

    useEffect(() => {
        if(host) {
            dispatch(changeServer(host))
        }
    }, [host]);

    useEffect(() => {
        if(currentServer) {
            setHost(currentServer.replace('https://', ''))
        }
    }, []);

    const formatLangArray = useMemo(() => {
        return languages.map(item => ({
            label: Object.values(item)[0], value: Object.keys(item)[0]
        }))
    }, [languages])

    const formatServerArray = useMemo(() => {
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
                                    {i18n.t('auth_title')}
                                </Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={i18n.t('user')}
                                        autoCorrect={false}
                                        autoCapitalize='none'
                                        activeOutlineColor="#326A81"
                                        returnKeyType="next"
                                        mode="outlined"
                                        blurOnSubmit={false}
                                        onChangeText={setUserName}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={i18n.t('password')}
                                        autoCorrect={false}
                                        autoCapitalize='none'
                                        activeOutlineColor="#326A81"
                                        returnKeyType="next"
                                        mode="outlined"
                                        selectionColor="#326A81"
                                        blurOnSubmit={false}
                                        onChangeText={setPassword}
                                        secureTextEntry={hidePass ? true : false}
                                        right={<TextInput.Icon icon="eye" onPress={() => setHidePass(!hidePass)}/>}
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
                                        placeholder={{value: 'select_item', label: i18n.t('select_item')}}
                                    />
                                </View>
                                <CustomButton
                                    title={i18n.t('sign_in')}
                                    isLoading={loading}
                                    btnColor={'#FFA500'}
                                    onPress={submitHandler}
                                />
                        <View style={{ marginTop: 20, marginBottom: 50, ...styles.row }}>
                        <Text style={styles.text}>{i18n.t('interface_language')}</Text>
                            <RNPickerSelect
                                onValueChange={(itemValue) => dispatch(setAppLanguage(itemValue))}
                                items={formatLangArray}
                                style={pickerSelectStylesLanguage}
                                value={lang}
                                placeholder={{value: 'select_item', label: i18n.t('select_item')}}
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
        minWidth: 150,
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
