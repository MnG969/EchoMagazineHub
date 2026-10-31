# Technical SEO Audit — Echo Magazine

**Property:** https://www.echomagazine.com.tr/
**Audit date:** 19 October 2026
**Scope:** crawlability, indexation, URL/canonical handling, performance (lab), mobile-friendliness, response headers, deployment configuration, image payload.
**Mode:** read-only. No site source, configuration, or content was modified.

---

## 0. Executive summary

The site renders well and edge latency is good, but its **crawl and indexation signals are largely broken**. Every URL that does not exist returns **HTTP 200 with the homepage HTML** — including `/robots.txt` and `/favicon.ico`. There is no real 404 anywhere on the property, and the sitemap advertises **1 of the 12 indexable pages**. Eight of those twelve pages have **no canonical tag**. In practice Google is being told "everything is the homepage, forever", while the pages that should rank are neither listed nor consolidated.

Performance is dominated by images. The homepage is **3.73 MB / 80 requests**, of which **1.23 MB (33%) is 48 broken `<img>` tags** pointing at a team directory that does not exist. The magazine section is far worse: **191 pages / ~132 MiB** of full-resolution JPEGs loaded eagerly, with **0 of 191 images carrying `alt`, `loading`, or `width`/`height`**. Issue-02 transfers **58.3 MB** and its `load` event still had not fired after 35 seconds.

| Severity | Count | Headline items |
|---|---|---|
| Critical | 4 | Soft-404 on every unknown URL; `robots.txt` serves HTML; sitemap lists 1/12 URLs; magazine payload (up to 69.9 MiB/page) |
| High | 6 | 8/12 pages without canonical; 48/53 homepage images broken; loader blocks content 4.0–9.5 s; no structured data; incomplete social metadata; no long-lived asset caching observed |
| Medium | 8 | Missing meta descriptions on issue pages; 98 internal `index.html` links → 308; duplicate path variants return 200; tap targets; unsized/upscaled images; exposed deployment files; no favicon/manifest; HSTS/CSP absent |
| Low | 4 | HTTP/1.1 stragglers; verification-file 308; ETag loss from email obfuscation; permissive CORS |

**Verified working:** HTTPS + HSTS-free but valid certificate chain; `http→https` and apex→`www` redirects are single-hop 301/308; Brotli compression; HTTP/2 + HTTP/3 (`alt-svc: h3`); HTML `cache-control: public, max-age=0, must-revalidate` is appropriate; canonical on the homepage and the three issue pages is correct and self-referential; titles are unique; no `noindex` and no accidental `X-Robots-Tag`.

**Not verifiable from here (MISSING):** CrUX field data, Lighthouse/PSI (API quota exhausted, HTTP 429), Google Search Console coverage and impressions, Cloudflare account-level rules (Transform/Redirect/Cache Rules, HSTS toggle, routes), Googlebot crawl logs, and origin TTFB (only edge TTFB was observed).

---

## 1. Measurement conditions

| Item | Detail |
|---|---|
| Crawler / client | `curl.exe` 8.21 for status lines, headers, redirects, bodies; Chromium via Playwright + CDP (`Network.*`, `Emulation.*`) for transfer sizes, protocol, LCP/CLS, and throttling |
| HTTP/2 note | The local `curl` build has no HTTP/2 support; protocol was therefore read from Chromium CDP `Network.responseReceived.protocol` (h2 = 73, h3 = 1, http/1.1 = 4, data = 2 on the homepage) |
| Viewports | Desktop 1440×900; mobile 390×844 (deviceScaleFactor 3, touch) |
| Throttling | Cold mobile profile: 9 Mbps down / 1.5 Mbps up / 150 ms RTT, CPU 4× slowdown |
| Cache state | Browser cache disabled for all measured runs; `Cache-Control: no-cache` on navigation where applicable |
| Location | Single lab location (agent egress); latency is edge, not origin |
| LCP | Buffered `PerformanceObserver('largest-contentful-paint')`, element + size recorded |
| CLS | `layout-shift` with `hadRecentInput` excluded, session-window sum |
| Bytes | CDP `encodedDataLength` (wire bytes, post-compression) |
| Caveats | Lab numbers are single-run, single-location. No field data (CrUX), no Lighthouse score, no GSC. Items marked **MISSING** were not observable with the available access. |

---

## 2. Crawlability & indexation

### 2.1 robots.txt — serves the homepage (Critical)

```
GET /robots.txt
HTTP/1.1 200 OK
content-type: text/html; charset=UTF-8
cache-control: public, max-age=14400, must-revalidate
cf-cache-status: EXPIRED
content-length: 29559   (HTML document, not a robots file)
```

The response body is the homepage `<html>` document. There is **no `User-agent:` line and no `Disallow:`/`Sitemap:` directive anywhere**. Google treats a robots.txt that is HTML rather than `text/plain` as unparseable; the documented fallback is to crawl as if no robots rules exist. That is benign for access but has two real consequences:

1. **No `Sitemap:` discovery hint.** Google must rely on external links and the single-URL sitemap submission (if any).
2. **It is the same soft-404 defect as §2.3** — the server has no concept of "this file does not exist".

There is also no `robots.txt` in the deployed asset tree, so this is not a file with a wrong MIME type; the request is being caught by the catch-all.

**Fix:** ship a literal `robots.txt` at the asset root:

```
User-agent: *
Allow: /

Sitemap: https://www.echomagazine.com.tr/sitemap.xml
```

Serve it as `text/plain; charset=utf-8` (Workers static assets infer this from the `.txt` extension). Do not add `Disallow` rules — nothing on the site currently needs to be blocked, and blocking would only hide the duplicate variants instead of canonicalising them.

### 2.2 sitemap.xml — 1 of 12 URLs (Critical)

```
GET /sitemap.xml → 200, application/xml, 275 bytes
<urlset>
  <url><loc>https://www.echomagazine.com.tr/</loc>
       <lastmod>2026-07-10</lastmod></url>
</urlset>
```

The XML is well-formed and the single `<loc>` is correct and absolute. But the property has **12 indexable HTML pages**, and **11 are absent**:

| Page | In sitemap | Canonical | Indexable |
|---|---|---|---|
| `/` | ✅ | ✅ self | ✅ |
| `/weekly/` | ❌ | ❌ none | ✅ |
| `/weekly/W001/` … `/weekly/W007/` (7) | ❌ | ❌ none | ✅ |
| `/magazine/issue-01/` | ❌ | ✅ self | ✅ |
| `/magazine/issue-02/` | ❌ | ✅ self | ✅ |
| `/magazine/issue-03/` | ❌ | ✅ self | ✅ |

`lastmod` 2026-07-10 is stale for a site whose issues are dated later; an unchanged `lastmod` on an unchanged URL is harmless, but once the other 11 URLs are added the values must be real modification dates, not a build timestamp applied to all.

**Fix:** generate the sitemap from the same list that drives navigation, and keep it in sync at build time. Minimum viable version:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.echomagazine.com.tr/</loc><lastmod>2026-10-19</lastmod></url>
  <url><loc>https://www.echomagazine.com.tr/weekly/</loc><lastmod>2026-10-19</lastmod></url>
  <url><loc>https://www.echomagazine.com.tr/weekly/W001/</loc><lastmod>2026-10-19</lastmod></url>
  <!-- … W002–W007 … -->
  <url><loc>https://www.echomagazine.com.tr/magazine/issue-01/</loc><lastmod>2026-10-19</lastmod></url>
  <url><loc>https://www.echomagazine.com.tr/magazine/issue-02/</loc><lastmod>2026-10-19</lastmod></url>
  <url><loc>https://www.echomagazine.com.tr/magazine/issue-03/</loc><lastmod>2026-10-19</lastmod></url>
