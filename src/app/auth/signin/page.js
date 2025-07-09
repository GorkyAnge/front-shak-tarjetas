"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiUser, FiKey, FiAlertCircle } from "react-icons/fi";

function SignInContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case "OAuthSignin":
          setError("Error al iniciar el proceso de autenticación");
          break;
        case "OAuthCallback":
          setError("Error en la respuesta de autenticación");
          break;
        case "OAuthCreateAccount":
          setError("Error al crear la cuenta");
          break;
        case "EmailCreateAccount":
          setError("Error al crear la cuenta con email");
          break;
        case "Callback":
          setError("Error en el callback de autenticación");
          break;
        case "OAuthAccountNotLinked":
          setError("Esta cuenta ya está asociada con otro proveedor");
          break;
        case "EmailSignin":
          setError("Error al enviar el email de inicio de sesión");
          break;
        case "CredentialsSignin":
          setError("Credenciales inválidas");
          break;
        case "SessionRequired":
          setError("Sesión requerida");
          break;
        default:
          setError("Error de autenticación");
      }
    }
  }, [errorParam]);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push(callbackUrl);
      }
    };
    checkSession();
  }, [router, callbackUrl]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await signIn("keycloak", {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError("Error al iniciar sesión con Keycloak");
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      setError("Error inesperado al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <FiUser className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta usando Keycloak
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error de Autenticación
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <FiKey className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                )}
              </span>
              {isLoading
                ? "Iniciando sesión..."
                : "Iniciar sesión con Keycloak"}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
