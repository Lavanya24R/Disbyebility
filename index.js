const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const PORT = 3000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Serve frontend
app.use(express.static("public")); // serves index.html automatically
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs"); // Render index.ejs
});

app.get("/chatbot", (req, res) => {
  res.render("chatbot.ejs"); // Render chatbot.ejs
});

// Chat route
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const botReply = completion.data.choices[0].message.content;
    res.json({ reply: botReply });
    console.log(botReply);
    res.render("chatbot.ejs", { reply: botReply }); // Render chatbot.ejs with reply
  } catch (error) { 
    console.error("OpenAI API Error:", error.message);
    res.status(500).json({ reply: "Something went wrong!" });
  }
});

app.listen(PORT, () => console.log(``));