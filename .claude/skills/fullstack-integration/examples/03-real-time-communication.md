# Real-Time Communication Example

**WebSocket Integration for Real-Time Features**

> **When to Use**: Chat, notifications, live updates, collaborative editing
> **Skill**: fullstack-integration
> **Related**: frontend-nextjs (real-time UI), backend-nestjs (WebSocket gateway)

---

## Overview

This example demonstrates complete real-time communication integration:
- WebSocket connection management
- Real-time notifications
- User presence tracking
- Room-based messaging
- Connection recovery and reconnection
- Type-safe event handling
- Authentication with WebSockets

**Architecture**: Socket.IO with Next.js frontend and Nest.js backend

## System Architecture

```
Frontend (Next.js)          Backend (Nest.js)           Database
┌─────────────────┐        ┌──────────────────┐        ┌──────────┐
│ Socket Client   │◀──────▶│ WebSocket        │        │ Messages │
│ - Connect       │   WS   │ Gateway          │───────▶│ Users    │
│ - Emit Events   │        │ - Rooms          │        │ Presence │
│ - Listen Events │        │ - Broadcasting   │        └──────────┘
└─────────────────┘        └──────────────────┘
         │                          │
         │  Events                  │  Events
         ▼                          ▼
┌─────────────────┐        ┌──────────────────┐
│ UI Updates      │        │ Event Handlers   │
│ - Notifications │        │ - join           │
│ - Messages      │        │ - message        │
│ - Presence      │        │ - typing         │
└─────────────────┘        └──────────────────┘
```

## Complete Implementation

### 1. Backend WebSocket Gateway

