"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { FiUser, FiLogIn, FiLogOut } from "react-icons/fi";

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-gray-600">Cargando...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
          <FiUser className="text-green-600" />
          <span className="text-green-800 font-medium">
            {session.user?.name || session.user?.email || "Usuario"}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FiLogOut />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("keycloak")}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <FiLogIn />
      <span>Iniciar Sesión</span>
    </button>
  );
}

export function UserProfile() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Perfil de Usuario
      </h2>
      <div className="space-y-3">
        {session.user?.name && (
          <div>
            <label className="text-sm font-medium text-gray-500">Nombre</label>
            <p className="text-gray-900">{session.user.name}</p>
          </div>
        )}
        {session.user?.email && (
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{session.user.email}</p>
          </div>
        )}
        <div>
          <label className="text-sm font-medium text-gray-500">
            Estado de Sesión
          </label>
          <p className="text-green-600 font-medium">Autenticado</p>
        </div>
      </div>
    </div>
  );
}
