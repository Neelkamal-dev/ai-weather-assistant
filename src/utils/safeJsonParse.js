function safeJsonParse(text) {

  try {

    if (!text || typeof text !== 'string') {
      return null;
    }

    text = text
      .replace(/^```json\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    return JSON.parse(text);

  } catch (error) {

    console.error("JSON Parse Error:", error.message);

    return null;
  }
}

module.exports = safeJsonParse;