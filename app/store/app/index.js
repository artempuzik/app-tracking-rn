import { createSlice } from '@reduxjs/toolkit'
import {BASE_URL} from "../../config";

const initialState = {
    subUserId: 0,
    loading: false,
    token: null,
    currentServer: BASE_URL,
    language: 'en-us',
    profile: null,
    languages: ['en-us'],
    servers: [BASE_URL]
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
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
        setCurrentServer: (state, action) => {
            state.currentServer = action.payload
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
            state.token = initialState.token
            state.profile = initialState.profile
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
    setCurrentServer,
    setLoading
} = appSlice.actions

export default appSlice.reducer
