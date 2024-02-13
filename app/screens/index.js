import React, {useEffect, useState} from 'react';
import {createNavigationContainerRef, NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {useDispatch, useSelector} from "react-redux";

import AuthScreen from "./auth/AuthScreen";
import HomeScreen from "./home/HomeScreen";
// import RegistrationScreen from "./registration/RegistrationScreen";
import {init} from "../store/app/appActions";
// import ResetPasswordScreen from "./resetpassword/ResetPasswordScreen";
import SettingsScreen from "./settings/SettingsScreen";
import ObjectsScreen from "./objects/ObjectsScreen";
import ObjectItemScreen from "./objects/ObjectItemScreen";
import ObjectTaskScreen from "./objects/ObjectTaskScreen";
import ObjectSendCommandScreen from './objects/ObjectSendCommandScreen';
import DriversScreen from "./drivers/DriversScreen";
import DriverItemScreen from "./drivers/DriverItemScreen";
import EventScreen from "./event/EventScreen";
import GasStationItemScreen from "./gas-stations/GasStationItemScreen";
import MapScreen from "./map/MapScreen";
import GasStationScreen from "./gas-stations/GasStationScreen";
import UserScreen from "./users/UserScreen";
import {ActivityIndicator, Platform, View} from "react-native";
import ServiceScreen from "./services/ServiceScreen";
import Loading from "../components/loading/Loading";
import GeozonesScreen from "./geozones/GeozonesScreen";
import GeozoneItemScreen from "./geozones/GeozoneItemScreen";

export const navigationRef = createNavigationContainerRef();
const Stack = createStackNavigator();

const isAndroid = Platform.OS === 'android'
export default function Screens() {
    const dispatch = useDispatch();
    const token = useSelector(store => store.app.token)
    const [isLoading, setIsLoading] = useState(false)
    const initApp = async () => {
        try {
            setIsLoading(true)
            await dispatch(init())
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        initApp().catch(err => {
            console.log(err)
        })
    }, [])

    console.log(isLoading)

    if(isLoading) {
        return (
            <Loading isLoading={isLoading} />
        )
    }
    return (
            <NavigationContainer ref={navigationRef}>
                {
                    !token ?
                        (
                            <Stack.Navigator initialRouteName="Auth"
                                             screenOptions={{
                                headerShown: false
                            }}>
                                <Stack.Screen name="Auth" component={AuthScreen} />
                                {/*<Stack.Screen name="Registration" component={RegistrationScreen} />*/}
                                {/*<Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />*/}
                            </Stack.Navigator>
                        ) :
                        (
                            <Stack.Navigator initialRouteName="Home"
                                             style={{paddingBottom: isAndroid ? 20 : 0}}
                                             screenOptions={{
                                headerShown: false
                            }}>
                                <Stack.Screen name="Home" component={HomeScreen} />
                                <Stack.Screen name="Settings" component={SettingsScreen} />
                                <Stack.Screen name="Objects" component={ObjectsScreen} />
                                <Stack.Screen name="Map" component={MapScreen} />
                                <Stack.Screen name="ObjectItem" component={ObjectItemScreen} />
                                <Stack.Screen name="ObjectTask" component={ObjectTaskScreen} />
                                <Stack.Screen name="ObjectSendCommand" component={ObjectSendCommandScreen} />
                                <Stack.Screen name="Drivers" component={DriversScreen} />
                                <Stack.Screen name="DriverItem" component={DriverItemScreen} />
                                <Stack.Screen name="GasStation" component={GasStationScreen} />
                                <Stack.Screen name="GasStationItem" component={GasStationItemScreen} />
                                <Stack.Screen name="Geozones" component={GeozonesScreen} />
                                <Stack.Screen name="GeozoneItem" component={GeozoneItemScreen} />
                                <Stack.Screen name="Event" component={EventScreen} />
                                <Stack.Screen name="User" component={UserScreen} />
                                <Stack.Screen name="Service" component={ServiceScreen} />
                            </Stack.Navigator>
                        )
                }
            </NavigationContainer>
    );
}
