import React, {useMemo, useState} from 'react';
import {View, Text, TextInput, ScrollView, Platform, KeyboardAvoidingView} from 'react-native';
import styles from '../styles'
import CustomButton from "../../../components/button/Button";
import {useDispatch} from "react-redux";
import {changeSelfPassword} from "../../../store/user/usersActions";

const AppProfile = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const dispatch = useDispatch()

    const isOldPassMatch = useMemo(() => {
        if(!currentPassword || (currentPassword && !newPassword)) {
            return false
        }
        return currentPassword === newPassword
    }, [currentPassword, newPassword])

    const isConfirmPassMatch = useMemo(() => {
        if(!confirmPassword || !newPassword) {
            return false
        }
        return confirmPassword === newPassword
    }, [confirmPassword, newPassword])

    const submit = () => {
        setError('')
        if(!isConfirmPassMatch) {
            setError('New password is not correct')
        }
        if(isOldPassMatch) {
            return
        }
        try{
            setLoading(true)
            dispatch(changeSelfPassword({
                password: newPassword,
                passwordConfirmation: confirmPassword,
                oldPassword: currentPassword
            })).then((response) => {
                setLoading(false)
                if(response.error) {
                    setError(response.error)
                }
            })
        } catch(err) {
            setError(err.message)
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
                            <Text style={styles.text}>Пароль</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setCurrentPassword}
                                autoCapitalize='none'
                                placeholder="Пароль"
                                keyboardType="visible-password"
                                secureTextEntry={true}
                            />
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>Новый пароль</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setNewPassword}
                                autoCapitalize='none'
                                placeholder="Новый пароль"
                                keyboardType="visible-password"
                                secureTextEntry={true}
                            />
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>Подтверждение пароля</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setConfirmPassword}
                                placeholder="Подтверждение пароля"
                                keyboardType="visible-password"
                                secureTextEntry={true}
                            />
                        </View>
                        {
                            isOldPassMatch &&  <Text style={styles.error}>The new password must be different from the current one</Text>
                        }
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

export default AppProfile;
