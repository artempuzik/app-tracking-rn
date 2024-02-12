import axios from 'axios';
import {BASE_URL} from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
let reconnect = 0

const api = axios.create({
    baseURL: BASE_URL + '/api'
});

const refreshToken = async () => {
    reconnect++
    try {
        const {user, login} = await getUserDataFromStorage()
        const response = await api.post('/token', {
            language: user.language,
            subUserId: user.id,
            userName: login.userName,
            password: login.password,
        })
        const access_token = response.data.accessToken
        if (access_token !== undefined) {
            await AsyncStorage.setItem('token', access_token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token
        } else {
            await AsyncStorage.removeItem('token');
            await Updates.reloadAsync()
        }
        return response;
    } catch (err) {
        console.log('refreshToken error', err)
        return null
    }
};

const getUserDataFromStorage = async () => {
    const user = await AsyncStorage.getItem('user');
    const login = await AsyncStorage.getItem('login');
    return {
        user: JSON.parse(user),
        login: JSON.parse(login)
    }
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
    if(!axios.defaults.baseURL) {
        axios.defaults.baseURL = BASE_URL + '/api';
    }
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        if(reconnect === 5) {
            reconnect = 0
            await AsyncStorage.removeItem('token');
            console.log('interceptors', error.response)
            await Updates.reloadAsync()
            return Promise.reject(error);
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
