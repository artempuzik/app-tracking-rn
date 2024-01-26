import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    objects: [],
    groups: [],
    statuses: [],
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
} = objectsSlice.actions

export default objectsSlice.reducer
