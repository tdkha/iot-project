import axios from 'axios'
import '../main.css'
import {  useState, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {selectScanner} from '../../redux/reducers/scannerReducer'

const SelectCashier = () => {    
    const [scanner,setScanner] = useState('')  
    const [store,setStore] = useState('')  
    const [errMsg, setErrMsg] = useState('');

    const dispatch = useDispatch();
    const errRef = useRef();
    const location = useLocation()
    const from = location.state?.from?.pathname || "/home";
    const navigate = useNavigate();
    
    const {token} = useSelector(state => state.auth);

    const handleReturn = () =>{
        navigate( from)
    }
    const handleScannerSelect = (scanner) => {
        setScanner((prevScanner) => {
          // Deselect the previous scanner if it's different from the current one
          if (prevScanner !== scanner) {
            return scanner;
          }
          // If the previous scanner is the same as the current one, deselect it
          return "";
        });
      };
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (scanner.length !==0 && store.length !== 0 ){
            try{
                const response = await axios.post('lab-iiot.northeurope.cloudapp.azure.com/scanner/scanner-state-true',
                JSON.stringify({
                    scanner_name:scanner,
                    store_name:store
                }),
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    withCredentials: true
                });
                const scannerInfo = {
                    "scanner_name": scanner,
                    "store_name": store
                }
                dispatch(selectScanner(scannerInfo))
                setScanner('');
                setStore('');
                setErrMsg('');  
                navigate('../cashier-workbench',{state:{from:location}});
            }catch(err) {
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else if (err.response?.status === 500) {
                    setErrMsg(err?.response?.data)
                }  
            }
            
        }else{
            setErrMsg('Please select both store and a scanner to be used')
        }   
    }

    return(
        <section className="container">
            <div className="title"> Please select your store and a scanner to start working </div>
            <form className='shopping-cart'>
                <label>Please select your store </label>
                <div className='buttons'>
                    <button 
                        className={`${store === "Lappeenranta" ? "selected" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setStore('Lappeenranta');
                        }}
                    >Lappeenranta</button>
                    
                        
                </div>
                <label>Please select your scanner </label>
                <div className='buttons'>
                    <button
                        className={`scanner-button ${scanner === "Scanner01" ? "selected" : ""}`}
                        onClick={(e) =>{ 
                            e.preventDefault()
                            handleScannerSelect("Scanner01")
                        }}
                    >Scanner 1</button>
                    <button
                        className={`scanner-button ${scanner === "Scanner02" ? "selected" : ""}`}
                        onClick={(e) =>{ 
                            e.preventDefault()
                            handleScannerSelect("Scanner02")
                        }}
                        
                    >Scanner 2</button>
                    <button
                        className={`scanner-button ${scanner === "Scanner03" ? "selected" : ""}`}
                        onClick={(e) =>{ 
                            e.preventDefault()
                            handleScannerSelect("Scanner03")
                        }}
                    >Scanner 3</button>
                </div>
                <div className='buttons'>
                    <button onClick={handleReturn} className='back-button'> Back </button>
                    <button onClick={handleSubmit} className='submit-button' type='submit'> Submit </button>
                </div>
                
                
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            </form>          
        </section>
    )
}
 
export default SelectCashier;