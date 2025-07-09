"use client";

import { useState } from "react";
import { FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";
import { Navigation } from "../components/Navigation";
import { useAuth } from "../hooks/useAuth";

export default function Demo() {
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Configuración de Variables de Entorno",
      description: "Configura tu archivo .env.local",
      content: `# Copia el archivo .env.example a .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-clave-secreta-aqui
KEYCLOAK_ID=nextjs-client
KEYCLOAK_SECRET=tu-client-secret-keycloak
KEYCLOAK_ISSUER=http://keycloak-aci-eastus.eastus.azurecontainer.io:8080/realms/master`,
      type: "code",
    },
    {
      title: "Configuración de Keycloak",
      description: "Configura tu cliente en Keycloak",
      content: [
        "1. Crear cliente 'nextjs-client'",
        "2. Access Type: confidential",
        "3. Standard Flow: enabled",
        "4. Direct Access Grants: disabled",
        "5. Valid Redirect URIs: http://localhost:3000/api/auth/callback/keycloak",
        "6. Web Origins: http://localhost:3000",
        "7. Generar client secret",
      ],
      type: "list",
    },
    {
      title: "Iniciar Sesión",
      description: "Haz clic en 'Iniciar Sesión' para autenticarte",
      content:
        "Una vez configurado Keycloak, podrás iniciar sesión y acceder a todas las funcionalidades del sistema.",
      type: "text",
    },
    {
      title: "Usar el Sistema",
      description: "Explora las funcionalidades",
      content: [
        "• Registrar identificadores",
        "• Consultar saldos",
        "• Realizar recargas",
        "• Procesar débitos",
        "• Gestionar sesiones",
      ],
      type: "list",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Demo - Configuración de Keycloak
            </h1>
            <p className="text-gray-600">
              Guía paso a paso para configurar y usar el sistema de
              autenticación
            </p>
          </div>

          {/* Estado de Autenticación */}
          <div className="mb-8 p-4 rounded-lg border">
            <div className="flex items-center space-x-2 mb-2">
              {isAuthenticated ? (
                <>
                  <FiCheckCircle className="text-green-500" />
                  <span className="font-medium text-green-700">
                    Autenticado
                  </span>
                </>
              ) : (
                <>
                  <FiAlertTriangle className="text-yellow-500" />
                  <span className="font-medium text-yellow-700">
                    No autenticado
                  </span>
                </>
              )}
            </div>
            {isAuthenticated && user && (
              <div className="text-sm text-gray-600">
                Usuario: {user.name || user.email || "Usuario de Keycloak"}
              </div>
            )}
          </div>

          {/* Navegación de pasos */}
          <div className="mb-8">
            <div className="flex space-x-2 overflow-x-auto">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentStep === index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Paso {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Contenido del paso actual */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 mb-4">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              {steps[currentStep].type === "code" && (
                <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                  <code>{steps[currentStep].content}</code>
                </pre>
              )}

              {steps[currentStep].type === "list" && (
                <ul className="space-y-2">
                  {steps[currentStep].content.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {steps[currentStep].type === "text" && (
                <p className="text-gray-700">{steps[currentStep].content}</p>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <FiInfo className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-1">
                    Información
                  </h3>
                  <div className="text-sm text-blue-700">
                    {currentStep === 0 && (
                      <p>
                        Asegúrate de tener todas las variables configuradas
                        antes de continuar. Puedes usar el archivo .env.example
                        como referencia.
                      </p>
                    )}
                    {currentStep === 1 && (
                      <p>
                        La configuración correcta de Keycloak es crucial para el
                        funcionamiento del sistema. Verifica cada paso
                        cuidadosamente.
                      </p>
                    )}
                    {currentStep === 2 && (
                      <p>
                        Si tienes problemas con el login, verifica que las URLs
                        de redirección estén configuradas correctamente en
                        Keycloak.
                      </p>
                    )}
                    {currentStep === 3 && (
                      <p>
                        Una vez autenticado, tendrás acceso completo a todas las
                        funcionalidades del sistema de gestión de tarjetas.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <button
              onClick={() =>
                setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
              }
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>

        {/* Enlaces útiles */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Documentación</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                •{" "}
                <a
                  href="/KEYCLOAK_SETUP.md"
                  className="text-blue-600 hover:underline"
                >
                  Guía de configuración de Keycloak
                </a>
              </li>
              <li>
                •{" "}
                <a
                  href="https://next-auth.js.org/providers/keycloak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  NextAuth.js Keycloak Provider
                </a>
              </li>
              <li>
                •{" "}
                <a
                  href="https://www.keycloak.org/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Documentación de Keycloak
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">
              Estado del Sistema
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>NextAuth.js:</span>
                <span className="text-green-600">✓ Configurado</span>
              </div>
              <div className="flex justify-between">
                <span>Keycloak Provider:</span>
                <span className="text-green-600">✓ Integrado</span>
              </div>
              <div className="flex justify-between">
                <span>Protección de rutas:</span>
                <span className="text-green-600">✓ Activa</span>
              </div>
              <div className="flex justify-between">
                <span>Estado de sesión:</span>
                <span
                  className={
                    isAuthenticated ? "text-green-600" : "text-yellow-600"
                  }
                >
                  {isAuthenticated ? "✓ Autenticado" : "⚠ No autenticado"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
