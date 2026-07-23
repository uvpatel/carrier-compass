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
  trustedOrigins: [
    "https://carrier-compass-nine.vercel.app",
    
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "github_client_id_placeholder",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "github_client_secret_placeholder",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "google_client_id_placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google_client_secret_placeholder",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
