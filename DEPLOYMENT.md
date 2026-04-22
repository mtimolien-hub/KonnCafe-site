# KonnCafe — Deployment Guide
## GitHub Pages + NameCheap Custom Domain

---

## Overview

This guide walks through deploying your KonnCafe Next.js site as a **static export**
to GitHub Pages and pointing your NameCheap domain to it.

> **Why static export?** GitHub Pages serves static files only. Next.js can export
> a fully static build via `next export` (or `output: 'export'` in v13+), which
> produces a plain `/out` folder ready for any static host.

---

## Prerequisites

| Tool           | Version | Notes                                    |
|----------------|---------|------------------------------------------|
| Node.js        | ≥ 18    | LTS recommended                          |
| npm / yarn     | any     | Included with Node                       |
| Git            | any     | Must be authenticated with GitHub        |
| GitHub account | —       | Free tier works                          |
| NameCheap domain | —    | e.g. `konncafe.com`                      |

---

## Step 1 — Configure Next.js for Static Export

Edit (or create) **`next.config.js`** in the project root:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",          // Emit static files to /out
  trailingSlash: true,       // Required for GitHub Pages routing
  images: {
    unoptimized: true,        // next/image optimization needs a server; disable for static
  },
  // Only needed if deploying to a sub-path (e.g. github.io/repo-name/)
  // basePath: "/konncafe",
  // assetPrefix: "/konncafe/",
};

module.exports = nextConfig;
```

> ⚠️ If you are using a **custom domain** (konncafe.com), leave `basePath` and
> `assetPrefix` commented out. Only uncomment them for the `username.github.io/repo`
> pattern without a custom domain.

---

## Step 2 — Add a Build + Export Script

In **`package.json`**, confirm these scripts exist:

```json
"scripts": {
  "dev":    "next dev",
  "build":  "next build",
  "start":  "next start",
  "export": "next build"
}
```

> In Next.js 13+, `next build` with `output: 'export'` in `next.config.js`
> automatically produces the `/out` folder. No separate `next export` command needed.

Run it locally to verify:

```bash
npm run build
# You should now see an /out directory with your static files.
```

---

## Step 3 — Add the CNAME File

GitHub Pages needs a `CNAME` file in the root of the published branch to serve
your custom domain. Place it in the **`/public`** folder so Next.js copies it
into `/out` automatically:

```bash
echo "konncafe.com" > public/CNAME
```

> Use your bare domain (`konncafe.com`), not `www.konncafe.com`. GitHub Pages
> will redirect www automatically once DNS is configured.

---

## Step 4 — Create the GitHub Repository

1. Go to [github.com/new](https://github.com/new).
2. Name it **`konncafe`** (or `konncafe.com`).
3. Set visibility to **Public** (required for free GitHub Pages).
4. Do **not** initialise with a README if you already have local files.

---

## Step 5 — Push Your Code

```bash
# In your project root
git init
git remote add origin git@github.com:YOUR_USERNAME/konncafe.git
git add .
git commit -m "chore: initial KonnCafe site"
git branch -M main
git push -u origin main
```

---

## Step 6 — Set Up GitHub Actions for Automated Deployment

Create **`.github/workflows/deploy.yml`**:

```yaml
name: Deploy KonnCafe to GitHub Pages

on:
  push:
    branches: [main]          # Deploy on every push to main
  workflow_dispatch:           # Allow manual deploys

permissions:
  contents: read
  pages:    write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build (static export)
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out          # Next.js static export target

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Commit and push:

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deployment workflow"
git push
```

Go to **GitHub → Repo → Actions** and watch the workflow run. ✅ means it deployed.

---

## Step 7 — Enable GitHub Pages in Repo Settings

1. **Repo → Settings → Pages**.
2. Under **Build and deployment**, set Source to **"GitHub Actions"**.
3. GitHub will display the live URL (e.g. `https://yourusername.github.io/konncafe`).

---

## Step 8 — Add Your Custom Domain in GitHub Pages

Still in **Repo → Settings → Pages**:

1. Under **Custom domain**, type `konncafe.com`.
2. Click **Save**.
3. Check **"Enforce HTTPS"** (appears after DNS propagates — ~30 min to 48 hrs).

