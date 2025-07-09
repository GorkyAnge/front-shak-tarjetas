import { NextResponse } from "next/server";

export async function GET() {
  try {
    const keycloakIssuer = process.env.KEYCLOAK_ISSUER;

    if (!keycloakIssuer) {
      return NextResponse.json({
        status: "ERROR",
        message: "KEYCLOAK_ISSUER not configured",
      });
    }

    // Intentar conectar al endpoint de configuración de Keycloak
    const wellKnownUrl = `${keycloakIssuer}/.well-known/openid_configuration`;

    const response = await fetch(wellKnownUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        status: "ERROR",
        message: `Failed to connect to Keycloak: ${response.status} ${response.statusText}`,
        issuer: keycloakIssuer,
        wellKnownUrl,
      });
    }

    const config = await response.json();

    return NextResponse.json({
      status: "OK",
      message: "Successfully connected to Keycloak",
      issuer: keycloakIssuer,
      wellKnownUrl,
      keycloakConfig: {
        authorization_endpoint: config.authorization_endpoint,
        token_endpoint: config.token_endpoint,
        userinfo_endpoint: config.userinfo_endpoint,
        end_session_endpoint: config.end_session_endpoint,
        issuer: config.issuer,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: "ERROR",
      message: `Error connecting to Keycloak: ${error.message}`,
      issuer: process.env.KEYCLOAK_ISSUER,
    });
  }
}
