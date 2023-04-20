import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../main.css'
import axios from 'axios';
import api from '../../api/api';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
  } from "recharts";

const Manager = () => {
    const [warehouseList , setwarehouseList] = useState([]);
    const [scannerList, setScannerList] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedOptions,setSelectedOptions] = useState(null);
    const [fetchOptionList, setfetchOptionList] = useState([]);

    const [barchartWidth, setBarchartWidth] = useState(500);
    const [barchartHeight, setBarchartHeight] =useState(500)

    const { work_at_store_id , token } = useSelector( state => state.auth);
    const navigate = useNavigate();
    const location = useLocation()

    const handleReturn = () =>{
        navigate('/home');
    }

    const handleScannerState = async(e) => {
        e.preventDefault();
        const scanner = e.target.id;
        const button_target = document.getElementById(scanner)
        const busy = e.target.className.includes('busy'); 
        const classList = e.target.className.split(' ')
        const scanner_state = classList.find(ele => ele=='busy'||ele=='free')
        const store_name = scannerList[0].store_name;
        if(busy){
            await api.post(' /scanner/scanner-state-false',
                JSON.stringify(
                {
                    "scanner_name": scanner,
                    "store_name" : store_name
                }));
                e.target.className = classList.map( (element) => {
                    if (element === scanner_state){
                        element = 'free'
                    }
                    return element
                }).join(' ');
            button_target.innerText = 'Free'
        }else{
            await api.post(' /scanner/scanner-state-true',
                JSON.stringify(
                    {
                        "scanner_name": scanner,
                        "store_name" : store_name
                    }));
            e.target.className = classList.map( (element) => {
                if (element === scanner_state){
                    element = 'busy'
                }
                return element
            }).join(' ');
            button_target.innerText = 'Busy'
        }
    };

    const handleOptionSelect = async(selectedOption) => {
        setSelectedOptions(selectedOption);
        console.log(`Option selected:`, selectedOption.value);

        const response = await axios.post(' /manager/get-weekly-profit',
        JSON.stringify(
            {
                "store_id": work_at_store_id,
                "type": selectedOption.value
            }),
            {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                withCredentials: true
            });
            const data = response.data;
            console.log(data);
        setfetchOptionList(data);
    };

    const handleButtonSizeIncrease = (e) =>{
        e.preventDefault();
        const width = barchartWidth + 50;
        setBarchartWidth(width);
    }

    const handleButtonSizeDecrease = (e) =>{
        e.preventDefault();
        const width = barchartWidth - 50;
        setBarchartWidth(width);
    }

    const fetchWarehouse = async() =>{
        const response = await api.post(' /manager/warehouseinfo',JSON.stringify(
            {
                "store_id": work_at_store_id
            }))

        const data = response.data;
        setwarehouseList(data)
    }

    const fetchScanner = async() => {
        const response = await axios.post(' /scanner/getscannerinfo',
        JSON.stringify(
            {
                "store_id": work_at_store_id
            }),
            {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                withCredentials: true
            });
        const data = response.data;
        setScannerList(data);
    }

    const fetchOptions = async() => {
        const response = await axios.get(' /product/get-product-type');
        const data = response.data;
        const formattedOptions = data.map((option) => ({
            value: option,
            label: option,
          }));
        const allOptions = 
            [...formattedOptions,
                {
                    value:"All",
                    label:"All"
                }
            ]
        setOptions(allOptions)
    }

    useEffect( () => {
        fetchWarehouse();
        fetchScanner();
        fetchOptions();
        return () => {};
    },[]);
    

    return (
        <section className='manager-container'>
            <div className='title'> Manager Page</div>
            <div className='warehouse-container'>
                <h3>Warehouse Information</h3>
                <div className='warehouse-item-container'>
                    <div className='items'>
                        <div className='item-title item-name'>Name</div>
                        <div className='item-title'>Supplier Name</div>
                        <div className='item-title'>Price</div>
                        <div className='item-title'>Quantity</div>
                        
                    </div>
                    {
                        warehouseList.map( (element) => {
                            const name = element.name;
                            const supplier_name = element.supplier_name;
                            const price = element.price;
                            const quantity = element.quantity;
                            return ( 
                                <div className='items' key={name}>
                                    <p className='item-name'>{name}</p>
                                    <p>{supplier_name}</p>
                                    <p>{price}</p>
                                    <p>{quantity}</p>
                                </div> 
                                
                            ) 
                        })
                    }
                </div>
                <h3>Scanner Information</h3>
                <div className='item-container'>
                    <h4>Scanner Info</h4>
                    <div className='items'>
                        <p>Scanners</p>
                        <p>Location</p>
                        <p>State</p>
                    </div>
                    {scannerList.map( (element) =>{
                        const store_name = element.store_name;
                        const isUsed = element.isUsed;
                        const state = (isUsed === 1 ? "Busy" : "Free");
                        return(
                            <div className='items' key={element.name}>
                                <p className='item-name'>{element.name}</p>
                                <p>{store_name}</p>
                                <button 
                                    className={`scanner-state ${state === "Busy" ? "busy" : "free"}`}
                                    id={element.name}
                                    onClick={handleScannerState}
                                >{state}</button>
                            </div>
                        )
                    })}         
                </div>
                <h3>Weekly Product Consumption</h3>
                <div>
                    <Select
                        value={selectedOptions}
                        onChange={handleOptionSelect}
                        options={options}
                    />

                    
                    
                     <div className='graph-container'>
                        
                     <BarChart
                        width={barchartWidth}
                        height={barchartHeight}
                        data={fetchOptionList}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="product_name" />
                        <YAxis dataKey="profit" domain={[0, 200]}/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="quantity" fill="blue" />
                        <Bar dataKey="profit" fill="lightgreen" />
                    </BarChart>
                    <div className='buttons'>
                        <button onClick={handleButtonSizeDecrease}>-</button>
                        <button className='blue-button' onClick={handleButtonSizeIncrease}>+</button>
                    </div>
                    </div>
                    
                </div>
                
                <button onClick={handleReturn} className='back-button'> Back </button>
                
            </div>
        </section>
        
    )
}
export default Manager; 