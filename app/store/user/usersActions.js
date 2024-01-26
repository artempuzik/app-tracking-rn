import Api from '../../api'
import {setUsers} from "./index";

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
    }
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
