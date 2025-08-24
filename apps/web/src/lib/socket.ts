"use client";

import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private connectionPromise: Promise<Socket> | null = null;

  async connect(token: string): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      this.socket = io(`${apiUrl}/chat`, {
        auth: {
          token,
        },
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
        transports: ["websocket", "polling"],
        timeout: 5000,
      });

      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket?.id);
        resolve(this.socket!);
      });

      this.socket.on("connect_error", error => {
        console.error("Socket connection error:", error);
        this.connectionPromise = null;
        reject(error);
      });

      this.socket.on("disconnect", reason => {
        console.log("Socket disconnected:", reason);
        this.connectionPromise = null;
      });

      this.socket.on("error", error => {
        console.error("Socket error:", error);
      });
    });

    return this.connectionPromise;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionPromise = null;
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket not connected. Event not sent:", event);
    }
  }

  on(event: string, callback: (_data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (_data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  get connected() {
    return this.socket?.connected || false;
  }

  get id() {
    return this.socket?.id;
  }
}

export const socketService = new SocketService();
