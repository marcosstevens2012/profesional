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
