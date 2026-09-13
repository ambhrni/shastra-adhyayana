# Gītā Vivṛtti — CLAUDE.md

This is the single project reference file. It gives Claude everything needed to resume in a new session and to maintain consistency across the entire HTML deliverable.

---

## What This Project Is

A self-contained single-file HTML teaching aid for Śrī Rāghavendra Tīrtha's *Gītā Vivṛtti* (also known as *Gītārthasaṅgraha*, 1623–1671 A.D.) — a direct commentary on the Bhagavadgītā in the **Tattvavāda Vedānta** tradition (never use the word "Dvaita"). To be hosted at tattvasudha.org.

**Full title:** श्रीराघवेन्द्रतीर्थस्य गीताविवृत्तिः  
**Transliteration:** Śrī Rāghavendra Tīrtha · Gītā Vivṛtti  
**Audience:** Sanskrit students proficient in the language but not yet in deep commentary literature.

---

## Files in This Folder

| File | Purpose |
|------|---------|
| `gita_vivrutti.html` | **Main deliverable** — all data embedded in JS, no backend |
| `CLAUDE.md` | This file — single project reference for Claude |
| `BG_Vyakhyas_Vidyadhiraja_Raghavendra_OCR.md` | OCR markdown of the printed source book (both Vidyādhirāja and Rāghavendra commentaries) |
| `Bhagavad Gita Vyakhyas of Vidyadi Raja Tirtha, Raghavendra Tirtha Ed. Vyasanakere Prabhanjanacharya (Missing Pg 181-184)_text.pdf` | Source PDF — curator's ground truth |

---

## Current Status

**Chapter X (Vibhūti Yoga) — ✅ COMPLETE (all 42 śhlokas: 1–11, 12–13 combined, 14–42)**

**Chapter XI (Viśvarūpa-darśana Yoga) — started. 11.1–11.24 done and proofread.**

| Śhlokas added | Proofread | Notes |
|--------------|-----------|-------|
| Ch. X: 1–11, 12–13 (combined), 14–42 — ALL DONE | ✅ 1–42 ALL proofread | 12–13 combined; chapter colophon included at end of 10.42 |
| Ch. XI: 1–24 | ✅ proofread | `CHAPTERS[11]` created; chapter-level footnote feature added (see Footnotes section); 11.2 carries a verse-level footnote (२, गी. ७-३) on a commentary word; 11.3 carries a verse-level footnote (१, विष्णुसहस्रनाम citation) keyed to a **mūla** word (पुरुषोत्तम) instead; 11.4 has no footnote; 11.5 has no footnote — speaker changes to `श्रीभगवानुवाच` (Kṛṣṇa begins speaking); 11.6, 11.7, 11.8 have no footnotes; 11.9 carries a verse-level footnote (१, Mokṣadharma citation, Bhārata-śānti-parva ३४२-६८); speaker stays `सञ्जय उवाच` through 11.10–11.14 (Sañjaya narrating what was shown), then changes to `अर्जुन उवाच` at 11.15 and continues unchanged through 11.24 (confirmed via राॕ's self-reference "अर्जुनोऽहमिव" at 11.20); 11.11 carries a verse-level footnote (१, मयट् suffix grammar, शब्दनिर्णय citation); 11.15 carries a verse-level footnote (१, पाद्मवचनम् — placement uncertain, see Resume Pointer below); 11.14 supplies `॥ १४ ॥` and 11.23 supplies `॥ २३ ॥` for bare-`॥` print omissions (same situation as 11.7); 11.16 is the first verse with **two separate footnotes** (२ on मूल word विश्वरूप, ३ on राॕ's own citation "पूर्णमेव च"), both appended in citation order with ॥ १६ ॥ only on the last; 11.17, 11.18, 11.22, 11.24 have no footnote; 11.19 has one footnote (२, ऋग्वेदे पुरुषसूक्ते) — a second footnote on that page (१, नारदीयवचनम्) belongs to the always-ignored 〔वि〕 section and was correctly skipped; 11.20 has one footnote (१, दुर्योधनादिषु... तात्पर्यनिर्णय २४/८१) and 11.21 has one footnote (२, ब्रह्माण्डवचनम्) — **footnote numbering resets per page**, confirmed this batch: page 401's १/२ belong to the ignored 〔वि॑ portion of 11.20, while page 402's १/२ (same digits) belong to राॕ's own citations in 11.20 and 11.21 respectively; all pratīkas across 1–24 are densely bolded by matching every mūla word echoed in the commentary, refined at 11.10–11.15 to require an **exact word-form match** (see standing rule below); bolding bare exact-form particles/pronouns (न, मे, हि, तथा, अहम्) is now a recurring pattern since 11.16, not yet settled as a blanket policy; 11.8 enriches the existing `aiśvara` DEFS entry; 11.9 adds `hariḥ`/`mahāyogeśvara`; 11.11 adds `sarvāścaryamaya`; 11.16 enriches the existing `viśvarūpa` DEFS entry with the विश्व=पूर्ण equivalence material |

**Last completed:** 11.24  
**Next to add:** 11.25

### Resume Pointer (update every session)

