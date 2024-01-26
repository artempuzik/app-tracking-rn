import React, {useMemo, useState} from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    Platform,
    ImageBackground,
    Pressable,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import styles from "./styles";
import CustomButton from "../../components/button/Button";
import {useDispatch} from "react-redux";
import {createNewUser} from "../../store/user/usersActions";
import {emailValidator} from "../../utils/helpers";

const RegistrationScreen = ({navigation}) => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [orgName, setOrgName] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState('')

    const dispatch = useDispatch()

    const isVerifyEmail = useMemo(() => {
        return emailValidator(email)
    }, [email])

    const isPasswordConfirm = useMemo(() => {
        return password && password === passwordConfirmation
    }, [password, passwordConfirmation])

    const isCanSubmit = useMemo(() => {
        return isVerifyEmail && isPasswordConfirm && name && orgName && phoneNumber
    }, [])

    const submit = async () => {
        setError('')
        if(!isCanSubmit) {
            setError('Invalid data')
            return
        }
        setLoading(true)
        try {
            dispatch(createNewUser({
                name,
                email,
                phoneNumber,
                orgName,
                password,
                passwordConfirmation,
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

    const goToAuthScreen = () => {
        navigation.navigate('Auth')
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
                    <ScrollView style={{flex: 1, marginTop: '10%'}}>
                        <KeyboardAvoidingView
                            behavior='padding'
                            enabled={Platform.OS === 'ios'}
                            style={styles.auth}
                        >
                            <Text style={styles.title}>
                                Регистрация
                            </Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setName}
                                    autoCapitalize='none'
                                    placeholder="Пользователь"
                                    keyboardType="default"
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setEmail}
                                    autoCapitalize='none'
                                    placeholder="Электронная почта"
                                    keyboardType="email-address"
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setPhoneNumber}
                                    placeholder="Номер телефона"
                                    keyboardType="phone-pad"
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setOrgName}
                                    autoCapitalize='none'
                                    placeholder="Название фирмы"
                                    keyboardType="default"
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setPassword}
                                    autoCapitalize='none'
                                    placeholder="Пароль"
                                    secureTextEntry={true}
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setPasswordConfirmation}
                                    autoCapitalize='none'
                                    placeholder="Повторите пароль"
                                    secureTextEntry={true}
                                />
                            </View>
                            <CustomButton
                                title={'Продолжить работу'}
                                isLoading={loading}
                                btnColor={'#FFA500'}
                                onPress={submit}
                            />
                            <Text style={styles.error}>
                                {error}
                            </Text>
                            <View style={{ marginTop: 20, marginBottom: 50, ...styles.row }}>
                                <Text style={styles.text}>Уже есть аккаунт?</Text>
                                <Pressable
                                    onPress={goToAuthScreen}
                                >
                                    <Text style={styles.links}>Авторизоваться</Text>
                                </Pressable>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
        </ImageBackground>
    </SafeAreaView>
);
};
const background = require('../../../assets/bg_auth.png')
const logo = require('../../../assets/logo.png')

export default RegistrationScreen;
