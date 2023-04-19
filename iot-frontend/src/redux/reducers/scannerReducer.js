import { createSlice } from "@reduxjs/toolkit"
/*
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const scannerPersistConfig = {
    key: 'scanner',
    storage,
    whitelist: ['scanner_name','store_name'],
};  
*/
const scannerSlice = createSlice({
    name: 'scanner',
    initialState: { scanner_name: null,store_name: null},
    reducers: {
        selectScanner: (state, action) => {
            const { scanner_name, store_name} = action.payload
            state.scanner_name = scanner_name
            state.store_name = store_name
            
        },
        
        deSelectScanner: (state, action) => {
            state.scanner_name = null
            state.store_name = null
        }
    },
})

//const persistedScannerReducer = persistReducer(scannerPersistConfig, scannerSlice.reducer);
export const { selectScanner, deSelectScanner} = scannerSlice.actions
export default scannerSlice.reducer;
