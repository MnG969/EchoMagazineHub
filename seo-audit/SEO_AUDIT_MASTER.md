# Echo Magazine — Full SEO Audit (Master Report)

**Property:** https://www.echomagazine.com.tr/
**Local source:** `C:\Desktop\echo\EchoMagazineHub`
**Audit date:** 19 October 2026
**Mode:** read-only. No site files were modified.
**Supporting deep-dives:**
- [`technical-seo.md`](./technical-seo.md) — crawl, indexation, performance, headers, deployment, 24 findings
- [`onpage-content-seo.md`](./onpage-content-seo.md) — metadata, content, E-E-A-T, schema, AI search, 25 findings

---

## 1. Verdict

**SEO health: 27 / 100.** The design and editorial voice are strong; the search foundation is not built yet.

The site is technically live, fast at the edge, and fully indexable — but search engines are being given three contradictory signals:

1. **Every URL that does not exist returns HTTP 200 with the homepage.** There is no 404 on the property.
2. **The sitemap advertises 1 of 12 pages**, and `robots.txt` is not a robots file at all.
3. **The flagship product — three magazine issues, 191 pages — is images only**, with zero text, zero alt text and 9–70 MB per issue.

Nothing here is a penalty. Everything is fixable. But until discovery and content extraction are fixed, on-page tuning will not move rankings.

| Area | Score | One-line assessment |
|---|---:|---|
| Crawlability & indexation | 2/10 | Soft 404 everywhere, no real robots.txt, 1-URL sitemap |
| Technical foundations | 5/10 | HTTPS, redirects, compression and edge speed are good; asset/cache config is not |
| Mobile | 6/10 | Responsive and CLS-safe; tap targets and text too small, images oversized |
| Core Web Vitals (lab) | 5/10 | LCP < 1.3 s on text pages, but 3.7 MB homepage and a loader that hides content 4–9.5 s |
| On-page metadata | 3/10 | 3 pages with no description, 8 with no canonical, weekly titles are serial numbers |
| Content depth | 3/10 | Mean 442 words per weekly; 2 thin pages; issue content invisible to crawlers |
| Structured data | 0/10 | Zero JSON-LD on 12 pages |
| E-E-A-T | 3/10 | Real authors, but no author pages, no dates, 47 broken portraits, 1 external citation |
| AI search readiness | 2/10 | GPTBot/ClaudeBot/CCBot blocked; image-only issue pages cannot be cited |
| **Overall** | **27/100** | Strong product, missing distribution layer |

**Indexation snapshot (directional, DuckDuckGo — Google data MISSING):** 8 of 12 URLs were found in the index (`/`, `/weekly/`, issue-01, W002–W006). Not found: W001, W007, issue-02, issue-03. This is consistent with a 1-URL sitemap and slow discovery, not with a manual action.

---

## 2. Scope and evidence

| Item | Detail |
|---|---|
| Pages audited | 12 indexable HTML pages + verification file |
| Crawl client | `curl` for status/headers/redirects; Playwright/Chromium for rendered DOM, network bytes, LCP/CLS |
| Viewports | Desktop 1440×900; mobile 390×844, DPR 3, touch |
| Throttling | 9 Mbps down / 1.5 Mbps up / 150 ms RTT, 4× CPU slowdown |
| Caching | Browser cache disabled; cold runs |
| Search data | GSC, keyword volumes, rankings, backlinks, CrUX = **MISSING** |
| AI crawler test | 12 user agents tested against a real article URL |

Lab numbers are single-run, single-location. Items that could not be verified are marked **MISSING**, not estimated.

---

## 3. Site inventory

| # | URL | Type | Words | Title | Description | Canonical | JSON-LD |
|---|---|---|---:|---|---|---|---|
| 1 | `/` | Hub | 735 | 28 ch | 135 ch | ✅ | ❌ |
| 2 | `/weekly/` | Hub | 305 | 22 ch | 71 ch | ❌ | ❌ |
| 3 | `/weekly/W001/` | Article | 776 | 18 ch | 32 ch | ❌ | ❌ |
| 4 | `/weekly/W002/` | Article | 632 | 18 ch | 32 ch | ❌ | ❌ |
| 5 | `/weekly/W003/` | Article | 481 | 18 ch | 40 ch | ❌ | ❌ |
| 6 | `/weekly/W004/` | Article | 550 | 18 ch | 100 ch | ❌ | ❌ |
| 7 | `/weekly/W005/` | Poem | 57 | 18 ch | 23 ch | ❌ | ❌ |
| 8 | `/weekly/W006/` | Article | 376 | 18 ch | 51 ch | ❌ | ❌ |
| 9 | `/weekly/W007/` | Article (TR) | 221 | 18 ch | 35 ch | ❌ | ❌ |
| 10 | `/magazine/issue-01/` | Issue | 15 | 24 ch | 0 ch | ✅ | ❌ |
| 11 | `/magazine/issue-02/` | Issue | 15 | 24 ch | 0 ch | ✅ | ❌ |
| 12 | `/magazine/issue-03/` | Issue | 15 | 24 ch | 0 ch | ✅ | ❌ |

