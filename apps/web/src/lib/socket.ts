// Placeholder para el servicio de socket
// Este archivo evita errores de compilación pero no implementa funcionalidad real

// Placeholder para el servicio de socket
// Este archivo evita errores de compilación pero no implementa funcionalidad real

const mockSocket = {
  connected: false,
  on: (_event: string, _callback: (..._args: any[]) => void) => {
    console.warn("Socket service not implemented");
  },
  off: (_event: string, _callback?: (..._args: any[]) => void) => {
    console.warn("Socket service not implemented");
  },
  emit: (_event: string, _data?: any) => {
    console.warn("Socket service not implemented");
  },
  disconnect: () => {
    console.warn("Socket service not implemented");
  },
};

export const socketService = {
  connect: async (_token?: string) => {
    console.warn("Socket service not implemented");
    return mockSocket;
  },
  disconnect: () => {
    console.warn("Socket service not implemented");
  },
  emit: (_event: string, _data?: any) => {
    console.warn("Socket service not implemented");
  },
  on: (_event: string, _callback: (..._args: any[]) => void) => {
    console.warn("Socket service not implemented");
  },
  off: (_event: string, _callback?: (..._args: any[]) => void) => {
    console.warn("Socket service not implemented");
  },
};

export default socketService;
