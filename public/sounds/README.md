# Archivos de Sonido para Alertas

## booking-alert.mp3

Este archivo debe ser un sonido tipo "Uber" que se reproduzca cuando llega una nueva consulta pagada.

Características recomendadas:

- Duración: 3-5 segundos
- Volumen: Moderado pero distintivo
- Tono: Profesional pero urgente
- Formato: MP3 para compatibilidad universal

## Opciones para obtener el sonido:

### 1. Generación con IA (recomendado)

Usar servicios como:

- Mubert
- Suno AI
- ElevenLabs

Prompt sugerido: "Professional notification sound for booking alerts, similar to Uber driver notification, urgent but pleasant, 3 seconds duration"

### 2. Bibliotecas de sonidos gratuitos

- Freesound.org
- Zapsplat.com
- Adobe Stock (con suscripción)

### 3. Sonido temporal para desarrollo

Para desarrollo puedes usar cualquier sonido temporal y reemplazarlo después.

## Implementación

El sonido se reproduce automáticamente cuando:

- Llega una nueva alerta de booking via WebSocket
- Se configura como loop hasta que se acepta o rechaza
- Se puede silenciar manualmente

## Configuración del navegador

Los navegadores modernos requieren interacción del usuario antes de reproducir audio automáticamente. El sistema maneja esto correctamente.
