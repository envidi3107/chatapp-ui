import { useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { set } from 'nprogress';

interface TypingEvent {
	senderId: number;
	avatar: string | null;
	roomId: number;
	typing: boolean;
	timestamp: number;
	ttlMs: number;
}

export default function useTypingEvent(roomId: number, senderId: number) {
	const [userTyping, setUserTyping] = useState<TypingEvent | null>(null);

	useWebSocket(`/queue/typing.room${roomId}`, (response) => {
		const typingEvent = response as TypingEvent;
		// Handle the typing event (e.g., update UI to show who is typing)
		console.log(
			`${typingEvent.senderId} is ${typingEvent.typing ? 'typing...' : 'not typing'}`,
		);
		if (senderId !== typingEvent.senderId) setUserTyping(typingEvent);
	});

	return userTyping;
}
