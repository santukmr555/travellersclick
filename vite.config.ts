import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from "path";

const REPO_NAME = "travellersclick"; // <-- if you rename the repo, update this
const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname;

// Export a function so we can switch base by mode
export default defineConfig(({ mode }) => ({
  // Use repo path on production builds (GitHub Pages), "/" for local dev
  base: mode === "production" ? `/${REPO_NAME}/` : "/",

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": resolve(projectRoot, "src"),
    },
  },
}));

