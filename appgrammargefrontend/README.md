# React + TypeScript + Vite

## Sign-in through sso.ltg.ge in development (merabza/SsoLtgGe#16)

On a machine with the local host (AppGrammarGe, :5022) and sso.ltg.ge (:5090) running, the git-ignored
`.env.development.local` switches appcarcass to its Sso mode (see `src/appcarcass/README.md`, "Authentication modes"):

```
VITE_AUTH_MODE=sso
VITE_SSO_URL=http://localhost:5090/
VITE_REACT_APP_API_URI=/api/v1
VITE_REACT_APP_NAME="ენის მოდელის რედაქტორი (dev)"
```

`npm run dev` then serves on http://localhost:5175 (a fixed port: it is in the redirect URI of sso's `app-grammar`
client; 5173 is ganmarteba's and 5174 errata's) and proxies `/api` (WebSockets included, for the ReCounter hub),
`/bff`, `/signin-oidc` and `/signout-callback-oidc` to the host (`vite.config.ts`). The ReCounter hub
(`api/v1/recounter/messages`) authenticates by the session cookie and the `X-CSRF: 1` header in the Sso mode, by the
token in the Local mode. Without that file the dev server uses devapp (`.env.development`) in Local mode;
`.env.production` stays `local` until merabza/SsoLtgGe#20.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
    extends: [
        // Remove ...tseslint.configs.recommended and replace with this
        ...tseslint.configs.recommendedTypeChecked,
        // Alternatively, use this for stricter rules
        ...tseslint.configs.strictTypeChecked,
        // Optionally, add this for stylistic rules
        ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
        // other options...
        parserOptions: {
            project: ["./tsconfig.node.json", "./tsconfig.app.json"],
            tsconfigRootDir: import.meta.dirname,
        },
    },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
    plugins: {
        // Add the react-x and react-dom plugins
        "react-x": reactX,
        "react-dom": reactDom,
    },
    rules: {
        // other rules...
        // Enable its recommended typescript rules
        ...reactX.configs["recommended-typescript"].rules,
        ...reactDom.configs.recommended.rules,
    },
});
```
