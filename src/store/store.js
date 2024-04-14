import { combineReducers, configureStore } from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage"
import { FLUSH, PAUSE, PERSIST, PURGE, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import { thunk } from "redux-thunk";
import authSlice from "../features/authSlice";
import querySlice from "../features/querySlice";
import proQuerySlice from '../features/visionProSlice'

const rootReducer = combineReducers({
    auth: authSlice, 
    query: querySlice,
    proQuery: proQuerySlice
})
const persistConfig = {key:'root', storage, version: 1}
const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REHYDRATE],
      },
    }).concat(thunk),
})

export const persistor = persistStore(store)