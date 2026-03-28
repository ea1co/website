# EA1 Site — Project Context

## What This Is
Marketing site for **Everybody At Once (EA1)**, a social media agency. Currently hosted as a test build at **https://shey.net/ea1/** via FTP. Will eventually move to **Vercel**.

## Site Architecture

### Pages
- `index.html` — Homepage (hero GIF, approach cards, work grid, team preview, clients, footer)
- `team.html` — Full team page with bios + pets ("Support Staff")
- `work.html` — Work index (grid of case study cards)
- `work-*.html` — 9 individual case study pages (BBC America, Doctor Who, Killing Eve, KQED, Netflix, Orphan Black, Searchlight, Serial Box, Wonderstruck)

### CSS (loaded in this order, later overrides earlier)
- `styles.css` — Shared styles for all pages (nav, footer, team grid 3-col, support grid, bio overlays, hamburger breakpoint at 480px, etc.)
- `index.css` — Homepage-only overrides (hero, approach grid 4-col, team grid 4-col for homepage preview, work grid, clients)
- `work.css` — Work page-specific styles
- `quiz.css` — Contact quiz overlay styles

### JavaScript (all loaded with `defer`)
- `nav.js` — **Shared nav include.** Injects nav HTML via `insertAdjacentHTML('afterbegin')`. Handles hamburger toggle, active page detection, and `document.fonts.ready` body fade-in. Nav items are defined in a `NAV_ITEMS` array at the top of the file. Approach is commented out. Newsletter links to Substack.
- `footer.js` — **Shared footer include.** Same injection pattern as nav.js. Social icons: Instagram, Facebook, X, LinkedIn, Substack. All SVG, standardized sizing.
- `quiz.js` — Contact quiz overlay ("My Robot Legs"). Loads questions/pitches/scoring from JSON. BuzzFeed-style point scoring determines which pitch the user sees. Submits to `submit-contact.php`.
- `parallax.js` — Shared parallax effects. Hero text parallax on homepage (GIF does NOT parallax — user explicitly wants it to never be covered). Scroll-reveal fade-in on sections, cards, headings. Respects `prefers-reduced-motion`.

### Data Files (JSON — editable by hand)
- `team-data.json` — All team members and pets. Team sorted by **last name** alpha, pets by **first name** alpha. Fields: name, title, image, bio, linkedin (null if none). The team page (`team.html`) builds all cards dynamically from this file.
- `quiz-questions.json` — Quiz questions and answer options. Each option has a `value` (short key) and `label` (display text).
- `quiz-pitches.json` — Pitch variants shown after quiz. Each has id, heading, body.
- `quiz-scoring.json` — Point-scoring matrix. Each answer distributes points across pitch types. Highest score wins; ties broken by array order in `pitchIds`.

### Backend
- `submit-contact.php` — Receives quiz submissions via POST JSON. Sends email to `tim@ea1.co` with full question/answer text and pitch result. Also logs to `contact-submissions.csv` on the server.

## Hosting & Deployment

### Current: shey.net (cPanel)
- Host: shey.net / cPanel at bluesky.entirelydigital.com
- FTP user: `claude@shey.net` (password in separate context file)
- FTP root = `public_html/` (don't include "public_html" in paths)
- Upload command: `curl -s --ftp-pasv -T localfile ftp://shey.net/ea1/remote-path --user "claude@shey.net:PASSWORD"`
- Test URL: https://shey.net/ea1/

### Future: Vercel
- HTML/CSS/JS works as-is
- `submit-contact.php` will need rewrite as Node.js serverless function (use Resend or SendGrid for email)
- CSV logging would move to Vercel Postgres or similar
- May add Sanity CMS for content management (access control, revision history, media uploads)

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

## Common Tasks

### Add a team member
1. Add their headshot to `images/`
2. Add an entry to `team-data.json` in the `team` array (alphabetical by last name)
3. Upload both files via FTP

### Add a pet
1. Add photo to `images/` as `pet-{name}.jpg`
2. Add entry to `team-data.json` in the `pets` array (alphabetical by first name)
3. Upload both files via FTP

### Edit quiz questions/answers
Edit `quiz-questions.json`. If you add/remove options, update `quiz-scoring.json` to include scoring for the new values.

### Change nav items
Edit the `NAV_ITEMS` array at the top of `nav.js`.

### Update footer social links
Edit `footer.js`.

### Upload changes to test server
```bash
curl -s --ftp-pasv -T filename ftp://shey.net/ea1/filename --user "claude@shey.net:PASSWORD"
```
