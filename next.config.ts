import type { NextConfig } from "next";

const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS || "photo.carrera74.com")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins,
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