GitHub will create / verify a `CNAME` file in your `gh-pages` branch automatically,
but because we added `public/CNAME` in Step 3 it will never be lost on re-deploy.

---

## Step 9 — Configure DNS in NameCheap

### 9a — Log in to NameCheap

1. Go to [namecheap.com](https://namecheap.com) → Dashboard → **Manage** on `konncafe.com`.
2. Click the **Advanced DNS** tab.

### 9b — Add GitHub Pages A Records (Apex / Root domain)

Delete any existing A records for `@`, then add all four:

| Type | Host | Value           | TTL       |
|------|------|-----------------|-----------|
| A    | @    | 185.199.108.153 | Automatic |
| A    | @    | 185.199.109.153 | Automatic |
| A    | @    | 185.199.110.153 | Automatic |
| A    | @    | 185.199.111.153 | Automatic |

> These are GitHub's official Pages IPs (stable as of 2024). Verify at:
> https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

### 9c — Add a CNAME Record for www

| Type  | Host | Value                          | TTL       |
|-------|------|--------------------------------|-----------|
| CNAME | www  | YOUR_USERNAME.github.io        | Automatic |

Replace `YOUR_USERNAME` with your actual GitHub username.

### 9d — Remove Conflicting Records

NameCheap sometimes adds a default `CNAME` for `www` pointing to `parkingpage.namecheap.com`. Delete it.

### 9e — Save and Wait

DNS changes propagate within **30 minutes to 48 hours**. You can monitor propagation at
[dnschecker.org](https://dnschecker.org/#A/konncafe.com).

---

## Step 10 — Verify & Enable HTTPS

Once DNS has propagated:

1. Return to **GitHub → Repo → Settings → Pages**.
2. The **"DNS check successful"** badge should appear next to your domain.
3. Check **"Enforce HTTPS"** to force SSL.

GitHub Pages provides a free TLS certificate via Let's Encrypt — no setup required.

---

## Environment Variables (Optional)

For any API keys (e.g. Shopify Storefront, email service):

```bash
# In GitHub: Repo → Settings → Secrets and variables → Actions → New secret
NEXT_PUBLIC_SHOPIFY_DOMAIN=konncafe.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxx
```

Reference them in your code as `process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN`.

Add to the workflow YAML under the build step:

```yaml
      - name: Build (static export)
        run: npm run build
        env:
          NEXT_PUBLIC_SHOPIFY_DOMAIN: ${{ secrets.NEXT_PUBLIC_SHOPIFY_DOMAIN }}
          NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: ${{ secrets.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN }}
```

---

## Deployment Checklist

- [ ] `next.config.js` has `output: "export"` and `trailingSlash: true`
- [ ] `public/CNAME` contains `konncafe.com`
- [ ] GitHub Actions workflow at `.github/workflows/deploy.yml`
- [ ] GitHub Pages source set to **"GitHub Actions"** in repo settings
- [ ] Custom domain `konncafe.com` entered in GitHub Pages settings
- [ ] Four A records + one www CNAME added in NameCheap Advanced DNS
- [ ] DNS propagated (verified via dnschecker.org)
- [ ] "Enforce HTTPS" checked in GitHub Pages settings
- [ ] Site loads at `https://konncafe.com` ✅

---

## Useful Commands

```bash
npm run dev          # Local dev server at localhost:3000
npm run build        # Build + static export → /out
npx serve out        # Preview the /out folder locally before deploying
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| 404 on page refresh | Confirm `trailingSlash: true` in `next.config.js` |
| Images broken | Confirm `images: { unoptimized: true }` in `next.config.js` |
| CNAME deleted after deploy | Ensure `public/CNAME` exists in source (not just in the gh-pages branch) |
| Domain not verified | Wait up to 48 hrs; verify A records match GitHub's IPs exactly |
| HTTPS unavailable | Must wait for DNS verification before GitHub issues the TLS cert |
| Build fails in Actions | Check Node version matches local; run `npm ci` not `npm install` in CI |

---

*KonnCafe — Crafted in Connecticut, USA.*
