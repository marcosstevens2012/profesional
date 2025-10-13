# 📅 Plan de Acción: Migración de Tokens

## 🎯 Objetivo

Completar la migración del sistema de tokens para lograr 100% de seguridad y consistencia.

---

## 📊 Estado Actual

✅ **Completado (70%)**

- Infraestructura de tokens segura
- Renovación automática implementada
- Documentación completa
- 2 hooks migrados

⏳ **Pendiente (30%)**

- 7 archivos con código legacy
- Testing completo del flujo

---

## 🗓️ Cronograma Sugerido

### Día 1: Migración Admin Pages (3-4 horas)

#### Mañana (2 horas)

1. **Preparación** (15 min)
   - [ ] Leer `RESUMEN_REVISION_TOKENS.md`
   - [ ] Revisar `TOKEN_MIGRATION_GUIDE.md`
   - [ ] Abrir `scripts/migration-helper.sh` como referencia

2. **Migrar archivos admin** (1h 45min)

   **Archivo 1: `src/app/admin/page.tsx`** (20 min)
   - [ ] Agregar import: `import { getAuthHeaders } from '@/lib/utils/auth-helpers';`
   - [ ] Buscar: `localStorage.getItem("token")` (línea ~37)
   - [ ] Reemplazar headers de fetch con `getAuthHeaders()`
   - [ ] Guardar y verificar que no hay errores TypeScript

   **Archivo 2: `src/app/admin/pagos/page.tsx`** (25 min)
   - [ ] Agregar import
   - [ ] Buscar ocurrencias (líneas ~77, 98)
   - [ ] Reemplazar todas con `getAuthHeaders()`
   - [ ] Guardar

   **Archivo 3: `src/app/admin/profesionales/page.tsx`** (30 min)
   - [ ] Agregar import
   - [ ] Buscar ocurrencias (líneas ~66, 89, 115)
   - [ ] Reemplazar todas
   - [ ] Guardar

#### Tarde (1-2 horas)

**Archivo 4: `src/app/admin/usuarios/page.tsx`** (20 min)

- [ ] Agregar import
- [ ] Buscar ocurrencias (líneas ~51, 71)
- [ ] Reemplazar
- [ ] Guardar

**Archivo 5: `src/app/admin/bookings/page.tsx`** (20 min)

- [ ] Agregar import
- [ ] Buscar ocurrencias (líneas ~81, 101)
- [ ] Reemplazar
- [ ] Guardar

**Break** (10 min)

**Testing de admin pages** (30-40 min)

- [ ] `npm run dev` (si no está corriendo)
- [ ] Login en la aplicación
- [ ] Visitar `/admin` → verificar que carga
- [ ] Visitar `/admin/pagos` → verificar que carga
- [ ] Visitar `/admin/profesionales` → verificar que carga
- [ ] Visitar `/admin/usuarios` → verificar que carga
- [ ] Visitar `/admin/bookings` → verificar que carga
- [ ] Abrir DevTools > Network > verificar Authorization headers

---

### Día 2: Migración Otros Archivos + Testing (2-3 horas)

#### Mañana (1 hora)

**Archivo 6: `src/app/bookings/[id]/meeting/page.tsx`** (20 min)

- [ ] Agregar import
- [ ] Buscar ocurrencia (línea ~17)
- [ ] Reemplazar
- [ ] Guardar

**Archivo 7: `src/components/WaitingRoom.tsx`** (20 min)

- [ ] Agregar import
- [ ] Buscar ocurrencia (línea ~46)
- [ ] Reemplazar
- [ ] Guardar

**Verificación final** (20 min)

- [ ] Ejecutar: `grep -r "localStorage.getItem(\"token\")" src/`
- [ ] Verificar que NO aparecen resultados
- [ ] Commit de cambios:

  ```bash
  git add .
  git commit -m "feat: migrar gestión de tokens a sistema seguro

  - Actualizar admin pages para usar getAuthHeaders()
  - Migrar WaitingRoom y meeting page
  - Eliminar referencias directas a localStorage token"
  ```

