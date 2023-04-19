import axios from "axios";
import { setCredentials, setToken , logOut} from "../redux/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useRefreshToken = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const refresh = async () => {
        try{
            const response = await axios.get('http://localhost:8000/auth/refreshtoken',{
                withCredentials: true
            });
            const token = response?.data?.accessToken;
            if(token){
                dispatch( setToken({token}) );
            }
        }catch(err){
            if (!err?.response) {
                window.location.reload(); //reload page
            } else if (err.response?.status === 403) {
                dispatch(logOut)
            }
            navigate('/login', { replace: true })
            
        }  
    }
    return refresh;
}

export default useRefreshToken;