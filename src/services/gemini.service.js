const ai = require('../config/ai.config');

async function generateResponse(contents) {

  try {

    const response =
      await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents
      });

    return {
      success: true,
      text: response.text
    };

  } catch (error) {

    console.error(
      "Gemini Service Error:",
      error.message
    );

    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = generateResponse;