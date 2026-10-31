# On-Page, Content & AI-Search Readiness Audit — Echo Magazine

**Property:** https://www.echomagazine.com.tr/  
**Audit date:** 19 October 2026  
**Scope:** on-page metadata, content quality and depth, keyword and intent coverage, cannibalisation, E-E-A-T, structured data, AEO/GEO readiness, internal linking, title/meta/H1 rewrites.  
**Mode:** read-only. No site source, configuration, or content was modified.  
**Companion:** technical crawl/indexation/performance findings are in [`technical-seo.md`](./technical-seo.md). This report references them only where they change an on-page or content decision.

---

## 0. Task coverage

| Requested task | Where it is answered |
|---|---|
| 1. Page inventory table | §2 |
| 2. Keyword, intent and cannibalisation diagnosis | §3 |
| 3. E-E-A-T review | §4 |
| 4. Content quality and depth | §5 |
| 5. Exact schema types + ready-to-paste JSON-LD | §6 |
| 6. AEO/GEO readiness | §7 |
| 7. Internal linking plan | §8 |
| 8. Title/meta rewrites for all 12 pages + homepage H1 fix | §9 |
| 9. Severity-ranked findings with evidence, impact and exact fix | §10 |

Supporting material: 30/60/90 plan (§11), measurement plan (§12), MISSING data (§13), appendices (§14).

---

## 1. Method and evidence standard

**What was measured**

- All 12 live HTML pages were fetched over HTTPS and parsed for `<title>`, meta description, H1/H2/H3, canonical, Open Graph, Twitter Card, JSON-LD, `<time>`, `hreflang`, author markup, image `alt`, and internal links.
- Every live page was rendered in Chromium (Playwright), including a full homepage scroll, to count rendered words, images, broken images and visible links.
- Local source was read for the same 12 pages, `js/team.js`, `sitemap.xml`, `wrangler.jsonc` and the issue-page scripts. Local source was used to recover image counts, page counts and copy that is injected by JavaScript.
- Live HTTP behaviour was tested for missing URLs, missing assets, `robots.txt`, `llms.txt`, and crawler user agents (GPTBot, ClaudeBot, CCBot, anthropic-ai, Bytespider, OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended, Googlebot, Bingbot, Applebot).
- Issue covers and contents images were read directly to identify the real themes of Issues 01–03.

**Rules applied**

1. **Live values win** where live and local differ. Example: local weekly titles use an em dash; live serves `W001 - Echo Weekly` (18 characters).
2. **No invented facts.** Exact publication days are not visible on the pages, so schema uses month precision (`2026-09`) and is labelled as such. File timestamps were not treated as publication dates.
3. **No invented features.** There is no site search, so no `SearchAction`. There is no visible FAQ, so no `FAQPage`. There are no ratings, so no `Review`/`AggregateRating`.
4. **MISSING is a finding, not a zero.** Search Console, rankings, traffic, keyword volume and backlink data were not available and are marked MISSING in §13.
5. **Character counts** are for the exact string shown, including spaces and punctuation. Titles are <= 60 characters; descriptions are 140–160 characters.

**Important caveat on word counts.** "Body words" excludes navigation, footer, cookie/loader chrome and repeated boilerplate. It counts visible article prose only. The homepage's 735 words are the rendered main-column text, not the full HTML source.

---

## 2. Page inventory

The property has **12 indexable HTML pages**: one homepage, one weekly hub, seven weekly articles, and three issue readers. There is no `/magazine/` hub, no author pages, no About page, no editorial-policy page, no contact page and no category/topic hub.

| # | URL | Type | Live title (chars) | Meta description (chars) | H1 | Body words | Images (broken / no alt) | Canonical | JSON-LD |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `/` | Homepage / hub | `Echo Magazine \| Official Hub` (28) | 135 | **2 H1s:** `Echo` (loader) + `Different voices. Different perspectives. One Echo.` | 735 rendered | 53 (48 broken) | Yes, self | 0 |
| 2 | `/weekly/` | Weekly hub | `Weekly - Echo Magazine` (22) | 71 | `Stories between the issues.` | 305 | 5 (0 / 0) | **No** | 0 |
| 3 | `/magazine/issue-01/` | Issue reader | `Echo Magazine \| Issue 01` (24) | **0** | `Echo Magazine` | **15** | 30 (0 / 30) | Yes, self | 0 |
| 4 | `/magazine/issue-02/` | Issue reader | `Echo Magazine \| Issue 02` (24) | **0** | `Echo Magazine` | **15** | 95 (0 / 95) | Yes, self | 0 |
| 5 | `/magazine/issue-03/` | Issue reader | `Echo Magazine \| Issue 03` (24) | **0** | `Echo Magazine` | **15** | 66 (0 / 66) | Yes, self | 0 |
| 6 | `/weekly/W001/` | Article | `W001 - Echo Weekly` (18) | 32 | `Anaximander and the Origins of Evolution` | 776 | 1 (0 / 0) | **No** | 0 |
| 7 | `/weekly/W002/` | Article | `W002 - Echo Weekly` (18) | 32 | `The Voice of a Prime` | 632 | 1 (0 / 0) | **No** | 0 |
| 8 | `/weekly/W003/` | Article | `W003 - Echo Weekly` (18) | 40 | `IF` | 481 | 1 (0 / 0) | **No** | 0 |
| 9 | `/weekly/W004/` | Article | `W004 - Echo Weekly` (18) | 100 | `The Price of Mercy` | 550 | 0 | **No** | 0 |
| 10 | `/weekly/W005/` | Article / poem | `W005 - Echo Weekly` (18) | 23 | `Blood` | **57** | 0 | **No** | 0 |
| 11 | `/weekly/W006/` | Article | `W006 - Echo Weekly` (18) | 51 | `UN Is Changing Maps Now, But Why?` | 376 | 0 | **No** | 0 |
| 12 | `/weekly/W007/` | Article (Turkish) | `W007 - Echo Weekly` (18) | 35 | `Peki ya Nastenka?` | 221 | 0 | **No** | 0 |

**Totals and derived figures**

- Weekly article body words: **3,093** across 7 articles; mean **442**; median **481**; range **57–776**.
- **6 of 7** weekly articles are under 600 body words. Only W001 (776) clears 700.
- Issue readers contain **191 images** (30 + 95 + 66), **0 with `alt`**, and **15 visible words** each. The "article" text exists only inside JPEGs.
- **8 of 12 pages have no canonical** (weekly hub + all seven weeklies).
- **0 of 12 pages have any JSON-LD.**
- **0 of 12 pages have a `<time>` element, `datePublished`, `dateModified`, or `article:published_time`.**
- **0 of 12 pages have `hreflang`.** This is acceptable today; see §9.4.
- **3 of 12 pages have a meta description of 0 characters** (the three issue readers).
- The five shortest descriptions (23–40 chars) belong to W005, W001, W002, W007 and W003; W006's 51-character description is the sixth.

**Inventory notes that matter for search**

1. **The issue readers are not text pages.** Each renders a flipbook: one cover image plus 29/94/65 JS-injected page images. A crawler that does not execute the script sees one image; a crawler that does sees 30/95/66 images with no `alt`. In both cases it sees **15 words**: "Back to Hub", "Echo Magazine", "Issue 0X", "PREV", "1 / 95", "NEXT".
2. **The weekly hub is a card index, not a blog.** 305 words, seven cards, no canonical, no schema, no dates and no category structure. It links to all seven articles, but the homepage links to only one of them (W007).
3. **Every weekly title is a serial number.** `W001 - Echo Weekly` through `W007 - Echo Weekly` tell a reader nothing about the subject and give each article the same 18-character title pattern. The H1s are better, but they are not in the title tag.
4. **Three issue pages share the same H1 and title stem.** `Echo Magazine` / `Echo Magazine | Issue 0X` makes the three pages near-duplicates at the template level before any content is considered.
5. **Analytics only covers the homepage and the issue readers.** GA4 and Clarity are installed on `/` and the three issue pages, but not on `/weekly/` or W001–W007. Content performance is therefore unmeasurable even if traffic arrives.

---

## 3. Keyword, intent and cannibalisation diagnosis

### 3.1 What the site can realistically rank for

Echo is a new, small, teen-run publication with no backlink or authority data available (MISSING). It will not win head terms such as "teen magazine", "literary magazine" or "magazine for students" against established publishers on authority alone. Its realistic path is:

1. **Brand terms** — `echo magazine`, `echo magazine turkey`, `echomagazine.com.tr`, `echo magazine issue 3`.
2. **Long-tail article topics** where the writing is genuinely specific — Anaximander and evolution, Peter Cullen/Optimus Prime voice, Kipling's "If", *The Merchant of Venice* mercy, UN map reform and Africa, Dostoevsky's *White Nights* and Nastenka.
3. **Teen/student angle modifiers** — `teen essay on ...`, `student analysis of ...`, `magazine made by teens`, `teen literary magazine Turkey`.
4. **Issue queries** — `echo magazine issue 01`, `issue 02`, `issue 03`, and topic combinations from the contents pages.

The current metadata targets **none of these** except the brand. The homepage description targets "culture, design, fashion, creativity and timeless storytelling" — five terms that describe almost none of the published articles.

### 3.2 Page-by-page intent map