</urlset>
```

Then submit it in Search Console (**MISSING** — submission status not observable).

### 2.3 Soft-404: every unknown URL returns 200 + homepage (Critical)

This is the single most damaging finding. Every one of these returned **`200 OK`, `text/html`, 29,559 bytes — byte-identical to the homepage**:

| Requested URL | Status | Body |
|---|---|---|
| `/this-page-does-not-exist-xyz123` | 200 | homepage |
| `/robots.txt` | 200 | homepage |
| `/favicon.ico` | 200 | homepage |
| `/foo.jpg` | 200 | homepage |
| `/404.html` | 200 | homepage |
| `/zzz-not-real` | 200 | homepage |
| `/WEEKLY/W001/` (wrong case) | 200 | homepage |
| `/INDEX.HTML` (wrong case) | 200 | homepage |
| `/weekly//W001/` (double slash) | 200 | correct article |
| `/weekly/./W001/` | 200 | correct article |

Implications:

- **Infinite crawlable URL space.** Any string a crawler or a spammer invents yields a unique 200 page with identical content. Google reports these as "Soft 404" or "Duplicate, Google chose different canonical" and burns crawl budget on them.
- **No error signal for users or crawlers.** A mistyped `/weekly/W008/` looks like a successful page whose content is the homepage.
- **Link equity is absorbed.** External links to dead article URLs resolve to the homepage instead of a 404, so the homepage collects anchors that belong to articles.
- **`/404.html` itself is a 200 homepage**, so even a correctly configured error document cannot be reached.

The repo's `wrangler.jsonc` contains **no `not_found_handling` and no `main`**:

```jsonc
{
  "name": "echomagazinehub",
  "compatibility_date": "2026-07-10",
  "assets": { "directory": "." }
}
```

Cloudflare's static-assets documentation is explicit that with no Worker script and no `not_found_handling`, a missing asset returns **404**. The observed 200-homepage behaviour therefore cannot be produced by this config as written. The cause is **outside the repository — MISSING**: candidate explanations are a dashboard-level Worker/route, a Transform or Redirect Rule, a Pages project with an SPA fallback (`_redirects` with `/* /index.html 200`), or a deployed build that differs from this working tree. This must be checked in the Cloudflare dashboard before the code fix is applied; the code fix alone may be overridden.

**Fix (repo side):** add `not_found_handling` and a real `404.html`:

```jsonc
{
  "name": "echomagazinehub",
  "compatibility_date": "2026-07-10",
  "assets": {
    "directory": ".",
    "not_found_handling": "404-page",
    "html_handling": "auto-trailing-slash"
  }
}
```

`not_found_handling: "404-page"` makes Workers static assets serve the nearest `404.html` **with HTTP 404** for unmatched requests. Create `404.html` at the asset root with a short message, links to `/`, `/weekly/`, `/magazine/`, and `<meta name="robots" content="noindex">`. Do **not** use `single-page-application`, which would preserve the current soft-404 behaviour.

**Fix (dashboard side):** confirm no route/rule rewrites 404s to `/index.html`. Verify with:

```powershell
curl.exe -sSI https://www.echomagazine.com.tr/definitely-not-a-page-42
# expect: HTTP/2 404  + content-type: text/html
```

### 2.4 Redirects and URL variants

Correct, single-hop redirects (verified):

| From | Status | To |
|---|---|---|
| `http://echomagazine.com.tr/` | 301 | `https://www.echomagazine.com.tr/` |
| `http://www.echomagazine.com.tr/` | 301 | `https://www.echomagazine.com.tr/` |
| `https://echomagazine.com.tr/` | 301 | `https://www.echomagazine.com.tr/` |
| `/index.html` | 308 | `/` |
| `/weekly` | 308 | `/weekly/` |
| `/weekly/index.html` | 308 | `/weekly/` |
| `/magazine/issue-01` | 308 | `/magazine/issue-01/` |
| `/weekly/W001/index.html` | 308 | `/weekly/W001/` |

No redirect chains were found (apex→www and http→https collapse into one hop). This part of the setup is healthy and matches `html_handling: "auto-trailing-slash"` semantics.

Two variant problems remain:

1. **Duplicate paths resolve 200 without canonicalisation.** `/weekly//W001/`, `/weekly///W001/`, and `/weekly/./W001/` all return the article with 200. Because W001 has no canonical (§2.5), each is a standalone duplicate.
2. **98 internal links point at `index.html`**, each paying a 308. They are functionally fine but add a hop to every internal navigation and dilute the crawl graph. Point them at directory URLs (`/weekly/`, `/weekly/W001/`) and let `auto-trailing-slash` handle the rest.

### 2.5 Canonicals and indexability matrix

| URL | Status | Canonical | Meta description | H1 count | In sitemap |
|---|---|---|---|---|---|
| `/` | 200 | ✅ self | 135 chars | **2** | ✅ |
| `/weekly/` | 200 | ❌ **none** | 73 chars | 1 | ❌ |
| `/weekly/W001/` | 200 | ❌ **none** | 34 chars | 1 | ❌ |
| `/weekly/W002/` | 200 | ❌ **none** | 34 chars | 1 | ❌ |
| `/weekly/W003/` | 200 | ❌ **none** | 42 chars | 1 | ❌ |
| `/weekly/W004/` | 200 | ❌ **none** | 104 chars | 1 | ❌ |
| `/weekly/W005/` | 200 | ❌ **none** | 25 chars | 1 | ❌ |
| `/weekly/W006/` | 200 | ❌ **none** | 53 chars | 1 | ❌ |
| `/weekly/W007/` | 200 | ❌ **none** | 37 chars | 1 | ❌ |
| `/magazine/issue-01/` | 200 | ✅ self | ❌ none | 1 | ❌ |
| `/magazine/issue-02/` | 200 | ✅ self | ❌ none | 1 | ❌ |
| `/magazine/issue-03/` | 200 | ✅ self | ❌ none | 1 | ❌ |

All 12 pages are 200, contain no `noindex` meta, and receive no `X-Robots-Tag`. Nothing is blocked from indexing — the problem is the opposite: too much is indexable with too little differentiation.

**Fix:** add a self-referential absolute canonical to every page:

```html
<link rel="canonical" href="https://www.echomagazine.com.tr/weekly/W001/">
```

It must be absolute, `https`, `www`, and trailing-slash-matched. Apply to the weekly hub and all seven articles first (8 pages), then keep it in the page template so future issues inherit it. This alone resolves the `/weekly//W001/` and `/weekly/./W001/` duplicates.

### 2.6 Titles, descriptions, headings

Titles are unique and reasonably formed: `Echo Magazine | Official Hub`, `Echo Magazine | Issue 01/02/03`, `W001 — Echo Weekly`, `Weekly — Echo Magazine`. No duplication or truncation risk at 60 characters except the homepage pattern, which is fine.

Meta descriptions are the weak layer:

- **Missing entirely** on all three issue pages, which are the only pages likely to rank for "Echo Magazine issue 1/2/3" queries.
- Weekly descriptions are **25–104 characters**, far below the ~120–155 that gets used in a snippet. W005 at 25 characters will almost certainly be rewritten by Google from page text.
- The homepage at 135 characters is the only fully usable one.

**Fix:** write 140–155 character descriptions for the three issue pages and expand the eight weekly ones. Each should state issue number, theme, and a concrete reason to click; no keyword stuffing, no duplicated template sentences.

