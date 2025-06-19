import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost",
    "X-Title": "TB-Questionnaire",
  },
});

app.post("/api/chat", async (req, res) => {
  const { messages, sessionId } = req.body;

  // res.set({
  //   "Content-Type": "text/event-stream",
  //   "Cache-Control": "no-cache",
  //   Connection: "keep-alive",
  // });

  // const stream = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo",
  //   temperature: 0.2,
  //   stream: true,
  //   messages: [
  //     { role: "system", content: `You are a triage assistant…` },
  //     // ...history,
  //     ...messages,
  //   ],
  // });
  // for await (const chunk of stream) {
  //   const delta = chunk.choices[0]?.delta?.content || "";

  //   res.write(`data:${delta}\n\n`);
  // }
  // res.write("data:[DONE]\n\n");
  // res.end();

  try {
    const chat = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      stream: false,
      messages: [{ role: "system", content: `You are a triage assistant…` }, ...messages],
    });
    console.log(chat.choices);
    const reply = chat.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
