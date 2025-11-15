# Deployment Guide - Wage Tracker

**Production URLs:**
- Frontend: https://wage-tracker-delta.vercel.app
- Backend: https://wage-tracker-backend.onrender.com

---

## 🚀 Quick Start

This application is configured for automatic deployment on push to GitHub:
- **Vercel** automatically deploys the frontend
- **Render** automatically deploys the backend using `render.yaml`

---

## 📋 Prerequisites

### Required Services:
1. **GitHub Account** - For code repository
2. **Vercel Account** - For frontend hosting
3. **Render Account** - For backend hosting
4. **Neon Database** - PostgreSQL database (already configured)
5. **Groq Account** - For AI Assistant (optional but recommended)

---

## 🔧 Backend Deployment (Render)

### Initial Setup:

1. **Connect Repository:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select branch: `main` or your deployment branch

2. **Configure Service:**
   - Name: `wage-tracker-backend`
   - Runtime: `Node`
   - Build Command: `cd apps/backend && yarn install --frozen-lockfile && yarn tsc`
   - Start Command: `cd apps/backend && yarn start:prod`
   - Plan: Free (or choose paid plan for better performance)

3. **Set Environment Variables:**

   The `render.yaml` file contains most configurations, but you need to manually set:

   **Required:**
   - `GROQ_API_KEY` - Get from https://console.groq.com/keys
     ```
     Go to Render Dashboard → Your Service → Environment
     Add new variable:
       Key: GROQ_API_KEY
       Value: [your-groq-api-key]
     ```

   **Already Configured in render.yaml:**
   - `NODE_ENV=production`
   - `PORT=3000`
   - `FRONTEND_URL=https://wage-tracker-delta.vercel.app`
   - `DATABASE_URL` (Neon PostgreSQL connection string)
   - `JWT_SECRET` (auto-generated)
   - `JWT_REFRESH_SECRET` (auto-generated)
   - `GROQ_MODEL=llama-3.3-70b-versatile`

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Monitor the logs for any errors
   - Service will be live at: https://wage-tracker-backend.onrender.com

### Verify Backend Deployment:

```bash
# Check if API is responding
curl https://wage-tracker-backend.onrender.com/api/health

# Expected response: 200 OK
```

---

## 🎨 Frontend Deployment (Vercel)

### Initial Setup:

1. **Connect Repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select branch: `main` or your deployment branch

2. **Configure Project:**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)

3. **Set Environment Variables:**

   Go to Project Settings → Environment Variables:
   
   ```env
   VITE_API_URL=https://wage-tracker-backend.onrender.com/api
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy
   - Service will be live at: https://wage-tracker-delta.vercel.app

### Verify Frontend Deployment:

1. Visit: https://wage-tracker-delta.vercel.app
2. Check browser console for errors
3. Test login/registration flow
4. Verify API calls are reaching backend

---

## 🔐 Security Configuration

### CORS Setup:

The backend is configured to accept requests from:
```
FRONTEND_URL=https://wage-tracker-delta.vercel.app
```

If you deploy to a different domain, update this in:
- `apps/backend/.env` (for local development)
- Render Dashboard → Environment Variables (for production)

### JWT Secrets:

Render auto-generates secure JWT secrets. These are used for:
- `JWT_SECRET` - Access token signing
- `JWT_REFRESH_SECRET` - Refresh token signing

**Never commit actual secrets to the repository!**

---

## 🗄️ Database Configuration

### Neon PostgreSQL:

Connection string is already configured in `render.yaml`:
```
postgresql://neondb_owner:npg_fpo1bYjlQK7a@ep-jolly-sun-a1ptgjch-pooler.ap-southeast-1.aws.neon.tech/wage-tracker-db?sslmode=require&channel_binding=require
```

The database is hosted on Neon's free tier in Singapore (ap-southeast-1).

### Database Migrations:

TypeORM automatically syncs the database schema. For production, consider:
```bash
# Generate migrations (run locally)
cd apps/backend
npm run typeorm migration:generate -- -n MigrationName

