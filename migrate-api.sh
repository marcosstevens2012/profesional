#!/bin/bash

# Script para migrar la API a un repositorio independiente
# Uso: ./migrate-api.sh [directorio-destino]

set -e  # Salir si hay errores

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Migrando API a proyecto independiente${NC}"

# Directorio destino
DEST_DIR=${1:-"../profesional-api"}

echo -e "${YELLOW}📁 Creando directorio: $DEST_DIR${NC}"
mkdir -p "$DEST_DIR"

# Copiar API
echo -e "${YELLOW}📦 Copiando código de la API...${NC}"
cp -r apps/api/* "$DEST_DIR/"
cp apps/api/.env.example "$DEST_DIR/.env.example" 2>/dev/null || echo "No .env.example encontrado"
cp apps/api/.gitignore "$DEST_DIR/.gitignore" 2>/dev/null || true

# Copiar archivos de configuración de raíz si son relevantes
echo -e "${YELLOW}⚙️  Copiando configuraciones...${NC}"
cp .gitignore "$DEST_DIR/.gitignore" 2>/dev/null || true

# Crear package.json independiente
echo -e "${YELLOW}📝 Configurando package.json...${NC}"
cd "$DEST_DIR"

# Crear .gitignore si no existe
if [ ! -f .gitignore ]; then
  cat > .gitignore << 'EOF'
# Dependencies
node_modules
.pnpm-store

# Build outputs
dist
build
.next

# Environment
.env
.env.local
.env.*.local

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode
.idea
*.swp
*.swo

# Testing
coverage

# Prisma
prisma/migrations/**/migration.lock

# Misc
.turbo
tsconfig.tsbuildinfo
EOF
fi

# Inicializar Git
echo -e "${YELLOW}🔧 Inicializando repositorio Git...${NC}"
git init

# Crear README
cat > README.md << 'EOF'
# Profesional API

Backend API for the Profesional platform built with NestJS, Prisma, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 8.0.0
- PostgreSQL database

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:push

# Start development server
pnpm dev
```

## 📦 Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:push` - Push schema changes to database
- `pnpm prisma:seed` - Seed database

## 🏗️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Database
- **Supabase** - Auth & Storage
- **JWT** - Authentication
- **Socket.io** - Real-time communication

## 📝 Environment Variables

See `.env.example` for required environment variables.

## 🚢 Deployment

This API is configured for Railway deployment. See `railway.toml` for configuration.

## 📄 License

Private - Profesional Platform
EOF

echo -e "${GREEN}✅ Migración completada!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo "1. cd $DEST_DIR"
echo "2. Actualizar package.json (eliminar referencias a workspace:*)"
echo "3. pnpm install"
echo "4. Configurar .env"
echo "5. git add . && git commit -m 'Initial commit: API migration'"
echo "6. Crear repositorio en GitHub y hacer push"
echo ""
echo -e "${YELLOW}📚 Documentación de contracts:${NC}"
echo "El package @profesional/contracts necesita ser publicado a GitHub Packages"
echo "Ver: packages/contracts/README.md"
