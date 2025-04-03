const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require("node-fetch"); // Required for Fetch API in Node.js

// Initialize Google Generative AI Client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Analyze Image with Gemini API
 * @param {string} imageUrl - URL of the image to be analyzed
 */
const analyzeImage = async (imageUrl) => {
  try {
    // Fetch the image as an array buffer
    const imageResp = await fetch(imageUrl).then((response) => response.arrayBuffer());

    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

    // Generate content with the image data and captioning prompt
    const result = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(imageResp).toString("base64"),
          mimeType: "image/jpeg",
        },
      },
      "Generate a single, engaging Instagram caption for this image. The caption should be between 20 to 50 words, highlight unique details and emotions, use creativity, and include 5 to 10 relevant hashtags. Do not include any additional text or explanations—only the caption itself.",
    ]);

    // Log the entire response to debug its structure
    console.log("Response from Gemini API:", JSON.stringify(result, null, 2));

    // Extract the generated caption text
    if (
      result &&
      result.response &&
      result.response.candidates &&
      result.response.candidates.length > 0 &&
      result.response.candidates[0].content &&
      result.response.candidates[0].content.parts &&
      result.response.candidates[0].content.parts.length > 0
    ) {
      return result.response.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Failed to extract caption from response.");
    }
  } catch (error) {
    console.error("Error in generating caption:", error);
    throw error;
  }
};

/**
 * Main Function
 * @param {string} url - URL of the image
 */
const main = async (url) => {
  try {
    // Analyze the image using Gemini
    const caption = await analyzeImage(url);

    console.log("Final Caption:", caption);
    return caption;
  } catch (error) {
    console.error("Error in main function:", error);
    throw new Error(`Caption generation failed: ${error.message}`);
  }
};

// // Example Usage
// const imageUrl =
//   "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg/2560px-Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg";

// main(imageUrl).catch((err) => console.error(err));

// Export for external usage
module.exports = {
  analyzeImage,
  main,
};
