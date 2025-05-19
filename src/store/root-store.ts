import type {PayloadAction} from '@reduxjs/toolkit';
import {configureStore, createSlice} from '@reduxjs/toolkit';
import type ApiResponse from "../model/api-response.ts";


const errorSlice = createSlice({
    name: 'error',
    initialState: null as ApiResponse<unknown> | null,
    reducers: {
        setError: (_state, action: PayloadAction<ApiResponse<unknown>>) => {
            return {...action.payload};
        },
        clearError: () => {
            return null;
        },
    },
});

const successSlice = createSlice({
    name: 'success',
    initialState: null as ApiResponse<unknown> | null,
    reducers: {
        setSuccess: (_state, action: PayloadAction<ApiResponse<unknown>>) => {
            return {...action.payload};
        },
        clearSuccess: () => {
            return null;
        },
    },
});

export const {setError, clearError} = errorSlice.actions;
export const {setSuccess, clearSuccess} = successSlice.actions;

const store = configureStore({
    reducer: {
        error: errorSlice.reducer,
        success: successSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;