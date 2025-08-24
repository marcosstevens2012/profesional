#!/bin/bash

# Arreglar todas las referencias de propiedades
echo "🔧 Arreglando referencias en ChatController..."
sed -i '' 's/this\.chatService/this\._chatService/g' src/chat/chat.controller.ts

echo "🔧 Arreglando referencias en MessagesController..."
sed -i '' 's/this\.messagesService/this\._messagesService/g' src/messages/messages.controller.ts

echo "🔧 Arreglando referencias en MessagesService..."
sed -i '' 's/this\.prisma/this\._prisma/g' src/messages/messages.service.ts
sed -i '' 's/this\.storageProvider/this\._storageProvider/g' src/messages/messages.service.ts

echo "🔧 Arreglando referencias en SupabaseStorageProvider..."
sed -i '' 's/this\.configService/this\._configService/g' src/storage/supabase.storage.provider.ts

echo "🔧 Arreglando referencias en VercelBlobStorageProvider..."
sed -i '' 's/this\.configService/this\._configService/g' src/storage/vercelblob.storage.provider.ts

echo "🔧 Arreglando import de IStorageProvider..."
sed -i '' 's/IStorageProvider/StorageProvider/g' src/messages/messages.service.ts

echo "🔧 Arreglando enum MessageType..."
sed -i '' 's/MessageType\.TEXT/MessageType._TEXT/g' src/chat/dto/message.dto.ts

echo "✅ Arreglos completados!"