| Page | Primary intent | Query family it should own | Current targeting | Verdict |
|---|---|---|---|---|
| `/` | Navigational / discovery | `Echo Magazine`, `teen magazine made by teens`, `student magazine Turkey` | Brand + generic culture/design/fashion | Weak: promise mismatch, 2 H1s, no descriptive body copy above the fold |
| `/weekly/` | Browse / discovery | `Echo Weekly`, `teen essays`, `student writing` | `Weekly - Echo Magazine` | Weak: no canonical, no schema, slogan H1, 305 words |
| `/magazine/issue-01/` | Navigational / issue browse | `Echo Magazine Issue 01`, `teen magazine issue 1` | `Echo Magazine \| Issue 01` | Very weak: 15 words, 30 un-alt-texted images |
| `/magazine/issue-02/` | Navigational / issue browse | `Echo Magazine Issue 02` | `Echo Magazine \| Issue 02` | Very weak: 15 words, 95 images |
| `/magazine/issue-03/` | Navigational / issue browse | `Echo Magazine Issue 03` | `Echo Magazine \| Issue 03` | Very weak: 15 words, 66 images |
| `/weekly/W001/` | Informational | `Anaximander evolution`, `Anaximander apeiron`, `pre-Socratic philosophy` | `W001 - Echo Weekly` | Good H1, zero title targeting |
| `/weekly/W002/` | Informational | `Peter Cullen Optimus Prime voice`, `Peter Cullen death` | `W002 - Echo Weekly` | Good topic, title/H1 mismatch (`The Voice of a Prime` is vague) |
| `/weekly/W003/` | Informational | `If by Rudyard Kipling analysis`, `Kipling If meaning` | `W003 - Echo Weekly` | H1 `IF` is unusable as a query target |
| `/weekly/W004/` | Informational | `Merchant of Venice mercy speech analysis`, `Portia mercy` | `W004 - Echo Weekly` | Best description on the site (100 chars), still no title targeting |
| `/weekly/W005/` | Informational / emotional | `short poem about loss`, `poem about love and grief` | `W005 - Echo Weekly` | 57 words; cannot satisfy the intent |
| `/weekly/W006/` | Informational / news | `UN map reform Africa`, `why Africa looks small on maps` | `W006 - Echo Weekly` | Strong headline, only sourced article, title wastes it |
| `/weekly/W007/` | Informational (TR) | `Beyaz Geceler Nastenka`, `Dostoyevski Beyaz Geceler analiz` | `W007 - Echo Weekly` | Turkish content, English title/description, no Dostoevsky in H1 or meta |

### 3.3 Cannibalisation

There is **no query-level cannibalisation yet**, because no page targets a query precisely enough to compete with another. There is, however, **template-level cannibalisation** that will become real the moment titles are improved:

| Conflict | Pages | Mechanism | Fix |
|---|---|---|---|
| Brand query `Echo Magazine` | `/`, issue 01, issue 02, issue 03 | All four can rank for the brand; three issue pages share the H1 `Echo Magazine` and title stem `Echo Magazine \| Issue 0X` | Keep `/` as the brand page; make issue H1s `Echo Magazine Issue 01`, `... 02`, `... 03` and titles unique with themes (§9) |
| `Echo Weekly` | `/weekly/` + W001–W007 | Seven articles use the same `W00X - Echo Weekly` title and all link to the hub; none differentiates by topic | Hub owns `Echo Weekly`; articles own topic queries (§9) |
| `Formula 1` | Issue 01, Issue 02, Issue 03 covers | F1 appears in all three issues as a section, but no page is a dedicated F1 article | Do not create an F1 page per issue; create one `/topics/formula-1/` hub only after three text articles exist |
| `Dostoevsky` / `White Nights` | W007 only | No conflict today | Keep W007 as the Turkish canonical; if an English version is written, use a separate `/weekly/W008/` URL with reciprocal `hreflang`, not a translated block on W007 |
| `Merchant of Venice` / `Kipling` | W003, W004 | Both are "classic literature" but target different works | Cross-link as a cluster; do not merge |

### 3.4 Topical clusters and gaps

