#!/bin/bash

# 🔄 Script de ejemplo para migrar archivos admin
# Este script muestra los cambios necesarios en cada archivo

echo "📝 Guía de Migración - Archivos Admin"
echo "======================================"
echo ""

cat << 'EOF'
Para cada archivo admin que use localStorage.getItem("token"), seguir estos pasos:

1️⃣ AGREGAR IMPORT al inicio del archivo:

   import { getAuthHeaders } from '@/lib/utils/auth-helpers';

2️⃣ REEMPLAZAR ocurrencias de:

   // ❌ ANTES:
   const token = localStorage.getItem("token");

   // ✅ DESPUÉS:
   import { getAuthToken } from '@/lib/utils/auth-helpers';
   const token = getAuthToken();

3️⃣ PARA FETCH REQUESTS, reemplazar:

   // ❌ ANTES:
   const response = await fetch(url, {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       Authorization: `Bearer ${localStorage.getItem("token")}`,
     },
   });

   // ✅ DESPUÉS (Opción A - recomendada):
   import { apiClient } from '@/lib/api/client';
   const response = await apiClient.get(url);

   // ✅ DESPUÉS (Opción B - si necesitas usar fetch):
   import { getAuthHeaders } from '@/lib/utils/auth-helpers';
   const response = await fetch(url, {
     method: 'GET',
     headers: getAuthHeaders(),
   });

══════════════════════════════════════════════════════════════════

📂 ARCHIVOS A MIGRAR (7 en total):

⚠️  PRIORIDAD ALTA (Admin pages):

1. src/app/admin/page.tsx
   Líneas a cambiar: ~37

2. src/app/admin/pagos/page.tsx
   Líneas a cambiar: ~77, 98

3. src/app/admin/profesionales/page.tsx
   Líneas a cambiar: ~66, 89, 115

4. src/app/admin/usuarios/page.tsx
   Líneas a cambiar: ~51, 71

5. src/app/admin/bookings/page.tsx
   Líneas a cambiar: ~81, 101

⚠️  PRIORIDAD MEDIA:

6. src/app/bookings/[id]/meeting/page.tsx
   Líneas a cambiar: ~17

7. src/components/WaitingRoom.tsx
   Líneas a cambiar: ~46

══════════════════════════════════════════════════════════════════

🎯 EJEMPLO COMPLETO DE MIGRACIÓN:

Archivo: src/app/admin/page.tsx

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ❌ ANTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");  // ❌

      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,  // ❌
        },
      });

      // ...
    } catch (error) {
      console.error(error);
    }
  };

  fetchStats();
}, []);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✅ DESPUÉS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { getAuthHeaders } from '@/lib/utils/auth-helpers';  // ✅

useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: getAuthHeaders(),  // ✅ Simple y seguro
      });

      // ...
    } catch (error) {
      console.error(error);
    }
  };

  fetchStats();
}, []);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✅ MEJOR AÚN: Usar apiClient
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { apiClient } from '@/lib/api/client';  // ✅

useEffect(() => {
  const fetchStats = async () => {
    try {
      // Token se agrega automáticamente
      // Renovación automática incluida
      const response = await apiClient.get('/admin/stats');  // ✅
      const data = response.data;

      // ...
    } catch (error) {
      console.error(error);
    }
  };

  fetchStats();
}, []);

══════════════════════════════════════════════════════════════════

🧪 TESTING DESPUÉS DE MIGRAR:

1. Login en la aplicación
2. Navegar a cada página admin migrada
3. Verificar que los datos se cargan correctamente
4. Verificar en DevTools > Network:
   - Header "Authorization: Bearer ..." presente
   - Requests exitosos (200)

5. Probar renovación automática:
   - Esperar 15 minutos (o ajustar expiración)
   - Hacer un request
   - Debe renovarse automáticamente (200)
   - NO debe redirigir a login

══════════════════════════════════════════════════════════════════

✅ CHECKLIST POR ARCHIVO:

src/app/admin/page.tsx
  [ ] Import agregado
  [ ] localStorage.getItem("token") reemplazado
  [ ] Headers actualizados
  [ ] Probado en navegador
  [ ] Funciona correctamente

src/app/admin/pagos/page.tsx
  [ ] Import agregado
  [ ] localStorage.getItem("token") reemplazado
  [ ] Headers actualizados
  [ ] Probado en navegador
  [ ] Funciona correctamente

src/app/admin/profesionales/page.tsx
  [ ] Import agregado
  [ ] localStorage.getItem("token") reemplazado
  [ ] Headers actualizados
  [ ] Probado en navegador
  [ ] Funciona correctamente

src/app/admin/usuarios/page.tsx
  [ ] Import agregado
  [ ] localStorage.getItem("token") reemplazado
  [ ] Headers actualizados
  [ ] Probado en navegador
  [ ] Funciona correctamente

src/app/admin/bookings/page.tsx
  [ ] Import agregado
  [ ] localStorage.getItem("token") reemplazado
  [ ] Headers actualizados
  [ ] Probado en navegador
  [ ] Funciona correctamente

src/app/bookings/[id]/meeting/page.tsx
  [ ] Import agregado
  [ ] localStorage.getItem("token") reemplazado
  [ ] Headers actualizados
  [ ] Probado en navegador
  [ ] Funciona correctamente

src/components/WaitingRoom.tsx
  [ ] Import agregado
  [ ] localStorage.getItem("token") reemplazado
  [ ] Headers actualizados
  [ ] Probado en navegador
  [ ] Funciona correctamente

══════════════════════════════════════════════════════════════════

🚀 COMANDO RÁPIDO DE BÚSQUEDA:

# Encontrar todos los usos de localStorage.getItem("token"):
grep -r "localStorage.getItem(\"token\")" src/

# Encontrar archivos específicos:
grep -l "localStorage.getItem(\"token\")" src/app/admin/*.tsx

══════════════════════════════════════════════════════════════════

📚 RECURSOS:

- Guía completa: TOKEN_MIGRATION_GUIDE.md
- Informe de seguridad: SECURITY_AUDIT_TOKENS.md
- Token utils: src/lib/utils/token-utils.ts
- Auth helpers: src/lib/utils/auth-helpers.ts

══════════════════════════════════════════════════════════════════

EOF

echo ""
echo "✅ Guía generada exitosamente"
echo "📖 Lee cuidadosamente cada sección antes de migrar"
