import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {reducers} from "./reducers";

export default configureStore({
    reducer: combineReducers(reducers),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    })
})