#### Tarde (1-2 horas)

**Testing Completo del Flujo** (1h 30min)

1.  **Test de Login** (15 min)
    - [ ] Ir a `/ingresar`
    - [ ] Ingresar con credenciales válidas
    - [ ] Verificar que redirige a dashboard/panel
    - [ ] Verificar en DevTools > Application > Storage:
      - `sessionStorage`: debe tener `access_token`
      - `localStorage`: debe tener `refresh_token` y `auth-storage`

2.  **Test de Navegación** (15 min)
    - [ ] Navegar entre páginas protegidas
    - [ ] Verificar que no pide login nuevamente
    - [ ] Verificar que datos se cargan correctamente

3.  **Test de Recarga de Página** (10 min)
    - [ ] Estar logueado
    - [ ] Recargar la página (F5)
    - [ ] Verificar que mantiene la sesión
    - [ ] Verificar que no redirige a login

4.  **Test de Renovación Automática** (30 min)
    - [ ] **Opción A** (rápida):
      - Modificar temporalmente en backend: `JWT_ACCESS_EXPIRES_IN=1m`
      - Reiniciar backend
      - Login
      - Esperar 2 minutos
      - Hacer un request (ej: ir a `/admin`)
      - Debe renovarse automáticamente
      - Restaurar `JWT_ACCESS_EXPIRES_IN=15m`
    - [ ] **Opción B** (lenta pero real):
      - Login
      - Esperar 15 minutos ⏰
      - Hacer un request
      - Debe renovarse sin redirigir a login

5.  **Test de Logout** (10 min)
    - [ ] Click en botón de Logout
    - [ ] Verificar que redirige a `/ingresar`
    - [ ] Verificar en DevTools > Storage:
      - `sessionStorage`: debe estar vacío (no `access_token`)
      - `localStorage`: debe estar vacío (no `refresh_token`)
    - [ ] Intentar acceder a ruta protegida → debe redirigir a login

6.  **Test de Token Expirado Completamente** (10 min)
    - [ ] Login
    - [ ] En DevTools > Application > Storage:
      - Eliminar manualmente `refresh_token` de localStorage
    - [ ] Esperar 1 minuto
    - [ ] Navegar a ruta protegida
    - [ ] Debe redirigir a `/ingresar`

7.  **Test de Múltiples Requests Simultáneos** (10 min)
    - [ ] Login
    - [ ] Abrir DevTools > Network
    - [ ] Navegar rápidamente a 3-4 páginas diferentes
    - [ ] Verificar que solo hay 1 llamada a `/auth/refresh` (si aplica)
    - [ ] Todas las páginas deben cargar correctamente

---

### Día 3: Optimización y Documentación (1-2 horas) - OPCIONAL

**Optimizaciones Opcionales**

1.  **Convertir fetch a apiClient** (30 min - 1 hora)
    - [ ] Revisar archivos migrados
    - [ ] Donde sea posible, reemplazar fetch con apiClient
    - [ ] Ejemplo:

      ```typescript
      // De esto:
      const res = await fetch(url, { headers: getAuthHeaders() });

      // A esto:
      const res = await apiClient.get(url);
      ```

2.  **Agregar manejo de errores mejorado** (30 min)
    - [ ] Revisar try-catch en páginas admin
    - [ ] Agregar mensajes de error user-friendly
    - [ ] Considerar usar toast notifications

3.  **Actualizar documentación del proyecto** (30 min)
    - [ ] Agregar referencia a nuevos archivos en README
    - [ ] Documentar helpers disponibles
    - [ ] Agregar ejemplos de uso

---

## 📋 Checklist Final

Una vez completado todo:

### Código