| Field | Value |
|-------|-------|
| Next śhloka | **11.25** |
| Chapter XI status | `CHAPTERS[11]` exists (nameDev, nameEn, desc, `footnotes` array, verses). Verses 1–24 populated. Speaker remains `अर्जुन उवाच` (no speaker-heading change since 11.15), confirmed through 11.24 via राॕ's own self-reference "अर्जुनोऽहमिव" at 11.20. |
| PDF page for 11.25 | 11.25's mūla anchor `अमी च त्वा धृतराष्ट्रस्य पुत्राः` appears right after 11.24 on PDF page 403 (Sanskrit ३५७), continuing into PDF page 404 (Sanskrit ३५८) for राॕ's commentary — not yet rendered/verified, do so before drafting. Its 〔वि॑ section carries a footnote about कर्ण's सूतपुत्रत्व — check carefully whether it belongs to राॕ's own portion too (given the page-resets-per-footnote-number finding below, do not assume). |
| OCR anchor | grep `अमी च त्वा धृतराष्ट्रस्य` (BG 11.25) in the OCR md. |
| Outstanding | **Two open flags carried from 11.15, still not resolved by curator — don't block resuming:** (1) footnote "१. पाद्मवचनम् — गी.ता." placement uncertainty at PDF page 399. (2) Judgment call on bolding `अर्जुन उवाच` as a speaker-heading citation at 11.15. **Flags from 11.16–11.24 (open, non-blocking):** (3) 11.16's two-footnote-on-one-verse structure. (4) Bolding bare exact-form particles/pronouns (न, मे, हि, तथा, अहम्) — a recurring pattern since 11.16, not resolved as a blanket policy either way. (5) 11.20's sentence 4 is the densest single bolded sentence yet (4 bold spans). (6) 11.20's "उग्रमिव"/"तूग्रमेव" left unbolded — sandhi merges the मूल word into a following particle with no clean akṣara boundary for a bold span, a new edge case. (7) 11.20's "लोकत्रयपदेन"/"लोकत्रयस्थ" left unbolded under the current strict rule, though 11.9's `महायोगेश्वरत्वं` was bolded in an analogous-looking situation before the rule was sharpened — flagged rather than resolved unilaterally. Ch. XI 1–24 fully written and proofread. |

**Correction found at 11.5 (worth knowing going forward):** the previous resume pointer guessed 11.5 "spans four mūla lines" based on the commentary's word `चतुष्टयेन`. On reading the source directly, this was wrong — 11.5 is a normal 2-line verse like 1–4. `चतुष्टयेन` ("by the group of four") refers to verses 5–8 collectively (each contains an imperative "paśya"), not extra lines within verse 5. Don't assume a verse has a non-standard line count from a stray commentary word like this without checking the actual mūla in the OCR/PDF first.

**Pratīka-bolding — firm standing requirement (reconfirmed by curator at 11.7):** always bold every mūla word that is echoed or glossed in the 〔रा〕 commentary, densely and consistently, matching the style already established at 10.21 and 11.3/11.4 — this is the ORIGINAL rule from the "Session Workflow" section above ("infer pratīkas by matching the mūla words being glossed"), and it stands regardless of whether the OCR carries `**bold**` markers or whether the print itself visibly shows bold at a given zoom level. A brief deviation happened at 11.5/11.6/11.7 during this session, where actual print-bold was visually verified from the PDF and used as the sole basis for bolding — this produced 11.6 and 11.7 with little-to-no bold, and a sparser 11.5 than 11.3/11.4. The curator caught this and asked for it to be corrected and made an explicit going-forward requirement: 11.6 and 11.7 have been re-bolded densely (every mūla word matched, following the sandhi-split conventions in "Strict Rules — Never Violate" below) and the HTML/CLAUDE.md updated accordingly. **Do not repeat the print-verification-only approach** — PDF rendering is still mandatory for verifying the Sanskrit text itself and catching OCR errors, but pratīka bolding should be inferred by matching mūla words, not gated on visually spotting bold ink.

**Exception — vigraha (compound analysis) is not a citation (confirmed at 11.9, sharpened at 11.10–11.15):** when the commentary analyzes a mūla *compound* word by breaking it into separate case-inflected constituents (a vigraha), the individual analytical words are the commentator's own grammar, not a verbatim quote of the mūla — do not bold them even though they relate to a mūla word. Example: mūla has the single compound `महायोगेश्वरः`; the commentary's vigraha reads `महतां योगानाम्...अनन्तशक्तीनां वेश्वरः` — only `वेश्वरः` (which directly corresponds to the compound's own `ईश्वरः` member, a real mūla constituent) is bolded; `महतां` and `योगानाम्` (genitive-plural forms found nowhere as such in the mūla) are left unbolded. This follows the same logic as the 11.8 "त्वनेन" case (an unbolded commentary connective that doesn't cleanly match a मूल word).

