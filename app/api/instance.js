import axios from 'axios';
import {BASE_URL} from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Platform} from "react-native";
import * as Updates from "expo-updates";
let reconnect = 0

const base = AsyncStorage.getItem('server') || BASE_URL

const api = axios.create({
    baseURL: base + '/api'
});

const refreshToken = async () => {
    const {language} = await getUserDataFromStorage()
    const response = await api.post('/token/refresh', {
            language,
        })
    return response;
};

const getUserDataFromStorage = async () => {
    const user = await AsyncStorage.getItem('user');
    return JSON.parse(user)
}

const clearStorage = async () => {
    console.log('CLEAR')
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
        if (Platform.OS === 'android') {
            await AsyncStorage.clear();
        }
        if (Platform.OS === 'ios') {
            await AsyncStorage.multiRemove(asyncStorageKeys);
        }
    }
    await Updates.reloadAsync()
}

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.request.use(
    async config => {
        const access_token = await AsyncStorage.getItem('token');
        config.headers = {
            'Authorization': `Bearer ${access_token}`,
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    });
api.interceptors.response.use((response) => {
    reconnect = 0
    return response
}, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        if(reconnect = 5) {
            await clearStorage();
            return;
        }
        const access_token = await refreshToken();
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        if (access_token) {
            reconnect = 0
        }
        return api(originalRequest);
    }
    return Promise.reject(error);
});

export default api;