| Cluster | Existing pages | What is missing | Priority |
|---|---|---|---|
| Philosophy and big ideas | W001 (Anaximander), Issue 01 (Dreams), Issue 03 (Marcus Aurelius, butterfly effect) | A definitional explainer for `apeiron`; a Stoicism piece; a "what is philosophy for teenagers" hub | High — W001 is the strongest article and has no supporting cluster |
| Literature | W003 (Kipling), W004 (Shakespeare), W007 (Dostoevsky), Issue 02 (Orpheus, acrostics), Issue 03 (Dante, hip-hop) | Book reviews with spoiler-free summaries; poetry craft; a `/topics/literature/` hub | High |
| Science and environment | Issue 01 (marine life, 5G), Issue 02 (string theory, multiverse, evolution), Issue 03 (nuclear sharks, electricity, climate, 1816) | Source-backed explainers; a climate piece with data; a "science of..." series | High — currently image-only and uncitable |
| Culture and arts | Issue 01 (Met Gala, Grammys, Rio Carnival, Turkish art music), Issue 02 (Sofia Coppola, Victoria's Secret, Deftones, Edinburgh Fringe), Issue 03 (perfume, IDM/Aphex Twin, Total Drama Island) | Reviews, interviews, scene reports; a culture hub | Medium |
| World affairs | W006 (UN map reform), Issue 02 (South Korea, Bulgaria), Issue 03 (1816, climate) | Explainers with primary sources; a world-affairs hub | Medium — W006 is the only sourced article |
| Sport | Issue 01/02/03 (Formula 1) | One canonical F1 page or series, not three issue sections | Medium |
| Teen life and voice | Editor letters, W005, W007 | Student-life essays, first-person reporting, a "made by teens" manifesto with names and ages | High — this is the differentiator |

**Keyword volumes, difficulty and current rankings are MISSING.** No keyword tool export and no Search Console access were available. The recommendations above are intent-led, not volume-led.

---

## 4. E-E-A-T review

Echo has the raw material for strong E-E-A-T — real teen writers, a named editor-in-chief, original essays and a clear "created by teens for teens" identity. Almost none of it is exposed in a way a reader, search engine or AI system can verify.

### 4.1 Byline and author table

| Author | Articles | Role in `js/team.js` | Author page | Bio / credentials | Schema |
|---|---|---|---|---|---|
| Şevval Korkut | W001, W003, W007 | Founder & Editor-in-Chief | No | No | None |
| Arı Yaşayan | W002 | Writer | No | No | None |
| Melek Nas Gürkan | W004 | Co-Editor & Design Manager | No | No | None |
| Vespera | W005 | **Not in `team.js`** | No | No | None |
| Ahmet Tuğra Hisar | W006 | **Not in `team.js`** | No | No | None |

Every article shows `BY [NAME]` as plain text. There is no link to a bio, no role, no age or school (optional), no expertise statement, no social profile, no `rel="author"`, and no `Person` schema. Two of the five bylines cannot be matched to the masthead at all, which is a direct trust failure: a reader cannot tell whether "Vespera" is a pen name, a guest, or a mistake.

### 4.2 The four E-E-A-T dimensions

| Dimension | Evidence | Assessment |
|---|---|---|
| **Experience** | First-person teen voice; W001 opens "Dear Echo Reader"; W007 is a personal reading of *White Nights*; editor letters exist in issues | **Genuine but invisible.** No author bios say "17-year-old student in Istanbul" or "writes about philosophy". The experience is in the prose, not in the byline. |
| **Expertise** | W001 cites DK 12 A 10 / DK 12 B 1 and Peri Physeos; W006 links one UN press release; W004 reads Shakespeare closely | **Uneven.** W001 and W006 show research; W002 asserts a death date with no source; W005 is 57 words; W007 is 79% quotation. No editorial review or fact-check statement. |
| **Authoritativeness** | Named founder/editor; 47-person team; three issues; Instagram `@echomagazinne` | **Not corroborated off-site.** No About page, no masthead page, no editorial policy, no `Organization` schema, no `sameAs` beyond Instagram, no press page. The 47 team portraits are all broken, so the main visual proof of the team is missing. |
| **Trust** | Contact email `contact@echomagazine.com.tr`; no privacy page; no corrections policy; no dates on articles; issue pages have no text | **Weakest dimension.** A reader cannot see when an article was published or updated, who checked it, how to report an error, or what the publication's standards are. |

### 4.3 Exact fixes

1. **Create `/about/`** with: who Echo is, who it is for, who runs it, how stories are commissioned, how corrections are handled, and how to contact the team. Link it from the global nav and every footer.
2. **Create `/team/`** (or fix `/#team`) with the 47 real portraits, names, roles and optional one-line bios. Fix the broken image paths first. A team section with 47 broken images is worse than no team section.
3. **Create author pages** at `/authors/sevval-korkut/`, `/authors/ari-yasayan/`, `/authors/melek-nas-gurkan/`, `/authors/vespera/`, `/authors/ahmet-tugra-hisar/`. Each needs a name, role, short bio, list of articles, and optional `sameAs`. Add `ProfilePage` + `Person` schema.
4. **Reconcile the masthead.** Add Vespera and Ahmet Tuğra Hisar to `team.js`, or add a "Guest contributor" label and a one-line bio on the article. Do not leave a byline that cannot be matched to the team.
5. **Add a visible date and an "Updated" date** to every article. Use `<time datetime="YYYY-MM-DD">`. If only month/year is known, show `September 2026` and use month precision in schema until the exact day is confirmed.
6. **Add a sources block** to every research-based article. W002's death claim, W001's fragments and W006's UN vote all need links to primary or reputable secondary sources. A "Sources" H2 is enough; it does not need academic citation style.
7. **Add an editorial policy page** covering AI use, corrections, sponsored content, and independence. This is a trust signal for readers and for AI answer engines.

---

## 5. Content quality and depth

### 5.1 Depth scorecard

Scores are 1–5 and judge the page against the intent it claims to serve, not against a generic word-count target.

| Page | Words | Depth | Originality | Sourcing | Structure | Language | Main problem |
|---|---:|---:|---:|---:|---:|---:|---|
| W001 Anaximander | 776 | 4 | 4 | 3 | 4 | 2 | Strongest article; typos and unsourced fragments undermine it |
| W002 Peter Cullen | 632 | 4 | 4 | 1 | 3 | 3 | Unsourced death claim; "Canadian-American"; H1 too vague |
| W003 Kipling | 481 | 3 | 3 | 1 | 2 | 2 | One H2, no sources, confused pronoun argument |
| W004 Merchant of Venice | 550 | 3 | 3 | 1 | 3 | 3 | Good close reading; no sources; no scene references |
| W005 Blood | 57 | 1 | 3 | 0 | 1 | 2 | Not an article; a poem fragment with a typo and no context |
| W006 UN map | 376 | 3 | 3 | 4 | 3 | 3 | Best sourced; too short for the claim; one H2 |
| W007 Nastenka | 221 | 2 | 2 | 1 | 1 | 2 | 79% quotation; Dostoevsky never named; Turkish grammar error |

### 5.2 What is genuinely good

- **A real editorial voice.** W001's "Dear Echo Reader" and W007's personal address are not generic SEO copy. They sound like teenagers writing for other teenagers.
- **Specific, non-obvious topics.** Anaximander's *apeiron*, Peter Cullen's voice acting, the UN's map reform vote, and *White Nights* are not the usual teen-magazine fare. This is the site's competitive advantage.
- **W006 is a model for the rest.** It has a clear news hook, a named vote count (164 in favour, 1 against, 6 abstentions), a list of abstaining countries, and a link to the UN press release. It is still too short, but it is checkable.
- **W001 has real primary-text engagement.** It quotes DK 12 A 10 and DK 12 B 1 and explains the Diels–Kranz system. That is more than most student essays attempt.

### 5.3 What is thin, and why word count is not the whole answer

- **W005 (57 words)** is a poem, not an article. It has no introduction, no context, no author note and no reason to exist as a standalone URL. Either expand it into a poetry feature (the poem + 300 words on form and context) or publish it as part of a weekly poetry round-up.
- **W007 (221 words, 175 quoted)** is 79% quotation. The original commentary is roughly 46 words. It never names Dostoevsky in the body, so a reader who lands from search may not know whose *White Nights* is being discussed. It also contains a grammar error: `Hepimizi kendi hayatımızın hem Nastenkası hem de hayalperestiyiz.` should be `Hepimiz kendi hayatımızın hem Nastenkası hem de hayalperestiyiz.`
- **W003 (481 words)** has one H2 and a confused argument about pronouns: `Even his pronouns in the poem are he and him... His choice of pronouns is not a great appeal`. Kipling's speaker is giving advice to a son; the poem's power is in the conditional "If—", not in the speaker's gender. This needs a rewrite, not a tweak.
- **W002 (632 words)** claims `Following his death this year on the 26th of August` with no source. It also calls Cullen `Canadian-American`; Cullen is widely documented as Canadian. Both claims must be verified and sourced before the page is promoted.
- **W004 (550 words)** is a solid close reading but never cites act/scene or a edition, so a reader cannot check the quotations. Add act/scene references and one source for the play text.
- **W001 (776 words)** has the opposite problem: it is long enough, but `Anaximender` appears three times, `aperion` appears once, and `PreSocratic` should be `Pre-Socratic`. These are not style choices; they are factual/orthographic errors in a philosophy article.

### 5.4 Language and accuracy issues

| Page | Exact issue | Correction |
|---|---|---|
| W001 | `Anaximender` (3 occurrences) | `Anaximander` |
| W001 | `aperion` | `apeiron` |
| W001 | `PreSocratic` | `Pre-Socratic` |
| W001 | `Anaximander. He was born in Ionia...` | Sentence fragment; merge into one sentence |
| W001 | `he thought that the source...` after a comma splice | Add a full stop or semicolon |
| W002 | `Canadian-American` | `Canadian` unless dual citizenship is documented |
| W002 | `Following his death this year on the 26th of August` | Add a source and a year; do not rely on "this year" |
| W003 | `His choice of pronouns is not a great appeal` | Rewrite the paragraph; the claim is unclear and unsupported |
| W005 | `Glowes in the dark` | `Glows in the dark` |
| W006 | `UN Is Changing Maps Now, But Why?` | Acceptable headline, but the title tag should carry the topic, not `W006` |
| W007 | `Hepimizi kendi hayatımızın...` | `Hepimiz kendi hayatımızın...` |
| W007 | Dostoevsky is never named in the body | Add `Dostoyevski'nin Beyaz Geceler'i...` in the first sentence |
| Home | `03 Published Issue` | `3 Published Issues` |
| Home | `All Weeklys` | `All Weekly Stories` or `All Weeklies` (prefer the former) |
| Home | `Science, Sports & Arts and anything you are passionate about` | `Science, sport, arts and anything else you are passionate about` |

### 5.5 What each page needs to reach intent satisfaction

| Page | Current | Target | Add |
|---|---:|---:|---|
| Home | 735 | 900–1,100 | A clear 60-word "what Echo is" paragraph above the fold; three featured story cards; a "What you'll find" section with links to Magazine, Weekly, About, Team |
| Weekly hub | 305 | 500–700 | Intro paragraph, issue/date labels on cards, topic tags, a "Start here" block with W001/W004/W006 |
| Issue 01 | 15 | 600+ text | HTML contents with 11 section titles, one-line summaries, contributor names; a 150-word issue description; links to 3 text articles |
| Issue 02 | 15 | 900+ text | HTML contents with 20 section titles and summaries; a 150-word issue description; links to 3 text articles |
| Issue 03 | 15 | 800+ text | HTML contents with 16 section titles and summaries; a 150-word issue description; links to 3 text articles |
| W001 | 776 | 850–1,000 | Sources block, author bio, one diagram/timeline of Anaximander's cosmology, a "why it matters" close |
| W002 | 632 | 800–1,000 | Source for death date, clip references with timestamps, a "how the voice was built" section, author bio |
| W003 | 481 | 700–900 | Act/line references, a stanza-by-stanza structure, a corrected argument about the speaker, sources |
| W004 | 550 | 700–900 | Act/scene citations, a definition of mercy vs justice, one production or film reference, sources |
| W005 | 57 | 300–500 | Context for the poem, a note on form and imagery, author bio; or merge into a poetry feature |
| W006 | 376 | 700–900 | The actual map proposal, a before/after visual, why Mercator distorts Africa, the vote's next step, sources |
| W007 | 221 | 600–800 | Name Dostoevsky in the first sentence, reduce quotation to <40%, add plot context, a clear reading, sources |

---

## 6. Structured data

### 6.1 Schema matrix

| Page type | Current | Required types | Optional / later | Do **not** add |
|---|---|---|---|---|
| Homepage `/` | None | `Organization`, `WebSite`, `CollectionPage` (or `WebPage`) | `ItemList` of latest stories | `SearchAction` (no site search) |
| Weekly hub `/weekly/` | None | `Blog`, `BreadcrumbList` | `ItemList` of posts | `FAQPage` (no FAQ) |
| Weekly articles W001–W007 | None | `BlogPosting`, `BreadcrumbList` | `Person` (author), `Article` (if you prefer over BlogPosting) | `Review`, `AggregateRating` (no ratings) |
| Issue readers 01–03 | None | `PublicationIssue`, `PublicationVolume`, `BreadcrumbList` | `about` topics; `hasPart` only after text article pages exist | `Article` for the issue itself; `Book` (it is a magazine issue) |
| Author pages (future) | None | `ProfilePage`, `Person` | `sameAs` | `Organization` |
| `/magazine/` hub (future) | None | `CollectionPage`, `ItemList`, `BreadcrumbList` | `PublicationVolume` | `SearchAction` |

**Entity IDs used below.** Replace nothing except the dates once exact days are confirmed. `@id` values are stable and should be reused across pages so Google can merge the organization, website and articles into one entity.

### 6.2 Homepage — Organization + WebSite + CollectionPage

Paste inside `<head>` on `/`. **No `SearchAction`** because the site has no search endpoint.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.echomagazine.com.tr/#organization",
      "name": "Echo Magazine",
      "alternateName": "Echo",
      "url": "https://www.echomagazine.com.tr/",
      "email": "contact@echomagazine.com.tr",
      "description": "An independent digital magazine created by teens for teens, covering literature, science, culture and world affairs.",
      "sameAs": [
        "https://www.instagram.com/echomagazinne"
      ],
      "knowsAbout": [
        "Literature",
        "Philosophy",
        "Science",
        "Culture",
        "World affairs"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.echomagazine.com.tr/#website",
      "url": "https://www.echomagazine.com.tr/",
      "name": "Echo Magazine",
      "publisher": { "@id": "https://www.echomagazine.com.tr/#organization" },
      "inLanguage": "en"
    },
    {
      "@type": "CollectionPage",
      "@id": "https://www.echomagazine.com.tr/#webpage",
      "url": "https://www.echomagazine.com.tr/",
      "name": "Teen Magazine Made by Teens | Echo Magazine",
      "description": "Echo Magazine is an independent teen magazine of literature, science, culture and world affairs. Read every issue and weekly story, written by students.",
      "isPartOf": { "@id": "https://www.echomagazine.com.tr/#website" },
      "about": { "@id": "https://www.echomagazine.com.tr/#organization" },
      "inLanguage": "en",
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://www.echomagazine.com.tr/assets/hero/hero-cover3.jpg"
      }
    }
  ]
}
</script>
```

**Note on the logo.** There is no logo file on the site. `Organization` does not require `logo`, but Google's organization rich result does. Add a square PNG/SVG logo at `/assets/logo.png` and then add:

```json
"logo": {
  "@type": "ImageObject",
  "url": "https://www.echomagazine.com.tr/assets/logo.png",
  "width": 512,
  "height": 512
}
```

Do not point `logo` at a cover image; it is not a logo.

### 6.3 Weekly article — BlogPosting (W001 example)

Use one block per article, changing `headline`, `description`, `url`, `image`, `datePublished`, `dateModified`, `author`, `wordCount`, `articleSection` and `about`.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://www.echomagazine.com.tr/weekly/W001/#article",
  "headline": "Anaximander and the Origins of Evolution",
  "description": "Anaximander proposed apeiron as the source of all things in 610 BC. A teen look at how his ideas anticipate modern evolution and scientific thought.",
  "url": "https://www.echomagazine.com.tr/weekly/W001/",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.echomagazine.com.tr/weekly/W001/"
  },
  "image": {
    "@type": "ImageObject",
    "url": "https://www.echomagazine.com.tr/assets/weekly/w001-anaximander2.jpg"
  },
  "datePublished": "2026-09",
  "dateModified": "2026-09",
  "author": {
    "@type": "Person",
    "name": "Şevval Korkut",
    "url": "https://www.echomagazine.com.tr/authors/sevval-korkut/"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://www.echomagazine.com.tr/#organization",
    "name": "Echo Magazine",
    "url": "https://www.echomagazine.com.tr/"
  },
  "isPartOf": {
    "@type": "Blog",
    "@id": "https://www.echomagazine.com.tr/weekly/#blog",
    "name": "Echo Weekly",
    "url": "https://www.echomagazine.com.tr/weekly/"
  },
  "inLanguage": "en",
  "wordCount": 776,
  "articleSection": "Philosophy",
  "about": [
    { "@type": "Thing", "name": "Anaximander" },
    { "@type": "Thing", "name": "Apeiron" },
    { "@type": "Thing", "name": "Evolution" }
  ]
}
</script>
```

**Date rule.** `2026-09` is month precision because the page only displays `SEPTEMBER 2026`. Replace it with the exact `YYYY-MM-DD` once the publication day is confirmed. Do not guess a day. If the article is updated later, change `dateModified` and show the update visibly.

