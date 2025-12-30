This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
# NextChat — Ứng dụng Chat & Mạng Xã Hội (Frontend)

NextChat là giao diện người dùng (frontend) được xây dựng bằng Next.js + React cho một nền tảng trò chuyện thời gian thực kết hợp mạng xã hội. Dự án này tập trung vào trải nghiệm chat (nhắn tin, gửi file, gọi âm thanh/video), mạng xã hội nhẹ (bài viết, tương tác), và các tính năng thời gian thực (WebSocket/STOMP).

**Bản tóm tắt ngắn**
- Ngôn ngữ & framework: TypeScript, React, Next.js (App Router)
- Styling: Tailwind CSS và một số CSS tuỳ chỉnh trong `src/app/globals.css` và `src/styles/*`
- Thời gian thực: WebSocket với STOMP (`@stomp/stompjs`) và `sockjs-client`
- RTC (gọi âm thanh/Video): `agora-rtc-react` / `agora-rtc-sdk-ng` (hỗ trợ gọi video HD)
- State & Context: React Context cho Auth và WebSocket (các provider trong `src/contexts`)
- HTTP: `axios` wrapper qua hook `useRequest`

**Vị trí chính trong mã nguồn (src/)**
- `src/app/` — các route và layout của Next.js (home, login, signup, nextchat, nextvibes, profile, ...)
- `src/components/` — các component UI: Chat, Message, ChatInput, Header, Avatar, Post, Notification, v.v.
- `src/contexts/` — Context providers: `AuthContext`, `AgoraRTCProvider` (quản lý auth + token, user info, JWT)
- `src/hooks/` — các hook tuỳ chỉnh: `useWebSocket`, `useMessages`, `useChatRooms`, `useRequest`, `useTheme`, `useTypingEvent`, v.v.
- `src/services/` — service kết nối WebSocket (`websocket.ts`), các API khác có thể ở hooks `useRequest`.
- `src/types/` — các kiểu TypeScript: `User`, `Message`, `ChatRoom`, `Attachment`, `Post`, `Notification`, ...
- `src/utils/` — các tiện ích: xử lý JWT (`jwts.ts`), format thời gian (`formatDateTime.ts`), helper request
- `src/styles/` — CSS tuỳ chỉnh (animations, breakpoints)

**Các tính năng nổi bật (theo mã nguồn)**
- Trang landing giới thiệu tính năng (tham chiếu `src/app/page.tsx`)
- Xác thực JWT: `AuthContext` kiểm tra access/refresh token, refresh khi cần, lưu token vào `localStorage`.
- Chat thời gian thực: `WebSocketContext` + STOMP client tạo kết nối, `useWebSocket` dùng để subscribe message topics.
- Gửi/nhận tin nhắn: component `ChatInput` + hook `useMessages` (gồm optimistic UI, upload progress, file attachments, voice-to-text, emoji picker).
- Hiển thị tin nhắn: `Message` component hỗ trợ text, hình ảnh, video, audio và file download; kèm menu sửa/xóa cho tin nhắn của chính user.
- Chat room: `ChatRoom` component quản lý scroll, paginate (tải tin nhắn cũ khi scroll lên), quản lý thành viên & info room.
- Gọi thoại / video: UI + `AgoraRTCProvider` tích hợp để tạo/nhận cuộc gọi.
- Mạng xã hội (NextVibes): các component liên quan post/interaction (Post, CreatePost, PostDetail, PostInteraction, Comment, Reaction).
- Thông báo: `Notification` + `useNotification` / `useNotificationListener` để xử lý và hiển thị thông báo thời gian thực.

**Chạy dự án (local)**
1. Cài dependencies:

```bash
pnpm install
# hoặc npm install
```

2. Thiết lập biến môi trường (ví dụ `.env.local`):
- `NEXT_PUBLIC_WS_BROKERURL` — URL broker cho SockJS/STOMP
- Các biến cho API backend (ví dụ `NEXT_PUBLIC_API_URL`), và config Agora nếu cần.

3. Chạy dev server:

```bash
pnpm dev
# hoặc npm run dev
```

**Ghi chú cho phát triển**
- Backend API endpoints không có trong repo frontend; kiểm tra hooks `useRequest` để biết các route được gọi.
- WebSocket sử dụng STOMP + SockJS: broker URL phải đúng server hỗ trợ STOMP.
- JWT handling: `AuthContext` dùng `jose.decodeJwt` và lưu token vào `localStorage`.
- Call / RTC: cần thiết lập `AGORA` credentials trên backend và biến môi trường tương ứng.