**REFINED at 11.10–11.15 — the exception is broader than "genitive analysis," it's "any re-inflection":** the curator caught that a *standard* bahuvrīhi/samāsa vigraha — one that reuses the compound's own roots, not different words — was still being bolded in error (11.10: `अनेकानि वक्त्राणि नयनानि यस्य तत्` for मूल `अनेकवक्त्रनयनम्`; 11.15: `कमलासने...स्थितम्` for मूल `कमलासनस्थम्`). The corrected, general rule: **bold marks an exact word-form match to the मूल — same stem, same case, same number** (sandhi-driven spelling changes are fine; grammatical re-inflection to make a vigraha sentence work is not), regardless of whether the vigraha reuses the compound's own roots or introduces different ones. Two bolding patterns remain valid and are NOT vigraha:
1. **Lemma-citation** — a bare word or the verse's opening word cited before "इति" to mark which मूल word/verse is being glossed (e.g. `<b>अनेक</b>शब्दः अनन्तवाची` — "the word aneka means..."; `<b>एवम्</b>इति` at 11.9; `<b>अनेके</b>ति` at 11.10). This is citing the word itself, not analyzing it.
2. **Compound restated verbatim after "इति," closing a vigraha** — e.g. 11.10's `यस्मिन्नि<b>त्यनेकाद्भुतदर्शनं</b>` and 11.11's `तद्<b>विश्वतोमुखम्</b>`: the vigraha's middle portion (the analytical decomposition) stays unbolded, but where it concludes by naming the compound itself again (in the same neuter nom=acc spelling as मूल, a genuine exact-form match, not a re-inflection), that closing restatement is bolded.
When two exact-form मूल words simply sit adjacent in the commentary (not vigraha-transformed, just repositioned near each other for clarity — e.g. 11.13's जगत्+एकस्थम् → `<b>जगदेकस्थम्</b>`, or तदा+अपश्यत् → `<b>तदाऽपश्यत्</b>`), bold the whole sandhi-joined span as one citation, matching the existing चक्षुर्ददामि-style convention (see "Strict Rules" below).

**Page-offset formula:** PDF page = Sanskrit page + 46 (e.g. Sanskrit ३४१ = PDF 387; Sanskrit ३४७ = PDF 393; Sanskrit ३४८ = PDF 394; Sanskrit ३४९ = PDF 395). Render with PyMuPDF (see workflow below).

**Chapters I–IX and XII–XVIII:** pending.

---

## Session Workflow (PDF-first — current standard, since 10.39)

**Goal:** minimize the curator's manual copy-paste. Claude does the extraction; the curator only verifies interpretation and approves. Adopted after the OCR-only flow dropped a whole passage in 10.37 (see history below).

Per śhloka, Claude:

1. **Locates the śhloka in the OCR** (`BG_Vyakhyas_Vidyadhiraja_Raghavendra_OCR.md`) — grep the mūla, read the surrounding lines to pull mūla + **Rāghavendra 〔रा〕 only** + any numbered footnotes. (Ignore 〔वि〕 / "(वि)" / "(a)" Vidyādhirāja sections entirely.)
2. **Renders the source PDF page and verifies against it** — this is mandatory, it is the ground truth. The OCR scrambles word order across page breaks, drops passages that sit below footnotes, and mis-OCRs letters (e.g. त्रैष्ठ्य→श्रैष्ठ्य). Use the page-offset formula above. Rendering recipe:
   ```python
   import fitz
   doc = fitz.open(PDF)
   p = doc[PDFPAGE-1]                       # 0-based
   r = p.rect
   pix = p.get_pixmap(matrix=fitz.Matrix(4.5,4.5),
            clip=fitz.Rect(r.x0, r.y0, r.x1, r.y0+r.height*0.58))  # top; *0.42→y1 for bottom
   pix.save('/…/outputs/pgN_top.png')
   ```
   Render at ~4.5× and split top/bottom for legible Devanagari; then Read the PNG. Install once: `pip install pymupdf --break-system-packages`.
3. **Takes the mūla from the standard Bhagavadgītā text** (more reliable than OCR, whose verse numbers are mangled), cross-checked against the PDF.
4. **Identifies pratīkas.** OCR `**bold**` is inconsistent and often absent — **always** infer pratīkas by matching the mūla words being glossed and bold them densely (every mūla word echoed in the commentary gets `<b>`), matching the style at 10.21/11.3/11.4. This applies regardless of whether the OCR has bold markers or whether the print itself visibly shows bold — do not gate bolding on visually spotting ink on the PDF render (a deviation tried and rejected during the 11.5–11.7 session; see the note under "Current Status" above). Flag to the curator which pratīkas were inferred vs. taken directly from OCR `**bold**`, for confirmation.
5. **Drafts the full proposed entry** (mūla table + commentary lines with Bhāva + new DEFS) in chat and **waits for approval** ("write to HTML" / "go ahead"). Revise-and-reshow on any correction.
6. **Writes** to `gita_vivrutti.html` (verse data + DEFS) and **updates this file** — status table, **Resume Pointer**, and history.

> The curator may still paste a śhloka manually if preferred; the draft-then-approve gate (step 5) is unchanged either way.

**How Claude edits the HTML:**
- **Verse data:** Insert the new verse object after the last verse's closing `}` — change it to `},` and append the new `N: { ... }` block before the outer closing `}` of `verses`.
- **DEFS:** Insert new term entries before the closing `};` of `const DEFS`, preceded by a comment `/* śhloka 10.N terms */`.
- Always use the `Edit` tool (not `Write`) — find a unique surrounding string to anchor each edit.

**Commentary granularity (confirmed at 11.1 — follow for all remaining śhlokas):** Each commentary object corresponds to **one Sanskrit sentence** (one clause ending in `।`), not a whole paragraph. Do not merge several sentences into one `skt`/`tr` pair, even if the source prints them as a continuous paragraph — split every `।`-terminated clause into its own `{ skt:..., tr:... }` object. This matches the granularity already used throughout Chapter X (see 10.41/10.42) and makes each pratīka and its gloss land in its own line. When the OCR has no `**bold**` markers at all for a passage (this happens — 11.1 had none), infer pratīkas by matching exact mūla words against the commentary and **flag the inferred bolding to the curator explicitly** before writing.

**Chapter-level footnotes (new pattern, introduced at 11.1):** Some footnotes in the source are keyed to the **chapter heading itself** (e.g. a footnote "१" printed next to "एकादशोऽध्यायः"), not to any specific verse. These are distinct from ordinary verse footnotes (see the "Footnotes and Image Citations" section below) and use a separate mechanism:
- Add a `footnotes: [ { num:1, skt:'...', tr:'...' }, ... ]` array to the `CHAPTERS[N]` object (sibling of `desc`).
- Embed a superscript marker directly in the `nameDev` string: `nameDev:'चतुर्दशोऽध्यायः<sup class="ch-foot-sup">१</sup>'` (Devanagari numeral in the `<sup>`).
- `render()` builds a `.ch-footnotes` block (rows of `.ch-foot-num` + `.ch-foot-skt` + `.ch-foot-tr`) under `.ch-desc` in the chapter banner — CSS already added (`.ch-foot-sup`, `.ch-footnotes`, `.ch-foot-row`, `.ch-foot-num`, `.ch-foot-skt`, `.ch-foot-tr`).
- `.ch-foot-tr` is already wired into the English-toggle hide rule alongside `.sr-tr`/`.vr-tr`/`.ch-desc` — no further CSS changes needed for future chapters.
- Reuse this same mechanism for any future chapter-heading footnote; do **not** reuse it for ordinary verse-keyed footnotes — those still follow the existing "append as a commentary line" convention.

**Key source note:** The OCR file contains both Vidyādhirāja (〔वि〕) and Rāghavendra (〔रा〕) commentaries. **Only 〔रा〕 goes into the HTML.** The 〔वि〕 sections are ignored entirely.

**OCR artifacts to watch for:**
- Stray `'` quote marks before Sanskrit words — drop them
- `''` double closing quote → normalize to `'` single
- `||` or `||३०||` style → `॥` or `॥ ३० ॥` with proper Devanagari dandas
- Bold markers split mid-word across a line break — join into one `<b>word</b>`
- Bold can absorb sandhi: e.g. `**कलयतामा**कलयतां` = pratīka `<b>कलयताम्</b>` + gloss start `आकलयतां` — split at the sandhi boundary
- `द्वादशा**दित्यानां**` style mid-compound bold splits — render faithfully: `द्वादशा<b>दित्यानां...</b>`
- Visarga typos: `कालस्थ:` (colon) → `कालस्थः` (ḥ visarga)
- Line-break hyphens in compounds → join without hyphen

---

## Bhāva (भावः) — Interpretive Clarification Lines

**Standing rule (all śhlokas, going forward):** For each Rāghavendra (〔रा〕) statement whose meaning is **not easily interpretable** from a literal rendering alone (especially terse nirvacana/etymologies), append a short **Bhāva** clause to that commentary line's `tr` field to bring out the meaning clearly.

- Format: literal translation first, then the interpretive note in parentheses — `(Bhāva: …)`. (Equivalently "Bhāva" or "bhāvaḥ".)
- **Scope is strict:** the Bhāva must only unpack what the Vivṛtti itself states — clarifying Rāghavendra's own etymology/intent. **Never add outside interpretations**, other commentators, or modern readings. If the Vivṛtti doesn't support it, it doesn't go in.
- The `skt` source string stays untouched — Bhāva lives only in the `tr` field (and may be echoed in the term's DEFS entry where helpful).
- Only add a Bhāva where it genuinely aids understanding; lines that are already clear need none.

Example (10.31, jāhnavī): `… present in [the deity] Gaṅgā. (Bhāva: just as the Gaṅgā carries one across, the Lord within her rescues those who renounce saṃsāra.)`

---

## Footnotes and Image Citations

The source book has footnotes keyed to specific words in the mūla or commentary. The curator will sometimes paste these separately (often from a photo of the printed page).

**Placement:** Footnotes go as **separate commentary lines appended after the main commentary** of that śhloka. The closing `॥ N ॥` marker travels to whichever is the **last `skt` string of the verse** — main commentary or footnote, whichever comes last.

**Superscript marker (standing rule, confirmed at 11.2):** The source PDF prints a small superscript footnote number right at the cited word in the main commentary (e.g. `प्रलयस्तथा२`). **Preserve this superscript** — don't drop it. Use `<sup class="vr-foot-sup">N</sup>` inline, immediately after the word it marks (inside quotes if the word is itself part of a quoted citation), e.g.:
```javascript
{ skt:`'... प्रलयस्तथा<sup class="vr-foot-sup">२</sup>' इत्यादिना ...`, tr:`...` }
```
Then prefix the footnote's own appended commentary line with the **same number**, in the same `<sup>` style, so the two visually pair up even without a hyperlink:
```javascript
{ skt:'<sup class="vr-foot-sup">२</sup> गी. (७-३) ॥ २ ॥', tr:'' }
```
`.vr-foot-sup` CSS is already defined (small gold superscript, next to `.vr-skt`/`.vr-tr`) — no further setup needed for future verse-level footnotes. (This is separate from the chapter-level footnote mechanism — see "Chapter-level footnotes" under Session Workflow — which uses `.ch-foot-sup` and a dedicated footnote block instead.)

**Same mechanism applies when the superscript falls on a mūla word, not a commentary word (confirmed at 11.3):** the marker is on "पुरुषोत्तम" in the mūla's `dev` field, not in `skt` — e.g. `{ dev:'... पुरुषोत्तम<sup class="vr-foot-sup">१</sup> ॥ ३ ॥', tr:... }`. The footnote's own appended commentary line still carries the matching `<sup>` number regardless of which field (dev or skt) the in-text marker sits in.

**Sanskrit-only citation lines:** When the curator says "just take it as is in Sanskrit, no English explanation needed" — set `tr:''` (empty string). Do not omit the `tr` key; set it to empty. Example:
```javascript
{ skt:'विष्णोः सहस्रनाम्नां मध्ये ...', tr:'' }
```

**Citation source names — never translate to English:**
Sanskrit work names and abbreviations are kept in Sanskrit in all fields. Rules per source:

| Source | In `skt` field | In `tr` field |
|--------|---------------|---------------|
| `बाभ्रव्यशाखा` | Keep in Sanskrit; if DEFS entry exists, wrap: `${T('bābhravyaśākhā')}याम्` | Keep as `बाभ्रव्यशाखा` (never translate) |
| `म.भा.ता.नि.` | Use `${T('mbtn')}` (DEFS key `mbtn`) | Use `${T('mbtn')}` — do not spell it out |
| `सुमध्वविजये` | Keep in Sanskrit | Keep in Sanskrit; provide English tr of the cited śhloka's *content*, not the title |
| Viṣṇusahasranāma and other canonical citations | Keep in Sanskrit | Keep in Sanskrit; `tr:''` if curator says no English needed |

**Śleṣa / double-meaning verses:** When a footnote śhloka has śleṣa (punning double meaning) and the curator provides the explanation, render both meanings in the `tr` field in full.

---

## How to Resume (New Session)

**Paste this exact prompt to start the next session (continuing Chapter XI):**

```
Resume the Gītā Vivṛtti project. Read CLAUDE.md fully, then read gita_vivrutti.html
to see the current DEFS dictionary and verse-data structure. Chapter X is complete
and proofread; Chapter XI is underway (11.1–11.24 done). Continue at śhloka 11.25,
following the PDF-first workflow: extract the mūla + 〔रा〕 commentary + footnotes from
BG_Vyakhyas_Vidyadhiraja_Raghavendra_OCR.md, render and verify against the source PDF
page, draft the entry for my approval (one commentary object per Sanskrit sentence,
matching Ch. X granularity, with every mūla word echoed in the commentary densely
bolded as a pratīka — bold only an exact word-form match to the mūla, never a vigraha
re-inflection, per the refined standing rule under "Current Status"), then write to
HTML on my go-ahead.
```

Claude should then:
1. Read this file for full context (workflow, strict rules, HTML architecture, Resume Pointer), especially the refined pratīka-bolding rule (exact word-form match, not just root reuse) and the open flags from 11.15–11.17 noted in the Resume Pointer table.
2. Read `gita_vivrutti.html` to see the exact current DEFS dictionary and verse-data structure, and the existing `CHAPTERS[11]` object (verses 1–17 populated so far).
3. Extract 11.25 (anchor `अमी च त्वा धृतराष्ट्रस्य पुत्राः`; speaker stays `अर्जुन उवाच`, continuing his praise), render and verify against the PDF (pages 403–404; use the page-offset formula) — check its footnote situation carefully (see Resume Pointer) — draft, and proceed on approval.

**Note on model:** the next session is planned on Sonnet. Everything needed is in this file — the workflow, the page-offset formula, the PyMuPDF render recipe, and the Resume Pointer. No context from the previous session is required; just follow CLAUDE.md.

---

## HTML Architecture — Must Stay Consistent

**This section is critical.** The layout, fonts, colors, and UI patterns must remain identical across every chapter and every śhloka added. Never alter these without explicit curator instruction.

### Deliverable
Single self-contained HTML file: `gita_vivrutti.html`. All data (śhloka text, commentary, term definitions, chapter metadata) is embedded in JavaScript. No backend, no external data files. Ready to embed in tattvasudha.org.

### Page Layout
- **Single page app** — no separate landing page
- **Masthead** — ॥ श्रीः ॥ · title in Devanagari · transliteration · tattvasudha.org link · "श्रीराघवेन्द्रतीर्थ · Gītā Vivṛtti ▾" button that slides open the author bio panel
- **Nav bar** (sticky) — अध्यायः selector · श्लोकः selector · English toggle · Bookmark button · breadcrumb
- **Chapter banner** — Devanagari name (with optional superscript footnote marker) · English name · short description · optional chapter-level footnote block (all English parts hidden when English toggle OFF)
- **Audio placeholder row** — thin bar, ready for future recitation audio
- **Śhloka card** — one śhloka displayed at a time
- **Prev/Next navigation** — पूर्वः / अग्रिमः in Devanagari

### Śhloka Card Structure
Each card has two sections:
1. **मूलगीताश्लोकः** — speaker label (when present) + mūla lines, each paired with English translation
2. **गीताविवृत्तिः** — commentary lines, each Sanskrit line paired with English meaning

### English Toggle (Study Mode)
- Toggle **ON** (default) = English visible
- Toggle **OFF** = ALL English hidden — mūla translations, commentary meanings, chapter English title and description
- Only Devanagari Sanskrit remains when toggle is OFF

### Technical Term Tooltips
- Every technical Sanskrit term in `tr` (translation) fields is wrapped with `T('key')`
- On hover: shows a popup definition drawn **strictly from Rāghavendra Tīrtha's Vivṛtti only** — no external sources, no modern interpretations
- All definitions stored in the `DEFS` dictionary in the JS
- **Rule:** every new śhloka must have its terms added to `DEFS` and use `T()` — never bare `<span class="term">` tags or unwrapped terms

### Pratīka (प्रतीक) Bold Formatting
- Pratīkas = the bold cited mūla words that Rāghavendra is glossing in his commentary
- Rendered as `<b>word</b>` inside the `skt` field of commentary objects
- Styled in **saffron bold** via CSS `.vr-skt b`
- Source: curator provides markdown with pratīka words in `**bold**`; Claude converts to `<b>word</b>`

### Bookmark Feature
- Saves current chapter + śhloka to `localStorage`
- Resumes on next visit
- Toast notification on save

### Fonts — Do Not Change
- **Devanagari:** Noto Sans Devanagari (Google Fonts)
- **Display / headings:** Cinzel (Google Fonts)
- **Body:** Cormorant Garamond (Google Fonts)

### Color Palette — Do Not Change
| Role | Value |
|------|-------|
| Saffron (primary accent, pratīkas) | `#B85C1A` |
| Gold (secondary) | `#A8861C` |
| Parchment background | `#FDF8EE` |
| Ink (primary text) | `#241507` |

---

## HTML Data Structure

```javascript
const CHAPTERS = {
  10: {
    number: 'X',
    nameDev: 'विभूतियोगः',
    nameEn: 'Vibhūti Yoga · The Yoga of Divine Manifestations',
    desc: '...chapter introduction text...',
    verses: {
      1: {
        speaker: 'श्रीभगवानुवाच',   // only when speaker changes
        lines: [
          { dev: 'Sanskrit mūla line', tr: `English with ${T('term')} tooltips` }
        ],
        commentary: [
          { skt: 'Sanskrit with <b>pratīka</b>', tr: `English with ${T('term')}` }
        ]
      },
      12: {
        label: '12–13',              // combined śhlokas: label field, skip key 13
        speaker: 'अर्जुन उवाच',
        lines: [ /* all 4 mūla lines for both śhlokas */ ],
        commentary: [ /* combined commentary */ ]
      }
    }
  }
};

const DEFS = {
  'termKey': 'Definition strictly from Rāghavendra Tīrtha\'s Vivṛtti...',
};
```

---

## Strict Rules — Never Violate

**Pratīkas:**
- Bold cited mūla words in commentary → `<b>word</b>` in `skt` field
- OCR line-break splits mid-bold → join into one tag: `चेतोनेतृत्वा<b>च्चेतना</b>`
- Multi-word pratīkas → one `<b>multi word phrase</b>`
- Mid-sandhi bold splits — the bold marker starts mid-compound because sandhi merged words; preserve the split exactly:
  - `पतित्वा<b>द्बृहस्पति</b>नामानम्` — bold starts at the absorbed `द्` of `bṛhaspati`
  - `हेतुना<b>ऽनन्त</b>नामा` — avagraha absorbed into bold
  - `जानातीत्य<b>र्यम</b>नामा` — bold starts at `r` of `aryamā` after sandhi
  - `तिष्ठतीत्य<b>श्वत्थ</b>` — bold starts at `śva` after sandhi
  - `मुख्यत्वा<b>देकम्</b>` — bold starts at `de` after sandhi

**Tooltips:**
- Every technical term in `tr` fields → `${T('key')}` — never bare text or `<span>` tags
- Every new term → new entry in `DEFS` before the closing `};`
- DEFS definitions drawn **strictly from the Vivṛtti** — no external sources
- DEFS entries for each śhloka grouped with a comment: `/* śhloka 10.N terms */`

**Sanskrit-only lines (`tr:''`):**
- When the curator says "no English needed" for a citation line, set `tr:''` — do not omit the key
- The `T()` tooltip function can still be used in the `skt` field for terms that appear in DEFS

**Speaker field:**
- Add only when speaker changes from the previous śhloka
- Ch. X: Verse 1 → `श्रीभगवानुवाच` | Verse 12 → `अर्जुन उवाच` | Verse 19 → `श्रीभगवानुवाच`
- All others: omit `speaker` field entirely

**Combined śhlokas:**
- When Rāghavendra treats two śhlokas together: store under first key with `label: 'N–M'`
- Omit the second key entirely — navigation works from the key list, not consecutive integers
- All mūla lines for both śhlokas go in the single `lines[]` array
- Closing marker: `॥ N-M ॥` inside the last `skt` string

**Verse closing markers:**
- Mūla: `॥ N ॥` goes inside the last `dev` string
- Commentary: `॥ N ॥` goes inside the last `skt` string

**Transliteration (IAST) — use in all `tr` fields and DEFS definitions:**
- Long vowels: ā, ī, ū, ē, ō
- Retroflexes: ṭ, ḍ, ṇ, ṣ
- Palatal sibilant: ś | Anusvāra: ṃ | Visarga: ḥ
- No doubled consonants unless Sanskrit has a conjunct (tattva not tatva)
- DEFS keys may use simplified forms (e.g. `avEdyatva`) but definition body must use full IAST

**Terminology:**
| Use | Never use |
|-----|-----------|
| Tattvavāda | Dvaita |
| śhloka | verse |
| Vivṛtti | commentary (prefer Vivṛtti in running text) |
| pratīka | (the bold cited mūla word) |
| अध्यायः | chapter (in UI) |
| श्लोकः | verse (in UI) |
| पूर्वः / अग्रिमः | Previous / Next (in UI) |

---

## Navigation Architecture (Key-List Based)

The verse selector and prev/next navigation work from `verseKeys(chap)` — sorted numeric keys of the verses object — not from consecutive integer arithmetic. This transparently supports combined śhlokas (gaps in key sequence). The optional `label` field on a verse object overrides the key number in all display contexts (breadcrumb, header, selector, prev/next buttons).

---

## Planned Features (Not Yet Built)

- **Chapters I–IX and XII–XVIII** — to be added; Chapter XI is underway
- **Curator edit mode** — password-protected inline editing with JSON export; to be integrated with tattvasudha.org role system
- **Recitation audio** — placeholder row already in place; audio files to be added per śhloka
- **Word-by-word (anvaya) section** — deferred; may add later
- **Search** — deferred

---

## Author Bio (for the sliding About panel)

Śrī Rāghavendra Tīrtha (1623–1671 A.D.) — one of the most prolific writers of the Tattvavāda system of Vedānta. His present work, the *Gītā Vivṛtti* (also known as *Gītārthasaṅgraha*), is a direct commentary on the Bhagavadgītā, of immense help to students and scholars in understanding the Tattvavāda interpretation. He also wrote glosses on *Gītābhāṣya* (Prameyadīpikā) and *Gītātātparya* (Nyāyadīpikā) of Śrī Jayatīrtha. He holds the title *Ṭippanyācāryacakravartī* for his seventeen Ṭīkā commentaries on Śrī Jayatīrtha's works.

---

## Future Improvement — Automation (Not Yet Solved)

The current workflow (curator reads PDF + OCR, pastes śhloka by śhloka per session) is **not scalable** across all 18 chapters. A future solution needs to:

- Extract and align the 〔रा〕 commentary sections from the OCR automatically for all chapters
- Identify pratīkas programmatically (bold in the original print — already in OCR as `**bold**`)
- Auto-generate mūla translations and DEFS entries using a language model batch job
- Produce a complete JSON or JS data block for all 700+ śhlokas in one pass
- Curator review pass would then be per-chapter rather than per-śhloka

**Constraint:** The OCR quality is imperfect and bold markers sometimes split across lines — any automation must handle these artifacts. The source PDF is the ground truth.

**Immediate partial improvement possible:** Write a script to extract all 〔रा〕 sections from `BG_Vyakhyas_Vidyadhiraja_Raghavendra_OCR.md`, split by śhloka, and export as structured JSON — reducing per-session copy-paste work even before full automation.

---

*Last updated: Session through śhloka 11.24 (August 2026) — Chapter XI (Viśvarūpa-darśana Yoga) continuing; 11.1–11.24 written + proofread. Process refinements, now standing rules (see "Session Workflow" and "Footnotes and Image Citations" sections above):*
*(1) Commentary objects must be split one-per-Sanskrit-sentence, matching the granularity already used in Ch. X (10.41/10.42).*
*(2) A chapter-level footnote mechanism (`footnotes` array on `CHAPTERS[N]`, superscript in `nameDev`, `.ch-footnotes` block) handles footnotes keyed to the chapter heading itself — used for 11.1's footnote "१" (citing गी.भा.).*
*(3) Ordinary verse-level footnotes use `.vr-foot-sup` superscripts instead: the in-text marker goes right at the cited word, and the footnote's own appended commentary line is prefixed with the same `<sup>` number so the two visually pair up. Confirmed in the `skt` field (11.2 फुटनोट २, 11.9 फुटनोट १ on a mid-commentary Mokṣadharma citation, 11.11 फुटनोट १ on a मयट् grammar citation, 11.15 फुटनोट १ on a Padma citation) and in the `dev` field (11.3 फुटनोट १, विष्णुसहस्रनाम). Footnote text is always the LAST commentary entry, even when its citation sits mid-commentary (confirmed again at 11.9, sentence 8 of 12).*
*(4) At 11.5, corrected a prior misreading: 11.5 is a normal 2-line verse, not four lines — "चतुष्टयेन" in the commentary refers to the four-verse block 5–8, not extra mūla lines.*
*(5) For terse traditional deity-count enumerations (e.g. "twelve ādityas, eight vasus..." at 11.6), follow the 10.21 precedent of leaving them as plain translation text rather than adding thin one-line DEFS stubs for each name.*
*(6) REVERSED at 11.7 — pratīka bolding must always be inferred by matching mūla words echoed in the commentary and bolded densely, regardless of whether OCR has bold markers or whether the print itself visibly shows bold. A brief session-internal deviation (gating bold on visually-verified print-bold) left 11.6/11.7 under-bolded and was corrected.*
*(7) At 11.8, a mūla word repeated across the commentary (`ददामि`, `पश्य`) was bolded at every occurrence, not just the first — repeats always get bolded, confirmed again at 11.15 (`सर्वान्`, `तव देहे`).*
*(8) At 11.9, introduced the vigraha (compound-analysis) exception — a commentator's analytical decomposition of a मूल compound is not itself a pratīka citation.*
*(9) SHARPENED at 11.10–11.15 (curator-caught correction) — the vigraha exception is broader than first stated: it covers ANY re-inflection of a मूल word into a different case/number for a grammatical analysis, even when the analysis reuses the compound's own roots (not just when it introduces different words). Bold now requires an exact word-form match to the मूल. Two bolding patterns remain valid: (a) a bare word cited as a lemma before "इति" to mark which मूल word is being glossed, and (b) a compound restated verbatim right after "इति," closing a vigraha (the vigraha's own middle/analytical portion stays unbolded either way). Full detail and worked examples under "Pratīka-bolding" in "Current Status" above — read this before drafting any further vigraha-heavy commentary.*
*(10) At 11.15, speaker changes to सञ्जय उवाच (11.9) then to अर्जुन उवाच (11.15) — first non-Kṛṣṇa speakers since 11.1. Two open, non-blocking flags carried forward: a footnote placement uncertainty (see Resume Pointer) and a judgment call on bolding a speaker-heading citation (अर्जुन उवाच).*
*(11) At 11.16, first verse with TWO separate footnotes (२ on a मूल word, ३ on राॕ's own citation) — both rendered as appended entries in citation order, closing marker only on the last. Also first case of bolding a bare exact-form particle (न) rather than a content word — a judgment call, flagged open. Cross-verse citations (11.16 citing 11.10's wording, 11.19 citing 11.16's "नान्तं न मध्यम्") continue to be left unbolded per the 11.7 precedent, even when the words are identical, because they quote a *different* verse's मूल, not the current one's.*
*(12) At 11.20–11.24, confirmed footnote numbering resets per page rather than running continuously per verse/chapter — always trace a superscript to its exact citation point before matching it to a footnote-list entry; two footnotes with the same digit on consecutive pages can belong to entirely different (and non-adjacent) verses. Also surfaced a new sandhi edge case (मूल word fused into a following vowel-initial particle with no clean akṣara boundary for a bold span — left unbolded rather than force a split) and a case where the current strict exact-word-form rule now disagrees with an earlier (pre-11.10-sharpening) bolding decision at 11.9 — flagged rather than silently reconciled.*
*(13) At 11.20, the curator caught an OCR transcription error carried into the draft: "विभ्यज्जनं" should read "बिभ्यज्जनं" (a व/ब confusion — बिभ्यत् is the present participle "fearing," from भी; विभ्यत् is not a real word). Corrected before writing to HTML. Standing caution: this book's OCR/print has a recurring व/ब ambiguity — when a word looks etymologically odd, check whether the other letter makes it a real word before transcribing as-is.*
*(14) Also at 11.20, the curator flagged that Claude's own prose (not the HTML data) mixed a transliterated English word into Devanagari — "सेंटेंस" instead of "sentence." Standing rule: never write English words in Devanagari transliteration in commentary/notes/chat — use plain English or the actual Sanskrit term, never a phonetic hybrid.*
*Next session: continue Chapter XI at 11.25 (अमी च त्वा धृतराष्ट्रस्य पुत्राः..., PDF pages 403–404, speaker stays अर्जुन उवाच). Not yet rendered/verified — do so before drafting, and check its footnote situation carefully given the page-resets-per-footnote-number finding at (12). Remember: bold only an exact word-form match to the मूल — never a vigraha re-inflection, even one reusing the compound's own roots (see (9) above); footnote numbering resets per page (see (12) above); watch for व/ब OCR confusions (see (13) above). Single reference file going forward.*
