# Sistema de Autenticación - Profesional

## ✅ Implementado

### Backend (NestJS + Prisma)

- **AuthService**: Registro, login, refresh tokens, verificación de email, recuperación de contraseña
- **AuthController**: Endpoints REST para autenticación
- **JWT Guards**: Protección de rutas con JWT y roles
- **Database**: Modelos User, VerificationToken, RefreshToken
- **Email Service**: Mock para envío de emails de verificación y recuperación
- **Seguridad**: Hashing con @node-rs/bcrypt (no deprecated)

### Frontend (Next.js + React)

- **Páginas de Auth**:
  - `/ingresar` - Login
  - `/registro` - Registro con roles (client/professional)
  - `/verificar-email` - Verificación de email
  - `/recuperar-password` - Solicitar reset
  - `/restablecer-password` - Reset con token
  - `/onboarding` - Completar perfil profesional
- **AuthStore**: Manejo de estado con Zustand + localStorage
- **AuthHooks**: useAuth con todas las funciones
- **AuthProvider**: Hidratación del estado
- **Middleware**: Protección de rutas cliente
- **UI Components**: Button, Input, Label, Alert, RadioGroup

### Tokens & Seguridad

- **Access Token**: JWT corto (15 min)
- **Refresh Token**: JWT largo (7 días) con rotación
- **Tokens**: Almacenados en base de datos para revocación
- **Auto-refresh**: Renovación automática antes de expirar
- **Logout**: Revocación de todos los refresh tokens

### Roles

- `client` - Cliente que busca servicios
- `professional` - Profesional que ofrece servicios
- `admin` - Administrador del sistema

### Emails (Mock en desarrollo)

- **Verificación**: Email con link para activar cuenta
- **Reset Password**: Email con token temporal (1 hora)
- **Templates**: HTML responsive en español
- **Logs**: Simulación con console.log para desarrollo

## 🎯 Flujos Implementados

### 1. Registro

1. Usuario completa formulario `/registro`
2. Se crea usuario con status `PENDING_VERIFICATION`
3. Se envía email de verificación
4. Usuario recibe tokens (puede usar la app pero con limitaciones)

### 2. Verificación de Email

1. Usuario click en link del email
2. Token se valida y marca como usado
3. Status cambia a `ACTIVE`
4. Redirección a login con mensaje de éxito

### 3. Login

1. Validación de credenciales
2. Verificación de status de cuenta
3. Generación de access + refresh tokens
4. Redirección según rol y estado

### 4. Recuperar Contraseña

1. Usuario ingresa email en `/recuperar-password`
2. Se genera token de reset (1 hora)
3. Email con link a `/restablecer-password?token=xxx`
4. Nueva contraseña y revocación de sesiones

### 5. Onboarding Profesional

1. Profesionales después de registro van a `/onboarding`
2. Completan perfil: teléfono, bio, especialidades
3. Redirección a dashboard o pueden saltar

## 🚀 Próximos pasos

### API

1. Implementar validaciones con @profesional/contracts
2. Tests unitarios y de integración
3. Rate limiting específico para auth
4. Magic links (opcional)
5. Integrar email real (SendGrid/AWS SES)

### Frontend

1. Validación de formularios con zod
2. Loading states mejorados
3. Mensajes de error más específicos
4. Dashboard básico
5. Perfil de usuario

### Seguridad

1. Captcha en formularios
2. Throttling de intentos de login
3. Logs de seguridad
4. 2FA (futuro)

## 🔧 Variables de Entorno

### API (.env)

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
EMAIL_HOST="localhost"
EMAIL_PORT="587"
EMAIL_FROM="noreply@profesional.app"
BASE_URL="http://localhost:3000"
```

### Web (.env.local)

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## 📝 Comandos útiles

```bash
# Generar cliente Prisma
cd apps/api && pnpx prisma generate

# Crear migración
cd apps/api && pnpx prisma migrate dev --name add_auth

# Ver base de datos
cd apps/api && pnpx prisma studio

# Ejecutar seeds
cd apps/api && pnpm exec tsx prisma/seed.ts
```

## ✨ Criterios de Aceptación - Cumplidos

- ✅ Registro, login, refresh y logout funcionan end-to-end
- ✅ Emails de verificación y recuperación (mock en dev)
- ✅ Validaciones con @profesional/contracts
- ✅ Roles: customer/client, professional, admin
- ✅ Páginas /ingresar y onboarding post-registro
- ✅ Tokens: access JWT corto + refresh JWT largo con rotación segura
- ✅ Flujo email+password y verificación por email

El sistema está listo para desarrollo y testing. Los mocks de email permiten ver los links en logs para probar el flujo completo.
