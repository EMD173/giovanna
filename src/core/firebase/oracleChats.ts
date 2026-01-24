/**
 * Oracle Chat Persistence
 * 
 * Saves and retrieves Oracle conversation history from Firebase.
 * Enables continuity of reflective dialogue across sessions.
 */

import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    query,
    orderBy,
    limit,
    getDocs,
    Timestamp,
    arrayUnion,
} from 'firebase/firestore';
import { db } from './config';
import { trackEvent } from '../../lib/analytics';

export interface OracleMessage {
    id: string;
    sender: 'user' | 'oracle';
    text: string;
    timestamp: Date;
}

export interface OracleConversation {
    id: string;
    userId: string;
    messages: OracleMessage[];
    createdAt: Date;
    lastUpdatedAt: Date;
    messageCount: number;
}

/**
 * Get the current active conversation for a user
 * Returns the most recent conversation or null if none exists
 */
export async function getCurrentConversation(userId: string): Promise<OracleConversation | null> {
    try {
        const conversationsRef = collection(db, 'users', userId, 'oracleConversations');
        const q = query(conversationsRef, orderBy('lastUpdatedAt', 'desc'), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        return {
            id: doc.id,
            userId: data.userId,
            messages: (data.messages || []).map((m: OracleMessage & { timestamp: Timestamp }) => ({
                ...m,
                timestamp: m.timestamp?.toDate?.() || new Date(m.timestamp),
            })),
            createdAt: data.createdAt?.toDate?.() || new Date(),
            lastUpdatedAt: data.lastUpdatedAt?.toDate?.() || new Date(),
            messageCount: data.messageCount || 0,
        };
    } catch (error) {
        console.error('Failed to get current conversation:', error);
        return null;
    }
}

/**
 * Create a new Oracle conversation
 */
export async function createConversation(
    userId: string,
    initialMessage: OracleMessage
): Promise<OracleConversation> {
    const conversationId = `conv-${Date.now()}`;
    const conversationsRef = collection(db, 'users', userId, 'oracleConversations');
    const conversationDoc = doc(conversationsRef, conversationId);

    const conversation: OracleConversation = {
        id: conversationId,
        userId,
        messages: [initialMessage],
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
        messageCount: 1,
    };

    await setDoc(conversationDoc, {
        ...conversation,
        createdAt: Timestamp.fromDate(conversation.createdAt),
        lastUpdatedAt: Timestamp.fromDate(conversation.lastUpdatedAt),
        messages: conversation.messages.map(m => ({
            ...m,
            timestamp: Timestamp.fromDate(m.timestamp),
        })),
    });

    trackEvent('oracle_conversation_started', { conversationId });

    return conversation;
}

/**
 * Add a message to an existing conversation
 */
export async function addMessageToConversation(
    userId: string,
    conversationId: string,
    message: OracleMessage
): Promise<void> {
    try {
        const conversationRef = doc(db, 'users', userId, 'oracleConversations', conversationId);
        const conversationSnap = await getDoc(conversationRef);

        if (!conversationSnap.exists()) {
            console.error('Conversation not found:', conversationId);
            return;
        }

        const currentData = conversationSnap.data();
        const currentCount = currentData.messageCount || 0;

        await updateDoc(conversationRef, {
            messages: arrayUnion({
                ...message,
                timestamp: Timestamp.fromDate(message.timestamp),
            }),
            lastUpdatedAt: Timestamp.fromDate(new Date()),
            messageCount: currentCount + 1,
        });

        // Track Oracle response specifically
        if (message.sender === 'oracle') {
            trackEvent('oracle_response', {
                conversationId,
                messageLength: message.text.length,
            });
        }
    } catch (error) {
        console.error('Failed to add message to conversation:', error);
    }
}

/**
 * Get all conversations for a user (for history view)
 */
export async function getConversationHistory(
    userId: string,
    maxConversations: number = 10
): Promise<OracleConversation[]> {
    try {
        const conversationsRef = collection(db, 'users', userId, 'oracleConversations');
        const q = query(
            conversationsRef,
            orderBy('lastUpdatedAt', 'desc'),
            limit(maxConversations)
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                messages: (data.messages || []).map((m: OracleMessage & { timestamp: Timestamp }) => ({
                    ...m,
                    timestamp: m.timestamp?.toDate?.() || new Date(m.timestamp),
                })),
                createdAt: data.createdAt?.toDate?.() || new Date(),
                lastUpdatedAt: data.lastUpdatedAt?.toDate?.() || new Date(),
                messageCount: data.messageCount || 0,
            };
        });
    } catch (error) {
        console.error('Failed to get conversation history:', error);
        return [];
    }
}

/**
 * Check if we should start a new conversation
 * (e.g., if the last one is more than 24 hours old)
 */
export function shouldStartNewConversation(lastConversation: OracleConversation | null): boolean {
    if (!lastConversation) return true;

    const hoursSinceLastMessage =
        (Date.now() - lastConversation.lastUpdatedAt.getTime()) / (1000 * 60 * 60);

    // Start new conversation if last one is over 24 hours old
    return hoursSinceLastMessage > 24;
}
