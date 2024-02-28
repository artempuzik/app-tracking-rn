import React, {useMemo, useState} from 'react';
import {View, Text, ScrollView, Platform, KeyboardAvoidingView} from 'react-native';
import {TextInput} from 'react-native-paper';
import i18n from '../../../utils/i18'
import styles from '../styles'
import CustomButton from "../../../components/button/Button";
import {useDispatch} from "react-redux";
import {changeSelfPassword} from "../../../store/user/usersActions";

const AppProfile = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [hideCurrentPassword, setHideCurrentPassword] = useState(true)
    const [hideNewPassword, setHideNewPassword] = useState(true)
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true)
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
                            <Text style={styles.text}>{i18n.t('password')}</Text>
                            <TextInput
                                style={styles.inputPass}
                                placeholder={i18n.t('password')}
                                autoCorrect={false}
                                autoCapitalize='none'
                                activeOutlineColor="#326A81"
                                returnKeyType="next"
                                mode="outlined"
                                selectionColor="#326A81"
                                blurOnSubmit={false}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={hideCurrentPassword ? true : false}
                                right={<TextInput.Icon icon="eye" onPress={() => setHideCurrentPassword(!hideCurrentPassword)}/>}
                            />
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>{i18n.t('new_password')}</Text>
                            <TextInput
                                style={styles.inputPass}
                                placeholder={i18n.t('new_password')}
                                autoCorrect={false}
                                autoCapitalize='none'
                                activeOutlineColor="#326A81"
                                returnKeyType="next"
                                mode="outlined"
                                selectionColor="#326A81"
                                blurOnSubmit={false}
                                onChangeText={setNewPassword}
                                secureTextEntry={hideNewPassword ? true : false}
                                right={<TextInput.Icon icon="eye" onPress={() => setHideNewPassword(!hideNewPassword)}/>}
                            />
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>{i18n.t('confirm_password')}</Text>
                            <TextInput
                                style={styles.inputPass}
                                placeholder={i18n.t('confirm_password')}
                                autoCorrect={false}
                                autoCapitalize='none'
                                activeOutlineColor="#326A81"
                                returnKeyType="next"
                                mode="outlined"
                                selectionColor="#326A81"
                                blurOnSubmit={false}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={hideConfirmPassword ? true : false}
                                right={<TextInput.Icon icon="eye" onPress={() => setHideConfirmPassword(!hideConfirmPassword)}/>}
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
                        title={i18n.t('save')}
                        isLoading={loading}
                        onPress={submit}
                    />
                </View>
    );
};

export default AppProfile;
