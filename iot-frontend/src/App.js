
import './App.css';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

// ----------------------------------------------------
// COMPONENT IMPORT
// ----------------------------------------------------
import Login from "./Components/Login/Login";
import Cashier from './Components/Cashier/Cashier';
import Home from './Components/Home/Home';
import Layout from './Components/Layout';
import Welcome from './Components/Welcome/Welcome';
import RequireAuth from './Components/RequiredAuth';
import SelectCashier from './Components/SelectCashier/SelectCashier';
import  Manager  from './Components/Manager/Manager';
// ----------------------------------------------------
// APP COMPONENT
// ----------------------------------------------------
function App() {
  return (
    <Router>
      <Routes path='/' element={<Layout/>} >
        {/* public routes */}
        <Route path="/" element={ <Welcome />} />
        <Route path="/login" element={ <Login />} />
        

            {/* protected routes */}
            <Route element={<RequireAuth allowedRole={"all"}/>} >
              <Route path="/home" element={ <Home />} />
            </Route>

            {/* protected routes */}
            <Route element={<RequireAuth allowedRole={"manager"}/>} >
              <Route path="/manager" element={ <Manager />} />
            </Route>

            {/* protected routes */}
            <Route element={<RequireAuth allowedRole={"cashier"}/>} >
              <Route path="cashier">
                <Route path="cashier-workbench" element={ <Cashier />} />
                <Route path="select-cashier" element={ <SelectCashier />} />
              </Route>
            </Route>

        

      </Routes>
    </Router>
  );
}

export default App;

