# ZERO TRACE — Find what they left behind.

> **Cybersecurity research:** Malware analysis, reverse engineering, OSINT & threat intelligence.

---

## 🔍 Overview

**ZERO TRACE** is an interactive web showcase and repository for in-depth malware analysis field notes, reverse engineering breakdowns, threat intelligence correlation, and open-source intelligence (OSINT).

Every attack leaves evidence — we trace it from initial unknown indicator to complete actor attribution.

---

## 🚀 Features

- **Interactive Evidence Orbit:** Explore how a single indicator (IP, Domain, Certificate, Hash, Campaign, Malware) pivots into complete threat actor attribution.
- **Particle Vortex Canvas:** Dynamic background simulation matching the visual branding.
- **Deep Case Files:** Dedicated research reports on malware loaders, ransomware, backdoors, and process injection techniques.
- **Open Intelligence Tools:** Direct access to open-source security intelligence tools (**Friday**, **simi**, **Griffin**).

---

## 📁 Repository Structure

```
.
├── index.html                            # Main landing page
├── styles.css                            # Zero Trace custom dark theme & design system
├── script.js                             # Interactive canvas, particle vortex, scroll animations & orbit
├── logo.png                              # Zero Trace logo artwork
├── cases/                                # Interactive HTML case files & reverse engineering reports
│   ├── DCRat Breaking the Mirror.html
│   ├── Risen_ransomeware_doxwarepdf.html
│   ├── emotet blog.html
│   ├── process_injection explained.html
│   └── sarwent.html
├── .gitignore                            # Git ignore directives
└── .nojekyll                             # GitHub Pages Jekyll bypass flag
```

---

## 💻 Local Development / Preview

No complex build pipeline required. Simply serve using any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node / npx
npx serve .
```

Open `http://localhost:8000` in your browser.

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, select **Source: Deploy from a branch**.
4. Choose `main` branch and `/ (root)` folder, then click **Save**.
5. Your site will be live at `https://<username>.github.io/<repository-name>/`.

---

© 2026 ZERO TRACE · Cyber Intelligence