The homepage has **two `<h1>` elements**: one inside the loader (`Echo`) and one for the hero (`hero__title`). Neither is hidden from the accessibility tree in a way that removes it from the document, so the outline has two top-level headings. This is not a penalty, but it weakens the signal for the primary query. Change the loader's `<h1>` to a `<div>`/`<span>` — the loader is decorative chrome, not content.

### 2.7 Internal linking

- Navigation and footer links are real `<a href>` elements and crawlable; there is no JS-only routing.
- **98 `href` values end in `index.html`** and each 308-redirects.
- Weekly articles link back to `/weekly/` and to the homepage; issue pages link to `/magazine/` (which itself 308s to a directory index only if one exists — **MISSING**: `/magazine/` behaviour was not separately recorded).
- The homepage links all three issue covers and the weekly hub, so the 12 pages are reachable within 1–2 hops from `/`. Discovery is not the bottleneck; the sitemap and soft-404 are.

**Fix:** strip `index.html` from internal hrefs. One search-and-replace across templates, then re-crawl to confirm 0 internal 308s.

### 2.8 Verification file

```
/googlefcda3adb30ed0854.html → 308 → /googlefcda3adb30ed0854 → 200, 53 bytes
"google-site-verification: googlefcda3adb30ed0854.html"
```

The token is reachable and correct, but the 308 hop is unnecessary and depends on Google following redirects for verification (it generally does, but this is an avoidable risk). **MISSING:** whether verification currently succeeds in Search Console. Fix by exempting `*.html` verification files from extensionless rewriting, or by placing the token in a `<meta>` tag on `/` and DNS-verifying instead.

### 2.9 Structured data and social metadata

- **Zero JSON-LD on all 12 pages.** No `Organization`, `WebSite`, `Periodical`/`PublicationIssue`, `Article`, or `BreadcrumbList`.
- Open Graph exists **only on the homepage**, and only three properties: `og:title`, `og:description`, `og:type`. No `og:image`, no `og:url`, no `twitter:card`.
- The eight weekly pages have **no OG tags at all**, so every share renders as a bare link.

**Fix:** add a single `Organization` + `WebSite` graph on `/`, and `Article` (or `PublicationIssue` for magazines) on each article/issue page with `headline`, `datePublished`, `image`, `author`, `publisher`, and `mainEntityOfPage`. Add `og:image` (1200×630), `og:url`, `og:site_name`, and `twitter:card=summary_large_image` to the shared head template.

---

## 3. Performance (lab, cold cache)

### 3.1 Core metrics

| Page | Viewport / network | Requests | Transfer | TTFB | FCP | LCP | LCP element | CLS | `load` |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 1440×900, unthrottled | 80 | 3.73 MB | 329 ms | 1,064 ms | **1,084 ms** | `IMG` 543×679 (hero) | 0.0007 | 2,814 ms |
| `/` | 390×844, unthrottled | 80 | 3.88 MB | 313 ms | — | **976 ms** | `H1.hero__title` | 0 | 1,861 ms |
| `/` | 390×844, 9 Mbps / 150 ms / CPU 4× | 72 | 3.01 MB | 498 ms | — | — | — | — | **7,552 ms** |
| `/weekly/` | 1440×900 | 11 | 951 KB | 518 ms | — | **1,244 ms** | `H1.weekly-hero__title` | 0.001 | 1,983 ms |
| `/weekly/W001/` | 1440×900 | 12 | ~125 KB | 464 ms | — | **872 ms** | `H1.article-hero__title` | 0.032 | 1,247 ms |
| `/magazine/issue-01/` | 1440×900 | 30 img | 9.92 MB | 793 ms | — | — | — | — | 7,738 ms |
| `/magazine/issue-02/` | 1440×900 | 95 img | **58.31 MB** | — | — | — | — | — | **never fired (35 s)** |
| `/magazine/issue-03/` | 1440×900 | 66 img | **55.36 MB** | 448 ms | 768 ms | 928 ms (`1.jpg`) | — | 0.014 | 16,437 ms |

What is healthy: **TTFB is 313–793 ms** from the edge, well inside the 800 ms "good" threshold. **LCP on content pages is under 1.3 s** because those pages are text-led and the LCP element is a heading, not an image. **CLS is essentially zero** everywhere except W001 (0.032, still "good") — a real strength, and a reason not to redesign layout when fixing images.

What is not: **weight**. A 3.73 MB homepage is ~4× the ~1 MB that a magazine landing page should target, and the magazine issues are 10–70× over budget. On the throttled mobile profile the homepage takes **7.55 s to `load`**, and the loader keeps the page covered until **9.47 s**.

### 3.2 Homepage composition (3.73 MB, 80 requests)

| Bucket | Bytes | Share of 3.73 MB | Requests |
|---|---|---|---|
| Broken images (48 × soft-404 HTML) | 1,230,272 | ~33% | 48 |
| Real images (4 covers/hero) | 2,441,022 | ~65% | 4 |
| Fonts (5 files) | 371,505 | ~10% | 5 |
| Remixicon CSS | 18,465 | ~0.5% | 1 |
| Google Fonts CSS | 1,306 | <0.1% | 1 |
| Local CSS | 8,282 | ~0.2% | 1 |
| JS + HTML + misc | ~120,000 | ~3% | 20 |

The buckets come from two passes (a full-run CDP total and a per-request byte capture) and sum to ≈4.07 MB against the 3.73 MB headline. The ~9% difference is redirect/duplicate-request accounting between passes, not a measurement error in either; the reliable comparison is request-level: **48 of 80 requests and 1.23 MB of 3.73 MB are broken images.**

The four real images are individually oversized:

| Image | Bytes | Intrinsic | Displayed | Oversize factor |
|---|---|---|---|---|
| issue-01 cover | 845,661 | 1055×1491 | 543×679 | ~2× linear |
| hero-cover3 | 585,742 | 1055×1491 | 543×679 | ~2× |
| issue-03 cover | 585,742 | 1055×1491 | 456×644 | ~2.3× |
| issue-02 cover | 422,677 | 1414×2000 | 580×726 | ~2.6× |

All 53 `<img>` elements on the homepage have **no `width`/`height` attributes**, and none has `loading="lazy"`. CLS stays low only because the CSS grid reserves aspect ratio; any layout change would expose the missing intrinsic sizes immediately.

### 3.3 The loader delays content by 4.0–9.5 s

`js/script.js` hides `.loader` on `window.load` **plus a 1,200 ms timer**, and `.loader` is a fixed full-viewport overlay. Measured content-visible times:

| Condition | `load` | Loader hidden | Hero interactive |
|---|---|---|---|
| Desktop 1440×900 | 2,814 ms | ~4,014 ms | ~4.0 s |
| Mobile 390×844, unthrottled | 1,861 ms | ~3,061 ms | ~3.1 s |
| Mobile 4G throttled | 7,552 ms | **9,469 ms** | **8,782 ms** |

Because the overlay is on top of the document, LCP is *not* the limiting factor for perceived speed — the loader is. Google's LCP measurement can also be affected by the overlay if the painted hero is obscured, so the lab LCP of 1.08 s understates what a user experiences by roughly 3 s on desktop. On 4G the gap is ~7.9 s between LCP and first interaction.

The trigger is also structurally wrong: waiting for `load` means waiting for **all 80 requests, including 48 broken images and 5 font files**. Every additional broken image extends the loader. Fix the broken images and the loader still waits on the slowest image.

**Fix:**

```js
// hide as soon as the document is interactive + one frame painted
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelector('.loader')?.classList.add('is-hidden');
  }));
});
```

