import Api from '../../api'
import {setDrivers, setDriversGroup} from "./index";

export const getDrivers = () => async (dispatch, getState) => {
  try {
    const response = await Api.getDrivers()
    if(response.status === 200) {
      dispatch(setDrivers(response.data))
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

export const getDriverById = (id) => async (dispatch, getState) => {
  try {
    const response = await Api.getDriverById(id)
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

export const getDriverGroups = () => async (dispatch, getState) => {
  try {
    const response = await Api.getDriverGroups()
    if(response.status === 200) {
      dispatch(setDriversGroup(response.data))
      dispatch(getDrivers())
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

export const getDriverGroupById = (id) => async (dispatch, getState) => {
  try {
    const response = await Api.getDriverGroupById(id)
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

export const getDriverSessionById = (dto) => async (dispatch, getState) => {
  try {
    const response = await Api.getDriverSessionById(dto)
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

export const editDriver = (dto) => async (dispatch, getState) => {
  try {
    const response = await Api.changeDriver(dto)
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
