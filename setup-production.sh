#!/bin/bash

# 🚀 Production Setup Script
# Este script te ayuda a configurar credenciales y verificar que todo esté listo para producción

echo "🚀 Profesional Platform - Production Setup"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to prompt for input
prompt_input() {
    read -p "$1: " value
    echo $value
}

# Function to generate random secret
generate_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

echo ""
echo "${BLUE}📋 Verificando herramientas necesarias...${NC}"

# Check required tools
if ! command_exists "node"; then
    echo "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi

if ! command_exists "pnpm"; then
    echo "${RED}❌ pnpm no está instalado${NC}"
    exit 1
fi

if ! command_exists "vercel"; then
    echo "${YELLOW}⚠️  Vercel CLI no está instalado. Instalando...${NC}"
    npm install -g vercel
fi

if ! command_exists "railway"; then
    echo "${YELLOW}⚠️  Railway CLI no está instalado. Instalando...${NC}"
    npm install -g @railway/cli
fi

echo "${GREEN}✅ Herramientas verificadas${NC}"

echo ""
echo "${BLUE}🔑 Configuración de Credenciales de Producción${NC}"
echo "================================================"

# Create production environment files
mkdir -p .env-templates

echo "# 🌐 Web App (Vercel) Environment Variables" > .env-templates/.env.web.production
echo "NODE_ENV=production" >> .env-templates/.env.web.production
echo "NEXT_PUBLIC_API_URL=https://api.tudominio.com" >> .env-templates/.env.web.production
echo "NEXT_PUBLIC_APP_URL=https://tudominio.com" >> .env-templates/.env.web.production

echo ""
echo "${YELLOW}1. MercadoPago (Crítico para pagos)${NC}"
echo "   👉 Ve a: https://mercadopago.com/developers"
echo "   👉 Crea una aplicación de PRODUCCIÓN"
echo "   👉 Obtén el Access Token y Webhook Secret"

MP_TOKEN=$(prompt_input "   Ingresa tu MP_ACCESS_TOKEN de producción")
MP_WEBHOOK=$(prompt_input "   Ingresa tu MP_WEBHOOK_SECRET de producción")

echo ""
echo "${YELLOW}2. Base de Datos (PostgreSQL)${NC}"
echo "   👉 Railway auto-provee PostgreSQL"
echo "   👉 Solo necesitas configurar Railway"

echo ""
echo "${YELLOW}3. Storage (AWS S3 / Cloudflare R2)${NC}"
echo "   👉 Ve a: https://aws.amazon.com/s3/ o https://cloudflare.com/products/r2/"
echo "   👉 Crea un bucket de producción"

STORAGE_ENDPOINT=$(prompt_input "   STORAGE_ENDPOINT (ej: https://s3.amazonaws.com)")
STORAGE_BUCKET=$(prompt_input "   STORAGE_BUCKET (ej: profesional-production)")
STORAGE_ACCESS_KEY=$(prompt_input "   STORAGE_ACCESS_KEY")
STORAGE_SECRET_KEY=$(prompt_input "   STORAGE_SECRET_KEY")

echo ""
echo "${YELLOW}4. Observabilidad${NC}"
echo "   👉 Sentry: https://sentry.io (crear proyecto)"
echo "   👉 PostHog: https://posthog.com (crear proyecto)"

SENTRY_DSN=$(prompt_input "   SENTRY_DSN de producción")
POSTHOG_KEY=$(prompt_input "   POSTHOG_KEY de producción")

echo ""
echo "${YELLOW}5. Generando secretos de aplicación...${NC}"
JWT_SECRET=$(generate_secret)
JWT_REFRESH_SECRET=$(generate_secret)

echo "${GREEN}✅ Secretos generados automáticamente${NC}"

