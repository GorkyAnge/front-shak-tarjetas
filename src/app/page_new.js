"use client";
import { useState } from "react";
import {
  FiPlusCircle,
  FiSearch,
  FiCreditCard,
  FiBarChart2,
  FiShield,
  FiDollarSign,
} from "react-icons/fi";
import { Navigation } from "./components/Navigation";
import { UserProfile } from "./components/AuthComponents";
import { useAuth, useApiRequest } from "./hooks/useAuth";

const baseUrl = "https://api-shak-tarjetas-9fdaa9035cd4.herokuapp.com";

export default function Home() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { makeRequest, hasToken } = useApiRequest();

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("register");

  // Register Identifier
  const [registerIdentifier, setRegisterIdentifier] = useState("");
  const [registerResult, setRegisterResult] = useState("");

  // Check Identifier
  const [checkIdentifier, setCheckIdentifier] = useState("");
  const [checkResult, setCheckResult] = useState("");

  // Recharge Identifier
  const [rechargeData, setRechargeData] = useState({
    customer_email: "",
    card_type: "",
    card_holder_name: "",
    card_number: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    amount: "",
    currency: "USD",
    identifier: "",
  });
  const [rechargeResult, setRechargeResult] = useState("");

  // Charge Identifier
  const [chargeIdentifier, setChargeIdentifier] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");
  const [chargeResult, setChargeResult] = useState("");

  // Updated handlers using Keycloak authentication
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setRegisterResult("Debe iniciar sesión con Keycloak");
      return;
    }

    setIsLoading(true);
    try {
      // Verify if identifier already exists
      const checkRes = await makeRequest(`${baseUrl}/checkIdentifier`, {
        method: "POST",
        body: JSON.stringify({ identifier: registerIdentifier }),
      });

      if (checkRes.message?.toLowerCase().includes("existe")) {
        setRegisterResult("Identificador ya existe");
        return;
      }

      const res = await makeRequest(`${baseUrl}/api/register`, {
        method: "POST",
        body: JSON.stringify({ identifier: registerIdentifier }),
      });

      setRegisterResult(res.message || JSON.stringify(res));
    } catch (err) {
      setRegisterResult(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setCheckResult("Debe iniciar sesión con Keycloak");
      return;
    }

    setIsLoading(true);
    try {
      const res = await makeRequest(`${baseUrl}/checkIdentifier`, {
        method: "POST",
        body: JSON.stringify({ identifier: checkIdentifier }),
      });

      setCheckResult(res.message || JSON.stringify(res));
    } catch (err) {
      setCheckResult(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setRechargeResult("Debe iniciar sesión con Keycloak");
      return;
    }

    setIsLoading(true);
    try {
      const res = await makeRequest(`${baseUrl}/api/recharge`, {
        method: "POST",
        body: JSON.stringify(rechargeData),
      });

      setRechargeResult(
        res.message
          ? `${res.message} - Nuevo saldo: ${res.newBalance}`
          : JSON.stringify(res)
      );
    } catch (err) {
      setRechargeResult(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharge = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setChargeResult("Debe iniciar sesión con Keycloak");
      return;
    }

    setIsLoading(true);
    try {
      const res = await makeRequest(`${baseUrl}/api/charge`, {
        method: "POST",
        body: JSON.stringify({
          identifier: chargeIdentifier,
          amount: Number(chargeAmount),
        }),
      });

      setChargeResult(
        res.message
          ? `${res.message} - Saldo restante: ${res.newBalance}`
          : JSON.stringify(res)
      );
    } catch (err) {
      setChargeResult(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
            <div className="text-center">
              <FiShield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bienvenido a SHAK Tarjetas
              </h2>
              <p className="text-gray-600 mb-8">
                Para acceder al sistema de gestión de tarjetas, necesitas
                iniciar sesión con tu cuenta de Keycloak.
              </p>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    Características del Sistema:
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Registro y gestión de identificadores</li>
                    <li>• Recargas de tarjetas seguras</li>
                    <li>• Consulta de saldos en tiempo real</li>
                    <li>• Autenticación con Keycloak</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "register", label: "Registrar", icon: FiPlusCircle },
    { id: "check", label: "Consultar", icon: FiSearch },
    { id: "recharge", label: "Recargar", icon: FiCreditCard },
    { id: "charge", label: "Debitar", icon: FiDollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Profile Section */}
        <UserProfile />

        {/* Main Content */}
        <div className="bg-white shadow rounded-lg">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "register" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Registrar Identificador
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Registra un nuevo identificador en el sistema.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Identificador
                    </label>
                    <input
                      type="text"
                      value={registerIdentifier}
                      onChange={(e) => setRegisterIdentifier(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ingrese el identificador"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Registrando..." : "Registrar Identificador"}
                  </button>
                </form>

                {registerResult && (
                  <div
                    className={`p-4 rounded-md ${
                      registerResult.includes("Error") ||
                      registerResult.includes("existe")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    <p className="text-sm">{registerResult}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "check" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Consultar Identificador
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Consulta el estado y saldo de un identificador.
                  </p>
                </div>

                <form onSubmit={handleCheck} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Identificador
                    </label>
                    <input
                      type="text"
                      value={checkIdentifier}
                      onChange={(e) => setCheckIdentifier(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ingrese el identificador a consultar"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Consultando..." : "Consultar"}
                  </button>
                </form>

                {checkResult && (
                  <div
                    className={`p-4 rounded-md ${
                      checkResult.includes("Error")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    <p className="text-sm">{checkResult}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "recharge" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Recargar Tarjeta
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Realiza una recarga a un identificador específico.
                  </p>
                </div>

                <form onSubmit={handleRecharge} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email del Cliente
                      </label>
                      <input
                        type="email"
                        value={rechargeData.customer_email}
                        onChange={(e) =>
                          setRechargeData({
                            ...rechargeData,
                            customer_email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Tarjeta
                      </label>
                      <select
                        value={rechargeData.card_type}
                        onChange={(e) =>
                          setRechargeData({
                            ...rechargeData,
                            card_type: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="amex">American Express</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre en la Tarjeta
                      </label>
                      <input
                        type="text"
                        value={rechargeData.card_holder_name}
                        onChange={(e) =>
                          setRechargeData({
                            ...rechargeData,
                            card_holder_name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        value={rechargeData.card_number}
                        onChange={(e) =>
                          setRechargeData({
                            ...rechargeData,
                            card_number: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mes de Vencimiento
                      </label>
                      <input
                        type="text"
                        value={rechargeData.expiryMonth}
                        onChange={(e) =>
                          setRechargeData({
                            ...rechargeData,
                            expiryMonth: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="MM"
                        maxLength="2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Año de Vencimiento
                      </label>
                      <input
                        type="text"
                        value={rechargeData.expiryYear}
                        onChange={(e) =>
                          setRechargeData({
                            ...rechargeData,
                            expiryYear: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="YYYY"
                        maxLength="4"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={rechargeData.cvv}
                        onChange={(e) =>
                          setRechargeData({
                            ...rechargeData,
                            cvv: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={rechargeData.amount}
                        onChange={(e) =>
                          setRechargeData({
                            ...rechargeData,
                            amount: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Identificador
                      </label>
                      <input
                        type="text"
                        value={rechargeData.identifier}
                        onChange={(e) =>
                          setRechargeData({
                            ...rechargeData,
                            identifier: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Procesando..." : "Recargar"}
                  </button>
                </form>

                {rechargeResult && (
                  <div
                    className={`p-4 rounded-md ${
                      rechargeResult.includes("Error")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    <p className="text-sm">{rechargeResult}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "charge" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Debitar de Tarjeta
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Realiza un débito de un identificador específico.
                  </p>
                </div>

                <form onSubmit={handleCharge} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Identificador
                    </label>
                    <input
                      type="text"
                      value={chargeIdentifier}
                      onChange={(e) => setChargeIdentifier(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto a Debitar
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={chargeAmount}
                      onChange={(e) => setChargeAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Procesando..." : "Debitar"}
                  </button>
                </form>

                {chargeResult && (
                  <div
                    className={`p-4 rounded-md ${
                      chargeResult.includes("Error")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    <p className="text-sm">{chargeResult}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
