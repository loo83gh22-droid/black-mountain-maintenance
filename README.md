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
Edit `index.html` or `style.css`, then:
```bash
git add .
git commit -m "describe your change"
git push origin master
```
Vercel auto-deploys within ~60 seconds. No other steps needed.

---

## How the Site Works

| File | What it does |
|------|-------------|
| `index.html` | All page content — hero, services, about, testimonials, contact, footer |
| `style.css` | All styles and responsive layout |
| `script.js` | Nav scroll effect + contact form AJAX submission |
| `vercel.json` | Vercel config (clean URLs, no trailing slashes) |
| `logo-white.png` | Logo used in nav and footer |
| `logo-mountain.png` | Mountain-only logo used in About section |

## Site Structure

```
/ (index.html)
├── Nav
├── Hero
├── Services (8 cards, 3-col grid)
├── About (Rob's story + credentials)
├── Testimonials (3 reviews + Facebook link)
├── Contact (phone card + Web3Forms contact form)
└── Footer (logo, copyright, phone, email, Facebook icon)
```

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
- **Location:** Kelowna, BC (Black Mountain)
