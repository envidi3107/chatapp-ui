'use client';

import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';
import { isAuthorized } from '@/utils/jwts';
import { motion, AnimatePresence } from 'framer-motion';
import {
	FiArrowRight,
	FiMessageSquare,
	FiLock,
	FiGlobe,
	FiUsers,
	FiVideo,
	FiHeart,
} from 'react-icons/fi';
import { routes } from '@/lib/routes';
import ProjectionBox from '@/components/ProjectionBox';
import Button from '@/components/Button';

const features = [
	{
		icon: <FiMessageSquare className="h-8 w-8" />,
		title: 'Chat real-time',
		desc: 'Nhắn tin tức thì với công nghệ WebSocket tốc độ cao',
		color: 'text-blue-500',
		bgColor: 'bg-blue-500/10',
	},
	{
		icon: <FiLock className="h-8 w-8" />,
		title: 'Bảo mật tuyệt đối',
		desc: 'Mã hóa end-to-end cho tin nhắn an toàn',
		color: 'text-green-500',
		bgColor: 'bg-green-500/10',
	},
	{
		icon: <FiGlobe className="h-8 w-8" />,
		title: 'Đa nền tảng',
		desc: 'Dùng mọi lúc, mọi nơi trên mọi thiết bị',
		color: 'text-purple-500',
		bgColor: 'bg-purple-500/10',
	},
	{
		icon: <FiUsers className="h-8 w-8" />,
		title: 'Trò chuyện nhóm',
		desc: 'Tạo nhóm chat với bạn bè và gia đình',
		color: 'text-orange-500',
		bgColor: 'bg-orange-500/10',
	},
	{
		icon: <FiVideo className="h-8 w-8" />,
		title: 'Gọi video HD',
		desc: 'Gọi video chất lượng cao hoàn toàn miễn phí',
		color: 'text-red-500',
		bgColor: 'bg-red-500/10',
	},
	{
		icon: <FiHeart className="h-8 w-8" />,
		title: 'Giao diện thân thiện',
		desc: 'Trải nghiệm người dùng tuyệt vời và intuitive',
		color: 'text-pink-500',
		bgColor: 'bg-pink-500/10',
	},
];

const stats = [
	{ value: '10K+', label: 'Người dùng' },
	{ value: '99.9%', label: 'Uptime' },
	{ value: '256-bit', label: 'Mã hóa' },
	{ value: '24/7', label: 'Hỗ trợ' },
];

const fadeIn = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: 'easeOut' as const },
	},
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const scaleIn = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.5, ease: 'easeOut' as const },
	},
};

function useIsAuthoized() {
	const [isAuthorizedState, setIsAuthoized] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		isAuthorized().then((auth) => {
			setIsAuthoized(auth);
			setLoading(false);
		});
	}, []);

	return { isAuthorized: isAuthorizedState, loading };
}

