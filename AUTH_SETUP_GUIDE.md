# Authentication Production Setup Guide

This guide outlines the steps to configure Google and GitHub Login (NextAuth.js) for your live website, **tokensense-ai.com**.

## 1. Google Cloud Console Configuration
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select your existing one.
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Select **Web application** as the application type.
6. **Name:** Tokensense Production
7. **Authorized JavaScript origins:**
   - `http://localhost:3000` (for testing)
   - `https://www.tokensense-ai.com`
8. **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google` (for testing)
   - `https://www.tokensense-ai.com/api/auth/callback/google`
9. Click **Create** and copy your **Client ID** and **Client Secret**.

## 2. GitHub Developer Settings Configuration
1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. **Application name:** Tokensense-Ai
4. **Homepage URL:** `https://www.tokensense-ai.com`
5. **Authorization callback URL:**
   - `http://localhost:3000/api/auth/callback/github` (for testing)
   - `https://www.tokensense-ai.com/api/auth/callback/github`
6. Click **Register application**.
7. Copy your **Client ID** and generate a new **Client Secret**.

## 3. Generate a NextAuth Secret
For security, you need a long random string for `NEXTAUTH_SECRET`. You can generate one by running this in your terminal:
```bash
openssl rand -base64 32
```
*Note: Save this safely; do not share it.*

## 4. Configure Production Environment Variables
On your hosting provider (e.g., Netlify or Vercel), add the following environment variables:

| Variable | Value |
| :--- | :--- |
| `NEXTAUTH_URL` | `https://www.tokensense-ai.com` |
| `NEXTAUTH_SECRET` | *(The string you generated in step 3)* |
| `GOOGLE_CLIENT_ID` | *(From Google Cloud Console)* |
| `GOOGLE_CLIENT_SECRET` | *(From Google Cloud Console)* |
| `GITHUB_ID` | *(From GitHub Developer Settings)* |
| `GITHUB_SECRET` | *(From GitHub Developer Settings)* |

### Netlify Specific Steps:
1. Log in to your [Netlify Dashboard](https://app.netlify.com).
2. Select your project: **tokensense-ai**.
3. Go to **Site configuration** > **Environment variables**.
4. Click **Add a variable** > **Add a single variable**.
5. Enter the Key (e.g., `GITHUB_ID`) and the Value.
6. Repeat for all variables in the table above.
7. Go to **Deploys** and click **Trigger deploy** > **Clear cache and deploy site** for the changes to take effect.

## 5. Implementation Steps in Code
1. Install NextAuth: `npm install next-auth`
2. Create the API route: `src/app/api/auth/[...nextauth]/route.ts`
3. Wrap your application with the `<SessionProvider>` in `src/app/layout.tsx`.
4. Use the `signIn()` and `signOut()` hooks in your login components.

## 6. Deployment
After setting the environment variables in your hosting dashboard:
1. Push your code changes to GitHub.
2. The site will automatically redeploy with the new auth capabilities.
