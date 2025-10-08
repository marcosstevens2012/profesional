#!/bin/bash

# Script para publicar una nueva versión de @profesional/contracts
# Uso: ./publish-contracts.sh [patch|minor|major]

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar argumentos
VERSION_TYPE=${1:-patch}

if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo -e "${RED}Error: Tipo de versión inválido${NC}"
    echo "Uso: $0 [patch|minor|major]"
    echo ""
    echo "  patch: 0.1.0 → 0.1.1 (bugfixes, cambios menores)"
    echo "  minor: 0.1.0 → 0.2.0 (nuevas features, compatible)"
    echo "  major: 0.1.0 → 1.0.0 (breaking changes)"
    exit 1
fi

echo -e "${BLUE}📦 Publicando @profesional/contracts${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || ! grep -q "@profesional/contracts" package.json; then
    echo -e "${RED}Error: Este script debe ejecutarse desde packages/contracts${NC}"
    exit 1
fi

# Verificar que tenemos GITHUB_TOKEN
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}Error: GITHUB_TOKEN no está configurado${NC}"
    echo ""
    echo "Configúralo así:"
    echo "  export GITHUB_TOKEN=tu_github_personal_access_token"
    echo ""
    echo "O agrégalo a tu ~/.npmrc:"
    echo "  //npm.pkg.github.com/:_authToken=TU_TOKEN"
    exit 1
fi

# Verificar que no hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Hay cambios sin commitear${NC}"
    git status --short
    echo ""
    read -p "¿Quieres continuar? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo -e "${RED}Cancelado${NC}"
        exit 1
    fi
fi

# Limpiar y compilar
echo -e "${YELLOW}🧹 Limpiando...${NC}"
rm -rf dist/

echo -e "${YELLOW}🔨 Compilando...${NC}"
pnpm build

# Verificar que la compilación fue exitosa
if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
    echo -e "${RED}Error: La compilación falló${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Compilación exitosa${NC}"
echo ""

# Ejecutar tests si existen
if grep -q '"test"' package.json; then
    echo -e "${YELLOW}🧪 Ejecutando tests...${NC}"
    pnpm test:run || {
        echo -e "${RED}Error: Tests fallaron${NC}"
        exit 1
    }
    echo -e "${GREEN}✓ Tests pasaron${NC}"
    echo ""
fi

# Mostrar versión actual
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}Versión actual: $CURRENT_VERSION${NC}"

# Incrementar versión
echo -e "${YELLOW}📝 Incrementando versión ($VERSION_TYPE)...${NC}"
npm version $VERSION_TYPE --no-git-tag-version

NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}Nueva versión: $NEW_VERSION${NC}"
echo ""

# Confirmar publicación
echo -e "${YELLOW}¿Publicar @profesional/contracts@$NEW_VERSION a GitHub Packages?${NC}"
read -p "Continuar? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${RED}Cancelado${NC}"
    # Revertir cambio de versión
    git checkout package.json
    exit 1
fi

# Publicar
echo -e "${YELLOW}🚀 Publicando...${NC}"
npm publish

echo ""
echo -e "${GREEN}✅ Publicación exitosa!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo ""
echo -e "${YELLOW}1. Commitear el cambio de versión:${NC}"
echo "   git add package.json"
echo "   git commit -m \"chore: bump @profesional/contracts to v$NEW_VERSION\""
echo ""
echo -e "${YELLOW}2. Actualizar en la API:${NC}"
echo "   cd ../../../profesional-api"
echo "   pnpm update @profesional/contracts"
echo ""
echo -e "${YELLOW}3. Actualizar en el Frontend:${NC}"
echo "   cd ../../profesional/apps/web"
echo "   pnpm update @profesional/contracts"
echo ""
echo -e "${BLUE}💡 Tip:${NC} Puedes ver el paquete en:"
echo "   https://github.com/marcosstevens2012/profesional/packages"
