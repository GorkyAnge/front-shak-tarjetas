# 🔧 Solución al Error de Autenticación

## ❌ Error Actual

```
Error de Autenticación
Error al iniciar el proceso de autenticación
```

## ✅ Solución Paso a Paso

### 1. Variables de Entorno Corregidas

He actualizado el código para usar los nombres correctos de las variables. **Asegúrate de que tu archivo `.env.local` tenga exactamente esto:**

```bash
# NextAuth Configuration
NEXTAUTH_URL=https://front-shak-tarjetas.vercel.app
NEXTAUTH_SECRET=una_clave_secreta_larga_y_segura

# Keycloak Configuration
KEYCLOAK_CLIENT_ID=nextjs-client
KEYCLOAK_CLIENT_SECRET=tu-client-secret-real-aqui
KEYCLOAK_ISSUER=http://keycloak-aci-eastus.eastus.azurecontainer.io:8080/realms/master
```

### 2. Reemplaza el Client Secret

Ve a tu Keycloak Admin Console:

1. Ve a Clients → nextjs-client → Credentials
2. Copia el Client Secret
3. Reemplaza `tu-client-secret-real-aqui` con el valor real

### 3. Verificación de Configuración

Una vez que actualices las variables:

1. **Reinicia el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

2. **Ve a la página de demo:**

   ```
   http://localhost:3000/demo
   ```

3. **Haz clic en "Verificar" en la sección de diagnóstico**

### 4. URLs de Debug

He creado endpoints para diagnosticar problemas:

- **Variables de entorno:** `/api/debug/env`
- **Conexión a Keycloak:** `/api/debug/keycloak`

### 5. Configuración de Keycloak Verificada

Tu configuración de Keycloak se ve correcta. Solo asegúrate de que:

✅ **Client Type:** OpenID Connect  
✅ **Client ID:** nextjs-client  
✅ **Client Authentication:** On  
✅ **Standard Flow:** Enabled  
✅ **Direct Access Grants:** Disabled

✅ **Valid Redirect URIs:**

- `https://front-shak-tarjetas.vercel.app/api/auth/callback/keycloak`
- `http://localhost:3000/api/auth/callback/keycloak`

✅ **Web Origins:**

- `https://front-shak-tarjetas.vercel.app`
- `http://localhost:3000`

### 6. Posibles Causas del Error

1. **Variables mal configuradas** - ✅ Ya corregido
2. **Client Secret incorrecto** - Verifica en Keycloak
3. **Keycloak no accesible** - Verifica con `/api/debug/keycloak`
4. **Configuración de realm** - Asegúrate de usar el realm `master`

### 7. Debugging Mejorado

He agregado logging mejorado. Revisa la consola del navegador y del servidor para más detalles sobre el error.

### 8. Test Rápido

Después de hacer los cambios:

1. Ve a: `http://localhost:3000/demo`
2. Verifica que ambos diagnósticos estén en verde ✅
3. Intenta hacer login

## 🆘 Si Sigue Fallando

1. **Revisa la consola del navegador** para errores específicos
2. **Revisa los logs del servidor** de Next.js
3. **Verifica que Keycloak esté corriendo** en la URL configurada
4. **Prueba la conectividad** con: `curl http://keycloak-aci-eastus.eastus.azurecontainer.io:8080/realms/master/.well-known/openid_configuration`

---

**Los cambios están aplicados. Solo necesitas actualizar el CLIENT_SECRET real y reiniciar el servidor.**
