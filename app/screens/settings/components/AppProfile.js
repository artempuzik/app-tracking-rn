import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, ScrollView, Platform, KeyboardAvoidingView} from 'react-native';
import styles from '../styles'
import CustomButton from "../../../components/button/Button";
import {useDispatch, useSelector} from "react-redux";
import {changeUser} from "../../../store/user/usersActions";

const AppProfile = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [contactName, setContactName] = useState('')
    const [postAddress, setPostAddress] = useState('')
    const [orgName, setOrgName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.currentUser)

    useEffect(() => {
        if(user) {
            setName(user.name)
            setEmail(user.email)
            setPhoneNumber(user.phoneNumber)
            setContactName(user.contactName)
            setPostAddress(user.postAddress)
            setOrgName(user.orgName)
        }
    }, [user])

    const submitHandler = () => {
        try {
            setError('')
            setLoading(true)
            dispatch(changeUser({
                name,
                email,
                phoneNumber,
                contactName,
                postAddress,
                orgName,
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
                            <Text style={styles.text}>Пользователь</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setName}
                                value={name}
                                autoCapitalize='none'
                                placeholder="Пользователь"
                                keyboardType="default"
                            />
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>Название фирмы</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setOrgName}
                                value={orgName}
                                autoCapitalize='none'
                                placeholder="Название фирмы"
                                keyboardType="default"
                            />
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>Номер телефона</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setPhoneNumber}
                                value={phoneNumber}
                                placeholder="Номер телефона"
                                keyboardType="phone-pad"
                            />
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>Электронная почта</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setEmail}
                                value={email}
                                autoCapitalize='none'
                                placeholder="Электронная почта"
                                keyboardType="email-address"
                            />
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>Контакт</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setContactName}
                                value={contactName}
                                autoCapitalize='none'
                                placeholder="Контакт"
                            />
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.text}>Адрес</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setPostAddress}
                                value={postAddress}
                                autoCapitalize='none'
                                placeholder="Адрес"
                            />
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

export default AppProfile;
