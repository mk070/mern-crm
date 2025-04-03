const express = require("express");
const axios = require("axios");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBvtqPeVnrqjAb44Q6zKx6572iMPUE10nc");

// Initialize the Gemini model
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
const router = express.Router();

// Define your prompt based on the CRM application
const promptTemplate = `
You are an AI chatbot assistant integrated into a CRM application. 

Respond concisely and professionally, maintaining a CRM-oriented tone.

### User Query:
{query}
`;

// POST request to handle chatbot queries
router.get("/", async (req, res) => {
  try {
    const userQuery = req.query.query;

    if (!userQuery) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Prepare the input for Gemini API
    const inputPrompt = promptTemplate.replace("{query}", userQuery);

    // Call Gemini API (replace with your Gemini endpoint and API key)
    const response = await model.generateContent(inputPrompt);
    console.log('response : ',response.response.text());

    const geminiResponse = response.response.text()

    // Return response to the client
    res.json({ reply: geminiResponse });
  } catch (error) {
    console.error("Error fetching chatbot response:", error.message);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
});

module.exports = router;