**Structural gaps:** no `/magazine/` hub, no `/about/`, no `/team/`, no `/contact/`, no author pages, no topic hubs, no 404 page, no favicon, no RSS, no `llms.txt`.

---

## 4. Critical findings

### C1. Every missing URL returns 200 + homepage (soft 404)

**Evidence**
```
/this-page-does-not-exist-xyz123  → 200 text/html, 29,559 B, homepage
/robots.txt                       → 200 text/html, 29,559 B, homepage
/favicon.ico                      → 200 text/html, 29,559 B, homepage
/404.html                         → 200 text/html, 29,559 B, homepage
/assets/team/sevval.jpg           → 200 text/html, 29,559 B, homepage
/WEEKLY/W001/ (wrong case)        → 200 text/html, homepage
```
Even `/weekly//W001/` and `/weekly/./W001/` return the article with 200.

**Impact:** infinite duplicate URL space; crawl budget burned; no error signal; external links to dead articles credit the homepage; broken images are served as valid HTML; the site cannot report soft 404s correctly.

**Why:** `wrangler.jsonc` has no `not_found_handling`, and the deployed behaviour does not match the repo config. The likely cause is a dashboard-level route or SPA fallback — **MISSING**, must be checked in Cloudflare.

**Fix**
```jsonc
"assets": {
  "directory": ".",
  "html_handling": "auto-trailing-slash",
  "not_found_handling": "404-page"
}
```
Plus a real `404.html` at the root with `<meta name="robots" content="noindex">` and links to `/`, `/weekly/`, `/magazine/issue-03/`.

**Verify:** `curl.exe -sSI https://www.echomagazine.com.tr/definitely-not-a-page-42` → `HTTP/2 404`.

---

### C2. `robots.txt` is the homepage; no sitemap directive

**Evidence:** `GET /robots.txt` → 200 `text/html`, 29,559 bytes, contains no `User-agent:` or `Sitemap:` line. No `robots.txt` exists in the repo.

**Impact:** unparseable robots file; no sitemap discovery hint; a request for a missing file returns a full page.

**Fix:** ship `/robots.txt` as `text/plain`:
```
User-agent: *
Allow: /

Sitemap: https://www.echomagazine.com.tr/sitemap.xml
```
Do not add `Disallow` rules — nothing needs blocking.

---

### C3. Sitemap lists 1 of 12 indexable URLs

**Evidence:** `/sitemap.xml` = 275 bytes, one `<loc>` for `/`, `lastmod` 2026-07-10. Missing: `/weekly/`, W001–W007, issue-01/02/03.

**Impact:** 11 pages depend entirely on internal links; new issues are discovered late; no `lastmod` signal; contradicts the actual site.

**Fix:** generate the sitemap from the page manifest, include all 12 URLs, use real modification dates, submit in Search Console. Consider a sitemap index once issue article pages exist.

---

### C4. Magazine issues are image-only: 191 images, 0 alt, 15 words

**Evidence**

| Issue | Pages | Weight | `load` | Visible words | Alt text |
|---|---:|---:|---:|---:|---:|
| issue-01 | 30 | 9.4 MB | 7.7 s | 15 | 0 |
| issue-02 | 95 | 58.3 MB | **never (35 s)** | 15 | 0 |
| issue-03 | 66 | 55.4 MB | 16.4 s | 15 | 0 |

Images are 1414×2000 JPEGs displayed at ~520×720 (~7× more pixels than needed). All are injected at once by a JS loop, with no `loading`, `decoding`, `width`/`height` or `alt`.

**Impact:** the publication's flagship content cannot rank, be quoted by AI, be skimmed, or be read by a screen reader. A full crawl moves ~132 MiB of images per pass with 55 characters of text to show for it. Mobile users on limited data cannot read an issue.

