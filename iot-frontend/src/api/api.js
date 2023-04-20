import axios from "axios";
import {store} from '../redux/store'
import { setToken , setExpireTime} from "../redux/reducers/authReducer";

async function refreshAccessToken() {

    try {
        const response = await axios.get('/auth/refreshtoken',{
            withCredentials: true
        });
        const token = response?.data?.accessToken;
        const expireTime = response?.data?.expireTime
        store.dispatch(setToken({token}));
        store.dispatch(setExpireTime({expireTime}))
        return token;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

const api = axios.create({
    baseURL: "",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json"
    }
  });

api.interceptors.request.use(
    async(config) =>{
        const  {expireTime}  = JSON.parse(localStorage.getItem('persist:root')); //access token
        const expire = ((expireTime*1000)- Date.now())/1000 //in seconds
        console.log("expire",expire)
        const  {token}  = JSON.parse(localStorage.getItem('persist:root')); //access token
        const reformatToken = JSON.parse(token); // redux-persist stores data as serialized data that comes with <backlashes> and <quotation marks>
        if (reformatToken) {
            config.headers = { 
                'Authorization': reformatToken,
                'Content-Type': 'application/json'
            }
        }
        if(expire <= 270){
            console.log("Front end needs refreshing ")
            const newAccessToken = await refreshAccessToken();
            console.log("New access token generate from api REQUEST interceptor: ",newAccessToken);
        }
        
        return config;
    }, (error) =>{
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => {
        return response;
    },
    
    async(error) => {/*
        const originalRequest = error.config;
        
        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            const accessToken = await refreshAccessToken();
            console.log("New access token generate from api RESPONSE interceptor: ",accessToken);
            if (accessToken) {
                originalRequest.headers.Authorization = accessToken;
                return axios(originalRequest);
            }
            
        }
        */
        return Promise.reject(error);
    }
)
export default api;