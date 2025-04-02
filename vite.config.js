import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "frontend", // Indique que le projet est dans "frontend"
  plugins: [react()],
});
