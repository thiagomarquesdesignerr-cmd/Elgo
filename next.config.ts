import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acessar o dev server pelos subdomínios dos portais (ex.: diariodovale.localhost)
  allowedDevOrigins: ["*.localhost"],
};

export default nextConfig;
