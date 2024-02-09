import React, {useMemo, useState} from 'react';
import {View, Image, Pressable, Text} from 'react-native';
import Svg, {Circle, Ellipse, Path} from "react-native-svg"
import { useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";
import i18n from "../../utils/i18";
import styles from './styles'
import {PRESSED_COLOR} from "../../config";
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../store/app/appActions";

const logo = require('../../../assets/logo.png')

const AppHeader = ({ canGoBack }) => {
    const navigation = useNavigation();
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const dispatch = useDispatch()

    const objects = useSelector(state => state.objects.objects)
    const currentUser = useSelector(state => state.user.currentUser)
    const logoutHandler = () => {
        setIsMenuOpen(false)
        dispatch(logOut())
    }

    const goToSettingsScreen = () => {
        navigation.navigate('Settings')
        setIsMenuOpen(false)
    }

    const goToUserScreen = () => {
        navigation.navigate('User')
        setIsMenuOpen(false)
    }

    const leftIconRender = useMemo(() => {
        if(isMenuOpen) {
            return (
                <Pressable
                    style={{...styles.headerButton, marginTop: 10}}
                    onPress={()=>setIsMenuOpen(false)}
                >
                    <Svg
                        width={30}
                        height={30}
                        viewBox="0 0 20 20"
                    >
                    <Path d="M12.6 14L8.4 9.8l1.4-1.4 4.2 4.2-1.4 1.4zM1.4 14L0 12.6 12.6 0 14 1.4 1.4 14zm2.8-8.4L0 1.4 1.4 0l4.2 4.2-1.4 1.4z" fill="#fff" />
                    </Svg>
                </Pressable>
            )
        }
        if(canGoBack) {
            return (
                <Pressable
                    style={{...styles.headerButton, marginTop: 10}}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Svg
                        width={30}
                        height={30}
                        viewBox="0 0 25 25"
                    >
                        <Path d="M0 0h4v4H0zm0 7h4v4H0zm0 7h4v4H0zM7 0h4v4H7zm0 7h4v4H7zm0 7h4v4H7zm7-14h4v4h-4zm0 7h4v4h-4zm0 7h4v4h-4z" fill="#fff"/>
                    </Svg>
                </Pressable>
            )
        }
        return (
            <View style={{...styles.headerButton, marginTop: 10}}></View>
        )

    }, [canGoBack, isMenuOpen])

    const renderModalMenu = useMemo(() => {
        return (
            <Modal
                style={styles.modalWrapper}
                backdropColor='transparent'
                animationInTiming={50}
                animationIn='fadeIn'
                animationOut='fadeOut'
                isVisible={isMenuOpen}
                onBackdropPress={() => setIsMenuOpen(false)}
            >
                <View style={styles.modalItem}>
                                        <Text style={styles.text}>{i18n.t('profile')}</Text>
                                        <View style={[styles.block, styles.profile]}>
                                            <Text>{currentUser?.name}</Text>
                                                <Pressable
                                                    onPress={goToSettingsScreen}
                                                >
                                                    <Svg
                                                        width={20}
                                                        height={20}
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <Path d="M15.885 9.877c.035-.28.058-.573.058-.877 0-.304-.023-.596-.07-.877l1.956-1.485a.456.456 0 0 0 .116-.574l-1.852-3.117c-.115-.202-.358-.27-.567-.202l-2.302.9a6.83 6.83 0 0 0-1.563-.877L11.315.383A.458.458 0 0 0 10.851 0H7.15a.446.446 0 0 0-.452.383L6.35 2.767a7.012 7.012 0 0 0-1.562.877l-2.303-.9a.464.464 0 0 0-.567.202L.067 6.064a.428.428 0 0 0 .115.574l1.956 1.485A5.502 5.502 0 0 0 2.057 9c0 .293.023.596.07.877L.17 11.364a.456.456 0 0 0-.116.573l1.852 3.117c.115.202.358.27.567.202l2.302-.9c.486.36.995.652 1.563.877l.347 2.386a.467.467 0 0 0 .463.382h3.702c.232 0 .429-.157.452-.383l.347-2.385a7.01 7.01 0 0 0 1.562-.877l2.303.9c.208.079.451 0 .567-.203l1.851-3.116a.428.428 0 0 0-.115-.573l-1.933-1.486zM9 12.375c-1.91 0-3.472-1.519-3.472-3.375S7.091 5.625 9 5.625c1.91 0 3.472 1.519 3.472 3.375S10.909 12.375 9 12.375z" fill="#a7a7aa"/>
                                                    </Svg>
                                              </Pressable>
                                        </View>
                                    <View style={styles.block}>
                                        <Text style={styles.text}>{i18n.t('object_counter')}</Text>
                                        <Text style={styles.balance}>{ objects ? objects.length : 0}</Text>
                                    </View>
                                <View style={styles.line}></View>
                                <Pressable
                                    onPress={goToUserScreen}
                                    style={({pressed}) => [
                                        {
                                            backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                                        },
                                        styles.logout,
                                    ]}
                                >
                                    <Svg
                                        width={20}
                                        height={20}
                                        viewBox="0 0 16 18"
                                    >
                                        <Path d="M8 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="#a7a7aa"/>
                                        <Path d="M8 10a8 8 0 0 1 8 8H0a8 8 0 0 1 8-8z" fill="#a7a7aa"/>
                                    </Svg>
                                    <Text style={{marginLeft: 10}}>{i18n.t('user_list')}</Text>
                                </Pressable>
                                <Pressable
                                    onPress={logoutHandler}
                                    style={({pressed}) => [
                                        {
                                            backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                                        },
                                        styles.logout,
                                    ]}
                                >
                                    <Svg
                                        width={20}
                                        height={20}
                                        viewBox="0 0 20 20"
                                    >
                                        <Path d="M9 16H0V0h9v2H2v12h7z" fill="#a7a7aa"/>
                                        <Path d="M5 7h10v2H5z" fill="#a7a7aa"/>
                                        <Path transform="rotate(-45.001 12.522 6.128)" d="M11.5 3.6h2v5.1h-2z" fill="#a7a7aa"/>
                                        <Path transform="rotate(-45.001 12.522 9.522)" d="M10 8.5h5.1v2H10z" fill="#a7a7aa"/>
                                    </Svg>
                                    <Text style={{marginLeft: 10}}>{i18n.t('log_out')}</Text>
                                </Pressable>
                </View>
            </Modal>
        )
    }, [isMenuOpen])

    return (
            <View style={styles.headerInner}>
                { leftIconRender }
                { renderModalMenu }
                <Image source={logo}
                       style={styles.logo}
                       alt="logotype"
                       resizeMode={'contain'} />
                <Pressable
                    style={styles.headerButton}
                    onPress={()=>setIsMenuOpen((prev) => !prev)}
                >
                    <Svg
                        width={30}
                        height={30}
                        viewBox="0 0 20 20"
                    >
                        <Path d="M10 20C4.5 20 0 15.5 0 10S4.5 0 10 0s10 4.5 10 10-4.5 10-10 10zm0-18c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" fill="#fff" />
                        <Circle className="st0" cx="10" cy="9" r="3" stroke="#fff" strokeWidth="2.5" fill="#fff"/>
                        <Ellipse className="st0" cx="10" cy="16.5" rx="5" ry="3.5" fill="#fff"/>
                    </Svg>
                </Pressable>
            </View>
    );
};

export default AppHeader;