**Fix (in order):**
1. Add an HTML layer above/below the flipbook: 150-word issue summary + HTML table of contents (section title, one-line summary, contributor) + 3 text article links.
2. Resize to 1040 px wide, q80, AVIF/WebP with JPEG fallback. Target 80–120 KB/page (2.5–4 MB per issue).
3. Lazy-load every page after the first two; add `width`/`height`; paginate the DOM to 2 pages ahead.
4. Add `alt="Issue 03, page 7: The History of Perfume"`.
5. Publish at least 3 text articles per issue (400–700 words, reused from the magazine copy).

---

### C5. Zero structured data and 8 pages without canonicals

**Evidence:** 0 JSON-LD on 12/12 pages. No canonical on `/weekly/` or W001–W007. Homepage has 3 OG tags and no `og:image`/`og:url`; weekly pages have none.

**Impact:** Google and AI systems cannot identify the organization, blog, authors or issues as entities; duplicate variants are not consolidated; no rich-result eligibility; shares render as bare links.

**Fix:** add `Organization` + `WebSite` on `/`, `Blog` + `ItemList` on `/weekly/`, `BlogPosting` + `BreadcrumbList` on each article, `PublicationIssue` on each issue. Add absolute self-canonicals to the 8 missing pages. Full ready-to-paste JSON-LD is in `onpage-content-seo.md` §6.

---

### C6. AI crawlers are blocked at the edge

**Evidence (verified 2026-10-19)**

| User agent | Status |
|---|---|
| GPTBot (OpenAI training) | **403** |
| ClaudeBot (Anthropic) | **403** |
| CCBot (Common Crawl) | **403** |
| Bytespider (ByteDance) | **403** |
| PerplexityBot | 200 |
| OAI-SearchBot / ChatGPT-User | 200 |
| Googlebot / Bingbot / Google-Extended | 200 |

**Impact:** ChatGPT and Claude cannot fetch Echo pages, so they cannot cite the site. Coverage is partial and accidental. This is a Cloudflare WAF/bot rule, not `robots.txt`.

**Fix:** add a WAF allow rule for **verified** AI bots ahead of the block rule, and require `cf.client.bot` so a spoofed user agent does not inherit it. Re-test with `curl -A`.

---

## 5. High-severity findings

| ID | Finding | Evidence | Fix |
|---|---|---|---|
| H1 | 48 of 53 homepage images are broken | 47 `assets/team/*.jpg` + `assets/hero/about-image.jpg`; all return 29.5 KB HTML; 1.23 MB = 33% of homepage bytes, 60% of requests | Restore portraits at 400×400 WebP (~30–50 KB) with `alt`/dimensions/lazy; or remove the team grid until assets exist |
| H2 | Loader hides content 4.0–9.5 s | Hides on `window.load` + 1200 ms; 4G: load 7.55 s, hidden 9.47 s, interactive 8.78 s | Hide on `DOMContentLoaded` + 2× rAF; 250 ms transition; cap any minimum at 400 ms |
| H3 | Weekly titles are serial numbers | All 7 titles `W00X - Echo Weekly` (18 ch); descriptions 23–100 ch; 0 OG/schema/canonical | Replace with topic-first titles and 140–160 ch descriptions (table below) |
| H4 | Homepage metadata describes a different publication | Description says "culture, design, fashion…"; published content is teen literature, science, culture, world affairs; 0 occurrences of teen/student/writing | Rewrite title/description/H1; add a 60-word "what Echo is" paragraph above the fold |
| H5 | Thin content | W005 57 words; W007 221 (79% quoted); 6/7 articles < 600 words; mean 442 | Expand W005 to 300–500, W007 to 600–800 with <40% quotation, name Dostoevsky in the first sentence |
| H6 | No publication dates | 0 `<time>` elements; 0 `datePublished`/`dateModified`; month only as plain text | Add `<time datetime="YYYY-MM-DD">` and schema dates once exact days are confirmed |
| H7 | Author E-E-A-T not exposed | 5 bylines, no author pages/bios; Vespera (W005) and Ahmet Tuğra Hisar (W006) absent from `team.js`; no `Person` schema | Add both to the masthead or label "Guest contributor"; create author pages; link bylines |
| H8 | Citation poverty | 6/7 articles have no external source; W002 makes an unsourced death claim and says "Canadian-American" | Add a Sources block to every research article; verify the W002 claim |
| H9 | Internal linking starves articles | Homepage links 5 distinct pages; only W007 is featured; 32 same-page anchors; no related/prev-next links | Feature W001/W004/W006 on `/`; add breadcrumbs, related links, prev/next, `/magazine/` hub |
| H10 | Assets effectively uncached | `max-age=14400, must-revalidate` on CSS/JPG; no `HIT` observed; 3 Remixicon versions (`4.3.0`, `4.6.0`, `4`) | Hash filenames + 1-year immutable; pin one Remixicon version or inline SVG |
| H11 | Whole repo is publicly served | `/wrangler.jsonc`, `/README.md`, `.vs/*` (leaks `C:\Users\melek\…`), `slnx.sqlite`, scratch `.txt` | Add `.assetsignore`; verify each returns 404 |

