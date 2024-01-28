import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    users: []
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
} = userSlice.actions

export default userSlice.reducer
