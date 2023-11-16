import { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent): Promise<void> => {
  try {
    console.log(JSON.stringify(event?.Records));
  } catch (error: any) {
    const message = {
      message:
        error?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Cron Push Messages Backend Error",
    };
    console.log(JSON.stringify(message));
  }
};
