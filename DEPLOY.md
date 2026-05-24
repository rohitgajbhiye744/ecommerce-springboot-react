# 🚀 Deployment Guide — Railway (Backend) + Vercel (Frontend)

This guide deploys your Spring Boot + MySQL backend to **Railway** and your React frontend to **Vercel**, both for free.

---

## Prerequisites

- [ ] A **GitHub account** with this repo pushed (public or private)
- [ ] Sign up at https://railway.app (use GitHub login — free)
- [ ] Sign up at https://vercel.com (use GitHub login — free)

---

## STEP 1 — Push latest code to GitHub

Make sure all your latest changes are committed and pushed:

```bash
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

---

## STEP 2 — Deploy MySQL on Railway

1. Go to https://railway.app → **New Project**
2. Click **"Deploy a template"** → search **MySQL** → click **Deploy**
3. Wait for the MySQL service to start (green status)
4. Click on the MySQL service → go to **Variables** tab
5. Note down these values (you'll need them in Step 3):
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

6. Go to **Query** tab in Railway MySQL → run this to create your database table schema:
   ```sql
   CREATE DATABASE IF NOT EXISTS Ecommerce_db;
   ```
   Railway uses the database name from `MYSQLDATABASE` — make sure it matches.

---

## STEP 3 — Deploy Spring Boot Backend on Railway

1. In the same Railway project → click **"+ New Service"** → **"GitHub Repo"**
2. Select your `ecommerce-springboot-react` repo
3. Railway will auto-detect it's a Maven project and start building

4. Go to the backend service → **Variables** tab → Add these environment variables:

   | Variable | Value |
   |----------|-------|
   | `DB_URL` | `jdbc:mysql://<MYSQLHOST>:<MYSQLPORT>/Ecommerce_db` |
   | `DB_USERNAME` | `<MYSQLUSER>` (from Step 2) |
   | `DB_PASSWORD` | `<MYSQLPASSWORD>` (from Step 2) |
   | `ALLOWED_ORIGIN` | `https://your-app.vercel.app` *(fill in after Step 4)* |

5. Go to **Settings** tab → set **Root Directory** to `backend`
6. Railway will build and deploy. Wait for green status.
7. Click **"Generate Domain"** under the Networking section
8. Copy your backend URL — it looks like: `https://backend-production-xxxx.up.railway.app`

> ✅ Test it: Open `https://your-backend.railway.app/products` in browser with `Role: USER` header — you should see your product list.

---

## STEP 4 — Deploy React Frontend on Vercel

1. Go to https://vercel.com → **New Project** → Import your GitHub repo
2. Set **Root Directory** to `frontend`
3. Framework preset will auto-detect **Vite**
4. Under **Environment Variables**, add:

   | Variable | Value |
   |----------|-------|
   | `VITE_API_BASE_URL` | `https://your-backend.railway.app` *(your Railway backend URL from Step 3)* |

5. Click **Deploy** — Vercel builds and deploys in ~1 minute
6. Copy your Vercel URL — it looks like: `https://your-app.vercel.app`

---

## STEP 5 — Update CORS on Railway Backend

Now that you have the Vercel URL, go back to Railway:

1. Open your backend service → **Variables** tab
2. Update `ALLOWED_ORIGIN` to your exact Vercel URL:
   ```
   ALLOWED_ORIGIN=https://your-app.vercel.app
   ```
3. Railway will auto-redeploy the backend with the new CORS setting.

---

## STEP 6 — Update `.env.production` in your repo

Open `frontend/.env.production` and replace the placeholder:

```env
VITE_API_BASE_URL=https://your-backend.railway.app
```

Push the change:
```bash
git add frontend/.env.production
git commit -m "chore: set production API URL"
git push origin main
```

Vercel will auto-redeploy the frontend.

---

## ✅ Final Verification

| Check | URL |
|-------|-----|
| Frontend live | `https://your-app.vercel.app` |
| Backend API | `https://your-backend.railway.app/products` |
| Sign up works | Register a new user on the live site |
| Products load | Product list shows from Railway MySQL |
| Cart works | Add a product to cart |

---

## 📤 Share with Recruiters

Just send them your **Vercel URL**:
```
https://your-app.vercel.app
```

That's it! The full stack (React → Spring Boot → MySQL) is live on the internet. 🎉

---

## 🔧 Troubleshooting

**Products not loading on live site?**
- Check browser console for CORS errors
- Make sure `ALLOWED_ORIGIN` in Railway matches your exact Vercel URL (no trailing slash)

**Railway build fails?**
- Check build logs — usually a missing `JAVA_HOME` or Maven wrapper issue
- Make sure Root Directory is set to `backend`

**Vercel build fails?**
- Check build logs — usually a missing env var
- Make sure Root Directory is set to `frontend`
