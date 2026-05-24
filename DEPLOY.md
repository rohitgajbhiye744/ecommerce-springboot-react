# 🚀 Deployment Guide — TiDB Cloud (DB) + Render (Backend) + Vercel (Frontend)

**100% Free Forever. No credit card required. No expiry.**

| Layer | Service | URL |
|-------|---------|-----|
| 🗄️ Database | TiDB Cloud Serverless | https://tidbcloud.com |
| ☕ Backend | Render | https://render.com |
| ⚛️ Frontend | Vercel | https://vercel.com |

---

## Prerequisites

- [ ] GitHub account with this repo pushed (public recommended)
- [ ] Sign up at https://tidbcloud.com (free, no credit card)
- [ ] Sign up at https://render.com (free, use GitHub login)
- [ ] Sign up at https://vercel.com (free, use GitHub login)

---

## STEP 1 — Push latest code to GitHub

Make sure all changes are committed and pushed:

```bash
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

---

## STEP 2 — Set up Free MySQL Database on TiDB Cloud

TiDB Cloud Serverless is 100% MySQL-compatible — **zero code changes** needed.

1. Go to https://tidbcloud.com → **Sign up** (free, no credit card)
2. Click **"Create Cluster"** → Select **"Serverless"** (free tier)
3. Choose any region → click **"Create"**
4. Wait ~30 seconds for cluster to be ready
5. Click on your cluster → **"Connect"** button
6. Select:
   - Connect With: **General**
   - Operating System: **Windows**
7. Note down these values shown on screen:

   ```
   Host:     gateway01.xxxx.prod.aws.tidbcloud.com
   Port:     4000
   User:     xxxxxxxx.root
   Password: (click "Generate Password" and copy it)
   Database: test
   ```

8. Click **"SQL Editor"** tab → run this to create your database:
   ```sql
   CREATE DATABASE IF NOT EXISTS Ecommerce_db;
   ```

9. Build your DB_URL from these values:
   ```
   jdbc:mysql://<Host>:<Port>/Ecommerce_db?sslMode=VERIFY_IDENTITY
   ```
   Example:
   ```
   jdbc:mysql://gateway01.us-east-1.prod.aws.tidbcloud.com:4000/Ecommerce_db?sslMode=VERIFY_IDENTITY
   ```


   <!-- jdbc:mysql://2sJYMrM4LTnzesc.root:1KnK3ydg5fqKUWX2@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/Ecommerce_db?sslMode=VERIFY_IDENTITY -->

> ⚠️ TiDB Cloud **requires SSL** — the `?sslMode=VERIFY_IDENTITY` part is mandatory.

---

## STEP 3 — Deploy Spring Boot Backend on Render (via Docker)

> ℹ️ Render removed native Java support. We use **Docker** instead — a `Dockerfile` has already been added to the `backend/` folder and Render will auto-detect it.

1. Go to https://render.com → **Sign up with GitHub**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo → select your forked `ecommerce-springboot-react`
4. Fill in the settings:

   | Setting | Value |
   |---------|-------|
   | **Name** | `ecommerce-backend` |
   | **Root Directory** | `backend` |
   | **Runtime** | **`Docker`** ← select this (NOT Java) |
   | **Instance Type** | `Free` |

   > Render will auto-detect the `Dockerfile` inside `backend/` — no Build/Start command needed.

5. Scroll to **"Environment Variables"** → add these:

   | Key | Value |
   |-----|-------|
   | `DB_URL` | `jdbc:mysql://<TiDB Host>:4000/Ecommerce_db?sslMode=VERIFY_IDENTITY` |
   | `DB_USERNAME` | your TiDB username (e.g. `xxxxxxxx.root`) |
   | `DB_PASSWORD` | your TiDB password |
   | `ALLOWED_ORIGIN` | `https://your-app.vercel.app` *(fill after Step 4)* |

6. Click **"Create Web Service"**
7. Render will build your Docker image (~5-8 minutes first time — it's downloading Java + building)
8. Once deployed, copy your URL: `https://ecommerce-backend.onrender.com`

> ✅ Test: Open `https://ecommerce-backend.onrender.com/products` in browser — you should see your product list (may take 30s to wake up on first visit)

> ⚠️ **Cold Start Warning**: Render free tier sleeps after 15 min of no traffic. First request after sleeping takes ~30 seconds to wake up. This is normal for a portfolio project.

---

## STEP 4 — Deploy React Frontend on Vercel

1. Go to https://vercel.com → **Sign up with GitHub**
2. Click **"New Project"** → Import your GitHub repo
3. Fill in settings:

   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `frontend` |
   | **Framework Preset** | Vite (auto-detected) |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

4. Scroll to **"Environment Variables"** → add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_BASE_URL` | `https://ecommerce-backend.onrender.com` |

5. Click **"Deploy"** — Vercel builds in ~1 minute
6. Copy your Vercel URL: `https://your-app.vercel.app`

---

## STEP 5 — Update CORS on Render Backend

Now that you have your Vercel URL, go back to Render:

1. Open your backend service → **"Environment"** tab
2. Update `ALLOWED_ORIGIN` with your exact Vercel URL:
   ```
   ALLOWED_ORIGIN=https://your-app.vercel.app
   ```
3. Click **"Save Changes"** → Render will auto-redeploy

---

## STEP 6 — Update `.env.production` and push

Open `frontend/.env.production` and set the real Render URL:

```env
VITE_API_BASE_URL=https://ecommerce-backend.onrender.com
```

Push the change so Vercel auto-redeploys:
```bash
git add frontend/.env.production
git commit -m "chore: set production Render backend URL"
git push origin main
```

Vercel will detect the push and redeploy automatically (~1 min).

---

## ✅ Final Verification Checklist

| Test | Expected Result |
|------|----------------|
| Open `https://your-app.vercel.app` | Homepage loads |
| Click Products | Products load from TiDB Cloud via Render |
| Sign Up | New user created in TiDB Cloud |
| Sign In | Login works |
| Add to Cart | Cart updates |
| Place Order | Order is saved |

---

## 📤 Share with Recruiters

Just send them **one link**:
```
https://your-app.vercel.app
```

**That's it.** Free forever. Full stack. Recruiter-ready. 🎉

---

## 🔧 Troubleshooting

### Products not loading (CORS error in browser console)?
- Make sure `ALLOWED_ORIGIN` in Render exactly matches your Vercel URL
- No trailing slash: ✅ `https://xxx.vercel.app` ❌ `https://xxx.vercel.app/`

### Render build fails?
- Check build logs — make sure Root Directory is `backend`
- Make sure Build Command is `./mvnw clean package -DskipTests`

### TiDB connection refused?
- Make sure you included `?sslMode=VERIFY_IDENTITY` in the DB_URL
- Double-check username and password

### Render is slow to respond?
- This is normal on the free tier — it wakes from sleep in ~30 seconds
- You can add a note to recruiters: *"First load may take 30s as the free server wakes up"*

---

## 💡 Tips for Recruiters

Add this to your GitHub README:

```markdown
## 🌐 Live Demo
🔗 **[View Live App](https://your-app.vercel.app)**

> Note: Backend is hosted on Render free tier — first load may take ~30 seconds to wake up.

**Tech Stack:** React • Spring Boot • MySQL (TiDB Cloud) • Vercel • Render
```
