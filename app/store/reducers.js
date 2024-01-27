import userReducer from './user'
import appReducer from './app'
import driversReducer from './drivers'
import objectReducer from './objects'

export const reducers = {
    user: userReducer,
    app: appReducer,
    objects: objectReducer,
    drivers: driversReducer
};
