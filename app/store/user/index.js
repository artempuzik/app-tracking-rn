import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userName: null,
    currentUser: null,
    users: []
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUserName: (state, action) => {
            state.userName = action.payload
        },
        setUsers: (state, action) => {
            state.users = action.payload
            if(state.userName && state.users.length) {
                const matchedUser = state.users.filter(user => user.name === state.userName)
                state.currentUser = matchedUser ? matchedUser[0] : null
            }
        },
        resetUserState: (state) => {
            state.userName = initialState.userName
            state.users = initialState.users
        },
    },
})
export const {
    setUserName,
    resetUserState,
    setUsers,
} = userSlice.actions

export default userSlice.reducer
