# EA1 Site — Project Context

## What This Is
Marketing site for **Everybody At Once (EA1)**, an audience strategy agency built on a specific insight: audiences are networks of participation. Founded by Kenyatta Cheese, Kevin Slavin, and Molly Templeton. Live at **https://ea1.co** via Vercel, deployed from **github.com/ea1co/website**.

### Positioning (as of April 2026)
The site leads with worldview, not services. EA1 wins work through referrals, not inbound discovery — the site confirms why EA1 is different for people already in conversation. Three principles (Your audience has an audience / Enable fans to be better fans / Audiences are networks of participation) and one framework (LASO: Listen, Amplify, Support, Organize) are the structural foundation. Services are embedded throughout the copy rather than listed separately. See `CHANGELOG.md` for strategic reasoning behind copy decisions.

## Site Architecture

### Pages
- `index.html` — Homepage (hero GIF, approach cards, work grid, team preview, clients, footer). Has Organization JSON-LD structured data.
- `team.html` — Full team page with bios, "Our Network" collaborators statement, and pets ("Support Staff")
- `work.html` — Work index (grid of case study cards)
- `work-*.html` — 9 individual case study pages (BBC America, Doctor Who, Killing Eve, KQED, Netflix, Orphan Black, Searchlight, Serial Box, Wonderstruck)
- `labs.html` — EA1 Labs page (philosophy, tool directory, category claim). Has ResearchProject JSON-LD, screenshot lightbox for Murmur. This is the clearest articulation of the agency-intelligence-cognition thesis.

### CSS (loaded in this order, later overrides earlier)
- `styles.css` — Shared styles for all pages (nav, footer, team grid 3-col, support grid, bio overlays, hamburger breakpoint at 480px, etc.)
- `index.css` — Homepage-only overrides (hero, approach grid 4-col, team grid 4-col for homepage preview, work grid, clients)
- `work.css` — Work page-specific styles
- `labs.css` — Labs page styles (philosophy layout, tool grid, lightbox)
- `quiz.css` — Contact quiz overlay styles

### JavaScript (all loaded with `defer`)
- `nav.js` — **Shared nav include.** Injects nav HTML via `insertAdjacentHTML('afterbegin')`. Handles hamburger toggle, active page detection, and `document.fonts.ready` body fade-in. Nav items are defined in a `NAV_ITEMS` array at the top of the file. Approach is commented out. Newsletter links to Substack.
- `footer.js` — **Shared footer include.** Same injection pattern as nav.js. Social icons: Instagram, Facebook, X, LinkedIn, Substack. All SVG, standardized sizing.
- `quiz.js` — Contact quiz overlay ("My Robot Legs"). Loads questions/pitches/scoring from JSON. BuzzFeed-style point scoring determines which pitch the user sees. Submits to `/api/submit-contact` (Vercel) or `submit-contact.php` (shey.net). Has spam protection: honeypot field, timing check (5s minimum), and email format validation.
- `parallax.js` — Shared parallax effects. Hero text parallax on homepage (GIF does NOT parallax — user explicitly wants it to never be covered). Scroll-reveal fade-in on sections, cards, headings. Respects `prefers-reduced-motion`.

### Data Files (JSON — editable by hand)
- `team-data.json` — All team members and pets. Team sorted by **last name** alpha, pets by **first name** alpha. Fields: name, title, image, bio, linkedin (null if none). The team page (`team.html`) builds all cards dynamically from this file.
- `quiz-questions.json` — Quiz questions and answer options. Each option has a `value` (short key) and `label` (display text).
- `quiz-pitches.json` — Pitch variants shown after quiz. Each has id, heading, body.
- `quiz-scoring.json` — Point-scoring matrix. Each answer distributes points across pitch types. Highest score wins; ties broken by array order in `pitchIds`.

### Backend
- `api/submit-contact.js` — Vercel serverless function. Receives quiz submissions via POST JSON. Sends email to `hello@ea1.co` (collaborative inbox) via Resend. Includes full quiz Q&A text and pitch result.
- `submit-contact.php` — Legacy shey.net version. Same submission format, sends to `hello@ea1.co` via PHP mail. Also logs to `contact-submissions.csv` on the server.

### SEO & Structured Data
- `robots.txt` — Explicitly allows all crawlers including AI (GPTBot, ClaudeBot, Google-Extended, PerplexityBot, Applebot-Extended).
- All pages have `<meta description>`, Open Graph, and Twitter Card tags.
- `index.html` has Organization JSON-LD (principles, founders, service types).
- `labs.html` has ResearchProject JSON-LD (tools, philosophy, category thesis) plus HTML comment "liner notes" addressing both LLMs and source-reading humans.
- Structured data is written with personality — valid Schema.org but carrying EA1's voice and principles. This is deliberate.

## Hosting & Deployment

### Vercel (live)
- **Domain:** ea1.co (DNS via Cloudflare, proxied to Vercel)
- **Repo:** github.com/ea1co/website (public, auto-deploys on push to main)
- `api/submit-contact.js` — Vercel serverless function using Resend (requires `RESEND_API_KEY` env var)
- Pushes to `main` auto-deploy in ~30 seconds

### Legacy: shey.net (cPanel)
- Previous test build location. No longer actively used.
- FTP user: `claude@shey.net` (password in separate context file)

## Key Design Decisions
- **No inline styles.** All CSS in external stylesheets.
- **Nav and footer are JS includes** so they only need updating in one place (nav.js, footer.js).
- **Bio overlays** on team cards: blue (#0094C6 at 90% opacity) overlay on hover. On touch devices (`@media (hover: none)`), tap to reveal — name/title/linkedin hide when bio is active to prevent overlap.
- **Pet bios** use same overlay pattern as team bios, slightly smaller font on mobile (0.7em).
- **Hero GIF** (`EA1-Design_Animation_v002.gif`) is the transparent version. The old one (`v007`) was white-on-red with CSS transforms to recolor — that code has been removed.
- **Client logos** have hover resize effect (scale on hover, shrink others).
- **Hamburger menu** appears at `max-width: 480px`.

## Images
- Team headshots: `images/{firstname}-{lastname}.jpg` (or .webp/.png)
- Pet photos: `images/pet-{name}.jpg` (or .png)
- Hero GIF: `images/EA1-Design_Animation_v002.gif` (transparent, current)
- Client logos: `images/clients/` directory
- Work case study images: `images/work/` directory
- Quiz shiba: `images/quiz-shiba.png`
- Labs screenshot: `images/labs-reddit-listening.png` (Murmur tool screenshot, used in lightbox and as OG image)

## Common Tasks

### Add a team member
1. Add their headshot to `images/` as `{firstname}-{lastname}.jpg`
2. Add an entry to `team-data.json` in the `team` array (alphabetical by last name)
3. `git add` both files, commit, and push

### Add a pet
1. Add photo to `images/` as `pet-{name}.jpg`
2. Add entry to `team-data.json` in the `pets` array (alphabetical by first name)
3. `git add` both files, commit, and push

### Edit team bios/titles/photos
Team members submit requests in the **#website** Slack channel. Kenyatta reviews with Claude, then pushes changes. Edit `team-data.json` and/or replace the image file in `images/`.

### Edit quiz questions/answers
Edit `quiz-questions.json`. If you add/remove options, update `quiz-scoring.json` to include scoring for the new values.

### Change nav items
Edit the `NAV_ITEMS` array at the top of `nav.js`.

### Update footer social links
Edit `footer.js`.

### Deploy changes
```bash
git add <files> && git commit -m "message" && git push
```
Vercel auto-deploys from main in ~30 seconds.
