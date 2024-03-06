import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from '../../utils/i18'
import Api from '../../api'
import axios from '../../api/instance'
import {
  resetAppState,
  setCurrentServer,
  setLanguage,
  setLanguages,
  setLoading,
  setProfile,
  setServers,
  setToken
} from "./index";
import {resetUserState, setCurrentUser, setRefreshInterval} from "../user";
import {resetDriversState} from "../drivers";
import {resetObjectsState} from "../objects";
import {getUsers} from "../user/usersActions";
import {getObjectIcons, getObjects, getObjectsStatuses} from "../objects/objectsActions";
import * as Updates from "expo-updates";
import {Alert} from "react-native";


export const clearStorage = async () => {
  await AsyncStorage.removeItem('user');
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('refresh');
  await AsyncStorage.removeItem('language');
}

export const changeServer = (server) => async (dispatch) => {
  const value = 'https://' + server.replace('https://', '')
  await AsyncStorage.setItem('server', value);
  dispatch(setCurrentServer(value))
  axios.defaults.baseURL = value  + '/api'
}

export const init = () => async (dispatch) => {
  dispatch(setLoading(true))
  dispatch(getSettings())
  const token = await AsyncStorage.getItem('token');
  const server = await AsyncStorage.getItem('server');
  if(server){
    dispatch(setCurrentServer(server))
    axios.defaults.baseURL = server  + '/api'
  }
  if(token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    dispatch(setToken(token))
    const language = await AsyncStorage.getItem('language');
    if(language) {
      i18n.locale = language
      await dispatch(setLanguage(language))
    }
    const user = await AsyncStorage.getItem('user');
    if(user) {
      const currentUser = JSON.parse(user)
      await dispatch(setCurrentUser(currentUser))
      await dispatch(refreshUserToken())
    }
    const interval = await AsyncStorage.getItem('refresh');
    if(interval) {
      await dispatch(setRefreshInterval(+interval))
    }
    await dispatch(getObjects())
    await dispatch(getObjectIcons())
    await dispatch(getProfileData())
    await dispatch(getObjectsStatuses())
    await dispatch(getObjectIcons())
    await dispatch(getUsers())
  }
  dispatch(setLoading(false))
};

export const getSettings = () => async (dispatch) => {
  try {
    fetch('https://geotek.online/config/mobile-app.json')
        .then(response => response.json())
        .then(data => {
          dispatch(setServers(data.servers))
          dispatch(setLanguages(data.langs))
        })
  } catch (e) {
    console.log(e)
  }
};

export const getProfileData = () => async (dispatch) => {
  try {
    const response = await Api.getProfile()
    if(response.status === 200) {
      if(!response.data.objects) {
        Alert.alert('Invalid JSON')
        dispatch(logOut())
      }
      dispatch(setProfile(response.data))
    }
    return {
      response: response.data,
      error: null,
    };
  } catch (e) {
    console.log(e)
    return {
      response: null,
      error: JSON.stringify(e.message)
    };
  }
};

export const setAppLanguage = (language) => async (dispatch) => {
  i18n.locale = language
  await AsyncStorage.setItem('language', language);
  dispatch(setLanguage(language))
};

export const reloadApp = () => async (dispatch) => {
  dispatch(setLoading(true))
  setTimeout(() => dispatch(setLoading(false)), 500)
}

export const getToken = (dto) => async (dispatch) => {
  try {
    const response = await Api.getUserToken({
      userName: dto.userName.trim(),
      password: dto.password.trim(),
    })
    await AsyncStorage.setItem('login', JSON.stringify(dto));
    const token = response.data.accessToken
    if (token !== undefined) {
      await AsyncStorage.setItem('token', token);
    } else {
      await AsyncStorage.removeItem('token');
      await Updates.reloadAsync()
    }
    dispatch(getUsers()).then(async (users) => {
      if(users) {
        const matchedUser = users.find(user => user.name.toLowerCase() === dto.userName.trim().toLowerCase())
        if(matchedUser) {
          await AsyncStorage.setItem('user', JSON.stringify(matchedUser));
          dispatch(setCurrentUser(matchedUser))
          dispatch(refreshUserToken())
        }
      }
    })
    dispatch(setToken(token))
    await dispatch(getObjects())
    await dispatch(getObjectIcons())
    await dispatch(getProfileData())
    await dispatch(getObjectsStatuses())
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

export const refreshUserToken = () => async (dispatch, getState) => {
  try {
    const user = getState().user.currentUser
    if(!user) {
      return {
        response: null,
        error: 'Not found'
      };
    }
    const response = await Api.refreshToken({
      subUserId: user.id,
      language: user.language
    })
    if(response.status === 200) {
      const access_token = response.data.accessToken
      if (access_token !== undefined) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        await AsyncStorage.setItem('token', access_token);
        await dispatch(setToken(access_token))
        await dispatch(getObjects())
        await dispatch(getObjectIcons())
        await dispatch(getProfileData())
        await dispatch(getObjectsStatuses())
      } else {
        await AsyncStorage.removeItem('token');
        await Updates.reloadAsync()
      }
    }
  } catch (e) {
    console.log(e)
  }
}

export const setCurrent = (user) => async (dispatch) => {
  try {
    await dispatch(setCurrentUser(user))
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await dispatch(refreshUserToken())
  } catch (e) {
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