### 6.4 Weekly hub — Blog + ItemList

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": "https://www.echomagazine.com.tr/weekly/#blog",
      "url": "https://www.echomagazine.com.tr/weekly/",
      "name": "Echo Weekly",
      "description": "Short stories, literature essays, poems and personal perspectives written by teen contributors between issues.",
      "publisher": {
        "@type": "Organization",
        "@id": "https://www.echomagazine.com.tr/#organization",
        "name": "Echo Magazine",
        "url": "https://www.echomagazine.com.tr/"
      },
      "inLanguage": "en",
      "blogPost": [
        {
          "@type": "BlogPosting",
          "headline": "Anaximander and the Origins of Evolution",
          "url": "https://www.echomagazine.com.tr/weekly/W001/",
          "datePublished": "2026-09",
          "author": { "@type": "Person", "name": "Şevval Korkut" }
        },
        {
          "@type": "BlogPosting",
          "headline": "Peter Cullen: The Voice of Optimus Prime",
          "url": "https://www.echomagazine.com.tr/weekly/W002/",
          "datePublished": "2026-09",
          "author": { "@type": "Person", "name": "Arı Yaşayan" }
        },
        {
          "@type": "BlogPosting",
          "headline": "If by Rudyard Kipling: A Teen Reading",
          "url": "https://www.echomagazine.com.tr/weekly/W003/",
          "datePublished": "2026-09",
          "author": { "@type": "Person", "name": "Şevval Korkut" }
        },
        {
          "@type": "BlogPosting",
          "headline": "The Merchant of Venice: Mercy and Power",
          "url": "https://www.echomagazine.com.tr/weekly/W004/",
          "datePublished": "2026-09",
          "author": { "@type": "Person", "name": "Melek Nas Gürkan" }
        },
        {
          "@type": "BlogPosting",
          "headline": "Blood: A Poem About Love and Loss",
          "url": "https://www.echomagazine.com.tr/weekly/W005/",
          "datePublished": "2026-10",
          "author": { "@type": "Person", "name": "Vespera" }
        },
        {
          "@type": "BlogPosting",
          "headline": "UN Map Reform: Why Africa Looks Too Small",
          "url": "https://www.echomagazine.com.tr/weekly/W006/",
          "datePublished": "2026-10",
          "author": { "@type": "Person", "name": "Ahmet Tuğra Hisar" }
        },
        {
          "@type": "BlogPosting",
          "headline": "Peki ya Nastenka? Beyaz Geceler'e Bakış",
          "url": "https://www.echomagazine.com.tr/weekly/W007/",
          "datePublished": "2026-10",
          "author": { "@type": "Person", "name": "Şevval Korkut" },
          "inLanguage": "tr"
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.echomagazine.com.tr/weekly/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.echomagazine.com.tr/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Echo Weekly",
          "item": "https://www.echomagazine.com.tr/weekly/"
        }
      ]
    }
  ]
}
</script>
```

### 6.5 Issue reader — PublicationIssue + PublicationVolume

Use this on `/magazine/issue-03/`, changing `issueNumber`, `name`, `url`, `image`, `description` and `about` for 01 and 02. The issue has no visible publication date, so `datePublished` is deliberately omitted; add it only when the date is shown on the page.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "PublicationIssue",
  "@id": "https://www.echomagazine.com.tr/magazine/issue-03/#issue",
  "issueNumber": 3,
  "name": "Echo Magazine Issue 03",
  "url": "https://www.echomagazine.com.tr/magazine/issue-03/",
  "description": "Issue 03 of Echo Magazine: Marcus Aurelius, the butterfly effect, the history of perfume, nuclear sharks, IDM and Aphex Twin, Formula 1, electricity, Dante's Inferno, hip-hop, climate change, 1816 and the Olympic Games.",
  "image": {
    "@type": "ImageObject",
    "url": "https://www.echomagazine.com.tr/assets/covers/issue-03.jpg"
  },
  "isPartOf": {
    "@type": "PublicationVolume",
    "@id": "https://www.echomagazine.com.tr/magazine/#publication",
    "name": "Echo Magazine"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://www.echomagazine.com.tr/#organization",
    "name": "Echo Magazine",
    "url": "https://www.echomagazine.com.tr/"
  },
  "inLanguage": "en",
  "about": [
    { "@type": "Thing", "name": "Marcus Aurelius" },
    { "@type": "Thing", "name": "Butterfly effect" },
    { "@type": "Thing", "name": "Nuclear sharks" },
    { "@type": "Thing", "name": "Formula 1" },
    { "@type": "Thing", "name": "Climate change" }
  ]
}
</script>
```

**Do not use `hasPart` yet.** The issue contains 16 sections, but none has its own HTML URL. Marking up image pages as `Article` would create 16 empty article entities. Add `hasPart` only after you publish text article pages for each section, with each part pointing to a real URL.

**Breadcrumb** (add the visible breadcrumb first — see §8.2):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://www.echomagazine.com.tr/magazine/issue-03/#breadcrumb",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.echomagazine.com.tr/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Magazine",
      "item": "https://www.echomagazine.com.tr/magazine/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Issue 03",
      "item": "https://www.echomagazine.com.tr/magazine/issue-03/"
    }
  ]
}
</script>
```

The `Magazine` breadcrumb URL does not exist yet. Create `/magazine/` before shipping this block, or omit position 2 until it does. Never mark up a URL that returns the soft-404 homepage.

### 6.6 Author page — ProfilePage + Person (future)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://www.echomagazine.com.tr/authors/sevval-korkut/#profile",
  "url": "https://www.echomagazine.com.tr/authors/sevval-korkut/",
  "name": "Şevval Korkut — Echo Magazine",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://www.echomagazine.com.tr/authors/sevval-korkut/#person",
    "name": "Şevval Korkut",
    "jobTitle": "Founder & Editor-in-Chief",
    "description": "Founder and editor-in-chief of Echo Magazine. Writes about philosophy, literature and culture.",
    "worksFor": { "@id": "https://www.echomagazine.com.tr/#organization" },
    "knowsAbout": ["Philosophy", "Literature", "Editing"]
  },
  "isPartOf": { "@id": "https://www.echomagazine.com.tr/#website" }
}
</script>
```

### 6.7 Validation checklist

