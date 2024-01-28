import React from 'react';
import {StatusBar} from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Provider} from "react-redux";
import Screens from "./app/screens";
import store from "./app/store";

export default function App() {
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <Screens />
            </Provider>
            <StatusBar style="light" />
        </SafeAreaProvider>
    );
}
