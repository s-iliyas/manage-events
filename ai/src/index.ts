import * as dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import morgan from "morgan";
import express from "express";
import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import { ChatOpenAI } from "langchain/chat_models/openai";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.post("/q", async (req, res) => {
  try {
    const data = req.body;
    const datasource = new DataSource({
      type: "postgres",
      url: `${process.env.DB_URL}`,
    });
    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
      //   includesTables: ["users", "todos"],
    });
    const llm = new ChatOpenAI();
    const prompt =
      PromptTemplate.fromTemplate(`Based on the provided SQL table schema below, write a SQL query that would answer the user's question.
                ------------
                SCHEMA: {schema}
                ------------
                QUESTION: {question}
                ------------
                SQL QUERY:
        `);
    const sqlQueryChain = RunnableSequence.from([
      {
        schema: async () => db.getTableInfo(),
        question: (input: { question: string }) => input.question,
      },
      prompt,
      llm.bind({ stop: ["\nSQLResult:"] }),
      new StringOutputParser(),
    ]);
    const finalResponsePrompt =
      PromptTemplate.fromTemplate(`Based on the table schema below, question, SQL query which has relations userId and etc, and SQL response, write a natural language response:
                ------------
                SCHEMA: {schema}
                ------------
                QUESTION: {question}
                ------------
                SQL QUERY: {query}
                ------------
                SQL RESPONSE: {response}
                ------------
                NATURAL LANGUAGE RESPONSE:
        `);
    const finalChain = RunnableSequence.from([
      {
        question: (input: any) => input.question,
        query: sqlQueryChain,
      },
      {
        schema: async () => db.getTableInfo(),
        question: (input: any) => input.question,
        query: (input: any) => input.query,
        response: (input: any) => db.run(input.query),
      },
      finalResponsePrompt,
      llm,
      new StringOutputParser(),
    ]);

    const finalResponse = await finalChain.invoke({
      question: `${data?.question}`,
      // 'Create a todo with title meeting client and description as how to create an app regarding ai along with due date tomorrow in iso string for user with id as "4dc02817-4e86-4e31-b2fa-5041cb90d034" and id in database is auto incremented and avoid duplicate key constraints',
    });
    return res.status(200).json(finalResponse);
  } catch (error: any) {
    console.log(error?.message);
    return res.status(400).json(error?.message);
  }
});

const port = process.env.NODE_PORT || 8000;

app
  .listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Server started at: ${new Date()}`);
    console.log("Press Ctrl+C to stop the server.");
  })
  .on("error", (error) => {
    console.log("[SERVER-ERROR] - ", error.message);
    process.exit();
  });
