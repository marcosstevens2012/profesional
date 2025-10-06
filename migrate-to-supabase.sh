#!/bin/bash

# Script para migrar la base de datos a Supabase
# Ejecutar desde la carpeta apps/api

echo "🔄 Generando migración inicial para Supabase..."

# 1. Generar una nueva migración
pnpm prisma migrate dev --name "init_supabase_database"

echo "✅ Migración generada exitosamente"

echo "🔄 Generando cliente de Prisma..."

# 2. Generar el cliente de Prisma
pnpm prisma generate

echo "✅ Cliente de Prisma generado"

echo "🔄 Ejecutando seed (opcional)..."

# 3. Opcional: ejecutar seed
# pnpm prisma db seed

echo "🎉 ¡Base de datos Supabase configurada exitosamente!"

echo "🔍 Para verificar la conexión, ejecuta:"
echo "   cd apps/api && pnpm prisma studio"
