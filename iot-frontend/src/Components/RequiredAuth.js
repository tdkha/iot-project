import { Outlet, useLocation, Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequiredAuth = ({allowedRole}) => {
    const {roles,token} = useSelector(state => state.auth);
    
    const location = useLocation() //current location

    return (
        (token && (roles.includes(allowedRole)|| allowedRole === 'all' ) )
            ? <Outlet/> 
            : <Navigate to='/login' replace state={{ from: location }} />
          
    )
}
export default RequiredAuth;