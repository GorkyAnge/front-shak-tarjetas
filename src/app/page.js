"use client";
import { useState, useEffect } from "react";
import {
  FiPlusCircle,
  FiSearch,
  FiCreditCard,
  FiBarChart2,
} from "react-icons/fi";

const baseUrl = "https://api-shak-tarjetas-9fdaa9035cd4.herokuapp.com";

export default function Home() {
  // Auth state
  const [token, setToken] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

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

  // Load token on mount
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) setToken(saved);
  }, []);

  // Handlers
  const handleUserRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setRegisterError("");
      } else {
        setRegisterError(data.message || "Error al registrar usuario");
      }
    } catch (err) {
      setRegisterError(err.message);
    }
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setLoginError("");
      } else {
        setLoginError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!token) {
      setRegisterResult("Debe iniciar sesión");
      return;
    }
    // Verify if identifier already exists
    const checkRes = await fetch(`${baseUrl}/checkIdentifier`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ identifier: registerIdentifier }),
    });
    const checkData = await checkRes.json();
    if (checkRes.ok && checkData.message?.toLowerCase().includes("existe")) {
      setRegisterResult("Identificador ya existe");
      return;
    }
    const res = await fetch(`${baseUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ identifier: registerIdentifier }),
    });
    const data = await res.json();
    setRegisterResult(data.message || JSON.stringify(data));
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!token) {
      setCheckResult("Debe iniciar sesión");
      return;
    }
    const res = await fetch(`${baseUrl}/checkIdentifier`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ identifier: checkIdentifier }),
    });
    const data = await res.json();
    setCheckResult(data.message || JSON.stringify(data));
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!token) {
      setRechargeResult("Debe iniciar sesión");
      return;
    }
    const res = await fetch(`${baseUrl}/api/recharge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rechargeData),
    });
    const data = await res.json();
    setRechargeResult(
      data.message
        ? `${data.message} - Nuevo saldo: ${data.newBalance}`
        : JSON.stringify(data)
    );
  };

  const handleCharge = async (e) => {
    e.preventDefault();
    if (!token) {
      setChargeResult("Debe iniciar sesión");
      return;
    }
    const res = await fetch(`${baseUrl}/api/charge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        identifier: chargeIdentifier,
        amount: Number(chargeAmount),
      }),
    });
    const data = await res.json();
    setChargeResult(
      data.message
        ? `${data.message} - Saldo restante: ${data.newBalance}`
        : JSON.stringify(data)
    );
  };

  // Show login/register if not authenticated
  if (!token) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          {isRegistering ? (
            <>
              <h2 className="text-xl font-semibold text-[#c10230] mb-4">
                Registro Usuario
              </h2>
              <form onSubmit={handleUserRegister} className="space-y-4">
                <input
                  placeholder="Email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-[#c10230]"
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-[#c10230]"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#c10230] text-white rounded"
                >
                  Registrar
                </button>
              </form>
              {registerError && (
                <p className="mt-4 text-red-600">{registerError}</p>
              )}
              <p className="mt-4 text-center">
                ¿Ya tienes una cuenta?{" "}
                <button
                  onClick={() => setIsRegistering(false)}
                  className="text-[#c10230] font-semibold"
                >
                  Iniciar sesión
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-[#c10230] mb-4">
                Login Usuario
              </h2>
              <form onSubmit={handleUserLogin} className="space-y-4">
                <input
                  placeholder="Email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-[#c10230]"
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-[#c10230]"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#c10230] text-white rounded"
                >
                  Login
                </button>
              </form>
              {loginError && <p className="mt-4 text-red-600">{loginError}</p>}
              <p className="mt-4 text-center">
                ¿No tienes una cuenta?{" "}
                <button
                  onClick={() => setIsRegistering(true)}
                  className="text-[#c10230] font-semibold"
                >
                  Regístrate
                </button>
              </p>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#c10230] text-white p-6">
        <div className="flex items-center mb-10">
          <FiCreditCard size={28} />
          <h1 className="ml-3 text-2xl font-bold">Shak Tarjetas</h1>
        </div>
      </aside>
      <main className="flex-1 bg-gray-100 p-8">
        <div>
          {!token ? (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* User Register Card */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-[#c10230] mb-4">
                  Registro Usuario
                </h2>
                <form onSubmit={handleUserRegister} className="space-y-4">
                  <input
                    placeholder="Email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-[#c10230]"
                  />
                  <input
                    placeholder="Password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-[#c10230]"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#c10230] text-white rounded"
                  >
                    Registrar
                  </button>
                </form>
                {regResult && (
                  <p className="mt-4 text-green-600">{regResult}</p>
                )}
              </div>
              {/* User Login Card */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-[#c10230] mb-4">
                  Login Usuario
                </h2>
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <input
                    placeholder="Email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-[#c10230]"
                  />
                  <input
                    placeholder="Password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-[#c10230]"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#c10230] text-white rounded"
                  >
                    Login
                  </button>
                </form>
                {loginResult && (
                  <p className="mt-4 text-green-600">{loginResult}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Registrar Identificador */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-[#c10230] mb-4">
                  Registrar Identificador
                </h2>
                <form onSubmit={handleRegister} className="space-y-4">
                  <input
                    placeholder="Identificador (ej: PBO1234)"
                    value={registerIdentifier}
                    onChange={(e) => setRegisterIdentifier(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#c10230] text-white rounded hover:bg-[#a80129]"
                  >
                    Registrar
                  </button>
                </form>
                {registerResult && (
                  <p className="mt-4 text-green-600">{registerResult}</p>
                )}
              </div>
              {/* Verificar Identificador */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-[#c10230] mb-4">
                  Verificar Identificador
                </h2>
                <form onSubmit={handleCheck} className="space-y-4">
                  <input
                    placeholder="Identificador"
                    value={checkIdentifier}
                    onChange={(e) => setCheckIdentifier(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#c10230] text-white rounded hover:bg-[#a80129]"
                  >
                    Verificar
                  </button>
                </form>
                {checkResult && (
                  <p className="mt-4 text-blue-600">{checkResult}</p>
                )}
              </div>
              {/* Recargar Identificador */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-[#c10230] mb-4">
                  Recargar Identificador
                </h2>
                <form onSubmit={handleRecharge} className="space-y-4">
                  <input
                    placeholder="Correo del cliente"
                    type="email"
                    value={rechargeData.customer_email}
                    onChange={(e) =>
                      setRechargeData({
                        ...rechargeData,
                        customer_email: e.target.value,
                      })
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                  />
                  <select
                    value={rechargeData.card_type}
                    onChange={(e) =>
                      setRechargeData({
                        ...rechargeData,
                        card_type: e.target.value,
                      })
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                  >
                    <option value="">Tipo de tarjeta</option>
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                    <option value="AMEX">AMEX</option>
                    <option value="DISCOVER">DISCOVER</option>
                  </select>
                  <input
                    placeholder="Nombre en tarjeta"
                    value={rechargeData.card_holder_name}
                    onChange={(e) =>
                      setRechargeData({
                        ...rechargeData,
                        card_holder_name: e.target.value,
                      })
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                  />
                  <input
                    placeholder="Número de tarjeta"
                    value={rechargeData.card_number}
                    onChange={(e) =>
                      setRechargeData({
                        ...rechargeData,
                        card_number: e.target.value,
                      })
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Mes (MM)"
                      value={rechargeData.expiryMonth}
                      onChange={(e) =>
                        setRechargeData({
                          ...rechargeData,
                          expiryMonth: e.target.value,
                        })
                      }
                      required
                      className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                    />
                    <input
                      placeholder="Año (YYYY)"
                      value={rechargeData.expiryYear}
                      onChange={(e) =>
                        setRechargeData({
                          ...rechargeData,
                          expiryYear: e.target.value,
                        })
                      }
                      required
                      className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                    />
                  </div>
                  <input
                    placeholder="CVV"
                    value={rechargeData.cvv}
                    onChange={(e) =>
                      setRechargeData({ ...rechargeData, cvv: e.target.value })
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                  />
                  <input
                    placeholder="Monto"
                    type="number"
                    step="0.01"
                    value={rechargeData.amount}
                    onChange={(e) =>
                      setRechargeData({
                        ...rechargeData,
                        amount: e.target.value,
                      })
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                  />
                  <input
                    placeholder="Identificador"
                    value={rechargeData.identifier}
                    onChange={(e) =>
                      setRechargeData({
                        ...rechargeData,
                        identifier: e.target.value,
                      })
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#c10230] text-white rounded hover:bg-[#a80129]"
                  >
                    Recargar
                  </button>
                </form>
                {rechargeResult && (
                  <p className="mt-4 text-green-600">{rechargeResult}</p>
                )}
              </div>
              {/* Cobrar Identificador */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-[#c10230] mb-4">
                  Cobrar Identificador
                </h2>
                <form onSubmit={handleCharge} className="space-y-4">
                  <input
                    placeholder="Identificador"
                    value={chargeIdentifier}
                    onChange={(e) => setChargeIdentifier(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                    required
                  />
                  <input
                    placeholder="Monto"
                    type="number"
                    step="0.01"
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#c10230]"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#c10230] text-white rounded hover:bg-[#a80129]"
                  >
                    Cobrar
                  </button>
                </form>
                {chargeResult && (
                  <p className="mt-4 text-green-600">{chargeResult}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
