require('dotenv').config();

const readlineSync = require('readline-sync');

const buildPrompt = require('./ai/prompt');
const ConversationHistory = require('./ai/conversation');

const generateResponse = require('./services/gemini.service');

const getWeather = require('./tools/weather.tool');

const safeJsonParse = require('./utils/safeJsonParse');



async function chatting() {

  const question =
    readlineSync.question("How can I help you? -> ");

  const prompt = buildPrompt(question);

  ConversationHistory.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const tools = require('./tools/toolRegistry');

let attempts = 0;

while (attempts < 5) {

  attempts++;

  const aiResponse =
    await generateResponse(ConversationHistory);

  if (!aiResponse.success) {

    console.log("AI Service Failed");
    break;
  }

  const response = aiResponse.text;

  ConversationHistory.push({
    role: 'model',
    parts: [{ text: response }]
  });

  const data = safeJsonParse(response);

  if (!data) {

    console.log("Invalid JSON");
    break;
  }

  if (!data.tool_needed) {

    console.log("\nFinal Response:\n");

    console.log(data.response);

    break;
  }

  const selectedTool =
    tools[data.tool_name];

  if (!selectedTool) {

    console.log("Tool not found");

    break;
  }

  console.log(
    `Executing Tool: ${data.tool_name}`
  );

  const toolResult =
    await selectedTool(data.tool_input);

  ConversationHistory.push({
    role: 'user',
    parts: [{
      text:
      `Tool Result:
      ${JSON.stringify(toolResult)}`
    }]
  });
}
}

chatting();