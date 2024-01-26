import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from '../../api'
import axios from '../../api/instance'
import {resetAppState, setLanguages, setProfile, setServers, setToken} from "./index";
import {resetUserState, setUserName} from "../user";
import {Platform} from "react-native";
import {resetDriversState} from "../drivers";
import {resetObjectsState} from "../objects";
import {getUsers} from "../user/usersActions";


export const clearStorage = async () => {
  const asyncStorageKeys = await AsyncStorage.getAllKeys();
  if (asyncStorageKeys.length > 0) {
    if (Platform.OS === 'android') {
      await AsyncStorage.clear();
    }
    if (Platform.OS === 'ios') {
      await AsyncStorage.multiRemove(asyncStorageKeys);
    }
  }
}
const checkUserDataAndLogout = () => async (dispatch) => {
  const user = await AsyncStorage.getItem('user');
  if(!user) {
    dispatch(logOut())
  }
}

export const changeServer = async (server) => {
  await AsyncStorage.setItem('server', server);
  axios.defaults.baseURL = 'https://' + server  + '/api'
}

export const init = () => async (dispatch, getState) => {
  const token = getState().app.token
  dispatch(getSettings())
  if(!token) {
    const token = await AsyncStorage.getItem('token');
    if(!token) {
      return
    }
    const user = await AsyncStorage.getItem('user');
    if(user) {
      const {userName} = JSON.parse(user)
      dispatch(setUserName(userName))
    }
    dispatch(setToken(token))
    dispatch(getUsers())
  }
};

export const getSettings = () => async (dispatch) => {
  try {
    fetch('https://geotek.online/config/mobile-app.json')
        .then(response => response.json())
        .then(data => {
          dispatch(setServers(data.servers))
          dispatch(setLanguages(data.languages))
        })
  } catch (e) {
    console.log(e)
  }
};

export const getProfileData = () => async (dispatch) => {
  try {
    dispatch(checkUserDataAndLogout());
    const response = await Api.getProfile()
    if(response.status === 200) {
      dispatch(setProfile(response.data))
    }
    return {
      response,
      error: null,
    };
  } catch (e) {
    return {
      response: null,
      error: JSON.stringify(e.message)
    };
  }
};

export const setLanguage = (language) => async (dispatch, getState) => {
  const userName = getState().user.userName
  await AsyncStorage.setItem('user', JSON.stringify({
    language,
    userName,
  }));
   dispatch(setLanguage(language))
};

export const getToken = (dto) => async (dispatch, getState) => {
  const language = getState().app.language
  try {
    const response = await Api.getUserToken({
      language,
      userName: dto.userName.trim(),
      password: dto.password.trim(),
    })
    const token = response.data.accessToken
    const userName = response.data.userName
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify({
      language,
      userName
    }));
    dispatch(setToken(token))
    dispatch(setUserName(userName))
    return {
      response,
      error: null,
    };
  } catch (e) {
    return {
      response: null,
      error: JSON.stringify(e.message)
    };
  }
};
export const logOut = () => async (dispatch) => {
  await clearStorage();
  console.log('LOGOUT')
  dispatch(resetUserState())
  dispatch(resetAppState())
  dispatch(resetDriversState())
  dispatch(resetObjectsState())
  dispatch(init())
}
