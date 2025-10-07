import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice"
import mapSlice from "./mapSlice"
import tipsSlice from "./tipsSlice"
export const store=configureStore({
    reducer:{
        user:userSlice,
        owner:ownerSlice,
        map:mapSlice,
        tips:tipsSlice
    }
})