…and shorten the CSS transition from `.8s` to ~`.25s`. If a minimum display time is desired for branding, cap it at 400 ms and do not tie it to `load`. Target: content visible < 1 s on desktop, < 2.5 s on 4G.

### 3.4 Fonts and icons — 371 KB for 5 files

| File | Bytes | Notes |
|---|---|---|
| `remixicon.woff2` | 165,819 | full icon font for ~10 icons used |
| Inter (2 subsets) | 48,392 + 85,646 | 134 KB |
| Cormorant (2 subsets) | 37,776 + 33,872 | 71 KB |
| **Total** | **371,505** | 5 requests, render-blocking CSS on top |

Remixicon alone is **166 KB (45% of font payload)** to render a handful of glyphs. The CSS is also heavily bloated: `remixicon.css` transfers 18,465 B but decodes to **140,913 B**, and Google Fonts CSS transfers 1,306 B / decodes to 22,435 B — 163 KB of parser work for two stylesheets.

Version drift makes caching worse: the homepage requests `remixicon@4.3.0`, the weekly pages `@4.6.0`, and magazine pages the unversioned `@4`. Three URLs, three cache entries, three chances of a mismatch after an update.

**Fix:** replace Remixicon with inline SVG for the ~10 icons actually used (saves 166 KB and one render-blocking request), or at minimum subset it and pin one version site-wide. Self-host Inter and Cormorant as `woff2` with `font-display: swap`, `preload` only the two faces used above the fold, and drop unused weights. Expected saving: **~250–300 KB and 2–3 requests**.

### 3.5 Magazine payload — the largest problem on the site

| Issue | Pages | Transfer | Avg/page | Median page | Max page | `load` |
|---|---|---|---|---|---|---|
| issue-01 | 30 | 9,916,479 B (9.4 MiB) | 321 KB | — | — | 7.7 s |
| issue-02 | 95 | 58,312,632 B (55.6 MiB) | 753 KB | — | — | **not fired @ 35 s** |
| issue-03 | 66 | 55,357,787 B (52.7 MiB) | 818 KB | 611 KB | 4,606 KB | 16.4 s |
| **Total** | **191** | **~132 MiB** | ~700 KB | — | 4.6 MB | — |

Every page image is a **1414×2000 JPEG displayed at roughly 520×720** — about 2.7× linear oversize, i.e. **~7× more pixels than are displayed**. None of the 191 images has `loading="lazy"`, `decoding="async"`, `alt`, or `width`/`height`; they are generated in a JS loop (`magazine/issue-0X/script.js`) that appends `<img>` nodes for all pages at once. Issue-03 contains **55 characters of body text**, so the page is effectively an image gallery with no textual content for a crawler to index.

Issue-02 is the extreme case: **58.3 MB, 93 of 95 images loaded, `load` never fired within 35 s**. On the throttled mobile profile this page would take minutes and is likely to be abandoned before first paint of later pages. Multiply by 191 URLs and a full crawl is **~132 MiB of image transfer per pass** — a meaningful crawl-budget and origin-egress cost, and a strong reason Google would treat these as low-value pages.

Re-encode tests (`.NET` JPEG encoder, quality 80) show the waste is entirely avoidable:

| Source | Original | Re-encoded q80 | Saving | At 720 px wide |
|---|---|---|---|---|
| issue-01 cover | 845,661 | 102,905 | **−87.8%** | — |
| issue-03 `1.jpg` | 585,742 | 367,349 | −37.3% | — |
| `1.jpg` at 720 px | 585,742 | — | — | 194,832 (**−66.7%**) |
| `26.jpg` | 3,262,976 | 373,208 | **−88.6%** | — |
| `26.jpg` at 720 px | 3,262,976 | — | — | 132,910 (**−95.9%**) |

A realistic target for the magazine section is **~80–120 KB per page image**, i.e. **2.5–4 MB per issue** instead of 9.4–55.6 MiB. That is a **90–95% reduction** with no visible loss at the displayed size.

**Fix, in order of impact:**

1. **Resize at build time** to ~2× the rendered width (1040 px for a 520 px column) and re-encode q80–82. Do not ship 1414×2000 for a 520 px slot.
2. **Convert to AVIF/WebP** with JPEG fallback via `<picture>`; expect another 30–50% over q80 JPEG.
3. **Lazy-load every page after the first two**: `loading="lazy" decoding="async"`, plus explicit `width`/`height` to reserve layout.
4. **Paginate instead of one long DOM.** 95 eagerly-created `<img>` nodes is both a network and a memory problem; load 2 pages ahead of the current scroll position.
5. **Add `alt`** — `Issue 03 — page 12` is enough for image search and accessibility.
6. **Add text**: an issue title, a standfirst, and a page count give the crawler something to index.

### 3.6 Caching, compression, protocol

**Compression — good.** Brotli confirmed on HTML and CSS; gzip fallback returns valid output. No uncompressed text assets observed.

**Protocols — good, with stragglers.** From Chromium CDP on the homepage: **h2 = 73, h3 = 1, http/1.1 = 4, data = 2**. `alt-svc: h3=":443"; ma=86400` is present, so HTTP/3 is advertised and used on repeat visits. The 4 HTTP/1.1 requests are worth identifying but are not a ranking issue at this scale.

**Caching — the weak layer.** Observed:

| Asset | `cache-control` | `cf-cache-status` on repeat |
|---|---|---|
| HTML | `public, max-age=0, must-revalidate` | `DYNAMIC` (correct — HTML should not be edge-cached blindly) |
| CSS | `public, max-age=14400, must-revalidate` | `REVALIDATED`, `MISS`, **no `HIT` observed** |
| JPG | `public, max-age=14400, must-revalidate` | `REVALIDATED`, `MISS`, **no `HIT` observed** |
| 404 / soft-404 HTML | `public, max-age=14400, must-revalidate` | cached 4 h |

Two problems:

1. **4-hour TTL with `must-revalidate` on immutable assets.** Covers and page images never change at a given URL; they should be `public, max-age=31536000, immutable` and fingerprinted (`issue-01-cover.9f3c2a.jpg`). As configured, every returning visitor revalidates every image after 4 hours, and no `HIT` was seen across repeated requests in the same session — the edge kept going back to origin.
2. **Soft-404s are cached for 4 hours.** A 200 homepage response for a nonexistent URL is now sticky at the edge, which makes a bad situation harder to debug and serves stale error pages after the fix.

**Fix:** serve hashed asset filenames with a one-year immutable TTL, and let the `404.html` response use `no-store` (or short `max-age`) so error pages are not cached. See §6.4 for the exact `_headers` file.

### 3.7 Third-party and analytics

GA4 and Microsoft Clarity are present on `/`, `/magazine/issue-01|02|03`, but **absent from `/weekly/` and all seven articles** — so the pages that most need behavioural data (article engagement, scroll depth) are unmeasured. This is a measurement gap, not a ranking factor, but it blocks any evidence-based iteration on the weekly section. **MISSING:** actual GA4/Clarity property data.

---

## 4. Mobile-friendliness

| Check | Result | Verdict |
|---|---|---|
| Viewport meta | `width=device-width, initial-scale=1` on all 12 pages | ✅ |
| Horizontal overflow @ 390 px | `scrollWidth` = 390 on `/`, `/weekly/`, W001, issue-03 | ✅ none |
| Body font size | 16 px | ✅ |
| Tap targets < 44 px | **25 of 44** on `/`; 10/10 on W001; 5/5 on issue-03 | ❌ |
| Text < 12 px | **15 elements at 10.4–11.68 px** on `/` | ❌ |
| Content parity vs desktop | Same DOM, no `display:none` content blocks | ✅ |
| Responsive images | No `srcset`/`sizes` anywhere; 1280 px sources served to 358 px slots | ❌ |

