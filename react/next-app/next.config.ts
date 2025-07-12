// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `$var: red;`
  }
}

export default nextConfig;