- [ ] Paste each block into the [Schema Markup Validator](https://validator.schema.org/) and Google's Rich Results Test.
- [ ] Confirm every `@id` resolves to the same entity across pages (Organization and WebSite are reused, not redefined).
- [ ] Confirm every URL in schema returns **200 with the correct page**, not the soft-404 homepage.
- [ ] Confirm `datePublished` matches a visible date on the page.
- [ ] Confirm `author.url` resolves to a real author page before adding it.
- [ ] Do not add `aggregateRating`, `reviewCount`, `FAQPage` or `SearchAction` until the visible feature exists.

---

## 7. AEO / GEO readiness

"AI search" here means both **answer engines** (Google AI Overviews, Perplexity, ChatGPT Search, Copilot) and **generative engines** that cite sources. The two requirements are different: answer engines need extractable, passage-level text; generative engines need crawl access, entity clarity and citations.

### 7.1 Readiness scorecard

| Dimension | Score /10 | Evidence | What would raise it |
|---|---:|---|---|
| Crawl access for AI agents | 4 | GPTBot, ClaudeBot, CCBot, anthropic-ai and Bytespider return **403** at the edge; OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended, Googlebot, Bingbot and Applebot return 200 | Allow verified AI crawlers at Cloudflare; keep generic scrapers blocked |
| Extractable text | 2 | Issue pages have 15 visible words and 191 images; weekly articles are text but average 442 words | HTML contents + summaries + article pages for every issue section |
| Passage-level answers | 3 | Articles open with narrative, not a direct answer; no TL;DR, no question H2s, no key-takeaways block | Add a 40–60 word answer paragraph under each H1; use question-form H2s |
| Structured data | 0 | 0 JSON-LD on 12 pages | §6 |
| Entity clarity | 2 | No About page, no author pages, no `Organization` schema, one Instagram link, no Wikipedia/Wikidata/press | About + team + author pages + `sameAs` + consistent NAP |
| Citations and verifiability | 1 | 1 external source across 7 articles (W006); W002 death claim unsourced | Sources block on every research article; link primary documents |
| Freshness | 3 | Month/year only; no `<time>`, no `dateModified`, no "Updated" | Visible dates + schema + update log |
| `llms.txt` / agent guidance | 0 | `/llms.txt` returns the homepage HTML (soft 404) | Publish a real `/llms.txt` with canonical sections and a content-use policy |
| Original information gain | 6 | Teen perspective, original essays, issue covers, interviews | Add original data: a teen survey, a scene report, a named interview |
| **Overall** | **2.3** | | |

### 7.2 The 403 problem is the first AI-visibility blocker

The edge returns `403` to GPTBot, ClaudeBot, CCBot, anthropic-ai and Bytespider, while allowing OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended, Googlebot, Bingbot and Applebot. That is a **deliberate or inherited Cloudflare bot-fight rule**, not a `robots.txt` directive (the robots file is HTML and contains no rules).

**Exact fix:** in Cloudflare → Security → WAF → Custom rules, add an allow rule for **verified** bots before the block rule:

```
(http.user_agent contains "GPTBot") or
(http.user_agent contains "ClaudeBot") or
(http.user_agent contains "CCBot") or
(http.user_agent contains "anthropic-ai") or
(http.user_agent contains "Bytespider")
```

Then require `cf.client.bot` or a verified-bot lookup so a spoofed user agent does not inherit the allow. Do **not** blanket-allow `*bot*`. Re-test with `curl -A "GPTBot" -I https://www.echomagazine.com.tr/` and confirm `200`.

Why this matters: if GPTBot and ClaudeBot cannot fetch the pages, ChatGPT Search and Claude cannot cite Echo even when a reader asks about Anaximander, Peter Cullen or the UN map vote. PerplexityBot and OAI-SearchBot are allowed today, which is why the site is not completely invisible — but the coverage is partial and accidental.

### 7.3 Making the issue pages citable

An image-only flipbook cannot be quoted. An AI system cannot extract a sentence from a JPEG, and Google cannot rank a page that says only "Echo Magazine / Issue 03 / 1 / 95". The fix is not to remove the flipbook; it is to add a **text layer** beside it:

1. **A 150-word issue summary** at the top: what the issue is about, who wrote it, how many sections, and three named highlights.
2. **An HTML table of contents** with every section title, a one-sentence summary, the contributor, and a link to a text article page. Issue 03 has 16 sections; Issue 02 has 20; Issue 01 has 11.
3. **Text article pages** for at least three sections per issue. These can be short (400–700 words) and can reuse the magazine copy. They are the pages that rank and get cited; the flipbook remains the visual edition.
4. **A "cite this issue" block** with the publication name, issue number, year and a stable URL. This is what an AI answer can reference.
5. **Image alt text** for every page: `Issue 03, page 7: "The History of Perfume" by [name]` — descriptive, not keyword-stuffed.

### 7.4 Passage-level optimisation patterns

Use these on every weekly article and every new issue article:

**Answer-first opening (40–60 words).** Replace the narrative warm-up with a direct answer, then continue the story. Example for W001:

> Anaximander (c. 610–546 BC) argued that everything comes from *apeiron*, an indefinite substance without limits. His idea is one of the earliest recorded theories of natural development, and it anticipates later evolutionary thinking by more than two millennia.

**Question-form H2s.** `What did Anaximander mean by apeiron?`, `Why does the cycle of existence matter?`, `How close was Anaximander to evolution?` These match how people ask and give an AI system a clean passage to extract.

**Key takeaways block.** Three bullets at the end: the claim, the evidence, the caveat. This is the block AI answers most often quote.

**Definitions in the first sentence.** For W006: `The UN's map reform proposal would redraw the boundary between Africa and the Middle East on official maps.` A reader or model should not have to infer the topic from a headline.

**Citations inline, not only at the end.** `According to the UN press release (GA/12779, 2026)...` is more citable than a bare link at the bottom.

### 7.5 `llms.txt` and agent guidance

`/llms.txt` currently returns the homepage HTML with `200`, which is worse than a 404 because an agent may treat the homepage as the file. Publish a real `text/plain` file at the root:

```
# Echo Magazine
> An independent digital magazine created by teens for teens, covering literature, science, culture and world affairs.

## Core pages
- [Home](https://www.echomagazine.com.tr/): current issue and latest weekly stories
- [Echo Weekly](https://www.echomagazine.com.tr/weekly/): short stories, essays and poems
- [Magazine archive](https://www.echomagazine.com.tr/magazine/): all issues
- [About](https://www.echomagazine.com.tr/about/): who we are and how we work
- [Team](https://www.echomagazine.com.tr/team/): contributors and editors

## Issues
- [Issue 01](https://www.echomagazine.com.tr/magazine/issue-01/)
- [Issue 02](https://www.echomagazine.com.tr/magazine/issue-02/)
- [Issue 03](https://www.echomagazine.com.tr/magazine/issue-03/)

## Weekly
- [Anaximander and the Origins of Evolution](https://www.echomagazine.com.tr/weekly/W001/)
- [Peter Cullen: The Voice of Optimus Prime](https://www.echomagazine.com.tr/weekly/W002/)
- [If by Rudyard Kipling: A Teen Reading](https://www.echomagazine.com.tr/weekly/W003/)
- [The Merchant of Venice: Mercy and Power](https://www.echomagazine.com.tr/weekly/W004/)
- [Blood: A Poem About Love and Loss](https://www.echomagazine.com.tr/weekly/W005/)
- [UN Map Reform: Why Africa Looks Too Small](https://www.echomagazine.com.tr/weekly/W006/)
- [Peki ya Nastenka? Beyaz Geceler'e Bakış](https://www.echomagazine.com.tr/weekly/W007/)

## Use
- Cite Echo Magazine with the article title and URL.
- Do not reproduce full issues or article text without permission.
- Contact: contact@echomagazine.com.tr
```

`llms.txt` is not a Google ranking factor. It is an agent convenience and a content-use signal. Do not pretend it replaces schema, sitemaps or readable HTML.

### 7.6 Measurement for AI visibility

- **Referral traffic:** GA4 → Reports → Acquisition → Traffic acquisition → Session source contains `chatgpt.com`, `perplexity.ai`, `claude.ai`, `copilot.microsoft.com`, `gemini.google.com`.
- **Server logs:** count requests by user agent `GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`, `CCBot`; confirm 200s after the WAF change.
- **Citation checks:** once a month, ask the same 10 questions in ChatGPT, Perplexity, Claude and Google AI Overviews; record whether Echo is cited, which URL, and which sentence. This is manual and imperfect, but it is the only direct check.
- **Brand mentions:** search `"Echo Magazine"` plus the article topic; record whether AI answers mention the site without a link.
- **No rank tracking can substitute for this.** AI answers are personalised and non-deterministic; treat the checks as directional.

---

## 8. Internal linking plan

### 8.1 Current state

| Source | Unique internal destinations | Link tags (excl. CSS) | Notes |
|---|---:|---:|---|
| Homepage | **5** | **38** | 6 page links (Issue 03 is linked twice) + **32 same-page anchors**; only W007 is featured; no link to W001–W006 |
| Weekly hub | **8** | **39** | Home + 7 articles, but repeated across header/footer; no canonical and no topic grouping |
| Issue 01 | **1** | **1** | Back to hub only |
| Issue 02 | **1** | **1** | Back to hub only |
| Issue 03 | **1** | **1** | Back to hub only; no article links |
| W001–W006 | **2 each** | **10 each** | Home + weekly hub, repeated in nav/footer; no prev/next, no related, no author link |
| W007 | **2** | **10** | Home + weekly hub, repeated in nav/footer; no related links |

There are **no true orphans** (every page is reachable from the hub), but the homepage — the strongest page — passes almost no authority to the articles: it links to only **five distinct pages**, and only one weekly article (W007). The 32 same-page anchors dilute the signal further: they are navigation, not editorial links. The weekly pages repeat the same two destinations up to ten times, which adds no crawl value and makes the footer look link-heavy.

### 8.2 Global navigation (every page)

Add a real header/footer nav, not just section anchors:

```
Home | Magazine | Weekly | About | Team | Contact
```

- `Magazine` → `/magazine/` (new hub)
- `Weekly` → `/weekly/`
- `About` → `/about/` (new)
- `Team` → `/team/` (new, or `/#team` until built)
- `Contact` → `/contact/` (new) or `mailto:contact@echomagazine.com.tr`

Add a **visible breadcrumb** on every page below the nav:

- Weekly article: `Home > Echo Weekly > Anaximander and the Origins of Evolution`
- Issue: `Home > Magazine > Issue 03`
- Hub: `Home > Echo Weekly`

Mark up the breadcrumb with `BreadcrumbList` only after it is visible.

### 8.3 Homepage link plan

| Block | Link to | Anchor text |
|---|---|---|
| Hero CTA | `/magazine/issue-03/` | `Read Issue 03` |
| Latest issue card | `/magazine/issue-03/` | `Issue 03: Science, sport and teen voices` |
| Featured weekly | `/weekly/W007/` | `Peki ya Nastenka? A reading of White Nights` |
| New "Latest stories" row | `/weekly/W001/`, `/weekly/W004/`, `/weekly/W006/` | `Anaximander and the origins of evolution`; `The Merchant of Venice: mercy and power`; `UN map reform: why Africa looks too small` |
| Archive | `/magazine/` | `Browse all issues` |
| About strip | `/about/` | `Who makes Echo Magazine` |
| Team strip | `/team/` | `Meet the 47 contributors` (only after images are fixed) |
| Newsletter | `/weekly/` | `Read this week's stories` |

Remove or reduce the 32 same-page anchors. Keep `#latest`, `#archive`, `#about`, `#team`, `#contact` only if those sections still exist; do not use them as the primary navigation.

### 8.4 Weekly hub link plan

- Keep the seven article cards.
- Add a **"Start here"** block: W001 (philosophy), W004 (literature), W006 (world affairs).
- Add **topic labels** to each card: `Philosophy`, `Culture`, `Literature`, `World affairs`, `Poetry`.
- Add **prev/next issue** links: `Issue 02` and `Issue 03`.
- Add a link to `/magazine/` and `/about/`.
- Add `datePublished` and `author` to each card (visible), not just in schema.

### 8.5 Article footer link plan

Every weekly article should end with:

1. **Author block:** name, role, one-line bio, link to `/authors/[slug]/`.
2. **Sources:** 2–5 links, visible.
3. **Related reading:** 2–3 links, chosen by topic, not by recency.
4. **Prev/next:** `Previous: W00X` / `Next: W00X`.
5. **Issue link:** `This story appeared in Issue 0X` (only if true; do not invent a print placement).
6. **Newsletter CTA:** `Get the next Echo Weekly in your inbox`.

### 8.6 Cluster link matrix

| From | To | Anchor | Reason |
|---|---|---|---|
| W001 | W003 | `Kipling's If and the ethics of patience` | Philosophy ↔ literature |
| W001 | Issue 03 | `Issue 03: Marcus Aurelius and the butterfly effect` | Ancient philosophy cluster |
| W002 | W004 | `Shakespeare's study of power and mercy` | Performance/text cluster |
| W003 | W004 | `The Merchant of Venice: mercy and power` | Classic literature cluster |
| W004 | W007 | `Dostoevsky's White Nights and the dreamer` | Love/literature cluster |
| W005 | W007 | `Another story about love and loss` | Poetry ↔ prose |
| W006 | Issue 03 | `Issue 03: climate, 1816 and the maps we inherit` | World affairs/climate cluster |
| W007 | W005 | `Blood: a poem about love and loss` | Thematic pairing |
| Issue 01 | W001 | `Read the full Anaximander essay` | Issue → text article |
| Issue 02 | W002 | `Read the full Peter Cullen story` | Issue → text article |
| Issue 03 | W006 | `Read the full UN map reform analysis` | Issue → text article |

### 8.7 Internal linking rules

- **One link per target per block.** Do not repeat the same link five times in a footer.
- **Descriptive anchors.** Never `Read more`, `Click here`, `All Weeklys`.
- **No `index.html` in internal hrefs.** `href="../../index.html"` causes a 308 redirect; use `/` or the directory URL. This is an easy site-wide fix.
- **No `href="#"` social links.** The footer has an empty Instagram icon link next to the real one; remove it or point it to the profile.
- **Link the hub from every article, and the article from the hub.** That is already true for the hub; the homepage is the missing bridge.
- **Do not link to a page that returns the soft-404 homepage.** Fix the catch-all first, then add links.

---

## 9. Titles, descriptions, H1s and hreflang

### 9.1 Rewrite rules

- Title <= 60 characters, primary query first, brand last only when it fits.
- Description 140–160 characters, active voice, one concrete promise, no keyword stuffing.
- One H1 per page. The H1 may differ from the title tag, but it must describe the page, not the brand alone.
- Keep the live URL; do not change paths as part of this rewrite.
- Turkish page W007 gets Turkish metadata; the rest stay English.

### 9.2 All 12 title/description rewrites

| # | Page | Current title (chars) | New title (chars) | New description (chars) | New H1 |
|---|---|---|---|---|---|
| 1 | `/` | `Echo Magazine \| Official Hub` (28) | `Teen Magazine Made by Teens \| Echo Magazine` (43) | `Echo Magazine is an independent teen magazine of literature, science, culture and world affairs. Read every issue and weekly story, written by students.` (152) | `A teen magazine made by teens, for teens.` (41) |
| 2 | `/weekly/` | `Weekly - Echo Magazine` (22) | `Echo Weekly: Teen Stories, Essays & Ideas` (41) | `Echo Weekly is the space between issues: short stories, literature essays, poems and personal perspectives written by teen contributors from our team.` (150) | `Echo Weekly: stories between the issues.` (40) |
| 3 | `/magazine/issue-01/` | `Echo Magazine \| Issue 01` (24) | `Echo Issue 01: Dreams, Met Gala, F1 & 5G` (40) | `Issue 01 explores dreams, the Met Gala, the Grammys, Rio Carnival, Turkish art music, Formula 1, marine life, 5G and internet privacy through teen eyes.` (152) | `Echo Magazine Issue 01: Dreams, Met Gala and F1` (47) |
| 4 | `/magazine/issue-02/` | `Echo Magazine \| Issue 02` (24) | `Echo Issue 02: String Theory, Myths & Korea` (43) | `Issue 02 covers string theory, the multiverse, South Korea, Sofia Coppola, Victoria's Secret, Greek myth, Deftones, gaming and human evolution.` (143) | `Echo Magazine Issue 02: Science, Myth and Korea` (47) |
| 5 | `/magazine/issue-03/` | `Echo Magazine \| Issue 03` (24) | `Echo Issue 03: Science, Sport & Teen Voices` (43) | `Issue 03 ranges from Marcus Aurelius and the butterfly effect to nuclear sharks, Formula 1, climate change, hip-hop and Olympic history. Written by teens.` (154) | `Echo Magazine Issue 03: Science, Sport and Teen Voices` (54) |
| 6 | `/weekly/W001/` | `W001 - Echo Weekly` (18) | `Anaximander and the Origins of Evolution \| Echo` (47) | `Anaximander proposed apeiron as the source of all things in 610 BC. A teen look at how his ideas anticipate modern evolution and scientific thought.` (148) | `Anaximander and the Origins of Evolution` (40) |
| 7 | `/weekly/W002/` | `W002 - Echo Weekly` (18) | `Peter Cullen: The Voice of Optimus Prime \| Echo` (47) | `Peter Cullen turned a few words into Optimus Prime's voice. How the Canadian actor built a hero through restraint, warmth and conviction on screen.` (147) | `Peter Cullen: The Voice of Optimus Prime` (40) |
| 8 | `/weekly/W003/` | `W003 - Echo Weekly` (18) | `If by Rudyard Kipling: A Teen Reading \| Echo` (44) | `Rudyard Kipling's If is a father's advice on patience, risk and integrity. A close reading of the poem's claims, pronouns and limits in four stanzas.` (149) | `If by Rudyard Kipling: A Teen Reading` (37) |
| 9 | `/weekly/W004/` | `W004 - Echo Weekly` (18) | `The Merchant of Venice: Mercy & Power \| Echo` (44) | `Portia's mercy speech in The Merchant of Venice asks whether justice can be tempered. A teen reading of power, debt and belonging in Venice.` (140) | `The Merchant of Venice: Mercy and Power` (39) |
| 10 | `/weekly/W005/` | `W005 - Echo Weekly` (18) | `Blood: A Poem About Love and Loss \| Echo` (40) | `A short poem about love, grief and the light that stays after loss, written for Echo Weekly by a teen contributor. Read it in under a minute.` (141) | `Blood: A Poem About Love and Loss` (33) |
| 11 | `/weekly/W006/` | `W006 - Echo Weekly` (18) | `UN Map Reform: Why Africa Looks Too Small \| Echo` (48) | `The UN has redrawn maps before. Why Africa's size and borders stay distorted, and what a new map reform vote would change for member states.` (140) | `UN Map Reform: Why Africa Looks Too Small` (41) |
| 12 | `/weekly/W007/` | `W007 - Echo Weekly` (18) | `Peki ya Nastenka? Beyaz Geceler'e Bakış \| Echo` (46) | `Dostoyevski'nin Beyaz Geceler'inde Nastenka kimdir? Hayalperestin aşkını, yalnızlığını ve kendi hayatımıza düşen payı okuyoruz. Bir edebiyat okuması.` (149) | `Peki ya Nastenka? Beyaz Geceler'e Bakış` (39) |

### 9.3 Homepage H1 fix

**Problem.** The homepage has two H1s: the loader logo `Echo` and the hero line `Different voices. Different perspectives. One Echo.` The loader H1 is decorative and appears before the real page; the hero H1 is a slogan that contains no descriptive keyword. A screen reader hears "Echo" as the page's first heading, and Google sees two competing H1s.

**Exact fix.**

```html
<!-- Loader: decorative, not a heading -->
<div class="loader__logo" aria-hidden="true">Echo</div>

<!-- Hero: one descriptive H1 -->
<h1 class="hero__title">A teen magazine made by teens, for teens.</h1>

<!-- Keep the old slogan as a supporting line, not a heading -->
<p class="hero__sub">Different voices. Different perspectives. One Echo.</p>
```

If the visual design requires the logo to remain a heading, make it a `<div>` with the same class and add `aria-hidden="true"`. Do not keep both as H1. The existing CSS targets `.loader__logo` and `.hero__title` classes, so changing the tag does not break the layout; add a `.hero__sub` rule for the supporting line (or reuse the existing hero paragraph style).

**Why this H1.** It names the entity (`teen magazine`), the differentiator (`made by teens`) and the audience (`for teens`) in 41 characters. It matches the homepage description and the site's actual content. It is also the phrase a person would use when recommending the site.

### 9.4 Hreflang

**Finding:** there is **no `hreflang` markup on any page**, and **no alternate-language version of any URL exists**. W007 is Turkish content with `lang="tr"`, but there is no English translation of W007 and no `/tr/` site.

**Verdict:** **no hreflang is acceptable and correct today.** Adding self-referential `hreflang="en"` alone would do nothing useful; adding `hreflang="tr"` pointing to W007 from an English page that has no Turkish counterpart would be wrong.

**What to do now:**

- Keep `lang="tr"` on W007 and give it Turkish title/description (see §9.2).
- Add `inLanguage: "tr"` to W007's `BlogPosting` schema.
- Do **not** add `hreflang` until a paired translation exists.

**When a translation exists,** add reciprocal pairs on both pages:

```html
<!-- English page -->
<link rel="alternate" hreflang="en" href="https://www.echomagazine.com.tr/weekly/W008/">
<link rel="alternate" hreflang="tr" href="https://www.echomagazine.com.tr/tr/weekly/W007/">
<link rel="alternate" hreflang="x-default" href="https://www.echomagazine.com.tr/weekly/W008/">
```

```html
<!-- Turkish page -->
<link rel="alternate" hreflang="en" href="https://www.echomagazine.com.tr/weekly/W008/">
<link rel="alternate" hreflang="tr" href="https://www.echomagazine.com.tr/tr/weekly/W007/">
<link rel="alternate" hreflang="x-default" href="https://www.echomagazine.com.tr/weekly/W008/">
```

Rules for later: every `hreflang` set must be reciprocal, every URL must return 200, and `x-default` must point to the language selector or the primary English version. Do not use `hreflang` as a substitute for translating the page.

### 9.5 Metadata implementation checklist

- [ ] One `<title>` per page, <= 60 characters, unique.
- [ ] One meta description per page, 140–160 characters, unique.
- [ ] One H1 per page; loader logo is not an H1.
- [ ] Canonical on all 12 pages, self-referential and absolute.
- [ ] Open Graph: `og:title`, `og:description`, `og:image` (1200×630), `og:url`, `og:type` (`website` for hubs, `article` for articles).
- [ ] Twitter/X: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`.
- [ ] `article:published_time`, `article:modified_time`, `article:author` on weekly articles.
- [ ] Visible `<time datetime="YYYY-MM-DD">` and an "Updated" line where true.
- [ ] `lang` correct per page (`en` except W007 `tr`).
- [ ] No `meta keywords` (the homepage still has one; it is ignored and looks dated).

---

## 10. Severity-ranked findings

Severity is judged by impact on **discoverability, trust and citability**, not by implementation effort. "Exact fix" is the smallest change that removes the finding.

### Critical (3)

| ID | Finding | Evidence | Impact | Exact fix |
|---|---|---|---|---|
| **C1** | Catch-all soft 404 returns the homepage with `200` for every missing URL, including `robots.txt` and `llms.txt` | `/this-page-does-not-exist-12345/` → `200`, `text/html`, 29,559 bytes, byte-identical to `/`; `/robots.txt` → same; `/llms.txt` → same; `/assets/team/sevval.jpg` → same | Google sees infinite duplicate homepages; `robots.txt` is unparseable; AI agents asking for `llms.txt` receive the homepage; every broken link looks "valid" | Add a real `404.html` and configure the host to return `404` for unmatched routes; serve `robots.txt` and `llms.txt` as real `text/plain` files; verify with `curl -I` |
| **C2** | All three issue readers are image-only and expose no citable editorial text | 191 images, **0 `alt`**, 15 visible words, 0 article URLs, 0 HTML TOC; 30/95/66 pages; 9.4/69.9/52.7 MB | Issue content cannot rank, be quoted by AI, be skimmed by a reader, or be accessed by a screen reader; the publication's flagship product is invisible to search | Add an HTML TOC with section titles + one-line summaries + contributor names; add a 150-word issue summary; publish at least three text article pages per issue; add descriptive `alt` to every page image |
| **C3** | Structured data is absent on all 12 pages, and 8/12 pages have no canonical | 0 JSON-LD; no canonical on `/weekly/` or W001–W007; issue pages share H1 `Echo Magazine` | Search and AI systems cannot identify the organization, the blog, the authors or the issues as entities; duplicate/parameter URLs are not consolidated; no rich-result eligibility | Add the schema in §6; add self-referential canonicals to the 8 missing pages; make issue H1s unique |

### High (10)

| ID | Finding | Evidence | Impact | Exact fix |
|---|---|---|---|---|
| **H1** | Homepage metadata targets a generic culture/design/fashion publication and omits the site's actual teen/literature/science identity | Description says `culture, design, fashion, creativity and timeless storytelling`; that description contains **0 occurrences** of `teen`, `student`, `writing`, `literature` or `science`; the published content is teen literature/science/culture/world affairs | The page misqualifies its audience and reads as generic; click-through and dwell time suffer; AI summaries describe the wrong publication | Replace title/description/H1 with §9.2; add a 60-word "what Echo is" paragraph above the fold |
| **H2** | All seven weekly titles are serial numbers; six of seven descriptions are too short to earn a click | Titles `W001 - Echo Weekly` … `W007 - Echo Weekly` (18 chars); descriptions 23–51 chars except W004 at 100; 0 canonical/OG/schema | None of the articles can rank for its topic; the `W00X` prefix is meaningless to a searcher; social shares have no preview | Use §9.2 titles/descriptions; add canonical, OG and Twitter tags; add `BlogPosting` schema |
| **H3** | Thin content on W005 and W007; 6/7 articles under 600 words | W005 57 words; W007 221 words (175 quoted = 79%); W003 481; W006 376; mean 442 | Pages cannot satisfy informational intent; Google may classify them as thin; AI systems have nothing to quote | Expand W005 to 300–500 words or merge into a poetry feature; expand W007 to 600–800 with <40% quotation and Dostoevsky named; add a sources block to each |
| **H4** | No visible publication or update dates | 0 `<time>` elements; 0 `datePublished`/`dateModified`/`article:published_time`; pages show `SEPTEMBER 2026` as plain text only | Readers cannot judge freshness; Google cannot assign a reliable date; AI answers prefer dated sources | Add `<time datetime="YYYY-MM-DD">September 2026</time>` (month precision until the day is confirmed); add `datePublished`/`dateModified`; show "Updated" when true |
| **H5** | Author E-E-A-T is not exposed; two bylines are not on the masthead | 5 bylines; Vespera (W005) and Ahmet Tuğra Hisar (W006) absent from `team.js`; no author pages, bios, roles, `rel="author"` or `Person` schema | Readers cannot verify who wrote the piece; Google cannot connect the author to the publication; trust is reduced | Add both names to `team.js` or label them "Guest contributor"; create author pages with bios; add `Person`/`ProfilePage` schema; link bylines |
| **H6** | Citation poverty: 6/7 articles have zero external sources; W002 makes an unsourced death claim | Only W006 links one UN release; W002: `Following his death this year on the 26th of August` with no source; W001 quotes primary fragments but no edition link | Claims are unverifiable; a factual error would be repeated by AI; E-E-A-T suffers | Add a visible "Sources" H2 to every research article; source W002's death date and correct `Canadian-American`; cite act/scene for W004; cite the poem edition for W003 |
| **H7** | Major AI crawlers are blocked at the edge | GPTBot, ClaudeBot, CCBot, anthropic-ai, Bytespider → `403`; OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended, Googlebot, Bingbot, Applebot → `200` | ChatGPT and Claude cannot fetch Echo pages; AI citation coverage is partial and accidental | Add a Cloudflare WAF allow rule for verified AI bots before the block rule; re-test with `curl -A` |
| **H8** | Sitemap lists 1 of 12 pages; `lastmod` is stale | `sitemap.xml` has only `/`; `lastmod` 2026-07-10; content includes Sept/Oct 2026 | New pages are discovered slowly or not at all; the sitemap contradicts the site | Generate the sitemap from the page list; include all 12 URLs; use real modification dates; submit in GSC |
| **H9** | All 47 team portraits are broken, plus the About hero image | 48 broken images at full render; every `assets/team/*.jpg` returns the homepage HTML (200); `assets/hero/about-image.jpg` missing | The team section — the main E-E-A-T proof — is visually empty; users see broken icons; 1.23 MB of wasted requests | Restore the 47 portraits at the exact paths or remove the section until assets exist; add `width`/`height`, `loading="lazy"`, and real `alt`; add a fallback avatar |
| **H10** | Internal linking starves the articles | Homepage has 6 page links to 5 distinct pages plus 32 same-page anchors; only W007 is featured; W001–W006 are not linked from `/`; no `/magazine/` hub; no related links | The strongest page passes almost no authority to the content; readers cannot discover the archive; crawl depth is unnecessarily high | Implement §8: nav, breadcrumbs, three featured articles on `/`, related links, prev/next, `/magazine/` hub |

### Medium (8)

| ID | Finding | Evidence | Impact | Exact fix |
|---|---|---|---|---|
| **M1** | Open Graph and Twitter metadata are incomplete or absent | Homepage: 3 OG tags, 0 Twitter; all other pages: 0 OG, 0 Twitter | Shared links show no image/description; social traffic converts poorly | Add `og:title`, `og:description`, `og:image` 1200×630, `og:url`, `og:type`; add `twitter:card=summary_large_image` and the three Twitter fields |
| **M2** | No topic or category hubs; the archive is one flat list | 12 pages; no `/magazine/`, no `/topics/`, no tags, no series pages | Topical authority cannot accumulate; readers cannot browse by interest; internal links have no logical target | Create `/magazine/` and 4–6 topic hubs (Literature, Philosophy, Science, Culture, World affairs); link every article to one hub |
| **M3** | H1 hierarchy is wrong on the homepage and all three issue pages | Homepage has 2 H1s; issue pages use `Echo Magazine` as H1 with no content H1 | Search engines see brand duplication, not page topics; screen-reader navigation is confusing | One H1 per page; issue H1s from §9.2; loader logo becomes a `div` |
| **M4** | Weekly pages have no analytics | GA4 `G-MDH2NEV0RK` and Clarity `xl70lubgc8` only on `/` and issue pages; absent on `/weekly/` and W001–W007 | You cannot measure article traffic, scroll depth or conversions; the 30/60/90 plan has no baseline | Add the same GA4 + Clarity snippets to the weekly template; create events for `read_article`, `newsletter_signup`, `issue_open` |
| **M5** | Issue page counter does not match the page count | Issue 03 shows `1 / 95` but `TOTAL_PAGES = 66`; Issue 02 shows `1 / 95` and has 95 | Readers think pages are missing; the UI looks broken; support questions | Set the counter from `TOTAL_PAGES`; verify 30/95/66 for issues 01/02/03 |
| **M6** | Issue payload is enormous and unsized | 30/95/66 full-resolution JPEGs; 9.4/69.9/52.7 MB; 0 `width`/`height`/`loading`; 0 `alt` | Mobile users on limited data cannot read the issue; LCP is delayed; CLS risk | Resize to max 1600px long edge, convert to WebP/AVIF, add `width`/`height`, `loading="lazy"` except page 1, and `alt`; consider a PDF download as an alternative |
| **M7** | Internal links use `index.html` and dead `#` anchors | `href="../../index.html"` throughout; footer has `<a href="#"><i class="ri-instagram-line"></i></a>` next to the real Instagram link | Every internal link takes a 308 redirect; the dead icon is a broken affordance | Replace `index.html` with `/` or directory URLs; remove or fix the `#` social link |
| **M8** | No trust pages: About, contact, privacy, editorial policy | No `/about/`, `/contact/`, `/privacy/`, `/editorial-policy/`; only a `mailto:` in the footer | Readers and AI systems cannot verify ownership, standards or data handling; newsletter signup lacks a privacy link | Create the four pages; link them in the footer; add a privacy line under the newsletter form |

### Low (4)

| ID | Finding | Evidence | Impact | Exact fix |
|---|---|---|---|---|
| **L1** | Copy errors and nonstandard labels | `03 Published Issue`; `All Weeklys`; `Anaximender` ×3; `aperion`; `PreSocratic`; `Glowes`; W007 `Hepimizi...` | Small trust erosion; some errors are factual (names, spelling) | Apply the copy-edit list in §5.4; add a proofreading pass before publishing |
| **L2** | W007 has Turkish content but English metadata | `lang="tr"`; title `W007 - Echo Weekly`; description `Echo Weekly 007 - Echo Magazine` | Turkish searchers see an English serial number; the page underperforms for its own language | Use the Turkish title/description in §9.2; add `inLanguage: "tr"` to schema; no hreflang until a paired translation exists |
| **L3** | Alt text is missing or non-descriptive | 191 issue images: no `alt`; W001 `alt` repeats the headline; decorative images are not consistently marked `alt=""` | Accessibility failure; image search cannot understand the issue pages | Descriptive alt for content images (`Issue 03, page 7: "The History of Perfume"`); `alt=""` for decorative images; do not repeat the H1 |
| **L4** | Obsolete meta and brand-only labels | Homepage `meta keywords`; `Official Hub`; `W00X` prefixes; `Echo Magazine` as issue H1 | Looks dated; wastes title/H1 space; no ranking benefit | Remove `meta keywords`; replace `Official Hub` with a descriptive phrase; remove `W00X` from titles; use unique issue H1s |

---

## 11. 30/60/90 plan

### Days 0–30: stop the bleeding and make the site readable

| Week | Action | Owner | Done when |
|---|---|---|---|
| 1 | Fix soft 404: real `404.html`, host returns 404, real `robots.txt` and `llms.txt` | Dev | `curl -I /this-page-does-not-exist` returns 404; `/robots.txt` is `text/plain` |
| 1 | Add canonicals to `/weekly/` and W001–W007 | Dev | 12/12 pages have a self-referential canonical |
| 1 | Replace all 12 titles/descriptions and the homepage H1 | Content + dev | Character counts pass; one H1 per page |
| 2 | Add `Organization`, `WebSite`, `BlogPosting`, `PublicationIssue`, `BreadcrumbList` | Dev | Validator passes; dates match visible text |
| 2 | Fix 47 team portraits + About hero; add `alt`, `width`, `height`, `loading` | Dev | 0 broken images on `/`; Lighthouse a11y improves |
| 2 | Add visible dates, author blocks and sources blocks to W001–W007 | Content | Every article has a date, a byline link and >= 1 source |
| 3 | Add W001, W004, W006 to the homepage; add related links; remove `index.html` hrefs | Dev | Homepage links to >= 6 distinct pages; 0 internal `index.html` links |
| 3 | Allow verified AI crawlers at Cloudflare | Dev/ops | GPTBot and ClaudeBot return 200 |
| 4 | Create `/about/`, `/team/`, `/contact/`, `/privacy/`, `/editorial-policy/` | Content | All five return 200 and are in the footer |
| 4 | Add GA4 + Clarity to weekly pages | Dev | Real-time report shows article pageviews |

### Days 30–60: build the text layer and the clusters

| Action | Detail | Success signal |
|---|---|---|
| HTML TOC for Issues 01–03 | Section title, one-line summary, contributor, link | Every issue has >= 10 crawlable section titles |
| Three text articles per issue | 400–700 words each, reusing magazine copy, with sources | 9 new indexable article URLs |
| Author pages | 5 pages with bio, role, article list, `ProfilePage` schema | Bylines link to real pages |
| Expand W005 and W007 | W005 300–500 words; W007 600–800 with <40% quotation | Both meet intent |
| Topic hubs | `/topics/literature/`, `/topics/philosophy/`, `/topics/science/`, `/topics/world-affairs/` | 4 hubs, each with >= 3 articles |
| `/magazine/` hub | All issues, covers, dates, descriptions | Archive is browsable |
| Source pass | Every research article has 2–5 sources; W002 corrected | 0 unsourced factual claims |

### Days 60–90: authority, originality and measurement

| Action | Detail | Success signal |
|---|---|---|
| Publish 4–6 new weeklies | One per week, 700+ words, answer-first, sourced | Consistent cadence; 10+ articles total |
| Original data piece | A teen reading/study-habits survey with a methodology note | Earns links and citations; unique data |
| Digital PR | Pitch the survey or a teen-perspective essay to education/culture newsletters | >= 3 earned mentions |
| AI visibility baseline | 10 questions × 4 engines, monthly | Recorded citations and gaps |
| Refresh underperformers | Update the 3 weakest articles with new sections and `dateModified` | Improved impressions/CTR (GSC required) |
| Review internal links | Add links from new articles to old; update hubs | 0 orphans; >= 3 inlinks per article |

---

## 12. Measurement plan

**Baselines are MISSING.** Search Console, analytics exports and rank tracking were not available. The first task is to establish the baseline; the targets below are directional, not guarantees.

| KPI | Baseline | 90-day target | Source |
|---|---|---|---|
| Indexable pages with a canonical | 4/12 | 12/12 + 9 issue articles | Crawl |
| Pages with valid JSON-LD | 0/12 | 12/12 | Validator |
| Pages in sitemap | 1/12 | 21/21 | Sitemap |
| Weekly articles >= 600 words | 2/7 | 7/7 | Content audit |
| Articles with >= 1 source | 1/7 | 7/7 | Content audit |
| Bylines linked to author pages | 0/5 | 5/5 | Crawl |
| Broken images on `/` | 48 | 0 | Playwright |
| AI crawlers allowed (verified) | 7/12 tested | 12/12 tested | `curl -A` |
| AI referral sessions/month | MISSING | Establish baseline, then +20% QoQ | GA4 |
| Branded impressions/clicks | MISSING | +30% in 90 days | GSC |
| Non-brand article impressions | MISSING | >= 500/month across 7 articles | GSC |
| Newsletter signups from articles | MISSING | Track `newsletter_signup` event | GA4 |

**Events to instrument:** `article_view` (page path, author, word count), `scroll_75`, `source_click`, `author_click`, `issue_open`, `newsletter_signup`, `outbound_click`. Without these, the content plan cannot be evaluated.

---

## 13. MISSING data

The following were not observable with the available access. They are marked MISSING rather than estimated.

| Data | Why it matters | How to obtain |
|---|---|---|
| Google Search Console impressions, clicks, CTR, average position | The only reliable measure of query-level performance | Verify the property; export 16 months |
| Index coverage and crawl stats | Confirms whether the 12 pages are indexed and how often Googlebot visits | GSC → Pages / Settings → Crawl stats |
| Keyword volumes and difficulty | Prioritisation of the rewrite list | Ahrefs/Semrush/Keyword Planner |
| Current rankings for any query | Baseline for the 90-day plan | Rank tracker or GSC |
| Organic traffic, sessions, engagement | Content ROI | GA4 (currently absent on weekly pages) |
| Backlinks, referring domains, domain authority | Explains why head terms are unrealistic | Ahrefs/Majestic/GSC Links |
| CrUX field data / Core Web Vitals | Real-user performance | CrUX dashboard / PSI API |
| Exact publication days | Full-precision `datePublished` | Editorial calendar; pages only show month/year |
| Real identities/bios for Vespera and Ahmet Tuğra Hisar | Author E-E-A-T | Editorial team |
| Newsletter subscriber count and conversion rate | Audience baseline | Email platform |
| Cloudflare account rules (WAF, Transform, Cache) | Explains the 403s and soft 404s | Cloudflare dashboard |
| Server logs | Bot/crawler behaviour | Hosting provider |
| Competitor traffic and keyword gaps | Relative positioning | Third-party tool |
| Reader demographics and intent | Content-market fit | Survey / GA4 demographics |

---

## 14. Appendices

### 14.1 Per-page raw metadata (live)

| Page | Title | Description length | H1 count | H2 count | Canonical | OG tags | Twitter tags | JSON-LD |
|---|---|---:|---:|---:|---|---:|---:|---:|
| `/` | `Echo Magazine \| Official Hub` | 135 | 2 | 10 | Yes | 3 | 0 | 0 |
| `/weekly/` | `Weekly - Echo Magazine` | 71 | 1 | 1 | No | 0 | 0 | 0 |
| `/magazine/issue-01/` | `Echo Magazine \| Issue 01` | 0 | 1 | 0 | Yes | 0 | 0 | 0 |
| `/magazine/issue-02/` | `Echo Magazine \| Issue 02` | 0 | 1 | 0 | Yes | 0 | 0 | 0 |
| `/magazine/issue-03/` | `Echo Magazine \| Issue 03` | 0 | 1 | 0 | Yes | 0 | 0 | 0 |
| `/weekly/W001/` | `W001 - Echo Weekly` | 32 | 1 | 3 | No | 0 | 0 | 0 |
| `/weekly/W002/` | `W002 - Echo Weekly` | 32 | 1 | 1 | No | 0 | 0 | 0 |
| `/weekly/W003/` | `W003 - Echo Weekly` | 40 | 1 | 1 | No | 0 | 0 | 0 |
| `/weekly/W004/` | `W004 - Echo Weekly` | 100 | 1 | 2 | No | 0 | 0 | 0 |
| `/weekly/W005/` | `W005 - Echo Weekly` | 23 | 1 | 0 | No | 0 | 0 | 0 |
| `/weekly/W006/` | `W006 - Echo Weekly` | 51 | 1 | 1 | No | 0 | 0 | 0 |
| `/weekly/W007/` | `W007 - Echo Weekly` | 35 | 1 | 0 | No | 0 | 0 | 0 |

### 14.2 Issue contents (from the cover/contents images)

**Issue 01 (30 pages):** Our Team; Note From the Editor; Met Gala; Grammys; Rio Carnival; Turkish Art Music; Formula 1; Marine Life; Dreams; 5G; Internet Privacy.

**Issue 02 (95 pages):** Editor note; Acrostics; South Korea; String Theory; The Multiverse; Sofia Coppola; The Mandela Theory; Victoria's Secret; Pallas and Athena; Mother of Pop; Sirens; Deftones; Gamers' impact; Evolution of Human; F1; To Define Is To Limit; Edinburgh Fringe Festival; Orpheus and Eurydice; Sinema Sektörü; Bulgaria.

**Issue 03 (66 pages):** Note from the Editor; İlmek; Marcus Aurelius; The Butterfly Effect; The History of Perfume; Nuclear Sharks; IDM/Aphex Twin; Formula 1; Electricity; Dante's Inferno; History of Hip-Hop; Have a Nice Life; History of the Olympic Games; Climate Change; 1816; Total Drama Island.

### 14.3 Copy-edit checklist

- [ ] W001: `Anaximender` → `Anaximander` (3×); `aperion` → `apeiron`; `PreSocratic` → `Pre-Socratic`.
- [ ] W001: fix the sentence fragment after `Anaximander.` and the comma splice before `he thought that`.
- [ ] W002: verify and source the 26 August death claim; `Canadian-American` → `Canadian` unless documented.
- [ ] W003: rewrite the pronoun paragraph; remove `not a great appeal`.
- [ ] W005: `Glowes` → `Glows`; add context or merge into a poetry feature.
- [ ] W007: `Hepimizi` → `Hepimiz`; name Dostoevsky in the first sentence; reduce quotation below 40%.
- [ ] Home: `03 Published Issue` → `3 Published Issues`; `All Weeklys` → `All Weekly Stories`; fix the `Science, Sports & Arts` list.
- [ ] All pages: remove `index.html` from internal links; remove `href="#"` social links.

### 14.4 Schema acceptance tests

1. Homepage returns `Organization`, `WebSite`, `CollectionPage` in one `@graph`; no `SearchAction`.
2. Weekly hub returns `Blog` with seven `blogPost` entries and a `BreadcrumbList`.
3. Each weekly returns one `BlogPosting` whose `url` matches the canonical and whose `author.url` resolves.
4. Each issue returns `PublicationIssue` with `issueNumber` 1/2/3 and a `PublicationVolume` parent; no `Article` for the issue itself.
5. No page returns `FAQPage`, `Review`, `AggregateRating` or `SearchAction`.
6. Every `@id` is absolute and stable; no duplicate `Organization` definitions with different properties.
7. `datePublished` is not in the future and matches visible text.
8. Every schema URL returns 200 with the correct page (not the soft-404 homepage).

### 14.5 What not to do

- Do not add `FAQPage` schema for questions that are not visible on the page.
- Do not add `Review`/`AggregateRating` for issues or articles; there are no ratings.
- Do not add `SearchAction`; there is no search.
- Do not mark up the flipbook images as `Article` entities; they have no text.
- Do not add `hreflang` until a paired translation exists.
- Do not stuff keywords into alt text; describe the image.
- Do not publish a `lastmod` date that is not a real modification date.
- Do not "fix" the 403s by allowing every bot; allow verified AI crawlers only.

---

**End of report.** All 12 pages are covered in the inventory, rewrite table and severity findings. Counts are live measurements as of 19 October 2026. Items that could not be measured are listed in §13.
