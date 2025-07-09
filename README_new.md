# SHAK Tarjetas - Frontend

Sistema de gestión de tarjetas con autenticación Keycloak integrada.

## 🚀 Características

- ✅ **Autenticación con Keycloak**: Integración completa con Keycloak para manejo de usuarios
- ✅ **Gestión de Tarjetas**: Registro, consulta, recarga y débito de identificadores
- ✅ **Interfaz Moderna**: Diseño responsivo con Tailwind CSS
- ✅ **Seguridad**: Tokens JWT y protección de rutas
- ✅ **API Integration**: Comunicación segura con el backend

## 🛠️ Tecnologías

- **Next.js 15** - Framework React
- **NextAuth.js** - Autenticación
- **Keycloak** - Servidor de identidad
- **Tailwind CSS** - Estilos
- **React Icons** - Iconos

## 📋 Requisitos Previos

- Node.js 18 o superior
- Servidor Keycloak configurado
- Cliente Keycloak configurado con:
  - Access Type: confidential
  - Standard Flow: enabled
  - Valid Redirect URIs configuradas

## 🚀 Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd front-shak-tarjetas
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env.local
   ```

   Edita `.env.local` con tu configuración:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=tu-clave-secreta
   KEYCLOAK_ID=nextjs-client
   KEYCLOAK_SECRET=tu-client-secret
   KEYCLOAK_ISSUER=http://keycloak-server:8080/realms/master
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🔧 Configuración de Keycloak

Ver [KEYCLOAK_SETUP.md](./KEYCLOAK_SETUP.md) para instrucciones detalladas de configuración.

### Configuración Rápida

En tu cliente Keycloak `nextjs-client`:

- **Access Type**: `confidential`
- **Standard Flow**: `Enabled`
- **Direct Access Grants**: `Disabled`
- **Valid Redirect URIs**:
  - `http://localhost:3000/api/auth/callback/keycloak`
  - `https://tu-dominio.vercel.app/api/auth/callback/keycloak`
- **Web Origins**: `*` o dominios específicos

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/auth/[...nextauth]/     # Configuración NextAuth
│   ├── auth/                       # Páginas de autenticación
│   ├── components/                 # Componentes reutilizables
│   ├── hooks/                      # Hooks personalizados
│   ├── layout.js                   # Layout principal
│   └── page.js                     # Página principal
├── .env.local                      # Variables de entorno
└── .env.example                    # Ejemplo de configuración
```

## 🎯 Funcionalidades

### Autenticación

- Inicio de sesión con Keycloak
- Manejo automático de tokens JWT
- Protección de rutas
- Cierre de sesión seguro

### Gestión de Tarjetas

- **Registrar**: Crear nuevos identificadores
- **Consultar**: Verificar saldo y estado
- **Recargar**: Agregar fondos con tarjeta de crédito
- **Debitar**: Realizar cargos a identificadores

## 🔒 Seguridad

- Tokens JWT manejados automáticamente
- Refreshing automático de sesiones
- Validación de permisos en cada request
- Protección CSRF integrada

## 🚢 Despliegue

### Vercel

1. **Configurar variables de entorno en Vercel:**

   ```env
   NEXTAUTH_URL=https://tu-app.vercel.app
   NEXTAUTH_SECRET=tu-clave-produccion
   KEYCLOAK_ID=nextjs-client
   KEYCLOAK_SECRET=tu-client-secret-produccion
   KEYCLOAK_ISSUER=http://tu-keycloak:8080/realms/master
   ```

2. **Actualizar Keycloak:**

   - Agregar URL de producción a Valid Redirect URIs
   - Configurar Web Origins para el dominio de producción

3. **Deploy:**
   ```bash
   npm run build
   # O conectar con GitHub para auto-deploy
   ```

## 🐛 Solución de Problemas

### Error: "Invalid client_secret"

- Verificar `KEYCLOAK_SECRET` en `.env.local`
- Regenerar client secret en Keycloak

### Error: "Invalid redirect URI"

- Verificar Valid Redirect URIs en Keycloak
- Asegurar que incluya `/api/auth/callback/keycloak`

### Error de CORS

- Configurar Web Origins en Keycloak
- Verificar configuración de dominio

## 📖 API Reference

### Hooks

```javascript
// Hook de autenticación
const { isAuthenticated, user, token } = useAuth();

// Hook para requests
const { makeRequest } = useApiRequest();
```

### Componentes

```javascript
// Proteger componentes
<ProtectedRoute>
  <MiComponenteProtegido />
</ProtectedRoute>

// Botón de login/logout
<LoginButton />

// Perfil de usuario
<UserProfile />
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte y preguntas:

- Crear un issue en GitHub
- Revisar [KEYCLOAK_SETUP.md](./KEYCLOAK_SETUP.md) para configuración
- Verificar logs de Keycloak y aplicación

---

**Desarrollado con ❤️ para SHAK Tarjetas**
