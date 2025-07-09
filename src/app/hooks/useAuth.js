"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (session?.accessToken) {
      setToken(session.accessToken);
    }
  }, [session]);

  const isAuthenticated = !!session;
  const isLoading = status === "loading";
  const user = session?.user;

  return {
    session,
    user,
    token,
    isAuthenticated,
    isLoading,
    status,
  };
}

export function useApiRequest() {
  const { token } = useAuth();

  const makeRequest = async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  return { makeRequest, hasToken: !!token };
}
