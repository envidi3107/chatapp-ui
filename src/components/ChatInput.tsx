import React, { useState, useRef, useEffect } from 'react';
import debounce from 'debounce';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useRequest } from '@/hooks/useRequest';
import { MessageResponseType } from '@/types/Message';
import { MdAttachFile, MdDeleteForever } from 'react-icons/md';
import { IoIosMic, IoIosCloseCircleOutline } from 'react-icons/io';
import { FaPaperPlane, FaMicrophone, FaStopCircle } from 'react-icons/fa';
import { useNotification } from '@/hooks/useNotification';
import TextInput from './TextInput';
import { useAuth } from '@/contexts/AuthContext';
import useTypingEvent from '@/hooks/useTypingEvent';
import Avatar from './Avatar';

declare global {
	interface Window {
		SpeechRecognition: typeof SpeechRecognition;
		webkitSpeechRecognition: typeof SpeechRecognition;
	}
}

declare const SpeechRecognition: {
	new(): typeof SpeechRecognition;
	prototype: typeof SpeechRecognition;
};

type UploadProgressType = {
	id: number | null;
	percent: number;
};

type ChatRoomProps = {
	roomId: number | null;
	allow: number | undefined;
	onSendOptimistic: (msg: MessageResponseType) => void;
	onSetUploadProgress: (uploadProgress: UploadProgressType) => void;
};

type FileAttachmentTypes = {
	urlPreview: string;
	fileData: File;
};

type VoiceMenu = 'Ghi âm giọng nói' | 'Chuyển giọng nói thành văn bản';

const voiceMenuValues: VoiceMenu[] = [
	'Ghi âm giọng nói',
	'Chuyển giọng nói thành văn bản',
];

