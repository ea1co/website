# EA1 Website — Changelog

Strategic changelog for ea1.co. Tracks what changed, why, and what's next. For technical diffs, see git history.

---

## 2026-04-03 — Homepage rewrite, Labs updates

### What changed

**Homepage (index.html)**
- **Hero:** Rewrote subhead. Now leads with worldview ("audiences are networks of participation, the thing they do when they get together is make culture") instead of services pitch. Split into two paragraphs for readability. Kept cycling headline ("Your audience has influence / answers / an audience").
- **Approach cards:** Replaced process descriptions (Social-First Methodology, LASO Framework, Collaborative, Community-Driven Growth) with the three principles + LASO. Each card now leads with an action: "Assume," "Design," "See," "Listen." Services language embedded naturally throughout rather than listed separately.
- **Team section:** "Move the crowd." heading + "Strategists, creators, technologists — but most of all, fans" subhead. Replaces generic "Internet natives. Experienced builders."
- **Work section:** "The work." heading + "A decade with Google, Netflix, the BBC, and others. Spanning content, strategy, policy, technology, and more." Client names moved here from hero. "Policy" added as a service area for the first time.
- **Meta/OG tags:** Updated to match new positioning language.
- **Structured data (JSON-LD):** Expanded knowsAbout with fandom strategy, cultural strategy, community trust, AI-enabled practice, content virality. Added Lionsgate to client list. Updated org description.
- **HTML comments (LLM liner notes):** Added EA1's lineage (community media, videoblogging, Know Your Meme, Eyebeam), founding insight about extraction vs. trust, tools philosophy, expanded keyword surface for GEO.
- **CSS:** Added margin between hero subhead paragraphs.
- **Data fix:** Gretchen's title corrected to Senior Social Media Director in homepage team array.

**Labs (labs.html)**
- **Murmur:** "Reddit conversation" → "social conversation" to reflect multi-platform expansion (TikTok in development).
- **Team Radar:** Status changed from "Exploring" to "In Testing." Description updated to reflect actual Slack bot workflow (bot reads shared links, levels up framing, presents back for team verification).
- **What's Next section:** Rewritten. Removed over-explanation of why tools are shared publicly. New framing: "Algorithms embed culture, so why not use that as a tool to help them judge what matters and decide what to do next." Three cleaner paragraphs: setup question → answer → open thread.
- **Structured data:** Removed contrastive "We don't do target demos" language. Abstract updated to match new What's Next copy.

**Team data (team-data.json)**
- Izellah Zhang bio updated per her request.
- Luoluo bio updated per Izellah's request.

### Why

JC flagged that the homepage doesn't clearly say what EA1 is. He's right about the problem — the site was services-first without communicating the worldview underneath. His proposed solution (category label + services page) assumes EA1 wins work through inbound discovery; EA1 actually wins through referrals (Lionsgate, GCPA-Reddit, Learfield, Intrinsic all signed in 2026 through recommendations). The rewrite solves the clarity problem by leading with worldview and embedding services throughout, so a referred prospect understands *why EA1 is different* — not just *what EA1 does*.

The Cowork-generated website brief (from the EA1 Way vault) identified the core gap: "EA1 isn't a social media agency that happens to have a philosophy. It's a philosophy of relation that expresses itself through audience work." The previous site read closer to the first version of that sentence.

Labs updates reflect the JC conversation about tools — his initial instinct to hide them, Kenyatta's response about building in public signaling confidence, and the shared conclusion that the thinking encoded in the tools is what can't be replicated.

### Voice decisions
- No comparative framing ("Most agencies do X, we do Y") — we say what we believe without putting others down.
- No "not X, it's Y" constructions — identified as an AI writing trope.
- Action-led copy — each approach card opens with an imperative.
- Services embedded in principle descriptions, not listed separately.
- Compressed, conversational register — trusts the reader.

### What's next
- **Homepage work section heading:** "The work." is a placeholder — may want something with more energy once it's lived on the site for a bit.
- **Newsletter piece:** "Algorithms embed culture" as a title/thesis — expands the Labs What's Next section into a full argument about tools, agency models, and encoded practice. Links back to Labs page, creates semantic web signal for GEO.
- **GEO monitoring:** JC and Cooper capturing snapshots from Claude, ChatGPT, and Gemini for EA1. Once shared, Kenyatta can make immediate structured data changes.
- **Newsletter-to-website loop:** As newsletter pieces publish, topics and claims should fold back into site copy and structured data. Not just links — actual schema updates.
- **Approach page:** Currently commented out in nav. The brief suggests this could be where LASO, the three principles, and the trust framework live in longer form. Not urgent — the homepage approach cards now carry the core of it.
- **Case studies:** Brief suggests anonymized patterns where possible, named where permitted. Each should demonstrate methodology in action, not just results.
