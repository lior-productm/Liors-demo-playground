import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * If a lockfile exists higher in the tree (e.g. ~/package-lock.json), Next
   * otherwise picks that folder as the Turbopack root and the app misbehaves
   * or fails to resolve modules. Pin the root to this project.
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
   */
  turbopack: {
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "date-fns",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  /**
   * Lets dev assets load when the app is opened via a tunnel URL (Localtunnel, Cloudflare, ngrok).
   * Without this, Next can return 403 for /_next/* and the page looks blank or “not responding”.
   */
  allowedDevOrigins: [
    "127.0.0.1",
    "*.loca.lt",
    "*.localtunnel.me",
    "*.trycloudflare.com",
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.ngrok.app",
  ],
}

export default nextConfig
