# @profesional/contracts

Paquete de contratos de datos únicos como fuente de verdad para el proyecto Profesional. Contiene esquemas Zod y tipos TypeScript para todas las entidades del sistema.

## Características

- 🏗️ **Esquemas Zod** completos para validación
- 📝 **Tipos TypeScript** inferidos automáticamente
- 🔄 **DTOs** separados para input/output
- 📦 **Versionado semántico** para compatibilidad
- ✅ **Tests automatizados** de validación
- 🎯 **Tree-shakeable** y optimizado

## Instalación

```bash
pnpm add @profesional/contracts
```

## Uso básico

### Importar esquemas

```typescript
import {
  UserSchema,
  CreateUserDTO,
  ProfessionalProfileSchema,
  BookingSchema,
  ApiResponse,
  CONTRACTS_VERSION,
} from "@profesional/contracts";
```

### Validar datos

```typescript
// En controladores de API
const validateUser = (data: unknown) => {
  const result = UserSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.message);
  }
  return result.data; // Tipo User inferido
};

// Para creación de entidades
const createUser = (input: CreateUserDTO) => {
  // input está tipado automáticamente
  return userService.create(input);
};
```

### Respuestas de API tipadas

```typescript
// Controlador NestJS
@Get('/users/:id')
async getUser(@Param('id') id: string): Promise<ApiResponse<UserView>> {
  const user = await this.userService.findById(id);
  return {
    success: true,
    data: user
  };
}

// Frontend React/Next.js
const { data } = useQuery<ApiResponse<UserView>>({
  queryKey: ['user', id],
  queryFn: () => fetch(\`/api/users/\${id}\`).then(r => r.json())
});
```

## Entidades disponibles

### Core

- **User**: Usuario base del sistema
- **Profile**: Perfil básico de usuario
- **ProfessionalProfile**: Perfil extendido para profesionales

### Servicios

- **ServiceCategory**: Categorías de servicios
- **ServiceTag**: Tags para servicios
- **Location**: Ubicaciones (provincias/ciudades argentinas)

### Bookings y pagos

- **Booking**: Reservas con estados completos
- **AvailabilitySlot**: Disponibilidad de profesionales
- **Payment**: Pagos con integración MercadoPago
- **PaymentEvent**: Eventos de webhook para auditoría

### Comunicación

- **Conversation**: Conversaciones entre usuarios
- **Message**: Mensajes del chat
- **Review**: Reseñas y calificaciones

### Sistema

- **Notification**: Notificaciones del sistema
- **CommissionRule**: Reglas de comisiones

## Estados de Booking

```typescript
type BookingStatus =
  | "draft" // Borrador
  | "pending_payment" // Pendiente de pago
  | "paid" // Pagado
  | "confirmed" // Confirmado
  | "in_progress" // En progreso
  | "completed" // Completado
  | "canceled" // Cancelado
  | "no_show"; // No se presentó
```

## Estados de Payment

```typescript
type PaymentStatus =
  | "pending" // Pendiente
  | "approved" // Aprobado
  | "rejected" // Rechazado
  | "cancelled" // Cancelado
  | "refunded" // Reembolsado
  | "partially_refunded"; // Reembolso parcial
```

## Versionado

El paquete usa versionado semántico:

```typescript
import { CONTRACTS_VERSION, isCompatible } from "@profesional/contracts";

console.log(CONTRACTS_VERSION); // "1.0.0"

// Verificar compatibilidad
if (!isCompatible("1.0.0")) {
  console.warn("Versión de contratos incompatible");
}
```

## Ejemplos de uso

### NestJS Controller

```typescript
import {
  CreateBookingDTO,
  BookingView,
  ApiResponse,
} from "@profesional/contracts";

@Controller("bookings")
export class BookingsController {
  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDTO
  ): Promise<ApiResponse<BookingView>> {
    const booking = await this.bookingsService.create(createBookingDto);
    return {
      success: true,
      data: booking,
    };
  }
}
```

### Next.js API Route

```typescript
import { NextRequest } from "next/server";
import {
  CreateUserSchema,
  UserView,
  ApiResponse,
} from "@profesional/contracts";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validar entrada
  const result = CreateUserSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      {
        success: false,
        errors: result.error.issues.map(i => i.message),
      },
      { status: 400 }
    );
  }

  // Crear usuario
  const user = await createUser(result.data);

  const response: ApiResponse<UserView> = {
    success: true,
    data: user,
  };

  return Response.json(response);
}
```

### React Hook con TanStack Query

```typescript
import {
  ProfessionalProfileView,
  SearchFilters,
  PaginatedResponse
} from '@profesional/contracts';

const useSearchProfessionals = (filters: SearchFilters) => {
  return useQuery<PaginatedResponse<ProfessionalProfileView>>({
    queryKey: ['professionals', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters as any);
      const response = await fetch(\`/api/search?\${params}\`);
      return response.json();
    }
  });
};
```

## Scripts disponibles

```bash
# Desarrollo con watch mode
pnpm dev

# Tests
pnpm test        # Watch mode
pnpm test:run    # Single run

# Build
pnpm build

# Validación
pnpm typecheck
pnpm format
```

## Migración

Al actualizar el paquete, verifica siempre la compatibilidad:

```typescript
import { isCompatible, CONTRACTS_VERSION } from '@profesional/contracts';

// En el bootstrap de tu aplicación
if (!isCompatible('1.0.0')) {
  throw new Error(\`Contracts version \${CONTRACTS_VERSION} incompatible\`);
}
```

## Contribuir

1. Añade nuevos esquemas en `src/schemas.ts`
2. Exporta en `src/index.ts`
3. Agrega tests en `src/__tests__/`
4. Actualiza versión según cambios (breaking/feature/patch)
5. Documenta en este README