export default function ChatInput({
	roomId,
	allow,
	onSendOptimistic,
	onSetUploadProgress,
}: ChatRoomProps) {
	const { authUser } = useAuth();
	const { post } = useRequest();
	const { showNotification } = useNotification();
	const [message, setMessage] = useState('');
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const messageInputRef = useRef<HTMLInputElement>(null);
	const isTypingRef = useRef<boolean>(false);
	const debouncedStopRef = useRef<ReturnType<typeof debounce> | null>(null);

	useEffect(() => {
		// initialize debounced stop-typing function
		debouncedStopRef.current = debounce(() => {
			if (isTypingRef.current) {
				sendTypingEvent(false);
				isTypingRef.current = false;
			}
		}, 1200);

		return () => {
			// clear pending debounce and notify server that typing stopped
			debouncedStopRef.current?.clear?.();
			if (isTypingRef.current) {
				sendTypingEvent(false);
				isTypingRef.current = false;
			}
		};
	}, []);
	const [attachments, setAttachments] = useState<FileAttachmentTypes[] | null>(
		null,
	);

	const templeAttachments = useRef<FileAttachmentTypes[] | null>(null);

	const [isShowVoiceControl, setShowVoiceControl] = useState<boolean>(false);
	const [voiceMenu, setVoiceMenu] = useState<VoiceMenu>(voiceMenuValues[0]);
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);

	const userTyping = useTypingEvent(roomId || 0, authUser?.id || 0);
	console.log('user typing:', userTyping);

	const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;
		const formData = new FormData();
		const text = message.trim();

		if (!text && !attachments) return;

		if (attachments) {
			for (let i = 0; i < attachments.length; i++) {
				formData.append('attachments', attachments[i].fileData);
			}
		}

		if (text) {
			formData.append('message', text);
		}

		sendTypingEvent(false);

		templeAttachments.current = attachments;
		const fakeId = -Date.now();
		onSendOptimistic({
			id: -Date.now(),
			message: text ? text : null,
			sender: authUser?.username || 'you',
			sentOn: new Date().toISOString(),
			attachments:
				attachments?.map((a) => ({
					id: -Date.now(),
					name: '',
					source: a.urlPreview,
					type: a.fileData.type.startsWith('video') ? 'VIDEO' : 'IMAGE',
					format: (a.fileData.name.split('.').pop() ?? '').toLowerCase(),
					description: '',
				})) || [],
			sending: true,
			isFake: true,
		});
		setAttachments(null);

		try {
			await post(`messages`, formData, {
				params: {
					room: roomId,
				},
				onUploadProgress: templeAttachments.current
					? (progressEvent) => {
						const percent = Math.round(
							(progressEvent.loaded * 100) / (progressEvent.total || 1),
						);
						onSetUploadProgress({
							id: fakeId,
							percent: percent,
						});
					}
					: () => { },
			});
		} catch (err) {
			console.error('Send failed:', err);
		}

		form.reset();
		setMessage('');
		setAttachments(null);
	};

	async function sendTypingEvent(typing: boolean) {
		await post(`typing`, {
			roomId: roomId,
			senderId: authUser?.id,
			avatar: authUser?.avatar,
			typing: typing,
		});
	}

	const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		const newAttachments = files.map((file) => ({
			urlPreview: URL.createObjectURL(file),
			fileData: file,
		}));
		setAttachments((prev) => [...(prev ?? []), ...newAttachments]);
	};

	const addEmoji = (emoji: { native: string }) => {
		const cursor = messageInputRef.current?.selectionStart ?? message.length;
		const newMessage =
			message.slice(0, cursor) + emoji.native + message.slice(cursor);
		setMessage(newMessage);

		setTimeout(() => {
			messageInputRef.current?.focus();
			messageInputRef.current?.setSelectionRange(
				cursor + emoji.native.length,
				cursor + emoji.native.length,
			);
		}, 0);
	};

	const speechToText = () => {
		if (
			!('SpeechRecognition' in window) &&
			!('webkitSpeechRecognition' in window)
		)
			return;

		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;

		if (!SpeechRecognition) {
			showNotification({
				type: 'error',
				message: 'Trình duyệt không hỗ trợ Speech Recognition',
			});
			return;
		}

		const recognition: any = new SpeechRecognition();
		recognition.lang = 'vi-VN';

		recognition.onresult = (event: any) => {
			const transcript = event.results[0][0].transcript;
			setMessage(transcript);
		};

		recognition.onerror = (event: any) => {
			showNotification({
				type: 'error',
				message: `Lỗi nhận diện giọng nói: ${event.error}`,
			});
		};

		recognition.start();
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) audioChunksRef.current.push(e.data);
			};

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, {
					type: 'audio/webm',
				});
				const urlPreview = URL.createObjectURL(audioBlob);
				const audioFile = new File([audioBlob], 'recording.webm', {
					type: 'audio/webm',
					lastModified: Date.now(),
				});
				setAttachments((prev) => [
					...(prev || []),
					{
						fileData: audioFile,
						urlPreview,
					},
				]);
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (err) {
			showNotification({
				type: 'error',
				message: 'Không thể truy cập microphone',
			});
		}
	};

	const stopRecording = () => {
		mediaRecorderRef.current?.stop();
		setIsRecording(false);
	};

	if (allow !== -1 && allow !== authUser?.id) {
		return (
			<div className="relative flex flex-col items-center justify-center gap-[15px] border-t border-gray-800 bg-gray-800/50 p-4">
				Chỉ trưởng nhóm mới có thể gửi tin nhắn
			</div>
		);
	}

	return (
		<div className="relative flex flex-col gap-[15px] border-t border-gray-800 bg-gray-800/50 p-4">
			{userTyping && userTyping.typing && (
				<div className="absolute bottom-[105%] left-[10px] flex items-center gap-[10px] rounded-[10px] bg-gray-700/80 px-[10px] py-[5px]">
					<img
						src={userTyping.avatar || '/default-avatar.png'}
						alt="avatar"
						className="h-[30px] w-[30px] rounded-[50%] object-cover"
					/>
					<p className="text-sm text-white">
						đang nhập tin nhắn...
					</p>
				</div>
			)}

			<form className="flex gap-2" onSubmit={sendMessage}>
				<div className="flex items-center justify-center">
					<input
						id="attachments"
						name="attachments"
						type="file"
						onChange={handleFilesChange}
						className="hidden"
						multiple
					/>
					<label
						htmlFor="attachments"
						className="cursor-pointer text-[25px] hover:text-amber-300"
					>
						<MdAttachFile />
					</label>
				</div>

				<div className="relative h-[40px] w-full">
					<TextInput
						externalRef={messageInputRef}
						name="message"
						value={message}
						onChange={(e) => {
							const v = e.target.value;
							setMessage(v);
							if (v.length === 0) {
								if (isTypingRef.current) {
									sendTypingEvent(false);
									isTypingRef.current = false;
								}
								debouncedStopRef.current?.clear?.();
							} else {
								if (!isTypingRef.current) {
									sendTypingEvent(true);
									isTypingRef.current = true;
								}
								// schedule stop-typing after idle
								debouncedStopRef.current?.();
							}
						}}
						placeHolder="Type a message..."
						className="h-full w-full"
					/>
					<div className="absolute top-[50%] right-[2px] flex translate-y-[-50%] transform cursor-pointer items-center text-[23px]">
						<p
							className="select-none"
							onClick={() => setShowEmojiPicker((prev) => !prev)}
						>
							😊
						</p>

						{showEmojiPicker && (
							<div className="absolute right-0 bottom-[100%] z-10 cursor-pointer">
								<Picker data={data} onEmojiSelect={addEmoji} />
							</div>
						)}
					</div>
				</div>

				<div
					className="flex cursor-pointer items-center justify-center text-2xl"
					onClick={() => setShowVoiceControl(!isShowVoiceControl)}
				>
					<IoIosMic />
				</div>

				<button
					type="submit"
					disabled={!message.trim() && (attachments ? false : true)}
					className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<FaPaperPlane />
				</button>
			</form>

			{attachments && attachments.length !== 0 && (
				<div className="flex flex-wrap gap-[10px]">
					{attachments.map((attachment) => {
						const isImage = attachment.fileData.type.startsWith('image/');
						const isVideo = attachment.fileData.type.startsWith('video/');
						const isAudio = attachment.fileData.type.startsWith('audio/');
						const isDocument = !isImage && !isVideo && !isAudio;

						if (isAudio) return null;

						return (
							<div
								key={attachment.urlPreview}
								className="relative h-[100px] w-[30%]"
							>
								<div
									className="absolute top-[-10px] right-[-10px] z-10 cursor-pointer text-[23px]"
									onClick={() => {
										URL.revokeObjectURL(attachment.urlPreview);
										setAttachments(
											(prev) =>
												prev?.filter(
													(n) => n.urlPreview !== attachment.urlPreview,
												) || null,
										);
									}}
								>
									<IoIosCloseCircleOutline />
								</div>

								{isImage && (
									<img
										src={attachment.urlPreview}
										alt="preview"
										className="h-full w-full rounded-[10px] object-cover"
									/>
								)}

								{isVideo && (
									<video
										src={attachment.urlPreview}
										className="h-full w-full rounded-[10px] object-cover"
										controls
									/>
								)}

								{isDocument && (
									<div className="flex h-full w-full flex-col items-center justify-center rounded-[10px] bg-gray-100 px-1 text-center">
										<div className="w-full truncate text-sm font-medium text-black">
											{attachment.fileData.name}
										</div>
										<a
											href={attachment.urlPreview}
											download={attachment.fileData.name}
											className="mt-1 text-xs text-blue-600 underline"
										>
											Tải xuống
										</a>
									</div>
								)}
							</div>
						);
					})}

					{attachments.map((attachment) => {
						if (attachment.fileData.type.startsWith('audio/')) {
							return (
								<div className="flex items-center justify-center gap-[7px]">
									<audio src={attachment.urlPreview} controls />

									<div
										className="cursor-pointer text-2xl text-red-600"
										onClick={() => {
											URL.revokeObjectURL(attachment.urlPreview);
											setAttachments(
												(prev) =>
													prev?.filter(
														(n) => n.urlPreview !== attachment.urlPreview,
													) || null,
											);
										}}
									>
										<MdDeleteForever />
									</div>
								</div>
							);
						}
					})}
				</div>
			)}

			{isShowVoiceControl && (
				<div className="flex h-full w-full flex-col items-center justify-center gap-[10px] rounded-[8px] bg-gray-900 p-[10px]">
					<div
						className={`cursor-pointer rounded-[50%] bg-blue-700 p-[20px] ${isRecording ? 'animate-ping' : ''}`}
						onClick={() => {
							if (voiceMenu === 'Ghi âm giọng nói') {
								startRecording();
							} else {
								speechToText();
							}
						}}
					>
						<FaMicrophone />
					</div>
					<div className="flex cursor-pointer overflow-hidden rounded-[20px] bg-gray-700">
						{voiceMenuValues.map((value) => (
							<div
								key={value}
								className="px-[10px] py-[5px]"
								style={
									voiceMenu === value
										? {
											backgroundColor: 'blue',
										}
										: {}
								}
								onClick={() => setVoiceMenu(value)}
							>
								{value}
							</div>
						))}
					</div>

					{voiceMenu === 'Ghi âm giọng nói' && isRecording && (
						<div className="space-y-2">
							<div className="flex">
								<p>đang ghi âm...</p>
								<div
									onClick={stopRecording}
									className="cursor-pointer text-2xl text-red-600"
								>
									<FaStopCircle />
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
