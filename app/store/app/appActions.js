import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from '../../utils/i18'
import Api from '../../api'
import axios from '../../api/instance'
import {resetAppState, setCurrentServer, setLanguage, setLanguages, setProfile, setServers, setToken} from "./index";
import {resetUserState, setCurrentUser, setRefreshInterval} from "../user";
import {resetDriversState} from "../drivers";
import {resetObjectsState} from "../objects";
import {getUsers} from "../user/usersActions";
import {getObjectIcons, getObjects, getObjectsStatuses} from "../objects/objectsActions";
import * as Updates from "expo-updates";


export const clearStorage = async () => {
  await AsyncStorage.removeItem('user');
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('refresh');
}
const checkUserDataAndLogout = () => async (dispatch) => {
  const user = await AsyncStorage.getItem('user');
  if(!user) {
    dispatch(logOut())
  }
}

export const changeServer = (server) => async (dispatch) => {
  await AsyncStorage.setItem('server', server);
  dispatch(setCurrentServer('https://' + server))
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
      const currentUser = JSON.parse(user)
      i18n.locale = currentUser.language
      console.log(currentUser.language, i18n.locale)
      dispatch(setCurrentUser(currentUser))
    }
    const interval = await AsyncStorage.getItem('refresh');
    if(interval) {
      dispatch(setRefreshInterval(+interval))
    }
    await dispatch(setToken(token))
    await dispatch(getObjects())
    await dispatch(getObjectsStatuses())
    await dispatch(getObjectIcons())
    await dispatch(getUsers())
  }
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
    dispatch(checkUserDataAndLogout());
    const response = await Api.getProfile()
    if(response.status === 200) {
      dispatch(setProfile(response.data))
    }
    return {
      response: response.data,
      error: null,
    };
  } catch (e) {
    return {
      response: null,
      error: JSON.stringify(e.message)
    };
  }
};

export const setAppLanguage = (language) => async (dispatch, getState) => {
  const currentUser = getState().user.currentUser
  await AsyncStorage.setItem('user', JSON.stringify({
    ...currentUser,
    language,
  }));
  i18n.locale = language
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
    if (token !== undefined) {
      await AsyncStorage.setItem('token', token);
    } else {
      await AsyncStorage.removeItem('token');
      await Updates.reloadAsync()
    }
    dispatch(getUsers()).then(async (users) => {
      if(users) {
        const matchedUser = users.find(user => user.name === dto.userName.trim())
        if(matchedUser) {
          await AsyncStorage.setItem('user', JSON.stringify({
            ...matchedUser,
            language,
          }));
        }
      }
    })
    dispatch(setToken(token))
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