---

## 6. Performance

| Page | Requests | Transfer | TTFB | LCP | CLS | `load` |
|---|---:|---:|---:|---:|---:|---:|
| `/` desktop | 80 | **3.73 MB** | 329 ms | 1.08 s | 0.0007 | 2.81 s |
| `/` mobile 4G throttled | 72 | 3.01 MB | 498 ms | — | — | 7.55 s |
| `/weekly/` | 11 | 951 KB | 518 ms | 1.24 s | 0.001 | 1.98 s |
| `/weekly/W001/` | 12 | 125 KB | 464 ms | 0.87 s | 0.032 | 1.25 s |
| `/magazine/issue-01/` | 30 img | 9.92 MB | 793 ms | — | — | 7.74 s |
| `/magazine/issue-02/` | 95 img | **58.31 MB** | — | — | — | never (35 s) |
| `/magazine/issue-03/` | 66 img | **55.36 MB** | 448 ms | 0.93 s | 0.014 | 16.44 s |

**What is good:** TTFB 313–793 ms; LCP under 1.3 s on text pages; CLS ≈ 0; Brotli; HTTP/2 + HTTP/3; correct single-hop redirects; Brotli-compressed HTML/CSS.

**What is not:** homepage is ~4× a sensible budget; the 48 broken images alone are 1.23 MB; four real covers are 2.44 MB combined and displayed at half their linear size; Remixicon is 166 KB for ~10 icons; fonts total 371 KB across 5 files.

**Biggest perceived-speed issue is the loader, not LCP.** Content is covered for ~4.0 s desktop and ~9.5 s on throttled 4G because the overlay waits for `load` (all 80 requests) plus 1.2 s.

**Magazine savings:** re-encoding tests show 67–96% reduction. A realistic target is 2.5–4 MB per issue, down from 9.4–69.9 MB.

---

## 7. On-page and content

### 7.1 What is genuinely good
- A distinct teen editorial voice, not generic SEO copy.
- Non-obvious topics: Anaximander's *apeiron*, Peter Cullen's voice work, the UN map vote, *White Nights*.
- W001 has real primary-text engagement (DK 12 A 10 / B 1); W006 is sourced and checkable.
- Clean URL structure, unique titles, no keyword stuffing, no noindex accidents.

### 7.2 What blocks ranking
- **No page owns a topic query.** Titles are brand or serial numbers; descriptions are too short to earn clicks.
- **No topic clusters.** 7 articles across literature, philosophy, science, world affairs with no hubs, tags, or cross-links.
- **No dates, sources, or author identities** — three of the strongest trust signals for a publication.
- **Issue pages expose no text** — the flagship content is invisible to search.
- **Analyics missing on the weekly section**, so content performance cannot be measured.

### 7.3 Title / description rewrites

