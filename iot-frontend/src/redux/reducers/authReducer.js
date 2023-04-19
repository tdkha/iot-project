import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { employee_id: null,fullname: null, roles:[], work_at_store_id:null ,token: null ,expireTime:null},
    reducers: {
        setCredentials: (state, action) => {
            const { employee_id, fullname, roles, work_at_store_id,accessToken ,expireTime} =action.payload
            state.employee_id = employee_id
            state.fullname = fullname
            state.roles = roles.map(role => role)
            state.work_at_store_id = work_at_store_id
            state.token = accessToken
            state.expireTime = expireTime
        },
        setToken :  (state, action) => {
            const {token} = action.payload;
            state.token = token;
        },
        setExpireTime : (state, action) => {
            const {expireTime} = action.payload;
            state.expireTime = expireTime;
        },
        logOut: (state, action) => {
            state.employee_id = null
            state.fullname = null
            state.roles = []
            state.work_at_store_id = null
            state.token = null
            state.expireTime = null
        }
    },
})

export const { setCredentials, logOut, setToken, setExpireTime } = authSlice.actions
export default authSlice.reducer;
