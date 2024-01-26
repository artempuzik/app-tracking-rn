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
    KeyboardAvoidingView
} from 'react-native';
import React, {useMemo, useState} from "react";
import styles from "./styles";
import {useDispatch} from "react-redux";
import {recoverPassword} from "../../store/user/usersActions";
import CustomButton from "../../components/button/Button";
import {emailValidator} from "../../utils/helpers";

const background = require('../../../assets/bg_auth.png')
const logo = require('../../../assets/logo.png')
export default function ResetPasswordScreen({navigation}) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [isSandedMessage, setIsSandedMessage] = useState(false)

    const dispatch = useDispatch();

    const goToAuthScreen = () => {
        navigation.navigate('Auth')
    }

    const isVerifyEmail = useMemo(() => {
        return emailValidator(email)
    }, [email])

    const submitHandler = () => {
        console.log(isVerifyEmail)
        if(!isVerifyEmail) {
            setError('Invalid Email')
            return
        }
        try {
            setError('')
            setLoading(true)
            dispatch(recoverPassword(email)).then((response) => {
                if(response.error) {
                    setError(response.error)
                } else {
                    setError('')
                    setIsSandedMessage(true)
                }
                setLoading(false)
            })
        } catch (e) {
            setError(e.message)
            setLoading(false)
        }

    }

    const resetPasswordBlock = useMemo(() => {
        return (
            <SafeAreaView style={styles.auth}>
                <ScrollView style={{flex: 1, marginTop: '40%'}}>
                    <KeyboardAvoidingView
                        behavior='padding'
                        enabled={Platform.OS === 'ios'}
                        style={styles.auth}
                    >
                <Text style={styles.title}>
                    Восстановление пароля
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCorrect={false}
                        autoCapitalize='none'
                        placeholder="Ваша электронная почта"
                        keyboardType="email-address"
                    />
                </View>
                <CustomButton
                    title={'Отправить запрос'}
                    isLoading={loading}
                    btnColor={'#FFA500'}
                    onPress={submitHandler}
                />
                <Text style={styles.error}>
                    {error}
                </Text>
                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView>
        )
    }, [error, loading, email])

    const messageBlock = useMemo(() => {
        return (
            <View style={styles.auth}>
                <Text style={styles.title}>
                    Восстановление пароля
                </Text>
                <Text style={styles.subTitle}>
                    В течении 5 минут Вам на почту придет письмо с инструкцией по восстановлению пароля.
                </Text>
                <View style={styles.row }>
                    <Text style={styles.text}>Не пришло письмо? </Text>
                    <Pressable
                        onPress={() => setIsSandedMessage(false)}
                    >
                        <Text style={styles.links}>Повторить запрос</Text>
                    </Pressable>
                </View>
            </View>
        )
    }, [])

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
                    {
                        isSandedMessage ?
                        messageBlock :
                        resetPasswordBlock }
                    <View style={{ marginTop: 20, marginBottom: 50, ...styles.row }}>
                        <Text style={styles.text}>Вернуться к </Text>
                        <Pressable
                            onPress={goToAuthScreen}
                        >
                            <Text style={styles.links}>Авторизации</Text>
                        </Pressable>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}
