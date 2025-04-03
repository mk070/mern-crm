const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

// Define the prompt template for proposal generation
const promptTemplate = (type, clientName, companyName) => `
You are an AI assistant in a CRM application. Generate a professional, well-structured ${type} proposal for a client.

### Client Name: ${clientName}
### Company Name: ${companyName}
### Proposal Type: ${type}

Ensure the proposal is engaging, structured, and contains a clear offer with benefits.

Format:
1. **Introduction**
2. **Scope of Work**
3. **Timeline & Deliverables**
4. **Pricing & Payment Terms**
5. **Closing Statement**
`;

// POST request to generate AI-powered proposals
router.post("/", async (req, res) => {
  try {
    const { type, clientName, companyName } = req.body;

    if (!type || !clientName || !companyName) {
      return res.status(400).json({ error: "Proposal type, client name, and company name are required." });
    }

    const inputPrompt = promptTemplate(type, clientName, companyName);

    // Generate content using Google Gemini
    const response = await model.generateContent(inputPrompt);
    const proposalText = await response.response.text();

    // Send the AI-generated proposal
    res.json({ proposal: proposalText });
  } catch (error) {
    console.error("Error generating proposal:", error);
    res.status(500).json({ error: "Failed to generate proposal. Please try again later." });
  }
});

module.exports = router;
