import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import { ChatOpenAI } from "langchain/chat_models/openai";

import { apiResponse } from "../helpers/apiResponse";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (
      event?.headers?.["x-hasura-admin-secret"] !==
      `${process.env.HASURA_ADMIN_SECRET}`
    ) {
      throw new Error("Unauthorized.");
    } else {
      const datasource = new DataSource({
        type: "postgres",
        url: `${process.env.DB_URL}`,
      });
      const db = await SqlDatabase.fromDataSourceParams({
        appDataSource: datasource,
      });
      const llm = new ChatOpenAI();
      const body = JSON.parse(`${event?.body}`);
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
        question: body?.question,
      });
      return apiResponse._200(finalResponse);
    }
  } catch (error: any) {
    console.log(error?.message);
    return apiResponse._400(error?.message);
  }
};
