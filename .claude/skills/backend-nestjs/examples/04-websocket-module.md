# WebSocket Module Example

**Real-time Communication with Nest.js WebSocket**

> **Skill**: backend-nestjs
> **Related**: frontend-nextjs (WebSocket client), fullstack-integration (real-time features)

---

## WebSocket Gateway

```typescript
// notifications/notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    // Remove from connected users
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    this.connectedUsers.set(userId, client.id);
    client.join(`user:${userId}`);
    return { event: 'joined', data: { userId } };
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    this.server.emit('message', payload);
  }

  // Server-side notification
  sendNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  // Broadcast to all
  broadcastUpdate(event: string, data: any) {
    this.server.emit(event, data);
  }
}

// In service (e.g., orders.service.ts)
@Injectable()
export class OrdersService {
  constructor(private notificationsGateway: NotificationsGateway) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const order = await this.prisma.order.create({
      data: createOrderDto,
    });

    // Send real-time notification
    this.notificationsGateway.sendNotification(
      order.userId,
      {
        type: 'order_created',
        message: 'Your order has been created',
        orderId: order.id,
      },
    );

    return order;
  }
}
```

## Frontend Integration

```typescript
// lib/socket.ts (frontend)
import { io } from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem('accessToken'),
  },
});

// components/notifications-provider.tsx
'use client';

import { useEffect } from 'react';
import { socket } from '@/lib/socket';

export function NotificationsProvider({ userId, children }) {
  useEffect(() => {
    socket.connect();

    socket.emit('join', userId);

    socket.on('notification', (data) => {
      // Show toast or update UI
      console.log('Notification:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return <>{children}</>;
}
```

## Key Patterns

1. **Socket.IO**: WebSocket library for Nest.js
2. **Rooms**: User-specific channels
3. **Guards**: JWT authentication for WebSocket
4. **Connection Lifecycle**: handleConnection/handleDisconnect
5. **Server-to-Client**: sendNotification method

## Related Examples

- **Integration**: `fullstack-integration/examples/03-real-time-communication.md`