- [ ] ✅ Todos los archivos migrados (7/7)
- [ ] ✅ No hay `localStorage.getItem("token")` en el código
- [ ] ✅ Imports correctos agregados
- [ ] ✅ Sin errores de TypeScript
- [ ] ✅ Sin errores en consola

### Testing

- [ ] ✅ Login funciona
- [ ] ✅ Logout funciona
- [ ] ✅ Navegación entre páginas OK
- [ ] ✅ Recarga de página mantiene sesión
- [ ] ✅ Renovación automática funciona
- [ ] ✅ Token expirado redirige a login
- [ ] ✅ Admin pages cargan datos correctamente

### Storage

- [ ] ✅ `sessionStorage` tiene `access_token`
- [ ] ✅ `localStorage` tiene `refresh_token`
- [ ] ✅ `localStorage` tiene `auth-storage` (solo user)
- [ ] ✅ Logout limpia todo

### Git

- [ ] ✅ Cambios commiteados
- [ ] ✅ Push a repositorio
- [ ] ✅ Branch actualizado

---

## 🎯 Métricas de Éxito

Al finalizar, deberías tener:

- ✅ **100% migración**: Todos los archivos usando nuevo sistema
- ✅ **0 errores**: Sin errores de TypeScript o runtime
- ✅ **Tests pasando**: Todos los flujos funcionando
- ✅ **Mejor UX**: Usuarios no deslogueados cada 15 min
- ✅ **Más seguro**: Tokens en sessionStorage
- ✅ **Mantenible**: Código consistente y centralizado

---

## 💡 Tips

1. **No hacer todo de una vez**: Migrar archivo por archivo, probar cada uno
2. **Usar búsqueda**: `Cmd+F` en VSCode para encontrar `localStorage.getItem`
3. **DevTools son tu amigo**: Network tab y Storage tab
4. **Commit frecuentemente**: Después de cada archivo migrado
5. **Probar en navegador privado**: Para asegurar que no hay cache issues

---

## 🆘 Si Algo Sale Mal

### Problema: "No hay token" o requests fallan con 401

**Solución:**

1. Verificar que hiciste login
2. Verificar en DevTools > Storage que hay tokens
3. Verificar en Network que header `Authorization` se envía
4. Revisar console para errores

### Problema: Página en blanco o error de import

**Solución:**

1. Verificar path de import: `@/lib/utils/auth-helpers`
2. Verificar que el archivo existe
3. Reiniciar dev server: `Ctrl+C` y `npm run dev`

### Problema: Renovación no funciona

**Solución:**

1. Verificar que backend está corriendo
2. Verificar que endpoint `/auth/refresh` responde
3. Verificar que refresh token existe en localStorage
4. Revisar console para errores del interceptor

---

## 📊 Progress Tracker

```
Día 1: Migración Admin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  ] admin/page.tsx
[  ] admin/pagos/page.tsx
[  ] admin/profesionales/page.tsx
[  ] admin/usuarios/page.tsx
[  ] admin/bookings/page.tsx

Día 2: Migración Otros + Testing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  ] bookings/[id]/meeting/page.tsx
[  ] components/WaitingRoom.tsx
[  ] Testing completo

Día 3: Optimización (opcional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  ] Convertir fetch a apiClient
[  ] Mejorar error handling
[  ] Actualizar docs
```

---

## 🎉 Resultado Final

Al completar este plan, tendrás:

✅ Sistema de tokens **seguro** y acorde a mejores prácticas  
✅ Renovación **automática** que mejora UX  
✅ Código **consistente** y fácil de mantener  
✅ **Documentación** completa del sistema  
✅ Base sólida para **futuras mejoras** de seguridad

---

**¡Éxito con la migración! 🚀**

Si necesitás ayuda durante el proceso, revisá los documentos de referencia:

- `RESUMEN_REVISION_TOKENS.md`
- `TOKEN_MIGRATION_GUIDE.md`
- `SECURITY_AUDIT_TOKENS.md`
- `scripts/migration-helper.sh`
