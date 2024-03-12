import {setUsers, setRefreshInterval, setCurrentUser} from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from '../../api'

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

export const getUsers = () => async (dispatch) => {
  try {
    const response = await Api.getUsers()
    if(response.status === 200) {
      dispatch(setUsers(response.data))
      return response.data
    }
  } catch (e) {
  }
};

export const setRefreshStatusInterval = (value) => async (dispatch) => {
  dispatch(setRefreshInterval(value))
  await AsyncStorage.setItem('refresh', value.toString());
}

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
    await dispatch(setCurrentUser(response.data))
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
