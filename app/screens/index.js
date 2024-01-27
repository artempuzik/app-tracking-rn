import React, {useEffect} from 'react';
import {createNavigationContainerRef, NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {useDispatch, useSelector} from "react-redux";

import AuthScreen from "./auth/AuthScreen";
import HomeScreen from "./home/HomeScreen";
import RegistrationScreen from "./registration/RegistrationScreen";
import {init} from "../store/app/appActions";
import ResetPasswordScreen from "./resetpassword/ResetPasswordScreen";
import SettingsScreen from "./settings/SettingsScreen";
import ObjectsScreen from "./objects/ObjectsScreen";
import ObjectItemScreen from "./objects/ObjectItemScreen";
import ObjectTaskScreen from "./objects/ObjectTaskScreen";
import ObjectSendCommandScreen from './objects/ObjectSendCommandScreen';
import DriversScreen from "./drivers/DriversScreen";
import DriverItemScreen from "./drivers/DriverItemScreen";
import EventScreen from "./event/EventScreen";
import GasItemScreen from "./gas/GasItemScreen";
import MapScreen from "./map/MapScreen";
import GasScreen from "./gas/GasScreen";

export const navigationRef = createNavigationContainerRef();
const Stack = createStackNavigator();
export default function Screens() {
    const dispatch = useDispatch();
    const token = useSelector(store => store.app.token)
    const initApp = async () => {
        await dispatch(init())
    }

    useEffect(() => {
        initApp().catch(err => {
            console.log(err)
        })
    }, [])
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
                                <Stack.Screen name="Registration" component={RegistrationScreen} />
                                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                            </Stack.Navigator>
                        ) :
                        (
                            <Stack.Navigator initialRouteName="Home"
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
                                <Stack.Screen name="Gas" component={GasScreen} />
                                <Stack.Screen name="GasItem" component={GasItemScreen} />
                                <Stack.Screen name="Event" component={EventScreen} />
                            </Stack.Navigator>
                        )
                }
            </NavigationContainer>
    );
}
