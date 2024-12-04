import {config} from "dotenv"
config()

import OpenAI from "openai";
import readline from "readline";

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});
const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

userInterface.prompt()
userInterface.on("line", async input =>{
    const res = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: input }],
    })
    console.log(res.data.choices[0].messages.content)
    userInterface.prompt()
})