# ddgond/start
A quickstart repo for my preferred web stack of Express + Postgres backend with a React + Tanstack Router + shadcn frontend.

# Installation
Run the following command to get started:
```bash
npx degit ddgond/start my-app-name
cd client
pnpm i
```

# General Configuration
Replace `client/public/favicon.svg` with your own favicon.

Edit `client/src/lib/config.ts`, replacing the placeholder `SITE_NAME` variable with your site's name.

# Development
Ensure `server/.env.dev` is configured the way you wish to have it. Make note of the server's port.

Run the backend in development mode with `pnpm docker:up`.

Ensure that the proxy port in `client/vite.config.ts` points to the same port you set for the backend server in `server/.env.dev`.
If using a domain to access your development server, include it under `server.allowedHosts` in `client/vite.config.ts`.
Then start the frontend with `pnpm dev`.

# Deployment
Create `server/.env.prod` by copying `server/.env.dev` and making appropriate modifications.
The backend can be deployed by running `docker:up:prod`.

The frontend can be built with `pnpm build`. The output will be found in `client/dist` and can be served with any static file server. Ensure calls to `/api` are forewarded to the backend server port configured in `server/.env.prod`
