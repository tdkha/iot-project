import "../main.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux'
import {setCredentials} from '../../redux/reducers/authReducer'


const Login = () => {
    const [user,setUser] = useState('');
    const [pwd, setPwd] =  useState('');
    const [errMsg, setErrMsg] = useState('');

    const userRef = useRef();
    const errRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";

    const dispatch = useDispatch()
    
    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:8000/auth/login",
                JSON.stringify({
                    username: user,
                    password: pwd
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const {expireTime}=response.data
            const credential = {
                "employee_id": Number(response.data.employee_id),
                "fullname": String(response.data.fullname),
                "roles": (response.data.roles.map(element => element.role)),
                "work_at_store_id": Number(response.data.work_at_store_id),
                "accessToken": String(response.data.accessToken),
                "expireTime":expireTime
            }
            
            dispatch(setCredentials(credential))
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        }catch(err){
            console.log(err)
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };

    return ( 
        <section className="container">
            <div className="title"> Log in</div>
            <form onSubmit={handleSubmit}>
                
                <label>USERNAME</label>
                <input 
                    type="text" 
                    placeholder="Enter your username" 
                    ref={userRef}
                    onChange={(e) => setUser(e.target.value)}    
                />
                <label>PASSWORD</label>
                <input 
                    type="password" 
                    placeholder="Enter your password" 
                    onChange={(e) => setPwd(e.target.value)}    
                />
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <button type="submit"> Continue </button>
                
            </form>
        </section>
     );
}
 
export default Login;