import { useRequest } from '@/hooks/useRequest';
import { useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { useAuth } from '@/contexts/AuthContext';
import { MessageResponseType } from '@/types/Message';

export default function useMessages(roomId: number | null) {
	const [messages, setMessages] = useState<MessageResponseType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean | number>(1);
	const { accessToken } = useAuth();
	const { get } = useRequest();
	const webSocketPath = `/user/queue/chat/${roomId}`;

	async function getChatRoomMessage(page: number) {
		const data = await get(`messages`, {
			params: { page, room: roomId },
		});
		return data;
	}

	useEffect(() => {
		const fetch = async () => {
			const data = await getChatRoomMessage(1);
			setIsLoading(false);
			setMessages(data);
		};
		fetch();
	}, [roomId]);

	useWebSocket(webSocketPath, (response) => {
		const message = response as MessageResponseType;
		message.isFake = false;
		message.sending = false;
		setMessages((prev) => [
			...prev.filter((message) => message.isFake !== true),
			message,
		]);
	});

	function insertFakeMessage(fakeMessage: MessageResponseType) {
		setMessages((prev) => [...prev, fakeMessage]);
	}

	function updateMessage(
		messageId: number,
		newMessage: string,
		sending: boolean,
		isUpdated: boolean,
	) {
		setMessages((prev) =>
			prev.map((m) => {
				if (m.id !== messageId) {
					return m;
				}

				return {
					...m,
					message: newMessage,
					sending,
					isUpdated,
				};
			}),
		);
	}

	function deleteMessage(messageId: number) {
		setMessages((prev) =>
			prev.map((m) => {
				if (m.id !== messageId) {
					return m;
				}

				return {
					...m,
					message: 'Đã thu hồi tin nhắn',
				};
			}),
		);
	}

	async function handleFetchNewMessages(page: number) {
		// fetch messages for page and prepend to existing list
		const data = await getChatRoomMessage(page);
		if (!data || (Array.isArray(data) && data.length === 0)) {
			return data;
		}
		setMessages((prev) => [...data, ...prev]);
		return data;
	}

	return {
		messages,
		insertFakeMessage,
		updateMessage,
		deleteMessage,
		handleFetchNewMessages,
		isLoading,
	};
}
