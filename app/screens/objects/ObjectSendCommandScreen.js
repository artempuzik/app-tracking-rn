import React, {useCallback, useMemo, useState} from 'react';
import {
    View,
    Text,
    Pressable,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Svg, {Path} from "react-native-svg";
import {useDispatch, useSelector} from "react-redux";
import Checkbox from 'expo-checkbox';
import styles from './styles';
import AppHeader from "../../components/header/AppHeader";
import * as SMS from 'expo-sms';
import i18n from "../../utils/i18";
import AppModal from "../../components/modal/AppModal";
import {sendCustomCommand} from "../../store/objects/objectsActions";
import {Image} from "expo-image";
const ObjectSendCommandScreen = ({navigation}) => {
    const route = useRoute();
    const dispatch = useDispatch()
    const [isSmsAvailable, setIsSmsAvailable] = useState(false)
    const [sendSmsMessages, setSendSmsMessages] = useState(false)
    const [message, setMessages] = useState('')
    const [isModalShow, setIsModalShow] = useState(false)
    const profile = useSelector(state => state.app.profile)

    const icons = useSelector(state => state.objects.icons)
    const baseUrl = useSelector(state => state.app.currentServer)
    const element = useMemo(() => profile.objects.find(el => el.id == route.params.id, [profile]))

    SMS.isAvailableAsync().then((data) => {
        setIsSmsAvailable(data)
    });

    const sendDirectSms = useCallback(async (msg, phone) => {
        try {
        SMS.sendSMSAsync(
            [phone],
            msg,
        ).then(data => {
            Alert.alert('Result: ' + data.result);
            setTimeout(() => navigation.navigate('ObjectItem', {id: route.params.id}), 1000)
        });
        } catch (err) {
            console.warn(err);
        }
    }, [element, message])

    const icon = useMemo(() => {
        return icons.find((ic) => ic.id == element?.iconid)
    }, [element, icons])

    const sendCommand = useCallback(() => {
        if(sendSmsMessages) {
            console.log(isSmsAvailable)
            if(!isSmsAvailable) {
                Alert.alert('Sms is not available');
                navigation.navigate('ObjectItem', {id: route.params.id})
                return
            }
            sendDirectSms(message, element.phone).catch()
        } else {
            dispatch(sendCustomCommand({
                objectID: element.id,
                templateID: 0,
                command: message
            })).then(res => {
                if(!res.error) {
                    Alert.alert('Successfully sent');
                } else {
                    Alert.alert(res.error);
                }
            })
        }
    })

    const sendTemplateCommand = useCallback((template) => {
        if(sendSmsMessages) {
            if(!isSmsAvailable) {
                Alert.alert('Sms is not available');
                navigation.navigate('ObjectItem', {id: route.params.id})
                return
            }
            sendDirectSms(template.cmd, element.phone).catch()
        } else {
            dispatch(sendCustomCommand({
                objectID: element.id,
                templateID: template.id,
                cmd: template.cmd
            })).then(res => {
                if(!res.error) {
                    Alert.alert('Successfully sent');
                } else {
                    Alert.alert(res.error);
                }
            })
        }
    })

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
                    <Image
                        style={styles.image}
                        height={icon?.height}
                        width={icon?.width}
                        source={baseUrl + icon?.url}
                        contentFit="fill"
                    />
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
                    profile && profile.commandtemplates.map((command, idx) => (
                        <Pressable
                            key={idx}
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
            <AppModal
                isModalOpen={isModalShow}
                setIsModalOpen={setIsModalShow}
                onPress={sendCommand}
                buttonTitle={'send_command'}
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
