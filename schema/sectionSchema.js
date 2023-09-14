import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    name:String
})


export const Section = mongoose.model("section", sectionSchema)