import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    objects: [],
    groups: [],
    statuses: [],
    icons: [],
    transactions: [],
}

export const objectsSlice = createSlice({
    name: 'objects',
    initialState,
    reducers: {
        setObjectsGroup: (state, action) => {
            state.groups = action.payload
        },
        setObjects: (state, action) => {
            state.objects = action.payload
        },
        setObjectsStatuses: (state, action) => {
            state.statuses = action.payload
        },
        setObjectsIcons: (state, action) => {
            state.icons = action.payload
        },
        setTransactions: (state, action) => {
            state.transactions = action.payload
        },
        resetObjectsState: (state) => {
            state.objects = initialState.drivers
            state.groups = initialState.groups
            state.statuses = initialState.statuses
        },
    },
})
export const {
    setObjectsGroup,
    setObjects,
    resetObjectsState,
    setObjectsStatuses,
    setObjectsIcons,
    setTransactions,
} = objectsSlice.actions

export default objectsSlice.reducer