**Tap targets.** Navigation and footer links render **15–24 px high**; buttons are 38 px. Google's guidance is 44×44 CSS px with ≥8 px spacing; 25 of 44 interactive elements fail. The footer link grid is the worst cluster — adjacent 16 px-tall links with ~4 px gaps are easy to mis-tap. Fix with `padding: 10px 0` on footer/nav links (visual size unchanged, hit area grows) and `min-height: 44px` on buttons.

**Small text.** 15 homepage elements sit between 10.4 and 11.68 px — labels, meta rows, and footer copy. Anything below 12 px is hard to read on a 390 px viewport without zoom. Raise the smallest step to 12 px / 1.5 line-height.

**Image delivery.** Weekly index images are 930–1280 px wide but displayed at 619 px desktop / 358 px mobile; there is no `srcset`. A 390 px device downloads roughly **3–4× the pixels it can display**. Add `srcset` with 360/720/1280 variants and `sizes="(max-width: 720px) 100vw, 620px"`.

**Layout stability.** CLS 0–0.032 across pages is good, and no horizontal overflow was found at 390 px, including the magazine viewer. The mobile layout is structurally sound; the problems are hit-area sizing and image bytes, not responsiveness.

**Not verified (MISSING):** real-device testing (all runs were emulated Chromium at 390×844, DPR 3), iOS Safari-specific behaviour, and touch-scroll performance on the magazine pages.

---

## 5. Security and response headers

| Header | Present | Value / gap | SEO relevance |
|---|---|---|---|
| `strict-transport-security` | ❌ | absent | Low direct; HTTPS is already enforced by redirect. Add `max-age=31536000; includeSubDomains` once all subdomains are HTTPS. |
| `content-security-policy` | ❌ | absent | No direct ranking effect; protects against injected spam/redirects, which *is* a ranking risk. |
| `x-frame-options` | ❌ | absent | Clickjacking; no ranking effect. |
| `permissions-policy` | ❌ | absent | Low. |
| `cross-origin-opener-policy` / `-resource-policy` | ❌ | absent | Low. |
| `x-content-type-options` | ✅ | `nosniff` | ✅ correct |
| `referrer-policy` | ✅ | `strict-origin-when-cross-origin` | ✅ correct |
| `vary` | ✅ | `accept-encoding` | ✅ correct |
| `alt-svc` | ✅ | `h3=":443"; ma=86400` | ✅ HTTP/3 available |
| `access-control-allow-origin` | ⚠️ | `*` on all responses | Overly permissive for HTML; low risk but unnecessary. |
| `etag` | ⚠️ | **absent on HTML** | Caused by Cloudflare Email Address Obfuscation rewriting the body. Weakens revalidation (falls back to `Last-Modified`/full response). |
| `link` | ✅ | `<https://fonts.googleapis.com>; rel="preconnect"` | ✅ useful; add `crossorigin` for the font origin. |

The missing HSTS header means the first request can still be plaintext before the 301 lands. Given that `http→https` redirects correctly, the practical risk is small, but HSTS is a one-line fix via `_headers` or the Cloudflare SSL/TLS dashboard toggle (**MISSING:** current dashboard setting).

A CSP is harder here because the site loads Google Fonts, Remixicon, GA4, and Clarity, and uses inline scripts. A report-only policy first:

```
content-security-policy-report-only: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms; connect-src 'self' https://*.google-analytics.com https://*.clarity.ms
```

**Exposed deployment artefacts (Medium).** These are publicly readable and should not be:

