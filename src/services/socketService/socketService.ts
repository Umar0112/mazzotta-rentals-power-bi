import { io, Socket } from 'socket.io-client';
import { chatService } from '../chatService/chatService';
import { SocketConfig, ChatMessage } from '../../types/chat.types';
import config from '../../config';

class SocketService {
    private socket: Socket | null = null;
    private config: SocketConfig | null = null;
    private currentRoomId: string | null = null;

    /**
     * Resolve socket origin and path. Socket.IO uses the first argument as origin only (protocol + host).
     * path defaults to "/socket.io"; server config can override.
     */
    private resolveSocketUrl(socketConfig: SocketConfig | null): { url: string; path: string } {
        const urlCandidate =
            (import.meta as any)?.env?.VITE_SOCKET_URL ||
            config.socketUrl ||
            socketConfig?.url ||
            socketConfig?.baseUrlApi ||
            socketConfig?.baseUrl ||
            config.baseURLApi;

        const normalized =
            typeof urlCandidate === 'string'
                ? urlCandidate.replace(/^wss:\/\//i, 'https://').replace(/^ws:\/\//i, 'http://')
                : String(config.baseURLApi);

        try {
            const parsed = new URL(normalized);
            const url = `${parsed.protocol}//${parsed.host}`;
            const path = socketConfig?.path
                ? socketConfig.path.startsWith('/')
                    ? socketConfig.path
                    : `/${socketConfig.path}`
                : '/socket.io';
            return { url, path };
        } catch {
            return { url: normalized, path: socketConfig?.path || '/socket.io' };
        }
    }

    private getAccessToken(): string | null {
        return localStorage.getItem('accessToken') || localStorage.getItem('token');
    }

    /**
     * Initialize the socket connection using the configuration from the API
     */
    async initialize() {
        if (this.socket?.connected) return;

        try {
            // Prefer server-provided config, but allow local override (config.socketUrl / VITE_SOCKET_URL)
            try {
                this.config = await chatService.getSocketConfig();
            } catch (e) {
                console.warn('[Socket] Failed to fetch socket config, using local config.', e);
                this.config = null;
            }

            const { url, path } = this.resolveSocketUrl(this.config);
            const accessToken = this.getAccessToken();

            console.log("[Socket] Config:", this.config);
            console.log("[Socket] URL:", url, "Path:", path);

            this.socket = io(url, {
                path,
                auth: accessToken ? { token: accessToken } : undefined,
                transports: ['websocket', 'polling'],
                withCredentials: true,
                reconnection: true,
            });

            this.socket.on("connect", () => {
                console.log("[Socket] Connected:", this.socket?.id);
            });

            this.socket.on("connect_error", (error) => {
                console.error("[Socket] Connect error:", error.message);
            });

            this.socket.on("disconnect", (reason) => {
                console.log("[Socket] Disconnected:", reason);
            });

        } catch (error) {
            console.error("[Socket] Initialization failed:", error);
        }
    }


    /**
     * Check if socket is currently connected
     */
    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    /**
     * Join a specific ticket room using the dynamic event name from config
     */
    joinRoom(ticketId: string) {
        if (!this.socket || !this.config) return;

        if (this.currentRoomId && this.currentRoomId !== ticketId) {
            this.leaveRoom(this.currentRoomId);
        }

        this.currentRoomId = ticketId;
        const joinEvent = this.config?.events?.join || 'join_chat';
        const payload = { ticketId };

        this.socket.emit(joinEvent, payload);
        console.log(`[Socket] %cEMITTED ${joinEvent}`, 'color: #0088ff; font-weight: bold;', 'Actual Payload:', payload);
    }


    /**
     * Leave a specific ticket room using the dynamic event name from config
     */
    leaveRoom(ticketId: string) {
        if (!this.socket || !this.config) return;

        const leaveEvent = this.config?.events?.leave || 'leave_room';
        const payload = { ticketId };
        this.socket.emit(leaveEvent, payload);
        console.log(`[Socket] Emitted ${leaveEvent} with payload:`, payload);


        if (this.currentRoomId === ticketId) {
            this.currentRoomId = null;
        }
    }

    /**
     * Send a message to the current room using the dynamic event name from config
     */
    sendRoomMessage(ticketId: string, message: string, isInternal: boolean = false) {
        if (!this.socket || !this.config) return;

        const sendEvent = this.config?.events?.send || 'send_message';
        const payload = { ticketId, message, isInternal };

        this.socket.emit(sendEvent, payload);
        console.log(`[Socket] %cEMITTED ${sendEvent}`, 'color: #0088ff; font-weight: bold;', 'Actual Payload:', payload);
    }


    /**
     * Listen for new messages using the dynamic event name from config
     */
    onMessage(callback: (message: any) => void) {
        if (!this.socket || !this.config) return;
        const receiveEvent = this.config?.events?.receive || 'new_message';
        this.socket.on(receiveEvent, callback);
        console.log(`[Socket] Listening for ${receiveEvent}`);
    }


    /**
     * Stop listening for new messages
     */
    offMessage(callback: (message: any) => void) {
        if (!this.socket || !this.config) return;
        const receiveEvent = this.config?.events?.receive || 'new_message';
        this.socket.off(receiveEvent, callback);
    }

    /**
     * Subscribe to a custom socket event
     */
    on(event: string, callback: (data: any) => void) {
        if (!this.socket) return;
        this.socket.on(event, callback);
        console.log(`[Socket] Registered listener for: ${event}`);
    }

    /**
     * Unsubscribe from a custom socket event
     */
    off(event: string, callback: (data: any) => void) {
        if (!this.socket) return;
        this.socket.off(event, callback);
        console.log(`[Socket] Unregistered listener for: ${event}`);
    }

    /**
     * Close the socket connection
     */
    disconnect() {
        if (this.socket) {
            if (this.currentRoomId) {
                this.leaveRoom(this.currentRoomId);
            }
            this.socket.disconnect();
            this.socket = null;
            this.currentRoomId = null;
            this.config = null;
        }
    }
}

export const socketService = new SocketService();
