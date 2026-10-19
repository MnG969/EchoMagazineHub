# SEO Audit — Echo Magazine (Brief)

**Site:** https://www.echomagazine.com.tr/ · **Audited:** 19 Oct 2026 · **Score: 27/100**
Full detail: `SEO_AUDIT_MASTER.md` · Deep-dives: `technical-seo.md`, `onpage-content-seo.md`

---

## What's working
Design, editorial voice and edge speed are good. HTTPS, redirects, Brotli and HTTP/2/3 are correct. Text pages have LCP under 1.3 s and near-zero layout shift. URLs are clean and no page is accidentally blocked.

## The 6 problems that matter

| # | Problem | Evidence | Impact |
|---|---|---|---|
| 1 | **Every missing URL returns 200 + homepage** | `/robots.txt`, `/favicon.ico`, `/anything` → 200 HTML, 29.5 KB, homepage | Infinite duplicate URLs, no error signal, crawl budget burned |
| 2 | **Sitemap lists 1 of 12 pages; `robots.txt` is the homepage** | `sitemap.xml` = 275 B, one URL | 11 pages rely on links alone; slow discovery |
| 3 | **Magazine issues are image-only** | 191 images, 0 alt, 15 visible words, 9.4–69.9 MB per issue | Flagship content cannot rank, be quoted by AI, or be read on mobile data |
| 4 | **48 of 53 homepage images are broken** | Missing `assets/team/*` + `about-image.jpg`; 1.23 MB = 33% of page weight | Broken team section, wasted bytes, slower load |
| 5 | **Loader hides the page 4–9.5 s** | Runs on `load` + 1.2 s; 4G: content hidden 9.47 s | Users see a blank screen long after the page is ready |
| 6 | **No canonicals on 8 pages, no schema anywhere, weekly titles are serial numbers** | `W001 - Echo Weekly` ×7; 0 JSON-LD on 12 pages; 3 issue pages have no meta description | Weak snippets, no entity signals, duplicate variants |

Also: GPTBot/ClaudeBot/CCBot get **403** (ChatGPT and Claude can't cite the site), GA4 is missing on the weekly section, and issue-03 shows "1 / 95" while it has 66 pages.

---

## 7-day fix list (highest return)

1. Add `not_found_handling: "404-page"` + a real `404.html`; check Cloudflare for a rewrite rule forcing 200s.
2. Ship a real `robots.txt` (`text/plain` + `Sitemap:` line).
3. Regenerate `sitemap.xml` with all 12 URLs and submit in Search Console.
4. Add self-canonicals to `/weekly/` and W001–W007.
5. Fix the 48 broken images — restore the portraits or hide the team grid until they exist.
6. Change the loader to hide on `DOMContentLoaded` (250 ms transition).
7. Replace all 12 titles/descriptions (ready to paste in the master report) and fix the homepage double H1.

**Expected result:** 404s correct, all pages discoverable, 1.2 MB less per homepage view, content visible ~3 s sooner.

---

## Next 30 days
Schema (`Organization`, `BlogPosting`, `PublicationIssue`) + full Open Graph · image pipeline for the magazine (1040 px, q80, lazy-load, alt) · HTML table of contents + 3 text articles per issue · allow verified AI crawlers at Cloudflare · add GA4 to weekly pages · remove `index.html` from 98 internal links.

## Then (60–90 days)
Expand W005 (57 words) and W007 (221 words, 79% quoted) · author pages with bios · a Sources block on every article · `/about/`, `/team/`, `/magazine/` and 4–5 topic hubs · publish weekly at 700+ words, answer-first and sourced · one original data piece for links.

---

## Two things I need from you
1. **Search Console + analytics access** — I have no impressions, rankings, traffic or backlink data, so all targets are directional.
2. **Confirm the Cloudflare setup** (Workers vs Pages, and any page/redirect rules) — the soft-404 cause is outside the repo and I could not see it.
