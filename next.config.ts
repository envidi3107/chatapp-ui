import type { NextConfig } from 'next';
import TerserPlugin from 'terser-webpack-plugin';

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
	},
	webpack: (config, { dev }) => {
		if (!dev) {
			config.optimization.minimizer.push(
				new TerserPlugin({
					exclude: /VideoCall\.tsx$/,
				}),
			);
		}
		return config;
	},
};

export default nextConfig;
