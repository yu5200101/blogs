// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `$var: red;`
  }
}

// 使用i18next
export default nextConfig;