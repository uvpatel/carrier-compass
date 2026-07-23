import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { memoryAdapter } from "better-auth/adapters/memory";
import { MongoClient } from "mongodb";

function getDatabaseAdapter() {
  if (process.env.MONGODB_URI) {
    try {
      const client = new MongoClient(process.env.MONGODB_URI);
      return mongodbAdapter(client.db());
    } catch (err) {
      console.warn("Failed to connect MongoDB adapter for Better Auth, using memory adapter:", err);
      return memoryAdapter({});
    }
  }
  return memoryAdapter({});
}

export const auth = betterAuth({
  database: getDatabaseAdapter(),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
