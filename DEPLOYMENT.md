# Deployment Guide

## Quick Deploy to Vercel (Easiest Method)

### Option 1: One-Click Deploy
Click this button to deploy instantly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sabhji/website-vulnerability-scanner)

### Option 2: Manual Vercel Deployment

1. **Visit Vercel**: Go to https://vercel.com/new
2. **Import Repository**: 
   - Click "Import Git Repository"
   - Paste: `https://github.com/Sabhji/website-vulnerability-scanner`
   - Click "Import"
3. **Configure Project**:
   - Project Name: `website-vulnerability-scanner`
   - Framework Preset: Other
   - Build Command: (leave default)
   - Output Directory: (leave default)
4. **Deploy**: Click "Deploy" button
5. **Done**: Your app will be live in ~2 minutes!

### Option 3: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd website-vulnerability-scanner
vercel --prod
```

## GitHub Actions Auto-Deployment

To enable automatic deployments on every push:

1. **Get Vercel Tokens**:
   ```bash
   vercel login
   vercel link
   ```

2. **Add GitHub Secrets**:
   - Go to: https://github.com/Sabhji/website-vulnerability-scanner/settings/secrets/actions
   - Add these secrets:
     - `VERCEL_TOKEN`: Get from https://vercel.com/account/tokens
     - `VERCEL_ORG_ID`: Found in `.vercel/project.json` after running `vercel link`
     - `VERCEL_PROJECT_ID`: Found in `.vercel/project.json`

3. **Push to main branch** - Auto-deploys! 🚀

## Alternative Platforms

### Heroku
```bash
heroku create website-vuln-scanner
git push heroku main
```

### Railway
```bash
railway login
railway init
railway up
```

### Render
1. Go to https://render.com
2. New > Web Service
3. Connect GitHub repo
4. Deploy

## Environment Variables

No environment variables required for basic functionality!

## Post-Deployment

After deployment, your scanner will be available at:
- Vercel: `https://website-vulnerability-scanner.vercel.app`
- Custom domain: Configure in Vercel dashboard

Test it by scanning: `https://example.com`

## Troubleshooting

**Build fails?**
- Ensure Node.js version is 18+
- Check `package.json` dependencies

**App not loading?**
- Verify `server.js` is the entry point
- Check Vercel logs in dashboard

**Need help?**
- Open an issue: https://github.com/Sabhji/website-vulnerability-scanner/issues
