import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    section_Id:{
        type:String,
    },
    size:{
        type:String,
        required:[true,"Please enter product size"]
    },
    quantity:{
        type:Number,
        required:[true, "Please enter quantity"]
    }
})


export const Product = mongoose.model("product", productSchema)