# Google OAuth Setup Guide

This guide walks you through creating Google OAuth credentials for the Reupenny Life app.

## Error You're Seeing

```
Access blocked: Authorization Error
Error 401: invalid_client
The OAuth client was not found.
```

**Cause**: The `.env` file has a placeholder Client ID instead of real credentials.

---

## Step-by-Step Setup

### 1. Go to Google Cloud Console

1. Visit [console.cloud.google.com](https://console.cloud.google.com/)
2. Sign in with your Google account (use **sfg.miller.reupenny@gmail.com** or the account that will manage this app)

### 2. Create or Select a Project

**Option A: Create New Project**
1. Click the project dropdown (top left, next to "Google Cloud")
2. Click **New Project**
3. Name it: `Reupenny Life` (or your preferred name)
4. Click **Create**
5. Wait for project creation (~30 seconds)
6. Select the new project from the dropdown

**Option B: Use Existing Project**
1. Select your existing project from the dropdown

### 3. Enable Google+ API

1. In the search bar at the top, search for **"Google+ API"** or **"People API"**
2. Click on it
3. Click **Enable**

### 4. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen** (left sidebar)
2. Select **External** (unless you have a Google Workspace)
3. Click **Create**

Fill in the form:
- **App name**: `Reupenny Life Agency`
- **User support email**: Your email (e.g., sfg.miller.reupenny@gmail.com)
- **Developer contact**: Same email
- Leave other fields as default
- Click **Save and Continue**

**Scopes**: Click **Save and Continue** (we'll use default scopes)

**Test users** (Important!):
1. Click **Add Users**
2. Add these emails:
   - `sfg.miller.reupenny@gmail.com`
   - `sfg.seta.reupenny@gmail.com`
   - Any other admin/test accounts
3. Click **Save and Continue**
4. Click **Back to Dashboard**

### 5. Create OAuth Client ID

1. Go to **APIs & Services** → **Credentials** (left sidebar)
2. Click **+ Create Credentials** (top)
3. Select **OAuth client ID**

Configure:
- **Application type**: **Web application**
- **Name**: `Reupenny Life Web Client` (or any name)

**Authorized JavaScript origins**:
Click **+ Add URI** and add:
- `http://localhost:3003` (for local dev)
- `http://localhost:3000` (backup)
- Your production domain when ready (e.g., `https://yourdomain.com`)

**Authorized redirect URIs**:
Leave empty for now (not needed for Google Sign-In button)

Click **Create**

### 6. Copy Your Client ID

A popup will show:
- **Client ID**: Long string ending in `.apps.googleusercontent.com`
- **Client secret**: You don't need this for frontend OAuth

**Copy the Client ID** to your clipboard

### 7. Update Your .env File

1. Open `/Users/momdad/windsurf_reupennylife_app/reupennylife/.env`
2. Find the line:
   ```env
   VITE_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
   ```
3. Replace with your actual Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID="123456789-abcdefghijk.apps.googleusercontent.com"
   ```
4. Save the file

### 8. Restart Your Dev Server

In the terminal where the dev server is running:
1. Press `Ctrl+C` to stop it
2. Run: `npm run dev`
3. Refresh your browser

### 9. Test the Login

1. Go to http://localhost:3003
2. Try logging in with `sfg.miller.reupenny@gmail.com`
3. Should work now! ✅

---

## Troubleshooting

### "Access blocked: This app's request is invalid"
- Check that JavaScript origins include `http://localhost:3003`
- Make sure you copied the entire Client ID (no spaces/line breaks)

### Still getting 401 error
- Verify the Client ID in `.env` matches exactly what's in Google Cloud Console
- Restart the dev server after updating `.env`
- Clear browser cache or try incognito mode

### "This app is blocked"
- Make sure your email is added as a test user in OAuth consent screen
- App is in "Testing" mode, which is correct for development

### Publishing the app (later)
When ready for production:
1. Go to **OAuth consent screen**
2. Click **Publish App**
3. May need to go through verification if requesting sensitive scopes

---

## Quick Reference

**Client ID format**: `############-################################.apps.googleusercontent.com`

**Where to find it later**:
Google Cloud Console → APIs & Services → Credentials → Your OAuth 2.0 Client ID

---

## Security Notes

- ✅ Client ID is safe to expose in frontend code (it's public)
- ❌ Never commit `.env` to git (already in `.gitignore`)
- ✅ Client Secret is NOT needed for frontend Google Sign-In
- ✅ Add authorized origins for each domain where app runs

---

## Next Steps After OAuth Works

1. Set up Supabase (see `SUPABASE_SETUP.md`)
2. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Run database migrations
4. Configure Gemini API if using AI features
