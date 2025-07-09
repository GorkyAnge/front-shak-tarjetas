# Configuración de Autenticación con Keycloak

## Pasos de Configuración

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env.local` y configura las siguientes variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-clave-secreta-aqui

# Keycloak Configuration
KEYCLOAK_ID=nextjs-client
KEYCLOAK_SECRET=tu-client-secret-aqui
KEYCLOAK_ISSUER=http://keycloak-aci-eastus.eastus.azurecontainer.io:8080/realms/master
```

### 2. Configuración de Keycloak

Asegúrate de que tu cliente Keycloak tenga configurado:

- **Client ID**: `nextjs-client`
- **Access Type**: `confidential`
- **Standard Flow**: `Enabled`
- **Direct Access Grants**: `Disabled`
- **Valid Redirect URIs**:
  - `http://localhost:3000/api/auth/callback/keycloak` (desarrollo)
  - `https://front-shak-tarjetas.vercel.app/api/auth/callback/keycloak` (producción)
- **Web Origins**:
  - `http://localhost:3000` (desarrollo)
  - `https://front-shak-tarjetas.vercel.app` (producción)

### 3. Configuración para Producción

Para producción en Vercel, configura las siguientes variables de entorno:

```bash
NEXTAUTH_URL=https://front-shak-tarjetas.vercel.app
NEXTAUTH_SECRET=tu-clave-secreta-produccion
KEYCLOAK_ID=nextjs-client
KEYCLOAK_SECRET=tu-client-secret-produccion
KEYCLOAK_ISSUER=http://keycloak-aci-eastus.eastus.azurecontainer.io:8080/realms/master
```

### 4. Generar NEXTAUTH_SECRET

Puedes generar una clave secreta ejecutando:

```bash
openssl rand -base64 32
```

O usando Node.js:

```javascript
require("crypto").randomBytes(32).toString("base64");
```

## Funcionalidades Implementadas

### Autenticación

- ✅ Inicio de sesión con Keycloak
- ✅ Cierre de sesión
- ✅ Manejo de sesiones
- ✅ Protección de rutas
- ✅ Manejo de errores de autenticación

### Componentes

- ✅ `AuthProvider` - Proveedor de contexto de autenticación
- ✅ `LoginButton` - Botón de login/logout
- ✅ `UserProfile` - Perfil del usuario autenticado
- ✅ `ProtectedRoute` - Componente para proteger rutas
- ✅ `Navigation` - Navegación con estado de autenticación

### Hooks Personalizados

- ✅ `useAuth` - Hook para manejo de autenticación
- ✅ `useApiRequest` - Hook para requests autenticados

### Páginas

- ✅ `/auth/signin` - Página de inicio de sesión personalizada
- ✅ `/auth/error` - Página de errores de autenticación

## Uso

### Verificar Estado de Autenticación

```javascript
import { useAuth } from "./hooks/useAuth";

function MyComponent() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <div>No autenticado</div>;

  return <div>Hola, {user.name}!</div>;
}
```

### Hacer Requests Autenticados

```javascript
import { useApiRequest } from "./hooks/useAuth";

function MyComponent() {
  const { makeRequest } = useApiRequest();

  const handleApiCall = async () => {
    try {
      const data = await makeRequest("/api/endpoint", {
        method: "POST",
        body: JSON.stringify({ data: "example" }),
      });
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <button onClick={handleApiCall}>Hacer Request</button>;
}
```

### Proteger Rutas

```javascript
import { ProtectedRoute } from "./components/ProtectedRoute";

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Contenido protegido</div>
    </ProtectedRoute>
  );
}
```

## Estructura de Archivos

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.js          # Configuración NextAuth
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.js              # Página de login
│   │   └── error/
│   │       └── page.js              # Página de errores
│   ├── components/
│   │   ├── AuthProvider.js          # Provider de autenticación
│   │   ├── AuthComponents.js        # Componentes de auth
│   │   ├── Navigation.js            # Navegación
│   │   └── ProtectedRoute.js        # Protección de rutas
│   ├── hooks/
│   │   └── useAuth.js               # Hooks de autenticación
│   ├── layout.js                    # Layout principal
│   └── page.js                      # Página principal
├── .env.local                       # Variables de entorno
└── .env.example                     # Ejemplo de variables
```

## Solución de Problemas

### Error: "Missing environment variables"

- Verifica que todas las variables en `.env.local` estén configuradas
- Reinicia el servidor de desarrollo después de agregar variables

### Error: "Invalid client_secret"

- Verifica que el `KEYCLOAK_SECRET` sea correcto
- Regenera el client secret en Keycloak si es necesario

### Error: "Invalid redirect URI"

- Verifica que las URIs de redirección en Keycloak incluyan la URL correcta
- Para desarrollo: `http://localhost:3000/api/auth/callback/keycloak`
- Para producción: `https://tu-dominio.com/api/auth/callback/keycloak`

### Error: "Access denied"

- Verifica que el usuario tenga permisos en Keycloak
- Revisa la configuración de roles y grupos en Keycloak
