import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface Message {
    id: string;
    sender_id: string;
    sender_name: string;
    sender_role: string;
    content: string;
    timestamp: string;
    isPending?: boolean;
}

interface UseTransactionChatProps {
    transactionId: string;
    userId: string;
    userName: string;
    userRole: string;
}

export function useTransactionChat({ transactionId, userId, userName, userRole }: UseTransactionChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
        if (!wsUrl || !transactionId || !userId) return;

        // Prevent multiple connections
        if (socketRef.current?.readyState === WebSocket.OPEN) return;

        setStatus('connecting');

        // Build URL with query params
        const url = new URL(wsUrl);
        url.searchParams.append('transactionId', transactionId);
        url.searchParams.append('userId', userId);
        url.searchParams.append('userName', userName);
        url.searchParams.append('userRole', userRole);

        const ws = new WebSocket(url.toString());
        socketRef.current = ws;

        ws.onopen = () => {
            setStatus('connected');
            // Request message history on connect
            ws.send(JSON.stringify({
                action: 'getMessages',
                transactionId
            }));
        };

        ws.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);

                switch (payload.action) {
                    case 'messageHistory':
                        setMessages(payload.data.map((msg: any) => ({
                            id: msg.message_id || msg.id,
                            sender_id: msg.sender_id,
                            sender_name: msg.sender_name,
                            sender_role: msg.sender_role,
                            content: msg.content,
                            timestamp: msg.created_at || msg.timestamp,
                        })));
                        break;

                    case 'newMessage':
                        const newMsg = payload.data;
                        setMessages(prev => {
                            // Deduplicate
                            if (prev.some(m => m.id === newMsg.message_id)) return prev;
                            return [...prev, {
                                id: newMsg.message_id,
                                sender_id: newMsg.sender_id,
                                sender_name: newMsg.sender_name,
                                sender_role: newMsg.sender_role,
                                content: newMsg.content,
                                timestamp: newMsg.created_at,
                            }];
                        });
                        break;
                }
            } catch (e) {
                console.error('Failed to parse WebSocket message', e);
            }
        };

        ws.onclose = () => {
            setStatus('disconnected');
            // Attempt reconnect after 3 seconds
            reconnectTimeoutRef.current = setTimeout(() => connect(), 3000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            ws.close();
        };

    }, [transactionId, userId, userName, userRole]);

    useEffect(() => {
        connect();
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect]);

    const sendMessage = useCallback((content: string) => {
        if (socketRef.current?.readyState !== WebSocket.OPEN) {
            toast.error('Connection lost. Exploring reconnection...');
            return;
        }

        const tempId = `temp-${Date.now()}`;
        const timestamp = new Date().toISOString();

        // Optimistic update
        const tempMsg: Message = {
            id: tempId,
            sender_id: userId,
            sender_name: userName,
            sender_role: userRole,
            content,
            timestamp,
            isPending: true
        };

        // We don't add to state directly here if we expect the server to echo it back via 'newMessage' broadcast usually.
        // However, for better UX locally, we can add it. But we need to handle deduplication when the real one comes back.
        // The server code broadcasts 'newMessage' to ALL connected clients (including sender).
        // So if we add it here, we will see it twice unless we dedup by content/timestamp or handle the temp ID replacement.
        // For simplicity, let's wait for the echo or rely on fast easy socket.
        // Actually, let's add it optimistically and filter later? 
        // Or just simple broadcast reliance is often fine for low latency WS.
        // Let's rely on broadcast for now to avoid complexity of temp ID matching, 
        // but if latency is high, we can revisit.

        socketRef.current.send(JSON.stringify({
            action: 'sendMessage',
            transactionId,
            content
        }));
    }, [transactionId, userId, userName, userRole]);

    return {
        messages,
        sendMessage,
        status
    };
}