```typescript
// backend/src/notifications/notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface UserSocket extends Socket {
  userId?: string;
  email?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('NotificationsGateway');
  private connectedUsers = new Map<string, string>(); // userId -> socketId
  private userPresence = new Map<string, boolean>(); // userId -> online status

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: UserSocket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: UserSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove from connected users
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.userPresence.set(client.userId, false);

      // Broadcast user went offline
      this.server.emit('user:status', {
        userId: client.userId,
        online: false,
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: UserSocket,
    @CurrentUser() user: any,
  ) {
    client.userId = user.userId;
    client.email = user.email;

    // Store connection
    this.connectedUsers.set(user.userId, client.id);
    this.userPresence.set(user.userId, true);

    // Join user-specific room
    client.join(`user:${user.userId}`);

    // Broadcast user came online
    this.server.emit('user:status', {
      userId: user.userId,
      online: true,
    });

    this.logger.log(`User ${user.email} joined`);

    return {
      event: 'joined',
      data: {
        userId: user.userId,
        connectedUsers: this.getOnlineUsers(),
      },
    };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('message:send')
  handleMessage(
    @MessageBody() data: { recipientId: string; message: string },
    @CurrentUser() user: any,
  ) {
    const { recipientId, message } = data;

    // Send to specific user
    this.server.to(`user:${recipientId}`).emit('message:received', {
      senderId: user.userId,
      senderEmail: user.email,
      message,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Message from ${user.email} to user ${recipientId}`);

    return { success: true };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('typing:start')
  handleTypingStart(
    @MessageBody() data: { recipientId: string },
    @CurrentUser() user: any,
  ) {
    this.server.to(`user:${data.recipientId}`).emit('typing:status', {
      userId: user.userId,
      typing: true,
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @MessageBody() data: { recipientId: string },
    @CurrentUser() user: any,
  ) {
    this.server.to(`user:${data.recipientId}`).emit('typing:status', {
      userId: user.userId,
      typing: false,
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('room:join')
  handleRoomJoin(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: { roomId: string },
  ) {
    client.join(`room:${data.roomId}`);

    // Notify room members
    this.server.to(`room:${data.roomId}`).emit('room:user-joined', {
      userId: client.userId,
      roomId: data.roomId,
    });

    return { success: true };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('room:leave')
  handleRoomLeave(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: { roomId: string },
  ) {
    client.leave(`room:${data.roomId}`);

    // Notify room members
    this.server.to(`room:${data.roomId}`).emit('room:user-left', {
      userId: client.userId,
      roomId: data.roomId,
    });

    return { success: true };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('room:message')
  handleRoomMessage(
    @MessageBody() data: { roomId: string; message: string },
    @CurrentUser() user: any,
  ) {
    this.server.to(`room:${data.roomId}`).emit('room:message-received', {
      roomId: data.roomId,
      senderId: user.userId,
      senderEmail: user.email,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }

  // Server-side methods (called from services)
  sendNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  broadcastToRoom(roomId: string, event: string, data: any) {
    this.server.to(`room:${roomId}`).emit(event, data);
  }

  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  private getOnlineUsers(): string[] {
    return Array.from(this.userPresence.entries())
      .filter(([_, online]) => online)
      .map(([userId]) => userId);
  }
}
```

### 2. WebSocket JWT Guard

```typescript
// backend/src/auth/guards/ws-jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = this.extractToken(client);

      if (!token) {
        return false;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Attach user to socket
      (client as any).userId = payload.sub;
      (client as any).email = payload.email;

      return true;
    } catch {
      return false;
    }
  }

  private extractToken(client: Socket): string | undefined {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Also check query params for token
    return client.handshake.auth.token || client.handshake.query.token as string;
  }
}
```

### 3. Frontend Socket Client

```typescript
// frontend/lib/socket/client.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class SocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket?.connected) {
      console.log('[Socket] Already connected');
      return this.socket;
    }

    console.log('[Socket] Connecting...');

    this.socket = io(`${SOCKET_URL}/notifications`, {
      auth: {
        token,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers();

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log('[Socket] Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data?: any) {
    if (!this.socket?.connected) {
      console.warn('[Socket] Not connected, cannot emit event:', event);
      return;
    }

    this.socket.emit(event, data);
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) {
      console.warn('[Socket] Socket not initialized');
      return;
    }

    this.socket.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket) {
      return;
    }

    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[Socket] Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_failed', () => {
      console.error('[Socket] Reconnection failed');
    });
  }

  get connected(): boolean {
    return this.socket?.connected || false;
  }

  get id(): string | undefined {
    return this.socket?.id;
  }
}

export const socketClient = new SocketClient();
```

### 4. Socket Context Provider

```typescript
// frontend/contexts/socket-context.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketClient } from '@/lib/socket/client';
import { useAuth } from './auth-context';

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface Message {
  senderId: string;
  senderEmail: string;
  message: string;
  timestamp: string;
}

interface SocketContextType {
  connected: boolean;
  notifications: Notification[];
  sendMessage: (recipientId: string, message: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendRoomMessage: (roomId: string, message: string) => void;
  startTyping: (recipientId: string) => void;
  stopTyping: (recipientId: string) => void;
  markNotificationRead: (notificationId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      socketClient.disconnect();
      setConnected(false);
      return;
    }

    // Connect with token
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socket = socketClient.connect(token);

    // Join user room
    socket.emit('join', { userId: user.id });

    // Listen for connection status
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // Listen for notifications
    socket.on('notification', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);

      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.message);
      }
    });

    // Cleanup
    return () => {
      socketClient.disconnect();
    };
  }, [isAuthenticated, user]);

  const sendMessage = (recipientId: string, message: string) => {
    socketClient.emit('message:send', { recipientId, message });
  };

  const joinRoom = (roomId: string) => {
    socketClient.emit('room:join', { roomId });
  };

  const leaveRoom = (roomId: string) => {
    socketClient.emit('room:leave', { roomId });
  };

  const sendRoomMessage = (roomId: string, message: string) => {
    socketClient.emit('room:message', { roomId, message });
  };

  const startTyping = (recipientId: string) => {
    socketClient.emit('typing:start', { recipientId });
  };

  const stopTyping = (recipientId: string) => {
    socketClient.emit('typing:stop', { recipientId });
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  };

  return (
    <SocketContext.Provider
      value={{
        connected,
        notifications,
        sendMessage,
        joinRoom,
        leaveRoom,
        sendRoomMessage,
        startTyping,
        stopTyping,
        markNotificationRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
}
```

### 5. Notification Component

```typescript
// frontend/components/notifications/notification-center.tsx
'use client';

import { useSocket } from '@/contexts/socket-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function NotificationCenter() {
  const { notifications, markNotificationRead } = useSocket();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <h3 className="mb-2 font-semibold">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications</p>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 ${
                    !notification.read ? 'bg-muted' : ''
                  }`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 6. Chat Component Example

```typescript
// frontend/components/chat/chat-window.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { socketClient } from '@/lib/socket/client';
import { useSocket } from '@/contexts/socket-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface Message {
  senderId: string;
  senderEmail: string;
  message: string;
  timestamp: string;
}

interface ChatWindowProps {
  recipientId: string;
  recipientName: string;
}

export function ChatWindow({ recipientId, recipientName }: ChatWindowProps) {
  const { user } = useAuth();
  const { sendMessage, startTyping, stopTyping } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Listen for incoming messages
    const handleMessage = (message: Message) => {
      if (message.senderId === recipientId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    // Listen for typing status
    const handleTyping = (data: { userId: string; typing: boolean }) => {
      if (data.userId === recipientId) {
        setIsTyping(data.typing);
      }
    };

    socketClient.on('message:received', handleMessage);
    socketClient.on('typing:status', handleTyping);

    return () => {
      socketClient.off('message:received', handleMessage);
      socketClient.off('typing:status', handleTyping);
    };
  }, [recipientId]);

  useEffect(() => {
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (value: string) => {
    setInput(value);

    // Send typing indicator
    startTyping(recipientId);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(recipientId);
    }, 1000);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(recipientId, input);

    // Add to local messages
    setMessages((prev) => [
      ...prev,
      {
        senderId: user!.id,
        senderEmail: user!.email,
        message: input,
        timestamp: new Date().toISOString(),
      },
    ]);

    setInput('');
    stopTyping(recipientId);
  };

  return (
    <div className="flex h-[500px] flex-col rounded-lg border">
      {/* Header */}
      <div className="border-b p-4">
        <h3 className="font-semibold">{recipientName}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => {
          const isOwnMessage = msg.senderId === user?.id;

          return (
            <div
              key={idx}
              className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isOwnMessage
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="mt-1 text-xs opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="text-sm text-muted-foreground">
            {recipientName} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 7. Service Integration Example

```typescript
// backend/src/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createOrder(userId: string, orderData: any) {
    const order = await this.prisma.order.create({
      data: {
        ...orderData,
        userId,
      },
    });

    // Send real-time notification
    this.notificationsGateway.sendNotification(userId, {
      id: `notif-${Date.now()}`,
      type: 'order_created',
      message: `Your order #${order.id} has been created`,
      timestamp: new Date().toISOString(),
      read: false,
    });

    return order;
  }
}
```

## Connection Management Patterns

### Automatic Reconnection

```typescript
// Socket.IO handles reconnection automatically
const socket = io(url, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});
```

### Connection Status Indicator

```typescript
// frontend/components/connection-status.tsx
'use client';

