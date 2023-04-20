import axios from 'axios'
import '../main.css'
import {io} from "socket.io-client"
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate,Navigate} from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { deSelectScanner } from '../../redux/reducers/scannerReducer';
import {addItem, clearItem, removeItem} from '../../redux/reducers/productReducer';
const Cashier = () => {
    const [cardNum, setCardNum]  = useState(0);
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const location = useLocation()
    const from = location.state?.from?.pathname ;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    const {employee_id,token} = useSelector(state => state.auth);
    const { scanner_name, store_name} = useSelector(state => state.scanner);
    const productLists = useSelector(state => state.products);

    const socket = io('lab-iiot.northeurope.cloudapp.azure.com', {
        withCredentials: true,
        headers: { 
            'Content-Type': 'application/json'
        }
    });

    const total = (productLists.map(element => element.price).reduce( (prev,cur) => prev + cur ,0)).toFixed(2);;


    useEffect(()=>{
        socket.emit("scanner_connected",scanner_name);
    },[]);

    useEffect(()=>{
        socket.on("product_added",(response)=>{
            dispatch(addItem(response.product));
        });
        return () => {
            socket.off("product_added");
        };
    },[]);
    
    useEffect(() => {
        const handleBeforeUnload = async (e) => {
            console.log("Refresh")
            e.preventDefault()
          // Update the scanner state in the database
            await axios.post('lab-iiot.northeurope.cloudapp.azure.com/scanner/scanner-state-false',
                JSON.stringify({
                scanner_name: scanner_name,
                store_name: store_name
                }),
                {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token 
                },
                withCredentials: true
                });
            socket.disconnect();
            // Navigate to select cashier page
            navigate(from, { replace: true});
            // deselect scanner 
            dispatch(deSelectScanner());
            dispatch(clearItem());
        }
        window.addEventListener('beforeunload', handleBeforeUnload);
      
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };   
      }, [scanner_name, store_name]);
    
    const handleDelete = async(e) => {
        e.preventDefault();
        dispatch(removeItem());
    };

    const handleCLear = async(e) =>{
        e.preventDefault()
        dispatch(clearItem());
    };

    const handleScannerLogOut = async(e) =>{
        e.preventDefault()
        try{
            const scannerInfo = {
                "scanner_name": scanner_name,
                "store_name":store_name
            };

            await axios.post('lab-iiot.northeurope.cloudapp.azure.com/scanner/scanner-state-false',
            JSON.stringify({
                scanner_name:scanner_name,
                store_name:store_name
            }),
            {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token 
                 },
                withCredentials: true
            });   
            socket.disconnect(); 
            dispatch(deSelectScanner(scannerInfo));
            dispatch(clearItem());
            navigate(from, { replace: true});
            setErrMsg('');
            setSuccessMsg('');
        }catch(err){
            if (!err?.response) {
                setErrMsg('No Server Response');
            }
        }finally{
            socket.disconnect();         
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            if(productLists.length ==0){
                setErrMsg('No item in the cart. Please add one');
            }else{
                    const response = await productLists.map( async(element) => await axios.post('lab-iiot.northeurope.cloudapp.azure.com/sale/addsale',
                JSON.stringify({
                    "card_number": 181003,
                    "product_info": {
                        "product_id":element.id,
                        "quantity":element.quantity,
                        "price":element.price
                    },
                    "employee_id":employee_id,
                    "store_name": store_name
                }),
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': token 
                    },
                    withCredentials: true
                }).catch((err) => { 
                    if (!err?.response) {
                        setErrMsg('No Server Response');
                    } else if (err.response?.status === 500) {
                        setErrMsg(err?.response?.data);
                    }  
                }))
                dispatch(clearItem());
                if (!errMsg){
                    setSuccessMsg('Transaction Accepted')
                    setTimeout(()=> {
                        setSuccessMsg('');
                    },10000)
                }
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
        (from == '/cashier/select-cashier' ) 
        ?( 
            <section className="cashier-container">         
                <form className='shopping-cart' onSubmit={handleSubmit}>
                    <div className="title"> Shopping cart </div>
                    <div className='item-container'>
                        <div className='items'>
                            <div className='item-name'>
                                <div className='item-title'>Name</div>
                                <hr />
                                {productLists.map((element) => <p key={element.id}>{element.name}</p>)}
                            </div>
                            <div className='item-price'>
                                <div className='item-title'>Price</div>
                                <hr />
                                {productLists.map((element) => <p key={element.id}>{element.price}</p>)}
                            </div>
                            <div className='item-quantity'>
                                <div className='item-title'>Quantity</div>
                                <hr />
                                {productLists.map((element) => <p key={element.id}>{element.quantity}</p>)}
                            </div>
                        </div>
                        <div className='total'>
                            <hr />
                            <p><span>Total: </span><span>{total}</span></p>
                            
                        </div>
                    </div>
                    <div className='buttons'>
                        <button onClick={handleScannerLogOut} className='cashier-button blue-button'>End Scanner</button>
                        <button onClick={handleCLear} className='cashier-button '> Clear </button>
                        <button onClick={handleDelete} className='cashier-button '> Delete </button>
                    </div> 
                                  
                </form>   
                <form className='pay-addproduct-container'>
                    <div className='sale-container'>
                        <div className="title"> Sale</div>
                        <div className='cashier-buttons'>
                            <button >20%</button>
                            <button >40%</button>
                            <button >60%</button>
                        </div>  
                    </div>  
                    
                    <div className='addproduct-container'>
                        <div className="title"> Add Product</div>
                        
                        <div className='pay-content-input-container'>
                            <label>Product id</label>
                            <input 
                            placeholder='Enter product id'
                            className='pay-input'
                            type="text" 
                            onChange={(e) => setCardNum(e.target.value)} 
                            />
                        </div>
                        <button onClick={handleSubmit} className='blue-button'> Add </button>
                    </div>
                    
                    <div className='pay-content-container'>
                    <div className="title"> Card Number</div>
                        <div className='pay-content-input-container'>
                            <input 
                            placeholder='Enter card number'
                            className='pay-input'
                            type="text" 
                            onChange={(e) => setCardNum(e.target.value)} 
                            />
                        </div>
                    
                    <button onClick={handleSubmit} className='blue-button'> Pay </button>
                    </div>
                    <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <p className={successMsg ? "successmsg" : "offscreen"} aria-live="assertive">{successMsg}</p>
                </form>      
            </section>
        )
        :(
            <Navigate to="../select-cashier" replace state={{from:from}}></Navigate>
        )
     )
    
}
 
export default Cashier;