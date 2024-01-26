import React, {useEffect} from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {Circle, Path} from "react-native-svg"
import styles from './styles'
import {PRESSED_COLOR} from "../../config";
import AppHeader from "../../components/header/AppHeader";
import {useDispatch} from "react-redux";
import {getProfileData} from "../../store/app/appActions";
import {getUsers} from "../../store/user/usersActions";

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getProfileData())
        dispatch(getUsers())
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={false} />
            <ScrollView style={styles.buttons}>
                <View style={styles.mainMenuBlock}>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                            },
                            styles.mainMenuItem,
                        ]}
                        onPress={() => {navigation.navigate('Objects')}}
                    >
                        <Svg
                            width={30}
                            height={30}
                            viewBox="0 0 20 20"
                        >
                            <Path className="st0" d="M18.1 4.3c-.3-.3-.9-.4-1.2 0L4.3 16.9c-.3.3-.3.9 0 1.2a9.9 9.9 0 0 0 13.9 0c3.8-3.8 3.7-9.9-.1-13.8z" fill="#a7a7aa"/>
                            <Path className="st0" d="M11.3 22c-2.7 0-5.5-1-7.6-3.1-.7-.8-.7-1.9 0-2.7L16.2 3.6c.8-.8 2-.7 2.7 0 4.1 4.2 4.2 11 0 15.2C16.8 21 14 22 11.3 22zm-6.2-4.4c3.5 3.3 8.9 3.3 12.4-.1 3.3-3.4 3.3-8.9 0-12.3L5.1 17.6z" fill="#a7a7aa"/>
                            <Path className="st0" d="M.1 8.9c0-.1-.6-3.6 1.6-6.2C3.2.9 5.6 0 8.8 0v2c-2.6 0-4.4.7-5.6 2C1.6 5.9 2 8.5 2 8.5l-1.9.4zm6.5-.2h-2c0-2.2 1.8-4.1 4.1-4.1v2c-1.2 0-2.1 1-2.1 2.1z" fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.buttonTitle}>Объекты</Text>
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                            },
                            styles.mainMenuItem,
                        ]}
                    >
                        <Svg
                            width={30}
                            height={30}
                            viewBox="0 0 20 20"
                        >
                            <Circle cx="2" cy="16" r="2"  fill="#a7a7aa"/>
                            <Circle cx="16" cy="2" r="2"  fill="#a7a7aa"/>
                            <Circle cx="2" cy="2" r="2"  fill="#a7a7aa"/>
                            <Path fill-rule="evenodd" d="M3 3h12v3h2V1H1v16h7v-2H3V3z" clip-rule="evenodd"  fill="#a7a7aa"/>
                            <Path d="M16.873 18l-.675-2.37h-3.396L12.127 18H10l3.287-10H15.7L19 18h-2.127zm-1.147-4.142c-.624-2.148-.977-3.363-1.057-3.644a12.167 12.167 0 0 1-.166-.668c-.14.582-.541 2.019-1.204 4.312h2.427z"  fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.buttonTitle}>Геозоны</Text>
                    </Pressable>
                </View>
                <View style={styles.mainMenuBlock}>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                            },
                            styles.mainMenuItem,
                        ]}
                        onPress={() => {navigation.navigate('Drivers')}}
                    >
                        <Svg
                            width={30}
                            height={30}
                            viewBox="0 0 25 25"
                        >
                            <Path d="M12 24C5.4 24 0 18.6 0 12S5.4 0 12 0s12 5.4 12 12-5.4 12-12 12zm0-22C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" fill="#a7a7aa"/>
                            <Circle cx="12" cy="12" r="5.1" fill="#a7a7aa"/>
                            <Path d="M20.4 18l-8.2-4.7L3.9 18l-1-1.7 8.1-4.7V1.7h2v9.7l8.4 4.9z" fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.buttonTitle}>Водители</Text>
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                            },
                            styles.mainMenuItem,
                        ]}
                    >
                        <Svg
                            width={30}
                            height={30}
                            viewBox="0 0 20 20"
                        >
                            <Path d="M17.071 2.929A9.934 9.934 0 0 1 20 10a9.935 9.935 0 0 1-2.929 7.071A9.935 9.935 0 0 1 10 20a9.935 9.935 0 0 1-7.071-2.929A9.935 9.935 0 0 1 0 10.001a9.934 9.934 0 0 1 2.929-7.072A9.935 9.935 0 0 1 10 0a9.935 9.935 0 0 1 7.071 2.929zm-.884 13.258a8.69 8.69 0 0 0 2.388-4.435c-.263.388-.514.532-.67-.336-.16-1.414-1.46-.51-2.276-1.013-.86.58-2.791-1.126-2.463.798.506.867 2.734-1.161 1.624.674-.708 1.282-2.59 4.12-2.346 5.591.031 2.144-2.19.447-2.955-.264-.515-1.424-.176-3.913-1.522-4.61-1.46-.064-2.715-.197-3.28-1.83-.342-1.169.362-2.908 1.614-3.177 1.833-1.151 2.488 1.349 4.207 1.395.534-.558 1.989-.736 2.11-1.362-1.129-.199 1.43-.948-.109-1.375-.849.1-1.396.88-.945 1.543-1.645.383-1.698-2.381-3.28-1.51-.04 1.38-2.582.448-.879.168.585-.256-.954-.996-.122-.862.408-.022 1.783-.504 1.411-.828.766-.475 1.41 1.139 2.16-.037.54-.903-.228-1.07-.906-.612-.382-.428.675-1.353 1.608-1.753.31-.133.608-.205.835-.185.47.543 1.339.637 1.384-.065A8.717 8.717 0 0 0 10 1.25c-1.907 0-3.72.606-5.22 1.726.402.185.631.415.243.71-.302.899-1.527 2.106-2.602 1.935a8.653 8.653 0 0 0-1.083 3.136c.9.298 1.108.887.914 1.085-.458.4-.74.967-.886 1.588a8.685 8.685 0 0 0 2.447 4.757A8.693 8.693 0 0 0 10 18.75c2.337 0 4.534-.91 6.187-2.563z" fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.buttonTitle}>Карта</Text>
                    </Pressable>
                </View>
                <View style={styles.mainMenuBlock}>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                            },
                            styles.mainMenuItem,
                        ]}
                    >
                        <Svg
                            width={30}
                            height={30}
                            viewBox="0 0 352.8 341.8"
                        >
                            <Path d="M0 341.8h352.8L176.4 0 0 341.8zm32.8-20L176.4 43.6 320 321.8H32.8z" fill="#a7a7aa"/>
                            <Path d="M161.7 258.6h29.5v33.2h-29.5z" fill="#a7a7aa"/>
                            <Path d="M161.7 134.1h29.5v99h-29.5z" fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.buttonTitle}>События</Text>
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                            },
                            styles.mainMenuItem,
                        ]}
                    >
                        <Svg
                            width={30}
                            height={30}
                            viewBox="0 0 20 20"
                        >
                            <Path d="M19.115 5.17l.012-.012L14.618.61l-1.285 1.296 2.558 2.579a3.045 3.045 0 0 0-1.952 2.847c0 1.687 1.358 3.056 3.03 3.056.437 0 .837-.098 1.213-.257v8.812a1.22 1.22 0 0 1-1.212 1.223 1.22 1.22 0 0 1-1.212-1.223v-5.5c0-1.344-1.091-2.444-2.425-2.444h-1.212V2.444C12.121 1.1 11.031 0 9.697 0H2.424C1.091 0 0 1.1 0 2.444V22h12.121v-9.167h1.818v6.111c0 1.687 1.358 3.056 3.03 3.056C18.643 22 20 20.631 20 18.944V7.334c0-.844-.34-1.614-.885-2.164zM9.697 8.556H2.424V2.444h7.273v6.112zm7.273 0a1.22 1.22 0 0 1-1.212-1.223 1.22 1.22 0 0 1 1.212-1.222c.666 0 1.212.55 1.212 1.222a1.22 1.22 0 0 1-1.212 1.223z" fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.buttonTitle}>АЗС</Text>
                    </Pressable>
                </View>
                <View style={styles.mainMenuBlock}>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                            },
                            styles.mainMenuItem,
                        ]}
                    >
                        <Svg
                            width={30}
                            height={30}
                            viewBox="0 0 20 20"
                        >
                            <Path d="M.699 20.105c-.932.933-.932 2.264 0 3.196.4.4 1.065.666 1.598.666.532 0 1.198-.267 1.598-.666l7.323-7.323-3.196-3.196L.7 20.105zM19.073 6.524l3.196-1.73L24 1.597 22.402 0l-3.195 1.73-1.731 3.197-3.862 3.86 1.598 1.599 3.861-3.862z" fill="#a7a7aa"/>
                            <Path d="M19.872 15.046h-.266c-.532 0-1.065.133-1.598.266l-9.32-9.32c.133-.533.266-1.066.266-1.598v-.266A4.386 4.386 0 0 0 4.56 0c-.665 0-1.33.133-1.864.4l2.93 2.929c.133.266.266.4.266.665.133.533.133 1.199-.4 1.598-.133.267-.532.4-.932.4-.133 0-.4 0-.532-.133-.133 0-.4-.134-.533-.267L.565 2.53C.167 3.196.034 3.86.034 4.527a4.386 4.386 0 0 0 4.128 4.394h.266c.533 0 1.065-.133 1.598-.266l9.187 9.187c-.133.533-.266 1.065-.266 1.598v.266c.133 2.397 2.13 4.128 4.394 4.128.666 0 1.331-.133 1.864-.4l-2.93-2.93c-.133-.132-.266-.399-.399-.532-.133-.532-.133-1.198.4-1.598.266-.266.665-.399 1.065-.399.133 0 .4 0 .532.133.134.133.4.133.533.4l2.93 2.929c.266-.533.399-1.198.399-1.864.266-2.53-1.598-4.394-3.862-4.527z" fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.buttonTitle}>Сервисы</Text>
                    </Pressable>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                            },
                            styles.mainMenuItem,
                        ]}
                        onPress={() => {navigation.navigate('Settings')}}
                    >
                        <Svg
                            width={30}
                            height={30}
                            viewBox="0 0 20 20"
                        >
                            <Path d="M15.885 9.877c.035-.28.058-.573.058-.877 0-.304-.023-.596-.07-.877l1.956-1.485a.456.456 0 0 0 .116-.574l-1.852-3.117c-.115-.202-.358-.27-.567-.202l-2.302.9a6.83 6.83 0 0 0-1.563-.877L11.315.383A.458.458 0 0 0 10.851 0H7.15a.446.446 0 0 0-.452.383L6.35 2.767a7.012 7.012 0 0 0-1.562.877l-2.303-.9a.464.464 0 0 0-.567.202L.067 6.064a.428.428 0 0 0 .115.574l1.956 1.485A5.502 5.502 0 0 0 2.057 9c0 .293.023.596.07.877L.17 11.364a.456.456 0 0 0-.116.573l1.852 3.117c.115.202.358.27.567.202l2.302-.9c.486.36.995.652 1.563.877l.347 2.386a.467.467 0 0 0 .463.382h3.702c.232 0 .429-.157.452-.383l.347-2.385a7.01 7.01 0 0 0 1.562-.877l2.303.9c.208.079.451 0 .567-.203l1.851-3.116a.428.428 0 0 0-.115-.573l-1.933-1.486zM9 12.375c-1.91 0-3.472-1.519-3.472-3.375S7.091 5.625 9 5.625c1.91 0 3.472 1.519 3.472 3.375S10.909 12.375 9 12.375z" fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.buttonTitle}>Настройки</Text>
                    </Pressable>
                </View>
            </ScrollView>
            <Pressable
                style={({pressed}) => [
                    {
                        backgroundColor: pressed ? '#b0b0b2' : '#c7c7c9',
                    },
                    styles.footer,
                ]}
            >
                <Svg
                    width={30}
                    height={30}
                    viewBox="0 0 20 20"
                >
                    <Path fill-rule="evenodd" d="M1 1h14v8H1V1zM0 9V0h16v11h-6v1h2v2H4v-2h2v-1H0V9z" clip-rule="evenodd" fill="#a7a7aa"/>
                </Svg>
                <Text>Полная версия</Text>
            </Pressable>
        </SafeAreaView>
    );
};

export default HomeScreen;