export default function Page() {
	const { isAuthorized, loading } = useIsAuthoized();

	return (
		<div className="relative overflow-hidden">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
				<div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"></div>
				<div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"></div>
			</div>

			<div className="z-10 flex min-h-screen flex-col items-center justify-center px-[25px] py-4 transition-all duration-500 dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-black dark:text-white">
				<header className="flex h-[70px] w-full max-w-7xl items-center justify-between rounded-2xl bg-slate-500 p-4 backdrop-blur-md sm:p-6 dark:bg-gray-900/80">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, ease: 'easeOut' }}
					>
						<Logo />
					</motion.div>

					<div className="flex items-center gap-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="flex items-center gap-4"
						>
							{!loading && (
								<AnimatePresence mode="wait">
									{isAuthorized ? (
										<motion.div
											key="auth"
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.9 }}
											className="flex gap-3"
										>
											<Link
												href={routes.nextvibes}
												className="group relative overflow-hidden rounded-lg px-4 py-2 font-medium text-blue-600 transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
											>
												<span className="relative z-10">Mạng xã hội</span>
												<div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
											</Link>
											<Link
												href={routes.nextchat}
												className="group relative overflow-hidden rounded-lg px-4 py-2 font-medium text-blue-600 transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
											>
												<span className="relative z-10">Chat với bạn bè</span>
												<div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
											</Link>
										</motion.div>
									) : (
										<motion.div
											key="unauth"
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.9 }}
											className="flex items-center gap-3"
										>
											<Link
												href={routes.login}
												className="rounded-lg px-4 py-2 font-medium text-blue-600 transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
											>
												Đăng nhập
											</Link>
											<Link
												href={routes.register}
												className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-600 hover:shadow-xl"
											>
												<span className="relative z-10">Đăng ký</span>
												<div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
											</Link>
										</motion.div>
									)}
								</AnimatePresence>
							)}
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.4, duration: 0.5 }}
						>
							<ThemeToggle />
						</motion.div>
					</div>
				</header>

				<main className="mt-8 flex w-full max-w-7xl flex-col items-center justify-center gap-8 lg:flex-row lg:gap-12">
					<motion.div
						initial="hidden"
						animate="visible"
						variants={fadeIn}
						className="flex-1 space-y-8 text-center lg:text-left"
					>
						<div className="space-y-6">
							<motion.h1
								className="text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl"
								variants={fadeIn}
							>
								Kết nối mọi lúc, <br />
								<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
									<TypeAnimation
										sequence={[
											'Nhắn tin với bạn bè.',
											2000,
											'Trò chuyện nhóm.',
											2000,
											'Gọi video miễn phí.',
											2000,
											'Lướt mạng xã hội.',
											2000,
										]}
										speed={50}
										repeat={Infinity}
										wrapper="span"
									/>
								</span>
							</motion.h1>

							<motion.p
								className="ml-[10px] text-[90%] text-gray-600 dark:text-gray-400"
								variants={fadeIn}
								transition={{ delay: 0.2 }}
							>
								NextChat - Nền tảng trò chuyện đơn giản, bảo mật và miễn phí cho
								mọi người. Trải nghiệm giao tiếp thế hệ mới.
							</motion.p>
						</div>

						<motion.div
							className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
							variants={fadeIn}
							transition={{ delay: 0.4 }}
						>
							<Link
								href={isAuthorized ? routes.nextchat : routes.login}
								className="group hover:shadow-3xl relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 text-white shadow-2xl transition-all duration-300 hover:from-blue-700 hover:to-blue-600"
							>
								<span className="relative z-10 flex items-center justify-center gap-2 text-lg font-semibold">
									Bắt đầu ngay
									<FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
								</span>
								<div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
							</Link>

							<motion.a
								href="#features"
								className="group relative overflow-hidden rounded-xl border-2 border-blue-600 px-8 py-4 text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<span className="relative z-10 font-semibold">
									Khám phá tính năng
								</span>
							</motion.a>
						</motion.div>

						<motion.div
							className="grid grid-cols-2 gap-4 pt-8 sm:grid-cols-4"
							variants={staggerContainer}
							initial="hidden"
							animate="visible"
						>
							{stats.map((stat, index) => (
								<motion.div
									key={index}
									variants={fadeIn}
									className="text-center"
								>
									<div className="text-2xl font-bold text-blue-600 sm:text-3xl dark:text-blue-400">
										{stat.value}
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										{stat.label}
									</div>
								</motion.div>
							))}
						</motion.div>
					</motion.div>

					<motion.div
						initial="hidden"
						animate="visible"
						variants={scaleIn}
						transition={{ duration: 0.8, delay: 0.3 }}
						className="flex-1"
					>
						<div className="relative h-[300px]">
							<div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-3xl"></div>
							<div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-10 blur-xl"></div>

							<div className="relative rounded-2xl bg-white/5 backdrop-blur-md">
								<ProjectionBox />
							</div>
						</div>
					</motion.div>
				</main>

				<section id="features" className="w-full py-20 sm:py-32">
					<div className="mx-auto max-w-7xl px-6">
						<motion.div
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							variants={fadeIn}
							transition={{ duration: 0.8 }}
							className="mx-auto max-w-4xl text-center"
						>
							<h2 className="text-4xl font-bold sm:text-5xl">
								Tính năng <span className="text-blue-600">nổi bật</span>
							</h2>
							<p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
								Khám phá những tính năng ưu việt giúp <strong>NextChat</strong>{' '}
								trở thành lựa chọn hàng đầu
							</p>
						</motion.div>

						<motion.div
							className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
							variants={staggerContainer}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
						>
							{features.map((feature, index) => (
								<motion.div
									key={index}
									variants={fadeIn}
									whileHover={{
										y: -8,
										transition: { duration: 0.3 },
									}}
									className="group relative overflow-hidden rounded-2xl bg-white/50 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/50"
								>
									<div className="relative z-10">
										<div
											className={`mb-6 inline-flex rounded-2xl p-4 ${feature.bgColor} transition-transform duration-300 group-hover:scale-110`}
										>
											<div className={feature.color}>{feature.icon}</div>
										</div>
										<h3 className="mb-4 text-2xl font-bold">{feature.title}</h3>
										<p className="text-gray-700 dark:text-gray-300">
											{feature.desc}
										</p>
									</div>
									<div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-gray-700/20"></div>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>

				<section className="w-full py-20">
					<div className="mx-auto max-w-7xl px-6">
						<motion.div
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							variants={scaleIn}
							className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-12 text-center shadow-2xl"
						>
							<div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10"></div>
							<div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/10"></div>

							<motion.div
								variants={fadeIn}
								className="relative z-10 mx-auto max-w-4xl"
							>
								<h2 className="text-4xl font-bold text-white sm:text-5xl">
									Sẵn sàng trải nghiệm?
								</h2>
								<p className="mt-4 text-xl text-blue-100">
									Đăng ký ngay để kết nối với bạn bè và gia đình một cách dễ
									dàng và bảo mật
								</p>
								<motion.div
									className="mt-8"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Link
										href={routes.register}
										className="hover:shadow-3xl inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-2xl transition-all duration-300 hover:bg-gray-100"
									>
										Đăng ký miễn phí
										<FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
									</Link>
								</motion.div>
							</motion.div>
						</motion.div>
					</div>
				</section>
			</div>
		</div>
	);
}
