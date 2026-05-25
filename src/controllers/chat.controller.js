const buildPrompt =
require('../ai/prompt');

const ConversationHistory =
require('../ai/conversation');

const generateResponse =
require('../services/gemini.service');

const safeJsonParse =
require('../utils/safeJsonParse');

const tools =
require('../tools/toolRegistry');

async function chatController(req, res) {

  try {

    const { message } = req.body;

    if (!message) {

      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const prompt =
    buildPrompt(message);

    ConversationHistory.length = 0;

    ConversationHistory.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    let attempts = 0;

    while (attempts < 5) {

      attempts++;

      const aiResponse =
      await generateResponse(
        ConversationHistory
      );

      if (!aiResponse.success) {

        return res.status(500).json({
          success: false,
          message: 'AI Service Failed'
        });
      }

      const response =
      aiResponse.text;

      ConversationHistory.push({
        role: 'model',
        parts: [{ text: response }]
      });

      const data =
      safeJsonParse(response);

      if (!data) {

        return res.status(500).json({
          success: false,
          message: 'Invalid JSON'
        });
      }

      if (!data.tool_needed) {

        return res.json({
          success: true,
          response: data.response
        });
      }

      const selectedTool =
      tools[data.tool_name];

      if (!selectedTool) {

        return res.status(400).json({
          success: false,
          message: 'Tool not found'
        });
      }

      const toolResult =
      await selectedTool(
        data.tool_input
      );

      ConversationHistory.push({
        role: 'user',
        parts: [{
          text:
          `Tool Result:
          ${JSON.stringify(toolResult)}`
        }]
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Too many attempts'
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  chatController
};