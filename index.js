const {GoogleGenAI} = require('@google/genai');
const readlineSync = require('readline-sync');
require('dotenv').config();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

const ConversationHistory = [];

async function main() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: ConversationHistory
  });
  return response.text;
}


// Weather leke aayega 

async function getWeather(location){

  const weatherInfo = [];

  for(const {city,date} of location){

    if(date.toLowerCase() == 'today'){
      const responce = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`);
      const data = await responce.json();     
      weatherInfo.push(data);
    }
    else{
      const responce = await fetch(`http://api.weatherapi.com/v1/future.json?key=${process.env.WEATHER_API_KEY}&q=${city}&dt=${date}`);
      const data = await responce.json();
      weatherInfo.push(data);
    }

  }
  return weatherInfo;  
}


async function chatting() {
  const question = readlineSync.question("How I can Help You --->  ");

const prompt = `
  You are an AI agent , who will respond to me in JSON format only.
  Analyse the user query and try to fetch city and date details from it .
  Date format should be in (yyyy-mm-dd) if user ask for future weather .
  If user ask for today weather , mark date as 'today'.
  to fetch weather details , I already have some function which can fetch the weather details for me ,

  if you need weather inforamatiion use the below format 
  JSON format should look like below : 
  {
    "weather_details_needed : boolean,
    "location": [{"city":"mumbai","date":"today"},{"city":"Mumbai","date":"2026-05-23"}]
  }

  As an LLM; You don't know currrent date: Mark Today date is 2026-05-23

Once you have the weather report details, respond me in JSON format only.
If I have provided you weather details of delhi and you have enough information about them, make the summary of weather report and return it to me like below.
JSON format should look like below:
{
  "weather_details_needed": false,
  "weather_report":"Bhai Delhi ka mausam toh badiya hai, 18 degree temperatur hai, ghar pe pakode bana lo, maja aayega khaane mein",
}


User asked this question: ${question}

Strictly follow JSON format, respond only in JSON format.

`


ConversationHistory.push({
    role: "user",
    parts: [{ text: prompt }]
})


while(true){

let response = await main();

ConversationHistory.push({role:'model',parts:[{text:response}]})

response = response.trim();
response = response.replace(/^```json\s*|```$/g,'').trim();

const data = JSON.parse(response);



if(data.weather_details_needed==false){
    console.log(data.weather_report);
    break;
}


const weatherInformation = await getWeather(data.location);

const weatherInfo = JSON.stringify(weatherInformation);

ConversationHistory.push({role:'user',parts:[{text:`This is the weather report I Have fetched for you, use this weather report to generate user response, earlier you asked me to fetch weather details for model. ${weatherInfo}`}]})

}

}

chatting();












// delhi ka mausam bata

// LLM ko Bolunga : Delhi and mumbai ka mausam bata , return me mujhe location wala array de dena 

// [{city: "delhi",date:"today"},{city:"Mumbai",date:"today"}];

// Location getweather ---> Actual weather laake de dega 

// Actual weather aaya hai , LLM ko dunga , iska weather roport card ready kar do 

// User output me result de denge 

