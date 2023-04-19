import '../main.css'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logOut } from '../../redux/reducers/authReducer';
import useRefreshToken from '../../hooks/useRefreshToken';
const Home = () => {   
    const {fullname,roles} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";
    const navigate = useNavigate();

    const logoutHandler = (e) => {
        e.preventDefault();
        dispatch(logOut());
        navigate('/login',{state:{from:location}})
    }
    return ( 
        <section className="container">
            <div className="title"> This is the protected site</div>
            <p>Welcome back {fullname}</p>    
            <p>Your {roles.length > 1 ? "roles are" : "role is"} {roles.join(', ')}</p>  
            <div className='buttons'>
                {roles.map((role)=>{
                    if (role === "manager"){
                        return ( <button key="manager-button" ><Link to='/manager/'replace state={{ from: location}}>Manager</Link></button>  );
                    }else if (role === "cashier"){
                        return ( <button key="cashier-button" ><Link to='/cashier/select-cashier'replace state={{ from: location}}>Cashier</Link></button>  );
                    }
                })}
            </div>
            <button 
                onClick={useRefreshToken()}
            >Refresh Token</button>
            <button className='back-button' onClick={logoutHandler}>Log out</button>
            
            
        </section>
     );
}
 
export default Home;