"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FiAlertCircle, FiHome } from "react-icons/fi";

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "Configuration":
        return "Hay un problema con la configuración del servidor de autenticación.";
      case "AccessDenied":
        return "Acceso denegado. No tienes permisos para acceder a esta aplicación.";
      case "Verification":
        return "El token de verificación ha expirado o ya ha sido utilizado.";
      case "Default":
        return "Ocurrió un error durante la autenticación.";
      default:
        return "Error de autenticación desconocido.";
    }
  };

  const getErrorTitle = (errorCode) => {
    switch (errorCode) {
      case "Configuration":
        return "Error de Configuración";
      case "AccessDenied":
        return "Acceso Denegado";
      case "Verification":
        return "Error de Verificación";
      default:
        return "Error de Autenticación";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <FiAlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {getErrorTitle(error)}
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-center">
              <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/auth/signin")}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Intentar de nuevo
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FiHome className="mr-2 h-4 w-4" />
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
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
      <AuthErrorContent />
    </Suspense>
  );
}