# Create API environment template
echo "# 🔧 API (Railway) Environment Variables" > .env-templates/.env.api.production
echo "NODE_ENV=production" >> .env-templates/.env.api.production
echo "LOG_LEVEL=info" >> .env-templates/.env.api.production
echo "" >> .env-templates/.env.api.production
echo "# Database (Railway auto-provides)" >> .env-templates/.env.api.production
echo "DATABASE_URL=\${{DATABASE_URL}}" >> .env-templates/.env.api.production
echo "" >> .env-templates/.env.api.production
echo "# Authentication" >> .env-templates/.env.api.production
echo "JWT_SECRET=$JWT_SECRET" >> .env-templates/.env.api.production
echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET" >> .env-templates/.env.api.production
echo "" >> .env-templates/.env.api.production
echo "# MercadoPago" >> .env-templates/.env.api.production
echo "MP_ACCESS_TOKEN=$MP_TOKEN" >> .env-templates/.env.api.production
echo "MP_WEBHOOK_SECRET=$MP_WEBHOOK" >> .env-templates/.env.api.production
echo "MP_ENVIRONMENT=production" >> .env-templates/.env.api.production
echo "" >> .env-templates/.env.api.production
echo "# Storage" >> .env-templates/.env.api.production
echo "STORAGE_ENDPOINT=$STORAGE_ENDPOINT" >> .env-templates/.env.api.production
echo "STORAGE_BUCKET=$STORAGE_BUCKET" >> .env-templates/.env.api.production
echo "STORAGE_ACCESS_KEY=$STORAGE_ACCESS_KEY" >> .env-templates/.env.api.production
echo "STORAGE_SECRET_KEY=$STORAGE_SECRET_KEY" >> .env-templates/.env.api.production
echo "" >> .env-templates/.env.api.production
echo "# Security" >> .env-templates/.env.api.production
echo "ALLOWED_ORIGINS=https://tudominio.com" >> .env-templates/.env.api.production
echo "" >> .env-templates/.env.api.production
echo "# Observability" >> .env-templates/.env.api.production
echo "SENTRY_DSN=$SENTRY_DSN" >> .env-templates/.env.api.production
echo "POSTHOG_KEY=$POSTHOG_KEY" >> .env-templates/.env.api.production

# Update web environment template
echo "NEXT_PUBLIC_POSTHOG_KEY=$POSTHOG_KEY" >> .env-templates/.env.web.production
echo "NEXT_PUBLIC_SENTRY_DSN=$SENTRY_DSN" >> .env-templates/.env.web.production

echo ""
echo "${GREEN}📁 Archivos de configuración creados:${NC}"
echo "   📄 .env-templates/.env.web.production"
echo "   📄 .env-templates/.env.api.production"

echo ""
echo "${BLUE}🚀 Próximos pasos para deployment:${NC}"
echo "=================================="
echo ""
echo "${YELLOW}1. Configurar Vercel:${NC}"
echo "   vercel login"
echo "   cd apps/web && vercel"
echo "   👉 Copia las variables de .env-templates/.env.web.production a Vercel Dashboard"
echo ""
echo "${YELLOW}2. Configurar Railway:${NC}"
echo "   railway login"
echo "   railway link"
echo "   railway add --database postgresql"
echo "   👉 Copia las variables de .env-templates/.env.api.production a Railway Dashboard"
echo ""
echo "${YELLOW}3. Ejecutar migraciones:${NC}"
echo "   railway run pnpm prisma migrate deploy"
echo "   railway run pnpm prisma db seed"
echo ""
echo "${YELLOW}4. Deploy automático:${NC}"
echo "   git push origin main"
echo ""
echo "${GREEN}🎉 ¡Tu plataforma estará en producción!${NC}"

# Create quick deploy script
cat > deploy-production.sh << 'EOF'
#!/bin/bash
echo "🚀 Deploying to production..."

# Build and deploy
echo "📦 Building applications..."
pnpm build

echo "🌐 Deploying web app to Vercel..."
cd apps/web && vercel --prod && cd ../..

echo "🔧 Deploying API to Railway..."
railway up

echo "🗄️ Running database migrations..."
railway run pnpm prisma migrate deploy

echo "✅ Production deployment complete!"
echo "👉 Check your applications:"
echo "   Web: https://tudominio.com"
echo "   API: https://api.tudominio.com/health"
EOF

chmod +x deploy-production.sh

echo ""
echo "${GREEN}📜 Script de deploy creado: deploy-production.sh${NC}"
echo ""
echo "${BLUE}💡 Consejos adicionales:${NC}"
echo "• Configura un dominio personalizado en Vercel y Railway"
echo "• Configura alertas en Sentry para errores críticos"
echo "• Haz backup regular de la base de datos"
echo "• Monitorea los costos mensualmente"
echo ""
echo "${GREEN}🎯 ¿Todo listo? Ejecuta: ./deploy-production.sh${NC}"
