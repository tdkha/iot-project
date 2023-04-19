const express = require('express');
const app = express();
//--------------------------------------------
const http = require("http");
const server = http.createServer(app);
//--------------------------------------------
const socketIO = require('socket.io');
const io = socketIO(server,{
    cors:{
        origin: "http://localhost:3000",
        credentials: true
    }
});
app.set('io', io);
const customizedSocket = require("./socketIO");
customizedSocket(io); // establish a socket connection
//--------------------------------------------
const cookieParser = require("cookie-parser");
//--------------------------------------------
const dotenv = require("dotenv");
dotenv.config();
//--------------------------------------------
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
//--------------------------------------------
const PORT = process.env.PORT || 8000;
//--------------------------------------------

// Cross Origin Resource Sharing
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));


// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//file import
const productRoute = require('./routes/product')
const authRoute = require('./routes/auth');
const scannerRoute = require('./routes/scanner');
const saleRoute = require('./routes/sale');
const managerRouter = require('./routes/manager');


// MIDDLEWARE
app.use(cookieParser());
app.use(express.json());

//ROUTES
app.use("/product", productRoute);
app.use("/auth", authRoute);
app.use("/scanner", scannerRoute);
app.use('/sale',saleRoute);
app.use('/manager',managerRouter);

server.listen(PORT,()=>{
    console.log(`Server is running on host ${PORT}`);
    
})