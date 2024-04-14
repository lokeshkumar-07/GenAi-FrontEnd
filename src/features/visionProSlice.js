import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { ApiUrl } from "../config";
import axios from "axios";

const initialState = {
    isLoading: false,
    message: "",
    visionquery: {},
    allqueries: []
}

export const createProQuery = createAsyncThunk('pro-query/create', async(data,thunkApi) => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    console.log("pro Query executing....")
    try{
        const res = await axios({
            url: `${ApiUrl}/pro-vision/create`,
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
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

export const getProQueries = createAsyncThunk('pro-query/all', async(thunkApi) => {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    try{
        const res = await axios({
            url: `${ApiUrl}/pro-vision/all`,
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

const proQuerySlice = createSlice({
    name: 'proQuery',
    initialState,
    reducers: (state) => {

    },
    extraReducers: (builder) => {
        builder.addCase(createProQuery.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(createProQuery.rejected, (state,action) => {
            state.isLoading = false,
            state.message = action.payload
        })
        builder.addCase(createProQuery.fulfilled, (state,action) => {
            state.isLoading = false,
            state.allqueries.push(action.payload)
        })
        builder.addCase(getProQueries.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(getProQueries.rejected, (state,action) => {
            state.isLoading = false,
            state.message = action.payload
        })
        builder.addCase(getProQueries.fulfilled, (state,action) => {
            state.isLoading = false,
            state.allqueries = action.payload
        })
    }
})

export default proQuerySlice.reducer