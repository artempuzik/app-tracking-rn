import React, {useMemo, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {Path} from "react-native-svg"
import i18n from "../../utils/i18"
import styles from './styles'
import AppHeader from "../../components/header/AppHeader";
import AppProfile from "./components/AppProfile";
import AppGeneralSettings from "./components/AppGeneralSettings";
import AppSecurity from "./components/AppSecurity";

const SettingsScreen = ({ navigation }) => {
    const [screen, setScreen] = useState(0)

    const renderScreens = useMemo(()=>{
        switch (screen) {
            case 1: return (<AppGeneralSettings />)
            case 2: return (<AppSecurity />)
            default: return (<AppProfile />)
        }
    }, [screen])

    const header = useMemo(() => (
        <View style={styles.headerButtonsBlock}>
            <Pressable
                style={styles.headerButton}
                onPress={() => setScreen(0)}
            >
                <Svg
                    width={20}
                    height={20}
                    viewBox="0 0 510 510"
                >
                    <Path
                        d="M255 0C114.8 0 0 114.8 0 255s114.8 255 255 255 255-114.8 255-255S395.3 0 255 0zm25.5 408h-51V204h51v204zm0-255h-51v-51h51v51z"
                        fill={screen === 0 ? '#2060ae' : '#a7a7aa'}
                    />
                </Svg>
                {
                    screen === 0 ? (<Text style={styles.headerText}>{i18n.t('profile')}</Text>) : null
                }
            </Pressable>
            <Pressable
                style={styles.headerButton}
                onPress={() => setScreen(1)}
            >
                <Svg
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                >
                    <Path
                        d="M15.885 9.877c.035-.28.058-.573.058-.877 0-.304-.023-.596-.07-.877l1.956-1.485a.456.456 0 0 0 .116-.574l-1.852-3.117c-.115-.202-.358-.27-.567-.202l-2.302.9a6.83 6.83 0 0 0-1.563-.877L11.315.383A.458.458 0 0 0 10.851 0H7.15a.446.446 0 0 0-.452.383L6.35 2.767a7.012 7.012 0 0 0-1.562.877l-2.303-.9a.464.464 0 0 0-.567.202L.067 6.064a.428.428 0 0 0 .115.574l1.956 1.485A5.502 5.502 0 0 0 2.057 9c0 .293.023.596.07.877L.17 11.364a.456.456 0 0 0-.116.573l1.852 3.117c.115.202.358.27.567.202l2.302-.9c.486.36.995.652 1.563.877l.347 2.386a.467.467 0 0 0 .463.382h3.702c.232 0 .429-.157.452-.383l.347-2.385a7.01 7.01 0 0 0 1.562-.877l2.303.9c.208.079.451 0 .567-.203l1.851-3.116a.428.428 0 0 0-.115-.573l-1.933-1.486zM9 12.375c-1.91 0-3.472-1.519-3.472-3.375S7.091 5.625 9 5.625c1.91 0 3.472 1.519 3.472 3.375S10.909 12.375 9 12.375z"
                        fill={screen === 1 ? '#2060ae' : '#a7a7aa'}
                    />
                </Svg>
                {
                    screen === 1 ? (<Text style={styles.headerText}>{i18n.t('settings')}</Text>) : null
                }
            </Pressable>
            <Pressable
                style={styles.headerButton}
                onPress={() => setScreen(2)}
            >
                <Svg
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                >
                    <Path
                        d="M15.98 5.148c-.023-.526-.023-1.028-.023-1.53 0-.407-.295-.718-.682-.718-2.841 0-5.001-.861-6.797-2.703a.676.676 0 0 0-.955 0C5.727 2.04 3.567 2.9.726 2.9c-.387 0-.682.31-.682.717 0 .503 0 1.005-.023 1.531-.091 5.022-.228 11.91 7.752 14.804L8 20l.228-.048c7.957-2.894 7.843-9.758 7.752-14.804zm-8.525 6.96a.713.713 0 0 1-.478.191h-.022a.628.628 0 0 1-.478-.24L4.363 9.597l1.023-.956 1.66 1.937 3.682-3.683.933 1.052-4.206 4.162z"
                        fill={screen === 2 ? '#2060ae' : '#a7a7aa'}
                    />
                </Svg>
                {
                    screen === 2 ? (<Text style={styles.headerText}>{i18n.t('security')}</Text>) : null
                }
            </Pressable>
        </View>
    ), [screen])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            {header}
            <View style={styles.line}></View>
            {renderScreens}
        </SafeAreaView>
    );
};

export default SettingsScreen;
