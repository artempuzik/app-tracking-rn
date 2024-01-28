import React from 'react';
import {Platform, StatusBar} from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Provider} from "react-redux";
import Screens from "./app/screens";
import store from "./app/store";

const isAndroid = Platform.OS === 'android'

export default function App() {
    return (
        <SafeAreaProvider style={{paddingBottom: isAndroid ? 20 : 0}}>
            <Provider store={store}>
                <Screens />
            </Provider>
            <StatusBar style="light" />
        </SafeAreaProvider>
    );
}
