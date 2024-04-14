import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { ApiUrl } from "../config";
import axios from "axios";

const initialState = {
    isLoading: false,
    message: "",
    query: {},
    queries: []
}

export const createQuery = createAsyncThunk('query/create', async(data,thunkApi) => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    try{
        const res = await axios({
            url: `${ApiUrl}/query/new`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': user.token
            },
            data: data
        })

        return res.data
    }catch(err){
        const message = (err.response && err.response.data && err.response.data.message)|| err.message || err.toString()

        return thunkApi.rejectWithValue(message)
    }
})

export const getQueries = createAsyncThunk('query/all', async(thunkApi) => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    try{
        const res = await axios({
            url: `${ApiUrl}/query/all`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': user.token
            },
        })

        return res.data
    }catch(err){
        const message = (err.response && err.response.data && err.response.data.message)|| err.message || err.toString()

        return thunkApi.rejectWithValue(message)
    }
})

const querySlice = createSlice({
    name: 'query',
    initialState,
    reducers: (state) => {

    },
    extraReducers: (builder) => {
        builder.addCase(createQuery.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(createQuery.rejected, (state,action) => {
            state.isLoading = false,
            state.message = action.payload
        })
        builder.addCase(createQuery.fulfilled, (state,action) => {
            state.isLoading = false,
            state.queries.push(action.payload)
        })
        builder.addCase(getQueries.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(getQueries.rejected, (state,action) => {
            state.isLoading = false,
            state.message = action.payload.message
        })
        builder.addCase(getQueries.fulfilled, (state,action) => {
            state.isLoading = false,
            state.queries = action.payload
        })
    }
})

export default querySlice.reducer