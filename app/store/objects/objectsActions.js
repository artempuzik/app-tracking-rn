import Api from '../../api'
import {setObjectEvents, setObjects, setObjectsIcons, setObjectsStatuses, setTransactions} from "./index";

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

export const getObjectEvents = () => async (dispatch, getState) => {
  try {
    const response = await Api.getObjectEvents()
    if(response.status === 200) {
      dispatch(setObjectEvents(response.data))
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

export const getObjectHistory = (dto) => async () => {
  try {
    const response = await Api.getObjectHistory(dto)
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

export const getObjectHistoryDriversSession = (dto) => async () => {
  try {
    const response = await Api.getObjectHistoryDriversSession(dto)
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

export const sendCustomCommand = (dto) => async () => {
  try {
    const response = await Api.sendCustomCommand(dto)
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

export const getFuelReport = (dto) => async () => {
  try {
    const response = await Api.getFuelReport(dto)
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


export const getGeozones = () => async () => {
  try {
    const response = await Api.getGeozones()
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

export const getGeozoneById = (id) => async () => {
  try {
    const response = await Api.getGeozoneById(id)
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

export const getObjectPoint = (coords) => async (dispatch, getState) => {
  try {
    const lang = getState().app.language
    const response = await Api.getPoint(coords, lang)
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
}
