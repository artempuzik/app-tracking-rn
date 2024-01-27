import Api from '../../api'
import {setObjects, setObjectsIcons, setObjectsStatuses, setTransactions} from "./index";

export const getObjects = () => async (dispatch) => {
  try {
    const response = await Api.getObjects()
    if(response.status === 200) {
      dispatch(setObjects(response.data))
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

export const getObjectById = (id) => async (dispatch, getState) => {
  try {
    const response = await Api.getObjectById(id)
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

export const getObjectsStatuses = () => async (dispatch) => {
  try {
    const response = await Api.getObjectStatus()
    if(response.status === 200) {
      dispatch(setObjectsStatuses(response.data))
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

export const getObjectStatusById = (id) => async (dispatch, getState) => {
  try {
    const response = await Api.getObjectStatusById(id)
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

export const getObjectIcons = () => async (dispatch, getState) => {
  try {
    const response = await Api.getObjectIcons()
    console.log(response)
    if(response.status === 200) {
      dispatch(setObjectsIcons(response.data))
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

export const getTransactions = (dto) => async (dispatch, getState) => {
  try {
    const response = await Api.getTransactions(dto)
    if(response.status === 200) {
      dispatch(setTransactions(response.data))
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
