import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Sso რეჟიმში SPA და API ერთ origin-ზეა: Vite ჰოსტის მისამართებს AppGrammarGe-ზე (5022) აგზავნის.
// changeOrigin: false — ჰოსტმა Vite-ის მისამართი (localhost:5175) უნდა დაინახოს, რომ sso-ზე
// რეგისტრირებული redirect URI ააგოს და WebSocket-ის Origin მიიღოს
const toHost = { target: "http://localhost:5022", changeOrigin: false };

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // პორტი 5175 app-grammar კლიენტის redirect URI-შია (http://localhost:5175/signin-oidc);
    // 5173 ganmarteba-ს ეკავება, 5174 — errata-ს
    server: {
        port: 5175,
        strictPort: true,
        proxy: {
            // ws: ReCounter-ის SignalR hub-იც /api-შია (api/v1/recounter/messages)
            "/api": { ...toHost, ws: true },
            "/bff": toHost,
            "/signin-oidc": toHost,
            "/signout-callback-oidc": toHost,
        },
    },
});
