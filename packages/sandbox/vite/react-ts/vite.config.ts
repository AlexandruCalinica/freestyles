import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Inspect from "vite-plugin-inspect";
import freestyles from "@freestyles/react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Inspect(), freestyles(), react()],
});
