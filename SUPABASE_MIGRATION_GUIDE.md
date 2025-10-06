# 📝 Instrucciones para migrar a Supabase

## Pasos necesarios:

### 1. Obtener la contraseña de la base de datos

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard/projects
2. Selecciona tu proyecto: `anqdbinmztorvdsausrn`
3. Ve a Settings → Database
4. Busca "Connection string" o "Database password"
5. Copia la contraseña

### 2. Actualizar las variables de entorno

Reemplaza `[PASSWORD]` en los siguientes archivos con tu contraseña real:

- `apps/api/.env`
- `.env-templates/.env.api.production`

**Formato de la URL:**

```
DATABASE_URL="postgresql://postgres.anqdbinmztorvdsausrn:TU_PASSWORD_AQUI@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

### 3. Ejecutar la migración

```bash
# Desde la raíz del proyecto
./migrate-to-supabase.sh
```

### 4. Verificar la conexión

```bash
cd apps/api
pnpm prisma studio
```

## URLs de referencia:

- **Supabase Dashboard**: https://anqdbinmztorvdsausrn.supabase.co
- **API URL**: https://anqdbinmztorvdsausrn.supabase.co/rest/v1/
- **Auth URL**: https://anqdbinmztorvdsausrn.supabase.co/auth/v1/

## Claves de API ya configuradas:

- **Anon Key**: ✅ Configurada
- **Service Role Key**: ✅ Configurada

⚠️ **Importante**: No compartas la contraseña de la base de datos en repositorios públicos.