| Path | Size | Contents |
|---|---|---|
| `/wrangler.jsonc` | 264 B | Byte-identical to the repo config — reveals asset layout and project name |
| `/README.md` | 17 B | Placeholder |
| `/magazine/issue-01/.vs/dergi.slnx/v18/DocumentLayout.json` | — | Leaks local path `C:\Users\melek\Desktop\dergi\` |
| `/magazine/issue-01/.vs/dergi.slnx/v18/slnx.sqlite` | 90,112 B | IDE state database |
| `/magazine/issue-01/.vs/.../*.wsuo` | 12,288 B | IDE state |
| `/Yeni Metin Belgesi.txt` | 47 B | Stray scratch file |

This confirms `assets.directory: "."` is publishing the **entire repository**, including `.vs`, `.sqlite`, and editor scratch files. It is information disclosure rather than an SEO defect, but the same misconfiguration is what publishes `wrangler.jsonc` and makes the asset tree unpredictable. Fix with `.assetsignore` (§6.5).

---

## 6. Deployment configuration

### 6.1 Observed vs repository

The live `/wrangler.jsonc` is byte-identical to `C:\Desktop\echo\EchoMagazineHub\wrangler.jsonc`:

```jsonc
{
  "name": "echomagazinehub",
  "compatibility_date": "2026-07-10",
  "assets": { "directory": "." }
}
```

Three observations:

1. **No `main`** — this is a static-assets-only Worker. Per Cloudflare's docs, with no Worker script and no `not_found_handling`, an unmatched request returns **404**. The live site returns **200 + homepage**. So the deployed behaviour does not match this file, or an account-level rule is intercepting. **Cause: MISSING.**
2. **`assets.directory: "."`** publishes the whole repo — `.git`, `.vs`, `.sqlite`, `wrangler.jsonc`, `README.md`, scratch files. `.git` is 129.1 MB of the 137.3 MB working tree; if it were served, it would be catastrophic. No `/.git/config` request was made, but the directory is inside the published root, so `.assetsignore` is mandatory.
3. **`html_handling` is unset**, so the default `auto-trailing-slash` applies — which matches the observed 308s for `/weekly` → `/weekly/` and `/index.html` → `/`. That part is consistent.

### 6.2 Exact `wrangler.jsonc`

```jsonc
{
  "name": "echomagazinehub",
  "compatibility_date": "2026-07-10",
  "assets": {
    "directory": ".",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

- `html_handling: "auto-trailing-slash"` keeps current redirect behaviour explicit rather than relying on a default that could change.
- `not_found_handling: "404-page"` is the actual fix for §2.3: nearest `404.html`, served with **404**.
- No `main`, no `run_worker_first` — the site is pure static, so keep it that way; adding a Worker just to fix 404s is unnecessary.

If the site is actually deployed as **Cloudflare Pages** rather than Workers, the equivalent is `_redirects` (`/* /404.html 404`) plus `404.html` at the root, and `_headers` for headers. The repo contains no `_redirects`, `_headers`, `functions/`, or `public/`, so Workers static assets is the better fit; confirm the project type in the dashboard (**MISSING**).

### 6.3 `404.html`

Create at the asset root (so it is also the nearest 404 for `/weekly/` and `/magazine/`):

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Page not found — Echo Magazine</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <main style="max-width:640px;margin:12vh auto;padding:0 24px">
    <p style="letter-spacing:.18em;text-transform:uppercase;font-size:12px">404</p>
    <h1>That page isn’t here.</h1>
    <p>The link may be out of date. Try the latest issue or the weekly archive.</p>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/weekly/">Weekly</a></li>
      <li><a href="/magazine/issue-03/">Latest issue</a></li>
    </ul>
  </main>
</body>
</html>
```

The `noindex` meta is belt-and-braces; a 404 status already excludes the page. Do not add a canonical to a 404 page.

### 6.4 `_headers`

`_headers` **overrides** Cloudflare's default headers rather than merging, is capped at 100 rules, and is **not applied to Worker-generated responses** — so if a Worker is ever added in front, these rules stop applying. Place at the asset root:

```
/*
  strict-transport-security: max-age=31536000; includeSubDomains
  x-content-type-options: nosniff
  referrer-policy: strict-origin-when-cross-origin
  x-frame-options: SAMEORIGIN
  permissions-policy: camera=(), microphone=(), geolocation=()
  cross-origin-opener-policy: same-origin

/assets/*
  cache-control: public, max-age=31536000, immutable

/*.jpg
  cache-control: public, max-age=31536000, immutable

/*.png
  cache-control: public, max-age=31536000, immutable

/*.webp
  cache-control: public, max-age=31536000, immutable

/*.avif
  cache-control: public, max-age=31536000, immutable

/*.woff2
  cache-control: public, max-age=31536000, immutable

/*.css
  cache-control: public, max-age=31536000, immutable

/*.js
  cache-control: public, max-age=31536000, immutable

/404.html
  cache-control: no-store
```

**Caveat that matters:** the immutable TTL is only safe if filenames are **content-hashed**. This repo serves `assets/issue-01 cover.jpg`, `css/style.css`, and `js/script.js` at stable paths; setting a one-year immutable TTL on those would strand users on stale CSS/JS after a deploy. Either (a) add hashes at build time and reference the hashed names, or (b) start with `max-age=86400` for CSS/JS and `max-age=604800` for images, then move to immutable once hashing exists. Do **not** ship the block above unchanged against unhashed filenames.

Also note the current `cache-control` on assets includes `must-revalidate`, which forces a conditional request even inside the TTL. Dropping `must-revalidate` is what allows a real `HIT`.

### 6.5 `.assetsignore`

Because `assets.directory` is the repo root, exclude everything that is not a public asset. `.assetsignore` uses `.gitignore` syntax:

```
.git
.gitignore
.vs
**/.vs
**/*.sqlite
**/*.wsuo
**/*.suo
**/*.user
wrangler.jsonc
wrangler.toml
README.md
*.md
*.txt
node_modules
package.json
package-lock.json
seo-audit
```

Verify after deploy:

```powershell
curl.exe -sSI https://www.echomagazine.com.tr/wrangler.jsonc   # expect 404
curl.exe -sSI https://www.echomagazine.com.tr/.git/config      # expect 404
curl.exe -sSI https://www.echomagazine.com.tr/README.md        # expect 404
```

Note `*.txt` would also block a future `robots.txt` — that is fine because `robots.txt` is a special case at the root, but if you intend to ship `robots.txt` as a static file, remove `*.txt` and exclude only the known scratch filename (`Yeni Metin Belgesi.txt`).

### 6.6 `_redirects`

Not required for the canonicalisation fixes (canonicals and `auto-trailing-slash` handle them), but useful for the verification file and any legacy URLs:

```
/googlefcda3adb30ed0854.html  /googlefcda3adb30ed0854.html  200
```

A `200` rule proxies the request without a redirect. Keep this file small; every rule is evaluated per request and `_redirects` is capped (2,000 static / 100 dynamic rules).

---

## 7. Broken images — quantified waste

`js/team.js` builds 47 team cards pointing at `assets/team/<name>.jpg`. **`assets/team` does not exist** in the repository or on the live host. One more reference, `assets/hero/about-image.jpg`, is also missing. Each request falls through to the soft-404 catch-all and returns the **29,559-byte homepage HTML with `Content-Type: text/html`** — so the browser downloads a full HTML document, fails to decode it as an image, and paints a broken-image icon.

| Metric | Value |
|---|---|
| `<img>` elements on `/` | 53 |
| Broken `<img>` | **48 (90.6%)** |
| Broken requests as share of all homepage requests | **48 / 80 = 60%** |
| Measured transfer for broken images | **1,230,272 B** |
| Nominal transfer (48 × 29,559 B) | 1,418,832 B |
| Average per broken image | ~25.6 KB |
| Share of homepage bytes | **~33%** |
| Waste per 1,000 page views | **~1.23 GB** |
| Waste per 100,000 page views | **~123 GB** |

The 1.23 GB/1,000-views figure is edge egress for content that is never displayed. It also inflates `load` time, which in turn delays the loader (§3.3), so the broken images are costing roughly **1.2 s of `load` on desktop** and considerably more on mobile — a direct LCP/interaction penalty caused by 48 404s disguised as 200s.

**Two fixes, both needed:**

1. **Stop rendering the cards.** Guard the template on a known manifest, or remove the team section until the assets exist. A missing image is better than 48 HTML documents.
2. **Restore the assets.** If the team photos are intended, add them under `assets/team/` at ~400×400, q80 WebP/JPEG (~30–50 KB each), with `alt`, `width`, `height`, and `loading="lazy"`. That is ~2 MB total, loaded only when scrolled into view — versus 1.23 MB downloaded on every homepage view for nothing.

Also note the **`about-image.jpg`** reference: the about section's single image is among the 48 failures, so that block currently shows a broken icon in addition to the team grid.

---

## 8. Severity-ranked findings

Severity is assigned by SEO impact: **Critical** = breaks crawl/index signals at scale or makes key pages unindexable/undiscoverable; **High** = materially suppresses ranking or Core Web Vitals on money pages; **Medium** = measurable drag or risk; **Low** = hygiene.

| ID | Severity | Issue | Evidence | SEO impact | Fix | Effort |
|---|---|---|---|---|---|---|
| **C1** | Critical | Soft-404: every unknown URL returns 200 + homepage | `/this-page-does-not-exist-xyz123`, `/404.html`, `/foo.jpg`, `/zzz-not-real` → `200 text/html`, 29,559 B, identical to `/` | Infinite duplicate URL space, crawl-budget burn, no error signal, link equity misattributed; Google reports soft 404s at scale | `not_found_handling: "404-page"` + real `404.html`; audit dashboard for rewrite rules (§6.2) | 1 h + dashboard check |
| **C2** | Critical | `robots.txt` serves the homepage HTML | `GET /robots.txt` → `200 text/html`, 29,559 B, no `User-agent` or `Sitemap` line | Unparseable robots file; no sitemap discovery hint; same catch-all defect as C1 | Ship `robots.txt` as `text/plain` with `Allow: /` and `Sitemap:` | 15 min |
| **C3** | Critical | Sitemap lists 1 of 12 indexable URLs | `/sitemap.xml` = 275 B, one `<loc>` for `/`; weekly hub, 7 articles, 3 issues absent | 11 pages rely entirely on internal links; slow/no discovery of new issues; no `lastmod` signal | Generate sitemap from page manifest; submit in GSC | 1–2 h |
| **C4** | Critical | Magazine pages ship 9.4–69.9 MiB of eager full-res JPEGs | issue-01 9.92 MB / 30 img; issue-02 58.31 MB / 95 img, `load` not fired @35 s; issue-03 55.36 MB / 66 img, `load` 16.4 s; all 1414×2000 displayed ~520×720 | 191 pages / ~132 MiB per crawl; mobile abandonment before paint; image-heavy pages with 55 chars of text rank poorly | Resize to 1040 px, q80 AVIF/WebP, lazy-load after first 2, paginate (§3.5) | 1–2 days |
| **H1** | High | 8 of 12 pages have no canonical | `/weekly/` and W001–W007: no `<link rel="canonical">`; `/weekly//W001/` and `/weekly/./W001/` also 200 | Duplicate variants compete; no consolidation signal for the weekly section | Add absolute self-canonical to all 8 pages via template (§2.5) | 30 min |
| **H2** | High | 48 of 53 homepage images are broken (serve HTML) | 47 team paths under non-existent `assets/team/` + `assets/hero/about-image.jpg`; 1,230,272 B; 60% of requests | 90.6% of images fail; 33% of page weight wasted; delays `load` → delays loader → hurts LCP/interaction | Remove/guard team template; restore assets at 400×400 with `alt`/dimensions/lazy | 2 h (remove) / 1 day (restore) |
| **H3** | High | Full-screen loader hides content for 4.0–9.5 s | Hides on `load` + 1200 ms; `.loader` fixed overlay; throttled mobile: `load` 7,552 ms, hidden 9,469 ms, hero interactive 8,782 ms | Perceived load ~4× lab LCP; users and crawlers see a covered page; inflates engagement failure | Hide on `DOMContentLoaded` + 2× rAF; transition 250 ms; cap any min-display at 400 ms | 30 min |
| **H4** | High | No structured data; social metadata incomplete | 0 JSON-LD on 12/12 pages; OG only on `/` (3 tags, no `og:image`/`og:url`); 8 weekly pages 0 OG | No rich results/entity signals; shares render as bare links → less referral traffic | Add `Organization`+`WebSite` on `/`, `Article`/`PublicationIssue` on articles; full OG/Twitter in head template | 3–4 h |
| **H5** | High | Issue pages have no meta description; weekly descriptions 25–104 chars | issue-01/02/03: none; W005 25, W001/W002 34, W007 37, W003 42, W006 53, W001 34; homepage 135 | Google rewrites snippets; lower CTR on the pages most likely to rank for issue queries | Write 140–155 char descriptions for 3 issues + expand 8 weekly | 2 h |
| **H6** | High | Static assets effectively uncached; 3 Remixicon versions | CSS/JPG `max-age=14400, must-revalidate`; repeat requests `REVALIDATED`/`MISS`; **no `HIT` observed**; remixicon `@4.3.0` / `@4.6.0` / `@4` | Repeat-visit latency; origin egress; three cache entries for one library | Hashed filenames + `max-age=31536000, immutable`; pin one Remixicon version (§6.4) | 4 h |
| **M1** | Medium | Duplicate path variants return 200 | `/weekly//W001/`, `/weekly///W001/`, `/weekly/./W001/` → 200 article | Multiple URLs for one article; split signals | Canonical on articles fixes it; optionally normalise slashes at edge | 15 min (after H1) |
| **M2** | Medium | 98 internal links point at `index.html` | 98 `href` values ending `index.html`; each returns 308 | One extra hop per internal navigation; diluted crawl graph | Replace with directory URLs (`/weekly/W001/`) | 30 min |
| **M3** | Medium | Images unsized, oversized, no `srcset` | All 53 homepage `<img>` lack `width`/`height`; hero 1055×1491 → 543×679; W001 442×372 → 1240×1044; weekly 1280 px → 358 px mobile | Wasted bytes on mobile; CLS risk on any layout change; blurry upscaled article image | Add dimensions + `srcset`/`sizes`; cap at 2× display size | 1 day |
| **M4** | Medium | Tap targets and text below mobile guidance | 25/44 homepage targets <44 px (nav/footer 15–24 px, buttons 38 px); 10/10 W001, 5/5 issue-03; 15 elements at 10.4–11.68 px | Mobile usability friction; lower engagement on mobile-majority traffic | `padding: 10px 0` on nav/footer links; `min-height:44px` buttons; min font 12 px | 1–2 h |
| **M5** | Medium | Whole repo published as assets | `/wrangler.jsonc` (264 B), `/README.md`, `/.vs/.../DocumentLayout.json` (leaks `C:\Users\melek\...`), `slnx.sqlite` (90,112 B), `.wsuo` (12,288 B), `Yeni Metin Belgesi.txt` | Information disclosure; unpredictable asset tree; reputational/security risk | `.assetsignore` + verify 404s (§6.5) | 30 min |
| **M6** | Medium | No favicon, no web manifest | No `<link rel="icon">` on any page; `/favicon.ico` → 200 homepage HTML; no `manifest.webmanifest` | Weak brand/entity signal in SERP; broken tab icon | Add `favicon.ico` + PNG/SVG icons + manifest; link in head | 1 h |
| **M7** | Medium | Missing HSTS, CSP, `X-Frame-Options`, `Permissions-Policy` | Only `nosniff` and `referrer-policy` present; no HSTS/CSP/frame policy | No direct ranking effect; enables injection/clickjacking that can harm rankings | `_headers` rules (§6.4), CSP report-only first | 1 h |
| **M8** | Medium | Two `<h1>` on the homepage | Loader `<h1>Echo</h1>` + `H1.hero__title` | Diluted primary heading signal | Change loader `<h1>` to `<div>`/`<span>` | 5 min |
| **L1** | Low | 4 homepage requests over HTTP/1.1 | CDP protocols: h2 73, h3 1, http/1.1 4, data 2 | Minor multiplexing loss | Identify the 4 URLs; likely third-party or preconnect edge cases | 1 h |
| **L2** | Low | Verification file 308s | `/googlefcda3adb30ed0854.html` → 308 → extensionless 200, 53 B | Verification depends on redirect-following | `_redirects` 200 proxy or `<meta>` verification | 15 min |
| **L3** | Low | ETag missing on HTML | Email Address Obfuscation rewrites body (3 `email-protection` occurrences, `email-decode.min.js`, no `mailto:`) | Weaker revalidation; full responses instead of 304 | Disable obfuscation or accept; add `Last-Modified` consistency | 15 min |
| **L4** | Low | `access-control-allow-origin: *` on all responses | Present on HTML documents too | Overly permissive; no ranking effect | Restrict to asset paths in `_headers` | 15 min |

