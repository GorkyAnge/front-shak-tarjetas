import { NextResponse } from "next/server";

export async function GET() {
  const requiredEnvVars = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "***SET***" : "NOT SET",
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET
      ? "***SET***"
      : "NOT SET",
    KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value || value === "NOT SET")
    .map(([key]) => key);

  return NextResponse.json({
    status: missingVars.length === 0 ? "OK" : "ERROR",
    variables: requiredEnvVars,
    missing: missingVars,
    message:
      missingVars.length === 0
        ? "All environment variables are configured"
        : `Missing variables: ${missingVars.join(", ")}`,
  });
}
