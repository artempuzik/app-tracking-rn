import Api from '../../api'
import {setObjects, setObjectsStatuses} from "./index";

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