| Page | New title (≤60 ch) | New description (140–160 ch) |
|---|---|---|
| `/` | `Teen Magazine Made by Teens \| Echo Magazine` | `Echo Magazine is an independent teen magazine of literature, science, culture and world affairs. Read every issue and weekly story, written by students.` |
| `/weekly/` | `Echo Weekly: Teen Stories, Essays & Ideas` | `Echo Weekly is the space between issues: short stories, literature essays, poems and personal perspectives written by teen contributors from our team.` |
| issue-01 | `Echo Issue 01: Dreams, Met Gala, F1 & 5G` | `Issue 01 explores dreams, the Met Gala, the Grammys, Rio Carnival, Turkish art music, Formula 1, marine life, 5G and internet privacy through teen eyes.` |
| issue-02 | `Echo Issue 02: String Theory, Myths & Korea` | `Issue 02 covers string theory, the multiverse, South Korea, Sofia Coppola, Victoria's Secret, Greek myth, Deftones, gaming and human evolution.` |
| issue-03 | `Echo Issue 03: Science, Sport & Teen Voices` | `Issue 03 ranges from Marcus Aurelius and the butterfly effect to nuclear sharks, Formula 1, climate change, hip-hop and Olympic history. Written by teens.` |
| W001 | `Anaximander and the Origins of Evolution \| Echo` | `Anaximander proposed apeiron as the source of all things in 610 BC. A teen look at how his ideas anticipate modern evolution and scientific thought.` |
| W002 | `Peter Cullen: The Voice of Optimus Prime \| Echo` | `Peter Cullen turned a few words into Optimus Prime's voice. How the Canadian actor built a hero through restraint, warmth and conviction on screen.` |
| W003 | `If by Rudyard Kipling: A Teen Reading \| Echo` | `Rudyard Kipling's If is a father's advice on patience, risk and integrity. A close reading of the poem's claims, pronouns and limits in four stanzas.` |
| W004 | `The Merchant of Venice: Mercy & Power \| Echo` | `Portia's mercy speech in The Merchant of Venice asks whether justice can be tempered. A teen reading of power, debt and belonging in Venice.` |
| W005 | `Blood: A Poem About Love and Loss \| Echo` | `A short poem about love, grief and the light that stays after loss, written for Echo Weekly by a teen contributor. Read it in under a minute.` |
| W006 | `UN Map Reform: Why Africa Looks Too Small \| Echo` | `The UN has redrawn maps before. Why Africa's size and borders stay distorted, and what a new map reform vote would change for member states.` |
| W007 | `Peki ya Nastenka? Beyaz Geceler'e Bakış \| Echo` | `Dostoyevski'nin Beyaz Geceler'inde Nastenka kimdir? Hayalperestin aşkını, yalnızlığını ve kendi hayatımıza düşen payı okuyoruz. Bir edebiyat okuması.` |

**Homepage H1 fix:** the loader `<h1>Echo</h1>` is decorative. Change it to `<div class="loader__logo" aria-hidden="true">Echo</div>` and make the hero H1 descriptive: `A teen magazine made by teens, for teens.` Keep "Different voices. Different perspectives. One Echo." as a supporting `<p>`.

### 7.4 Copy fixes
`Anaximender` ×3 → `Anaximander`; `aperion` → `apeiron`; `PreSocratic` → `Pre-Socratic`; `Glowes` → `Glows`; `03 Published Issue` → `3 Published Issues`; `All Weeklys` → `All Weekly Stories`; W007 `Hepimizi…` → `Hepimiz…`.

---

## 8. Structured data plan

| Page | Required | Do not add |
|---|---|---|
| `/` | `Organization`, `WebSite`, `CollectionPage` | `SearchAction` (no site search) |
| `/weekly/` | `Blog`, `BreadcrumbList`, `ItemList` | `FAQPage` |
| W001–W007 | `BlogPosting`, `BreadcrumbList`, `Person` | `Review`, `AggregateRating` |
| issue-01/02/03 | `PublicationIssue`, `PublicationVolume`, `BreadcrumbList` | `Article` for the issue, `Book` |
| Author pages (new) | `ProfilePage`, `Person` | `Organization` |

Rules: absolute URLs, shared `@id`s, `datePublished` only when a date is visible, month precision (`2026-09`) until exact days are confirmed, and no markup for URLs that return the soft-404 homepage. Full JSON-LD blocks: `onpage-content-seo.md` §6.

---

## 9. AI search readiness (AEO/GEO) — 2.3/10

| Dimension | Score | Gap |
|---|---:|---|
| Crawl access | 4/10 | GPTBot, ClaudeBot, CCBot, Bytespider blocked |
| Extractable text | 2/10 | Issue pages: 15 words, 191 images |
| Passage-level answers | 3/10 | Narrative openings, no TL;DR, no question H2s |
| Structured data | 0/10 | None |
| Entity clarity | 2/10 | No About/author pages, no Organization schema, one Instagram link |
| Citations | 1/10 | 1 external source across 7 articles |
| Freshness | 3/10 | No dates |
| `llms.txt` | 0/10 | Returns homepage HTML |
| Original information gain | 6/10 | Real teen voice and original essays |

