# GangDev — AI Development Instructions

Reference this file before making changes to any part of the GangDev project.

---

## Core Principles

### 1. Zero Redundancy
- **Never** hardcode a value that already exists in a shared file.
- If a value appears in more than one place, extract it to a single source of truth.
- Prefer shared/global files over page-specific duplicates.
- Before creating a new file or function, check if one already serves the purpose.

### 2. Shared Architecture

| Layer | Path | Purpose |
|-------|------|---------|
| Cross-product shared | `shared/php/` | Foundation used by ALL products (db, mailer, versions, init_base) |
| GangDev platform | `main/src/` | CSS, JS, PHP used by all gangdev.co pages |
| Per-product | `candor/`, `dcops/`, `lafter/`, etc. | Product-specific code only |

**Rule:** If it's used by more than one product → `shared/`. If it's used by more than one gangdev.co page → `main/src/`. Otherwise → page-local.

### 3. Version Numbers
- **Single source:** `shared/php/versions.php` — the `$VERSIONS` array.
- Loaded globally via `init_base.php`. Available as `$VERSIONS['product_name']` in any PHP file.
- When bumping a version: edit `shared/php/versions.php` ONLY.
- Each product versions independently (candor, crust, inspectre, etc. do NOT have to match gangdev).

### 4. Updates Page
- Located at `main/updates/index.php`.
- **Every significant change** should be logged here under the current version slide.
- Use existing product block structure and tags: `feat`, `fix`, `infra`.
- Version numbers in product banners come from `$VERSIONS` — do not hardcode.

---

## File Structure

```
GangDev/
├── main/           ← gangdev.co (served from /var/www/gangdev/main/)
│   ├── src/        ← shared CSS, JS, PHP for gangdev.co pages
│   ├── account/    ← login, signup, profile
│   ├── crust/      ← game engine + servers
│   ├── updates/    ← changelog page
│   ├── gaming/     ← gaming hub
│   ├── people/     ← team pages
│   └── ...
├── candor/         ← candor.you
├── dcops/          ← dcops.co
├── inspectre/      ← inspectre.link
├── lafter/         ← lafter.gg
├── serided/        ← serided.ai
├── creodin/        ← creodin
├── onlyfansies/    ← onlyfansies
└── shared/         ← truly cross-product only
    ├── php/
    │   ├── init_base.php    ← foundation (session, dotenv, db, versions)
    │   ├── db.php           ← PDO PostgreSQL connection
    │   ├── mailer.php       ← PHPMailer sendMail()
    │   ├── email.php        ← branded HTML email builder
    │   ├── versions.php     ← product version numbers
    │   └── product_switch.php
    ├── docs/                ← ToS, privacy policy
    └── .env                 ← secrets (server-only, gitignored)
```

---

## Server Environment

- **Server:** Vultr VPS, Ubuntu, IP 144.202.95.1
- **Web:** Apache2 with Let's Encrypt SSL for all subdomains
- **DB:** PostgreSQL (schemas: `gangdev`, `candor`, `dcops`)
- **Node:** PM2 for Crust game servers (ports 10000-10002)
- **Paths:** Server root is `/var/www/gangdev/`, use absolute paths in `require_once`
- **Deploy:** Git push to master → pull on server

---

## Coding Standards

### PHP
- All files use `require_once` with absolute server paths: `/var/www/gangdev/...`
- Database queries use PDO prepared statements.
- `init_base.php` sets `search_path TO gangdev, public` — unqualified table names resolve to `gangdev.*`.
- Product init files (e.g. `candor/src/php/init.php`) extend `init_base.php`.

### CSS
- Global site font: `Nunito` (loaded in navbar.css).
- Each product has its own brand font — use it consistently.
- Site color palette: `#2B5C6E` (teal), `#1D3A4D` (navy), `#70838F` (slate), `#ECEFF1` (light).
- Use `var(--scaling)` for responsive sizing (defined in `main/src/css/style.css`).

### JavaScript
- Crust engine uses ES modules (`"type": "module"` in package.json) — always include `.js` extensions in imports.
- Each Node project gets its own `package.json` + `node_modules/`. No shared global Node deps.

### Assets
- Subdomain-served pages reference shared assets via absolute URLs: `https://gangdev.co/src/...`
- Same-domain pages use relative paths.

---

## Security Checklist

- `.env` blocked via Apache config + `.htaccess`
- All credentials in `.env` only — never in code
- Prepared statements for all DB queries
- No `display_errors` in production (fix pending)
- Password reset tokens should be signed (fix pending)
- CSRF protection needed (pending)

---

## When Making Changes

1. Check if the change touches shared infrastructure → update `shared/` if so.
2. Log significant changes in `main/updates/index.php` under the current version.
3. If you bump a version → update `shared/php/versions.php`.
4. Run an anti-redundancy check: is there anything hardcoded that should be shared?
5. Test with absolute server paths — relative paths break across subdomains.
6. Never send git commands — they run automatically.