# Run migrations
npm run typeorm migration:run
```

---

## 🤖 AI Assistant Configuration

The AI Assistant uses Groq AI with the Llama 3.3 model.

### Get Groq API Key:

1. Visit https://console.groq.com
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create API Key"
5. Copy the key
6. Add to Render Dashboard → Environment Variables

### Without API Key:

The app will work without Groq API key, but the AI Assistant will show:
```
"AI Assistant is not configured. Please contact the administrator."
```

---

## 🔄 Continuous Deployment

### Auto-Deploy on Push:

Both services are configured for automatic deployment:

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Vercel** automatically builds and deploys frontend (takes ~2 minutes)
3. **Render** automatically builds and deploys backend (takes ~5 minutes)

### Monitoring Deployments:

- **Vercel**: Dashboard → Deployments
- **Render**: Dashboard → Your Service → Events

---

## 📊 Post-Deployment Checklist

### Immediate Verification:

- [ ] Frontend loads at https://wage-tracker-delta.vercel.app
- [ ] Backend responds at https://wage-tracker-backend.onrender.com/api
- [ ] No console errors on page load
- [ ] Can register a new user
- [ ] Can log in
- [ ] Can create a job
- [ ] Can add work entry
- [ ] Clock in/out works
- [ ] Analytics dashboard loads
- [ ] Dark mode toggle works
- [ ] Language switcher works (EN/VN)

### Performance Testing:

```bash
# Run Lighthouse audit
lighthouse https://wage-tracker-delta.vercel.app --view

# Target scores:
# - Performance: > 80
# - Accessibility: > 90
# - Best Practices: > 90
# - SEO: > 90
```

---

## 🐛 Troubleshooting

### Frontend Issues:

**Issue**: Blank page or "Network Error"
- **Check**: Browser console for errors
- **Solution**: Verify VITE_API_URL is correct in Vercel environment variables

**Issue**: CORS errors
- **Check**: Network tab in browser devtools
- **Solution**: Verify FRONTEND_URL in Render matches your actual frontend URL

### Backend Issues:

**Issue**: 502 Bad Gateway
- **Check**: Render logs for build/startup errors
- **Solution**: Verify build command completed successfully

**Issue**: Database connection errors
- **Check**: Render logs for "Connection refused" or "ECONNREFUSED"
- **Solution**: Verify DATABASE_URL is correct and Neon database is running

**Issue**: AI Assistant not working
- **Check**: "AI Assistant is not configured" message
- **Solution**: Set GROQ_API_KEY in Render environment variables

---

## 📈 Monitoring & Maintenance

### Log Monitoring:

**Render Logs:**
```bash
# View via Dashboard
Render Dashboard → Your Service → Logs

# Or use CLI
render logs -s wage-tracker-backend
```

**Vercel Logs:**
```bash
# View via Dashboard  
Vercel Dashboard → Your Project → Logs

# Or use CLI
vercel logs
```

### Health Checks:

Set up monitoring services (recommended):
- **Uptime Robot** - Free tier: https://uptimerobot.com
- **Pingdom** - Basic monitoring: https://www.pingdom.com
- **Render's built-in health checks** - Already configured

---

## 🔄 Rollback Procedure

If deployment fails:

### Frontend (Vercel):

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

### Backend (Render):

1. Go to Render Dashboard → Events
2. Find the last successful deployment
3. Click "Redeploy" on that commit

Or revert via Git:
```bash
git revert HEAD
git push origin main
```

---

## 📝 Environment Variables Reference

### Backend (Render):

| Variable | Value | Source |
|----------|-------|--------|
| NODE_ENV | production | render.yaml |
| PORT | 3000 | render.yaml |
| FRONTEND_URL | https://wage-tracker-delta.vercel.app | render.yaml |
| DATABASE_URL | postgresql://... | render.yaml |
| JWT_SECRET | [auto-generated] | Render |
| JWT_REFRESH_SECRET | [auto-generated] | Render |
| JWT_ACCESS_EXP | 15m | render.yaml |
| JWT_REFRESH_EXP | 30d | render.yaml |
| GROQ_API_KEY | [set manually] | Render Dashboard |
| GROQ_MODEL | llama-3.3-70b-versatile | render.yaml |

### Frontend (Vercel):

| Variable | Value | Source |
|----------|-------|--------|
| VITE_API_URL | https://wage-tracker-backend.onrender.com/api | Vercel Dashboard |

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Frontend is accessible and loads without errors
- ✅ Users can register and log in
- ✅ Users can create jobs and work entries
- ✅ Analytics dashboard displays charts
- ✅ Dark mode works
- ✅ Language switching works
- ✅ No console errors in browser
- ✅ API calls complete successfully
- ✅ Mobile responsive design works

---

## 📞 Support

For issues:
1. Check Render/Vercel logs first
2. Review this documentation
3. Check `PHASE_IMPLEMENTATION_STATUS.md`
4. Review `RENDER_SETUP.md` for Groq configuration

---

**Last Updated**: November 15, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