**Minimum viable AI visibility:** allow verified AI crawlers; add an HTML text layer to every issue; open each article with a 40–60 word answer paragraph; add question-form H2s and a 3-bullet key-takeaways block; add sources; publish a real `/llms.txt`.

---

## 10. Prioritised roadmap

### Phase 0 — this week (stop the bleeding)
1. Real `404.html` + `not_found_handling: "404-page"`; audit Cloudflare dashboard for rewrite rules.
2. Ship `robots.txt` (`text/plain` + `Sitemap:`).
3. Regenerate `sitemap.xml` with all 12 URLs; submit in GSC.
4. Add self-referentials to `/weekly/` and W001–W007.
5. Fix the 48 broken images: restore assets or remove the team grid until they exist.
6. Change the loader trigger and its `<h1>`.
7. Replace all 12 titles/descriptions; fix the homepage H1.

**Expected:** 404s correct, 12/12 pages discoverable, 0 broken images, 1.2 MB less per homepage view, content visible ~3 s sooner.

### Phase 1 — weeks 2–4 (payload and signals)
8. Add JSON-LD site-wide + complete OG/Twitter tags.
9. Build the magazine image pipeline (1040 px, q80 AVIF/WebP, lazy-load, dimensions, alt).
10. Add `.assetsignore`; verify `wrangler.jsonc`, `README.md`, `.vs/*` return 404.
11. Remove `index.html` from 98 internal links.
12. Add favicon + manifest.
13. Allow verified AI crawlers at Cloudflare.
14. Add GA4 + Clarity to the weekly template.

**Expected:** homepage ~1.5–2.0 MB / ~27 requests; issue-02 ~3–5 MB; 12/12 pages with schema.

### Phase 2 — months 2–3 (content and authority)
15. HTML table of contents + 150-word summary for every issue.
16. Publish 3 text articles per issue (400–700 words).
17. Author pages with bios and `Person` schema.
18. Expand W005 and W007; add a Sources block to every article.
19. Create `/magazine/`, `/about/`, `/team/`, `/contact/`, `/privacy/`, `/editorial-policy/`.
20. Topic hubs: Literature, Philosophy, Science, Culture, World Affairs.
21. Add related links, prev/next, breadcrumbs, and feature 3 weeklies on `/`.
22. Publish 4–6 new weeklies at 700+ words, answer-first, sourced.
23. Publish one original data piece (teen survey or scene report) for links and citations.

---

## 11. Measurement plan

**Baselines are MISSING.** First task: verify Search Console, export 16 months, and install analytics on the weekly section.

| KPI | Baseline | 90-day target |
|---|---:|---:|
| Pages with canonical | 4/12 | 12/12 + new pages |
| Pages with valid JSON-LD | 0/12 | 12/12 |
| Pages in sitemap | 1/12 | all |
| Weekly articles ≥600 words | 2/7 | 7/7 |
| Articles with ≥1 source | 1/7 | 7/7 |
| Bylines linked to author pages | 0/5 | 5/5 |
| Broken images on `/` | 48 | 0 |
| Verified AI crawlers allowed | 7/12 tested | 12/12 |
| Homepage transfer | 3.73 MB | < 2.0 MB |
| issue-02 transfer | 58.3 MB | < 5 MB |
| Non-brand impressions | MISSING | ≥500/month across weeklies |

**Events to instrument:** `article_view`, `scroll_75`, `source_click`, `author_click`, `issue_open`, `newsletter_signup`, `outbound_click`.

---

## 12. What was not verified (MISSING)

- Google Search Console coverage, impressions, clicks, CTR, crawl stats
- Keyword volumes/difficulty and current rankings
- Organic traffic and engagement (GA4 absent on weekly pages)
- Backlinks and domain authority
- CrUX field data and Lighthouse/PSI scores (API returned 429)
- Cloudflare account rules (WAF, Transform/Redirect/Cache rules, HSTS toggle)
- Server logs
- Exact publication days for dates in schema
- Real identities/bios for Vespera and Ahmet Tuğra Hisar

---

## 13. Bottom line

Echo does not have a "content problem" — it has a **distribution problem created by configuration**. The three fixes that unlock everything else are: make the server return real 404s and a real robots/sitemap set; put text in front of the magazine images; and stop hiding content behind a loader while shipping 48 broken images.

Everything else — schema, titles, clusters, AI crawlers — is then worth doing.
