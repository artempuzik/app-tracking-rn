import { createSlice } from '@reduxjs/toolkit'
import {BASE_URL} from "../../config";

const initialState = {
    subUserId: 0,
    token: null,
    language: 'ru',
    profile: null,
    languages: ['ru-ru'],
    servers: [BASE_URL]
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
        },
        setLanguage: (state, action) => {
            state.language = action.payload
        },
        setProfile: (state, action) => {
            state.profile = action.payload
        },
        setServers: (state, action) => {
            state.servers = action.payload
        },
        setLanguages: (state, action) => {
            const formatted = []
            for (const code in action.payload) {
                formatted.push({
                    [code]: action.payload[code]
                })
            }
            state.languages = formatted
        },
        resetAppState: (state) => {
            state.language = initialState.language
            state.token = initialState.token
            state.profile = initialState.profile
            state.servers = initialState.servers
        }
    },
})

export const {
    setToken,
    setLanguage,
    resetAppState,
    setProfile,
    setServers,
    setLanguages,
} = appSlice.actions

export default appSlice.reducer