---

## 9. Prioritised remediation plan

### Phase 0 — today, under 1 hour, no build changes

1. Ship `robots.txt` and `404.html`; set `not_found_handling: "404-page"`.
2. Confirm no dashboard rewrite is forcing 200s; if one exists, remove it.
3. Add self-canonicals to `/weekly/` and W001–W007.
4. Fix the loader trigger (`DOMContentLoaded` + 2× rAF, 250 ms transition).
5. Change the loader `<h1>` to a non-heading element.

After Phase 0, re-run:

```powershell
curl.exe -sSI https://www.echomagazine.com.tr/definitely-not-a-page-42   # 404
curl.exe -sSI https://www.echomagazine.com.tr/robots.txt                # 200 text/plain
curl.exe -sS  https://www.echomagazine.com.tr/robots.txt                # User-agent: *
```

### Phase 1 — week 1, discovery and snippets

6. Remove or guard the 48 broken image references (stop the 1.23 MB/1k-views waste immediately).
7. Regenerate `sitemap.xml` with all 12 URLs and submit in Search Console.
8. Write meta descriptions for issue-01/02/03 and expand the eight weekly ones.
9. Add `.assetsignore`; verify `wrangler.jsonc`, `README.md`, `.vs/*` return 404.
10. Replace 98 `index.html` internal links with directory URLs.
11. Add favicon + manifest.

### Phase 2 — weeks 2–4, payload

12. Build an image pipeline: 1040 px max, q80 AVIF/WebP with JPEG fallback, hashed filenames.
13. Apply `loading="lazy" decoding="async"` to all magazine pages after the first two; add `width`/`height`.
14. Re-encode the four homepage covers; target < 150 KB each (from 423–846 KB).
15. Subset or replace Remixicon; self-host and preload the two used font faces.
16. Add `srcset`/`sizes` to weekly and homepage images.

### Phase 3 — month 1, signals and hygiene

