# Authentication Production Readiness Checklist

You are moving to production! To ensure Google and GitHub sign-ins work on **tokensense-ai.com**, you must update these settings in your provider consoles and Netlify.

## 1. Google Cloud Console Checklist
Go to the [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).

*   **Authorized JavaScript origins:**
    - [ ] `https://www.tokensense-ai.com` (Add this)
    - [ ] `http://localhost:3000` (Optional: keep for testing)
*   **Authorized redirect URIs:**
    - [ ] `https://www.tokensense-ai.com/api/auth/callback/google` (Add this)
    - [ ] `http://localhost:3000/api/auth/callback/google` (Optional: keep for testing)

## 2. GitHub Developer Settings Checklist
Go to your [GitHub OAuth App settings](https://github.com/settings/developers).

*   **Homepage URL:**
    - [ ] Change to `https://www.tokensense-ai.com`
*   **Authorization callback URL:**
    - [ ] Change to `https://www.tokensense-ai.com/api/auth/callback/github`
    - [ ] (If you want to keep testing locally, you may need a separate "Dev" OAuth App for `localhost:3000`)

## 3. Netlify Environment Variables Checklist
Go to your [Netlify Site Configuration](https://app.netlify.com).

*   [ ] **NEXTAUTH_URL**: Set to `https://www.tokensense-ai.com`
*   [ ] **NEXTAUTH_SECRET**: Ensure this is a long random string.
*   [ ] **GOOGLE_CLIENT_ID**: Your production ID.
*   [ ] **GOOGLE_CLIENT_SECRET**: Your production secret.
*   [ ] **GITHUB_ID**: Your production ID.
*   [ ] **GITHUB_SECRET**: Your production secret.

## 4. Verification Step
1.  Push your changes to GitHub.
2.  Wait for Netlify to finish the deploy.
3.  Go to `https://www.tokensense-ai.com/login` and try both sign-in buttons.

**Common Error:** If you see "Redirect URI Mismatch," it means the URI sent by the app (e.g., `https://www.tokensense-ai.com/api/auth/callback/google`) doesn't exactly match one of the URIs in your Google/GitHub console.
