# Black Mountain Maintenance — Website

Live site: **https://blackmountainmaintenance.ca**

---

## Account Recovery Cheatsheet

If you lose your computer or need to set this up from scratch, here's everything you need.

### Accounts to log into

| Service | URL | Login |
|---------|-----|-------|
| GitHub (code) | github.com | username: `loo83gh22-droid` |
| Vercel (hosting) | vercel.com | Log in with GitHub |
| Namecheap (domain) | ap.www.namecheap.com | username: `Waterloo1983` |
| Web3Forms (contact form) | web3forms.com | Log in with Google (waterloo1983hawk22@gmail.com) |
| Facebook page | facebook.com | Log in with Facebook account |

### Key details

- **Domain:** blackmountainmaintenance.ca (registered on Namecheap, renews May 31 each year)
- **Email forwarding:** rob@blackmountainmaintenance.ca → waterloo1983hawk22@gmail.com (set up in Namecheap)
- **Web3Forms access key:** `dc515cb0-6e2f-4fb7-90a9-3d7b40827418`
- **Facebook page:** https://www.facebook.com/profile.php?id=61589719342274
- **DNS records on Namecheap:**
  - A record: `@` → `216.150.1.1`
  - CNAME: `www` → `5f8b58982f01acb2.vercel-dns-016.com`

---

## Get Back Up and Running (New Computer)

### 1. Install tools
- Git: https://git-scm.com
- VS Code: https://code.visualstudio.com
- Claude Code: https://claude.ai/code

### 2. Clone the repo
```bash
git clone https://github.com/loo83gh22-droid/black-mountain-maintenance.git
cd black-mountain-maintenance
```

### 3. Make changes and deploy
The pages are generated. Edit the sources, rebuild, then push:
```bash
node build.js
git add .
git commit -m "describe your change"
git push origin master
```
Vercel auto-deploys within ~60 seconds. Never edit the generated `.html` files directly; `node build.js` overwrites them.

---

## How the Site Works

| File | What it does |
|------|-------------|
| `site.config.js` | **Business facts**: phone, email, service areas, reply time, seasonal note, credential flags, capability PDF. Credential lines only show when their flag is `true`; empty links are hidden. |
| `src/layout.html` | Shared head, nav, footer and mobile call bar |
| `src/pages/*.html` | Page content: home, strata, residential, about, service-area, contact |
| `src/partials/cta-band.html` | Closing "Now booking" band reused on several pages |
| `src/data/reviews.json` | Approved review snippets. Empty list hides the reviews section. |
| `build.js` | Generates the six `.html` pages, `sitemap.xml` and `robots.txt` from the above. No dependencies. |
| `style.css` | All styles and responsive layout |
| `script.js` | Nav, scroll reveal, mobile menu, quote form (pre-selects `?type=`, validates, sends via Web3Forms) |
| `vercel.json` | Clean URLs (`/strata-property-managers` serves `strata-property-managers.html`) |
| `.vercelignore` | Keeps `src/`, `build.js` and the config off the public site |

## Site Structure

| Route | Page |
|---|---|
| `/` | Home: hero, trust strip, services preview, how it works, before & after, reviews, CTA |
| `/strata-property-managers` | Strata & Property Managers (main revenue page) |
| `/residential` | Residential services + seasonal note |
| `/about` | About |
| `/service-area` | Service area list from config |
| `/contact` | Request a Quote form (`?type=strata`, `residential` or `commercial` pre-selects property type) |

## Deployment Pipeline

```
You edit files locally
    → git push to GitHub
        → Vercel detects push
            → Auto-builds and deploys
                → Live at blackmountainmaintenance.ca (~60s)
```

---

## Content Reference

The original professionally written copy for this site is in:
`Black_Mountain_Maintenance_Website_Content.docx`

Back this file up to Google Drive or email it to yourself — it is not stored in this repo.

---

## Contact Info on Site

- **Phone:** 780-972-4848
- **Email:** rob@blackmountainmaintenance.ca
- **Location:** Kelowna, BC
