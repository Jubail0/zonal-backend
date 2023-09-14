import express from "express";
import { getAllSections, createSection,changeSectionName,removeSection } from "../controllers/sections.js";

const router = express.Router();

router.route("/")
.get(getAllSections) // Get Section
.post(createSection); // Create Section

router.route("/:id") 
.put(changeSectionName) // Change Section's Name
.delete(removeSection); // Delete Section



export default router;