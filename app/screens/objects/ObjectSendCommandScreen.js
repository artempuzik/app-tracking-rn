import React, {useCallback, useMemo, useState} from 'react';
import {View, Text, Pressable, ScrollView, TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Svg, {Path} from "react-native-svg";
import {useDispatch, useSelector} from "react-redux";
import Checkbox from 'expo-checkbox';
import styles from './styles';
import AppHeader from "../../components/header/AppHeader";
import CustomButton from "../../components/button/Button";
import i18n from "../../utils/i18";
import AppModal from "../../components/modal/AppModal";
import {sendCustomCommand} from "../../store/objects/objectsActions";

const ObjectSendCommandScreen = ({navigation}) => {
    const route = useRoute();
    const dispatch = useDispatch()
    const [sendSmsMessages, setSendSmsMessages] = useState(false)
    const [message, setMessages] = useState('')
    const [isModalShow, setIsModalShow] = useState(false)

    const profile = useSelector(state => state.app.profile)

    const element = useMemo(() => profile.objects.find(el => el.id == route.params.id, [profile]))

    const sendCommand = useCallback(() => {
        dispatch(sendCustomCommand({
            objectID: element.id,
            templateID: "",
            cmd: message

        }))
    })

    const sendTemplateCommand = useCallback((template) => {
        dispatch(sendCustomCommand({
            objectID: element.id,
            templateID: template.id,
            cmd: template.cmd

        }))
    })
    console.log(element)

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            <View style={styles.screenTitle}>
                <Text>{i18n.t('send_command')}</Text>
                <Pressable
                    style={styles.headerButton}
                    onPress={() => navigation.navigate('ObjectItem', {id: route.params.id})}
                >
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                    >
                        <Path d="M12.6 14L8.4 9.8l1.4-1.4 4.2 4.2-1.4 1.4zM1.4 14L0 12.6 12.6 0 14 1.4 1.4 14zm2.8-8.4L0 1.4 1.4 0l4.2 4.2-1.4 1.4z" fill="#a7a7aa" />
                    </Svg>
                </Pressable>
            </View>
            <View style={{...styles.pageItemHeader, justifyContent: 'space-between'}}>
                <View style={styles.leftBlock}>
                    <Text style={styles.subText}>{i18n.t('object')}:</Text>
                    <Svg
                        width={30}
                        height={30}
                        viewBox="0 0 313 512.52"
                    >
                        <Path d="M42.3 110.94c2.22 24.11 2.48 51.07 1.93 79.75-13.76.05-24.14 1.44-32.95 6.69-4.96 2.96-8.38 6.28-10.42 12.15-1.37 4.3-.36 7.41 2.31 8.48 4.52 1.83 22.63-.27 28.42-1.54 2.47-.54 4.53-1.28 5.44-2.33.55-.63 1-1.4 1.35-2.31 1.49-3.93.23-8.44 3.22-12.08.73-.88 1.55-1.37 2.47-1.61-1.46 62.21-6.21 131.9-2.88 197.88 0 43.41 1 71.27 43.48 97.95 41.46 26.04 117.93 25.22 155.25-8.41 32.44-29.23 30.38-50.72 30.38-89.54 5.44-70.36 1.21-134.54-.79-197.69.69.28 1.32.73 1.89 1.42 2.99 3.64 1.73 8.15 3.22 12.08.35.91.8 1.68 1.35 2.31.91 1.05 2.97 1.79 5.44 2.33 5.79 1.27 23.9 3.37 28.42 1.54 2.67-1.07 3.68-4.18 2.31-8.48-2.04-5.87-5.46-9.19-10.42-12.15-8.7-5.18-18.93-6.6-32.44-6.69-.75-25.99-1.02-51.83-.01-77.89C275.52-48.32 29.74-25.45 42.3 110.94zm69.63-90.88C83.52 30.68 62.75 48.67 54.36 77.59c21.05-15.81 47.13-39.73 57.57-57.53zm89.14-4.18c28.41 10.62 49.19 28.61 57.57 57.53-21.05-15.81-47.13-39.73-57.57-57.53zM71.29 388.22l8.44-24.14c53.79 8.36 109.74 7.72 154.36-.15l7.61 22.8c-60.18 28.95-107.37 32.1-170.41 1.49zm185.26-34.13c5.86-34.1 4.8-86.58-1.99-120.61-12.64 47.63-9.76 74.51 1.99 120.61zM70.18 238.83l-10.34-47.2c45.37-57.48 148.38-53.51 193.32 0l-12.93 47.2c-57.58-14.37-114.19-13.21-170.05 0zM56.45 354.09c-5.86-34.1-4.8-86.58 1.99-120.61 12.63 47.63 9.76 74.51-1.99 120.61z"
                        fill={element?.color || "#a7a7aa"}/>
                    </Svg>
                    <View style={{...styles.mainInfo, flexDirection: 'row'}}>
                        <Text style={{...styles.objectItemTitle, fontWeight: 'normal', fontSize: 12, marginRight: 10}}>{element?.name}</Text>
                        <Text style={{...styles.subText, fontSize: 12}}>({element?.comment})</Text>
                    </View>
                </View>
            </View>
            <View style={{...styles.line, marginTop: 0}}></View>
            <ScrollView style={styles.textContainer}>
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        color='#2060ae'
                        value={sendSmsMessages}
                        onValueChange={setSendSmsMessages}
                        style={styles.checkbox}
                    />
                    <Text style={styles.label}>{i18n.t('send_command_by_sms')}</Text>
                </View>
                {
                    profile && profile.commandtemplates.map((command) => (
                        <Pressable
                            style={({pressed}) => [
                                {
                                    backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                                },
                                styles.sendCommentButton,
                                {width: '100%', marginVertical: 5}
                            ]}
                            onPress={() => sendTemplateCommand(command)}
                        >
                            <Text style={styles.commentText}>{command.name}</Text>
                        </Pressable>
                    ))
                }
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                        },
                        styles.sendCommentButton,
                        {width: '100%', marginVertical: 5}
                    ]}
                    onPress={() => setIsModalShow(true)}
                >
                    <Text style={styles.commentText}>{i18n.t('custom_command')}</Text>
                </Pressable>
            </ScrollView>
            <View style={{paddingHorizontal: 20}}>
                <CustomButton
                    title={i18n.t('save')}
                    onPress={() => {}} />
            </View>
            <AppModal
                isModalOpen={isModalShow}
                setIsModalOpen={setIsModalShow}
                onPress={sendCommand}
            >
                <View style={{paddingHorizontal: 20}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>{i18n.t('typed_command')}</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setMessages}
                        value={message}
                        autoCorrect={false}
                        autoCapitalize='none'
                    />
                </View>
            </AppModal>
        </SafeAreaView>
    );
};

export default ObjectSendCommandScreen;