import { useSocket } from '@/contexts/socket-context';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

export function ConnectionStatus() {
  const { connected } = useSocket();

  return (
    <Badge variant={connected ? 'default' : 'destructive'}>
      {connected ? (
        <>
          <Wifi className="mr-1 h-3 w-3" />
          Connected
        </>
      ) : (
        <>
          <WifiOff className="mr-1 h-3 w-3" />
          Disconnected
        </>
      )}
    </Badge>
  );
}
```

## Key Integration Patterns

1. **Authentication**: JWT token passed during connection
2. **Rooms**: User-specific and group rooms for targeted messaging
3. **Events**: Type-safe event names and payloads
4. **Reconnection**: Automatic with exponential backoff
5. **Context Provider**: Centralized socket state
6. **Cleanup**: Proper event listener removal
7. **Server-Side Broadcasting**: From services to connected clients

## Common Pitfalls

❌ **DON'T**:
- Forget to clean up event listeners
- Create multiple socket connections
- Send sensitive data without encryption
- Skip authentication on WebSocket
- Ignore connection errors

✅ **DO**:
- Clean up listeners in useEffect return
- Use single socket instance
- Validate data on both sides
- Implement JWT auth for WebSocket
- Handle connection/reconnection gracefully

## Related Examples

- **Backend**: `backend-nestjs/examples/04-websocket-module.md`
- **Authentication**: `01-complete-authentication-flow.md`
- **Frontend**: `frontend-nextjs/examples/02-dashboard-components.md`
