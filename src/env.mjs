import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import * as dotenv from "dotenv";

const environment = process.env.NODE_ENV || "development";

const fileName = {
  development: ".env.local",
  prod: ".env.production",
  test: ".env.test"
};

dotenv.config({
  path: `../${fileName[environment]}`
});

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    DATABASE_URL: z.string().url(),
    SHADOW_DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    PINECONE_API_KEY: z.string().min(1),
    PINECONE_ENVIRONMENT: z.string().min(1),
    PINECONE_INDEX: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1)
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1)
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SHADOW_DATABASE_URL: process.env.SHADOW_DATABASE_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    PINECONE_INDEX: process.env.PINECONE_INDEX,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  }
});
