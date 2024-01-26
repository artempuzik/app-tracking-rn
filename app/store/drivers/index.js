import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    drivers: [],
    groups: [],
}

export const driversSlice = createSlice({
    name: 'drivers',
    initialState,
    reducers: {
        setDriversGroup: (state, action) => {
            state.groups = action.payload
        },
        setDrivers: (state, action) => {
            state.drivers = action.payload
        },
        resetDriversState: (state) => {
            state.drivers = initialState.drivers
            state.groups = initialState.groups
        },
    },
})
export const {
    setDriversGroup,
    setDrivers,
    resetDriversState,
} = driversSlice.actions

export default driversSlice.reducer
