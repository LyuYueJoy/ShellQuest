import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],

  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
      "https://localhost:7000",
    ),
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    restoreMocks: true,

    // Windows 上避免使用容易启动超时的 child_process。
    pool: "threads",

    // 当前测试数量较少，使用单 worker 更稳定。
    maxWorkers: 1,
    fileParallelism: false,
  },
});