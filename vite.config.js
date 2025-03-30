import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "/bahgat-qr-mdcn-generator/",
    build: {
        assetsInlineLimit: 0,
        // Enable asset inlining to reduce the number of separate files
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
});
