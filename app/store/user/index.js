import { createSlice } from '@reduxjs/toolkit'
import {REFRESH_INTERVAL} from "../../config";

const initialState = {
    currentUser: null,
    users: [],
    refreshInterval: REFRESH_INTERVAL,
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload
        },
        setRefreshInterval: (state, action) => {
            state.refreshInterval = action.payload
        },
        resetUserState: (state) => {
            state.users = initialState.users
            state.currentUser = initialState.currentUser
        },
    },
})
export const {
    resetUserState,
    setUsers,
    setCurrentUser,
    setRefreshInterval,
} = userSlice.actions

export default userSlice.reducer
