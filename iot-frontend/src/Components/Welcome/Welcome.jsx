import { Link } from 'react-router-dom';
import './Welcome.css'

const Welcome = () => {    
    return ( 
        <section className="welcome-container">
            <div className="welcome-title"> Welcome to the home page </div>
            <button className='welcome-button'><Link to="/login">Log in</Link></button>
        </section>
     );
}
 
export default Welcome;