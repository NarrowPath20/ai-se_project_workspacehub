import mongoose from "mongoose";
import { env } from "./env";

let connection: Promise<typeof mongoose> | null = null;

export const connectToDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === mongoose.ConnectionStates.connected) {
    return;
  }

  if (!connection) {
    connection = mongoose.connect(env.mongoUri).finally(() => {
      // Mongoose owns the live connection. Cache only the in-flight attempt.
      connection = null;
    });
  }

  await connection;
};
