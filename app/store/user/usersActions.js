import {setUsers, setCurrentUser} from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from '../../api'
import axios from "../../api/instance";
import {setToken} from "../app";
import * as Updates from "expo-updates";

export const recoverPassword = (email) => async (dispatch, getState) => {
  try {
    const response = await Api.resetPassword({
      email: email.trim(),
    })
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

export const changeSelfPassword = (dto) => async (dispatch, getState) => {
  const user = getState().user.currentUser;
  if(!user) {
    return {
      response: null,
      error: 'Not found'
    };
  }
  try {
    const response = await Api.changeSelfPassword({
      ...dto,
      id: user.id,
    })
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

export const getUsers = () => async (dispatch, getState) => {
  try {
    const response = await Api.getUsers()
    if(response.status === 200) {
      dispatch(setUsers(response.data))
      return response.data
    }
  } catch (e) {
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
        dispatch(setToken(access_token))
        await AsyncStorage.setItem('token', access_token);
      } else {
        await AsyncStorage.removeItem('token');
        await Updates.reloadAsync()
      }
    }
  } catch (e) {

  }
}

export const setCurrent = (user) => async (dispatch) => {
  try {
    dispatch(setCurrentUser(user))
    await AsyncStorage.setItem('user', JSON.stringify(user));
    dispatch(refreshUserToken())
  } catch (e) {
  }
};

export const getUserById = (id) => async (dispatch, getState) => {
  try {
    const response = await Api.getUserById(id)
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

export const changeUser = (dto) => async (dispatch, getState) => {
  try {
    const user = getState().user.currentUser;
    if(!user) {
      return {
        response: null,
        error: 'Not found'
      };
    }
    const response = await Api.changeUser({
      ...user,
      ...dto
    })
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

export const createNewUser = (dto) => async (dispatch, getState) => {
  try {
    const language = getState().app.language;
    const response = await Api.changeUser({
      ...dto,
      language,
    })
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
