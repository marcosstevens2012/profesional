# Railway Build Fix - Resumen de Cambios

## Problema Original

Railway estaba fallando al construir tanto la API como la Web con los siguientes errores:

### Errores en API:

- `Cannot find module '@profesional/contracts'` - El paquete de contratos no estaba compilado
- `Module '"@prisma/client"' has no exported member 'BookingStatus/PaymentStatus/MeetingStatus'` - Prisma Client no estaba generado antes de la compilación
- Errores de TypeScript `implicitly has an 'any' type` - Tipos de Prisma faltantes

### Errores en Web:

- `Cannot find module '@profesional/ui'` - El paquete UI no estaba compilado
- `Cannot find module '@profesional/contracts'` - El paquete de contratos no estaba compilado

## Causa Raíz

El problema era el **orden de construcción** en Railway:

1. **Prisma Client no se generaba antes de compilar TypeScript** → tipos faltantes
2. **Las dependencias del workspace (@profesional/contracts, @profesional/ui) no se construían antes que las apps** → módulos no encontrados
3. **El paquete @profesional/config no tenía script de build** → Turbo fallaba al intentar construirlo

## Soluciones Implementadas

### 1. Modificación de `apps/api/package.json`

**Cambio en el script de build:**

```json
"build": "prisma generate && nest build"
```

**Razón:** Garantiza que Prisma Client se genere ANTES de que TypeScript intente compilar el código. Esto resuelve todos los errores de tipos faltantes como `BookingStatus`, `PaymentStatus`, etc.

### 2. Modificación de `packages/config/package.json`

**Agregado script de build:**

```json
"scripts": {
  "build": "echo 'No build needed for config package'"
}
```

**Razón:** El paquete `@profesional/config` solo contiene archivos de configuración (ESLint, Prettier, tsconfig) que no necesitan compilación. Sin embargo, Turbo necesita un script `build` para completar el grafo de dependencias correctamente.

### 3. Modificación de `nixpacks.toml`

**Nuevo comando de build simplificado:**

```toml
[phases.build]
cmds = [
  "echo 'Building workspace with Turbo...'",
  "pnpm turbo build --filter=@profesional/api... --filter=@profesional/web..."
]
```

**Razón:**

- Usa Turbo que **automáticamente respeta el grafo de dependencias** definido en `turbo.json`
- El `^build` en `turbo.json` indica que las dependencias se construyen primero
- Turbo construye en el orden correcto:
  1. `@profesional/config` (dummy build)
  2. `@profesional/contracts` (TypeScript)
  3. `@profesional/ui` (TypeScript)
  4. `@profesional/api` (Prisma generate + NestJS)
  5. `@profesional/web` (Next.js)

## Orden de Construcción Correcto

Con Turbo, el orden de construcción ahora es:

```
@profesional/config → @profesional/contracts
                   ↘                        ↘
                    → @profesional/ui    → @profesional/api
                                      ↘
                                       → @profesional/web
```

### Para API:

1. ✅ `@profesional/config#build` (sin operación)
2. ✅ `@profesional/contracts#build` (compila TypeScript)
3. ✅ `@profesional/api#build`:
   - Ejecuta `prisma generate` → Genera tipos de Prisma
   - Ejecuta `nest build` → Compila NestJS con todos los tipos disponibles

### Para Web:

1. ✅ `@profesional/config#build` (sin operación)
2. ✅ `@profesional/contracts#build` (compila TypeScript)
3. ✅ `@profesional/ui#build` (compila componentes React)
4. ✅ `@profesional/web#build` (compila Next.js con todas las dependencias)

## Verificación Local

Los siguientes comandos fueron probados exitosamente:

```bash
# Construir API con todas sus dependencias
pnpm turbo build --filter=@profesional/api...
# ✅ 3 paquetes construidos: config, contracts, api

# Construir Web con todas sus dependencias
pnpm turbo build --filter=@profesional/web...
# ✅ 4 paquetes construidos: config, contracts, ui, web
```

## Próximos Pasos en Railway

1. **Hacer commit de estos cambios:**

   ```bash
   git add .
   git commit -m "fix: Railway build - ensure dependencies build before apps"
   git push
   ```

2. **Railway detectará automáticamente los cambios en `nixpacks.toml`**

3. **El nuevo build ejecutará:**

   ```bash
   pnpm install --frozen-lockfile
   pnpm turbo build --filter=@profesional/api... --filter=@profesional/web...
   ```

4. **Turbo garantiza el orden correcto de construcción**

## Archivos Modificados

1. ✅ `apps/api/package.json` - Script de build con Prisma generate
2. ✅ `packages/config/package.json` - Script de build dummy
3. ✅ `nixpacks.toml` - Comando de build simplificado usando Turbo

## Notas Importantes

- **Turbo Cache:** Turbo mantiene un caché de builds. Si ya construiste localmente, Railway se beneficiará del cache si está habilitado.
- **Orden de Dependencias:** El `^build` en `turbo.json` es CRÍTICO - indica "construye mis dependencias primero"
- **Prisma Generate:** Debe ejecutarse ANTES de compilar TypeScript o tendrás errores de tipos
- **Workspace Protocol:** Los `workspace:*` en package.json funcionan SOLO si los paquetes están construidos primero