17. Add JSON-LD (`Organization`, `WebSite`, `Article`/`PublicationIssue`) and complete OG/Twitter tags site-wide.
18. Add `_headers` with HSTS, CSP report-only, frame policy, and a hashed-asset cache policy.
19. Fix mobile tap targets and the 10.4–11.68 px text.
20. Add GA4/Clarity to the weekly pages so engagement can be measured.

### Expected impact (measured deltas, not projections)

| Change | Current | After | Basis |
|---|---|---|---|
| Homepage transfer | 3.73 MB | **~1.5–2.0 MB** | Remove the 1.23 MB broken-image bucket, re-encode four covers (2.44 MB → <0.6 MB), subset fonts (−0.25 MB); range reflects the pass overlap noted in §3.2 |
| Homepage requests | 80 | **~27** | −48 broken, −2 stylesheets, −3 font files |
| Homepage `load` (desktop) | 2,814 ms | **< 1,200 ms** | Broken-image removal + image/font reduction |
| Content visible (desktop) | ~4.0 s | **< 1.0 s** | Loader trigger change |
| Content visible (4G mobile) | 9.47 s | **< 3.0 s** | Loader + 1.8 MB less transfer |
| issue-02 transfer | 58.3 MB | **~3–5 MB** | q80 + 1040 px + AVIF ≈ −92–95% |
| Magazine total | ~132 MiB | **~12–20 MiB** | Same |
| Indexable URLs in sitemap | 1 | **12** | Sitemap regeneration |
| Pages with canonical | 4 | **12** | Template fix |
| Soft-404 responses | all unknown URLs | **0** | `not_found_handling` |

These are arithmetic from the measurements in §3 and §7, with no allowance for network variance.

---

## 10. Appendix

### 10.1 Command reference

```powershell
# status + headers + redirect chain
curl.exe -sSIL "https://www.echomagazine.com.tr/weekly/W001/"
curl.exe -sSI  "http://echomagazine.com.tr/"

# body size and content type of the soft-404
curl.exe -sS -o NUL -w "%{http_code} %{content_type} %{size_download}`n" `
  "https://www.echomagazine.com.tr/this-page-does-not-exist-xyz123"

# robots.txt actual body
curl.exe -sS "https://www.echomagazine.com.tr/robots.txt" | Select-Object -First 5

# sitemap
curl.exe -sS "https://www.echomagazine.com.tr/sitemap.xml"

# cache behaviour on repeat
1..3 | ForEach-Object {
  curl.exe -sSI "https://www.echomagazine.com.tr/assets/issue-01%20cover.jpg" |
    Select-String -Pattern "cf-cache-status|cache-control"
}

# compression
curl.exe -sSI -H "Accept-Encoding: br" "https://www.echomagazine.com.tr/" |
  Select-String -Pattern "content-encoding|vary"

# exposed files
curl.exe -sSI "https://www.echomagazine.com.tr/wrangler.jsonc"
curl.exe -sSI "https://www.echomagazine.com.tr/magazine/issue-01/.vs/dergi.slnx/v18/slnx.sqlite"
```

Playwright/CDP was used for `Network.responseReceived` (protocol, `encodedDataLength`), `PerformanceObserver` (LCP), `layout-shift` (CLS), and `Emulation.setDeviceMetricsOverride` / `Network.emulateNetworkConditions` for the 390×844 and 4G runs.

### 10.2 Raw measurements

**Homepage desktop 1440×900, cache disabled**

```
requests            80
transfer            3,726,966 B resources + 6,798 B document
TTFB                329 ms
FCP                 1,064 ms
LCP                 1,084 ms   IMG, 368,712 px², 543×679
CLS                 0.0007
load                2,814 ms
content visible     ~4,014 ms
fully interactive   ~4.8 s
```

**Homepage mobile 390×844, unthrottled**

```
requests            80
transfer            3.88 MB
TTFB                313 ms
LCP                 976 ms    H1.hero__title
CLS                 0
load                1,861 ms
```

**Homepage mobile 390×844, 9 Mbps / 150 ms / CPU 4×**

```
requests            72
transfer            3.005 MB
TTFB                498 ms
load                7,552 ms
loader hidden       9,469 ms
hero interactive    8,782 ms
```

**Magazine**

```
issue-01   30 images    9,916,479 B    TTFB 793 ms    load 7,738 ms
issue-02   95 images   58,312,632 B    load not fired @35 s (93 loaded)
issue-03   66 images   55,357,787 B    TTFB 448 ms    FCP 768 ms    LCP 928 ms    CLS 0.014    load 16,437 ms
totals    191 images   ~132 MiB         avg ~700 KB/page, max 4,606 KB
```

**Image re-encode tests (q80)**

```
issue-01 cover   845,661 → 102,905   −87.8%
issue-03 1.jpg   585,742 → 367,349   −37.3%   (720 px: 194,832, −66.7%)
26.jpg         3,262,976 → 373,208   −88.6%   (720 px: 132,910, −95.9%)
```

**Headers observed**

```
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
vary: accept-encoding
alt-svc: h3=":443"; ma=86400
access-control-allow-origin: *
link: <https://fonts.googleapis.com>; rel=preconnect
cache-control: public, max-age=0, must-revalidate        (HTML)
cache-control: public, max-age=14400, must-revalidate    (CSS/JPG)
cf-cache-status: DYNAMIC | EXPIRED | REVALIDATED | MISS   (no HIT observed)
```

**Protocols (homepage, CDP)**

```
h2        73
h3         1
http/1.1   4
data       2
```

### 10.3 MISSING — not verifiable with available access

| Item | Why | How to close |
|---|---|---|
| CrUX field data (LCP/CLS/INP p75) | No API key; PSI API returned HTTP 429 (quota exceeded) | PageSpeed Insights UI or CrUX API with a key |
| Lighthouse score | PSI unavailable; no local Lighthouse run | `npx lighthouse` against the live URL |
| GSC index coverage, impressions, clicks | No Search Console access | Export the Pages + Performance reports |
| Soft-404 volume Google has already recorded | Requires GSC | Coverage → "Soft 404" / "Duplicate, Google chose different canonical" |
| Cloudflare account rules (Transform/Redirect/Cache Rules, routes, HSTS toggle) | Dashboard access not available | Zone → Rules → Transform/Redirect; SSL/TLS → Edge Certificates |
| Root cause of the 200-homepage catch-all | Not reproducible from the repo config | Compare deployed build hash with repo; check for a Pages project or Worker route |
| Origin TTFB | Only edge TTFB observed | `cf-cache-status: DYNAMIC` + origin logs, or a bypass-header request |
| Real-device / field performance | Emulated Chromium only | WebPageTest mobile or CrUX |
| Googlebot crawl logs | No log access | Cloudflare Logpush / zone analytics |
| `/magazine/` index behaviour | Not separately requested | `curl.exe -sSI https://www.echomagazine.com.tr/magazine/` |
| Whether verification 308 is followed | Not observable | Check GSC verification status |
| GA4 / Clarity data | No property access; weekly pages untagged | Property dashboards; add tags to weekly first |

### 10.4 Sources

- Cloudflare Workers static assets: `html_handling`, `not_found_handling`, `_headers`, `_redirects`, `.assetsignore` (developers.cloudflare.com/workers/static-assets/).
- Google Search Central: robots.txt specification, sitemap format, soft 404 guidance, Core Web Vitals thresholds, mobile tap-target guidance.
- Measurements in this document were taken on 19 October 2026 against the live production host. The repository examined was `C:\Desktop\echo\EchoMagazineHub` (258 files, 137.3 MB, including a 129.1 MB `.git` directory).

