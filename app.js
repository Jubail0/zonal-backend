import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import ErrorMiddleware from './Middlewares/error.js'
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

dotenv.config({
    path:"../server/config.env"
}); 

const FRONTEND_URL = process.env.FRONTEND_URL;

const corsOptions = {
  origin: FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


// Database Connection
const DB = process.env.DB;
const PORT = process.env.PORT;
mongoose.connect(DB).then(()=> {
    console.log("DB Connection Successful")
}).catch((err)=> console.log(err))


// Routes
import sections from "./routes/sections.js";
import products from "./routes/product.js";

app.use("/api/v1", sections);
app.use("/api/v1", products);

app.listen(PORT, ()=> {
    console.log("Server is running at port 5000")
})

// handle Error
app.use(ErrorMiddleware)
