#!/bin/bash

# Script para limpiar el monorepo y dejarlo solo con frontend
# Ejecutar desde la raíz del monorepo

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🧹 Limpiando monorepo para dejarlo solo con frontend${NC}"
echo ""

# Confirmación
echo -e "${YELLOW}⚠️  Este script eliminará apps/api del proyecto${NC}"
echo -e "${YELLOW}   Asegúrate de haber migrado la API antes de continuar${NC}"
echo ""
read -p "¿Continuar? (yes/no): " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]
then
    echo -e "${RED}Cancelado${NC}"
    exit 1
fi

# Backup por si acaso
echo -e "${YELLOW}📦 Creando backup de apps/api...${NC}"
if [ -d "apps/api" ]; then
    tar -czf apps-api-backup-$(date +%Y%m%d-%H%M%S).tar.gz apps/api
    echo -e "${GREEN}✓ Backup creado${NC}"
fi

# Eliminar apps/api
echo -e "${YELLOW}🗑️  Eliminando apps/api...${NC}"
rm -rf apps/api

# Actualizar pnpm-workspace.yaml
echo -e "${YELLOW}📝 Actualizando pnpm-workspace.yaml...${NC}"
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/web"
  - "packages/*"
EOF

# Actualizar turbo.json para optimizar solo web
echo -e "${YELLOW}⚙️  Actualizando turbo.json...${NC}"
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "format": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "test": {
      "dependsOn": ["^test"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
EOF

# Actualizar package.json raíz
echo -e "${YELLOW}📋 Actualizando descripción del proyecto...${NC}"
cat > package.json << 'EOF'
{
  "name": "profesional-frontend",
  "private": true,
  "version": "0.1.0",
  "description": "Frontend para la plataforma Profesional con Next.js",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.6",
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "format": "turbo format",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "clean": "turbo clean",
    "prepare": "husky install"
  },
  "devDependencies": {
    "@commitlint/cli": "^18.4.4",
    "@commitlint/config-conventional": "^18.4.4",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "turbo": "^1.11.2"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,mjs}": [
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
EOF

# Limpiar node_modules y reinstalar
echo -e "${YELLOW}🔄 Limpiando dependencias...${NC}"
rm -rf node_modules
rm -rf apps/web/node_modules
rm -rf packages/*/node_modules
rm -rf .turbo

# Limpiar lockfile antiguo
rm -f pnpm-lock.yaml

echo ""
echo -e "${GREEN}✅ Limpieza completada!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo ""
echo -e "${YELLOW}1. Reinstalar dependencias:${NC}"
echo "   pnpm install"
echo ""
echo -e "${YELLOW}2. Configurar URL de API en apps/web/.env:${NC}"
echo "   NEXT_PUBLIC_API_URL=http://localhost:3001  # desarrollo"
echo "   NEXT_PUBLIC_API_URL=https://tu-api.railway.app  # producción"
echo ""
echo -e "${YELLOW}3. Probar el frontend:${NC}"
echo "   pnpm dev"
echo ""
echo -e "${YELLOW}4. Si @profesional/contracts aún no está publicado:${NC}"
echo "   cd packages/contracts"
echo "   # Compilar"
echo "   pnpm build"
echo "   # Publicar a GitHub Packages"
echo "   npm publish"
echo ""
echo -e "${BLUE}💡 Tip:${NC} El backup de la API está en: apps-api-backup-*.tar.gz"
