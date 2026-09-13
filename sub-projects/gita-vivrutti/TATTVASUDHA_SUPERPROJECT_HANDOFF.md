# Sub-Project Entry: Gītā Vivṛtti (for Tattvasudha super-project CLAUDE.md)

Paste the section below into the Tattvasudha super-project's `CLAUDE.md`, under wherever it lists/tracks individual works or sub-projects. If that file has a "Sub-Projects" or "Works in Progress" index, add a row/entry there too, pointing at this section.

---

## Sub-Project: Gītā Vivṛtti (श्रीराघवेन्द्रतीर्थस्य गीताविवृत्तिः)

**What it is:** A self-contained single-file HTML teaching aid for Śrī Rāghavendra Tīrtha's *Gītā Vivṛtti* (also *Gītārthasaṅgraha*, 1623–1671 A.D.) — a direct commentary on the Bhagavadgītā in the **Tattvavāda Vedānta** tradition (never call it "Dvaita"). Destined to be embedded/hosted at **tattvasudha.org**.

**Location:** `gItAvivRttiH_Claude/` folder, with its own dedicated `CLAUDE.md` — that file is the single source of truth for this sub-project and should be read in full before any session touching it.

**Audience:** Sanskrit students proficient in the language but not yet in deep commentary literature.

### Deliverable
- `gita_vivrutti.html` — single self-contained HTML file, no backend, all śhloka text / commentary / term glossary embedded in JS (`CHAPTERS`, `DEFS` objects). Ready to drop into tattvasudha.org.
- Source materials: an OCR markdown of the printed source book (both Vidyādhirāja and Rāghavendra commentaries — only Rāghavendra's 〔रा〕 portions are used) and the source PDF (ground truth for verifying/correcting the OCR).

### Current Status (update this line whenever picking work back up)
**Chapter X (Vibhūti Yoga) — ✅ COMPLETE.** All 42 śhlokas (1–11, 12–13 combined, 14–42) written and fully proofread.
**Chapter XI (Viśvarūpa-darśana Yoga) — underway.** Śhlokas 11.1–11.4 written and proofread (includes a chapter-level footnote mechanism on the chapter heading itself, plus two verse-level footnotes at 11.2 and 11.3). Next to add: **11.5** — the point where the speaker changes to `श्रीभगवानुवाच` (Kṛṣṇa begins answering Arjuna's request from 11.1–4); this śhloka is longer than usual, spanning four mūla lines.
**Chapters I–IX and XII–XVIII:** not yet started.

*(Always check the "Current Status" / "Resume Pointer" table at the top of `gItAvivRttiH_Claude/CLAUDE.md` for the exact live number — this line will drift out of date.)*

### Workflow in One Paragraph
Per śhloka: locate it in the OCR (Rāghavendra's 〔रा〕 section only), render and verify the corresponding source-PDF page (PyMuPDF, ~4.5× zoom, top/bottom split for legible Devanagari — the PDF is ground truth, the OCR drops passages, scrambles word order across page breaks, and sometimes has no bold markers at all), draft a proposed HTML entry (one commentary object per Sanskrit sentence — not per paragraph — pratīkas bolded, technical terms wired to tooltip glossary entries, terse etymologies given a short "Bhāva" clarifying clause), show the curator for approval, then write to `gita_vivrutti.html` via the `Edit` tool and update the sub-project's own `CLAUDE.md` status table (including its Resume Pointer).

### Standing Rules Worth Knowing at the Super-Project Level
- Terminology: **Tattvavāda** (never "Dvaita"); **śhloka** (not "verse" in prose); **Vivṛtti** (not "commentary"); UI labels stay in Devanagari (अध्यायः, श्लोकः, पूर्वः/अग्रिमः).
- Fonts/colors are locked (Noto Sans Devanagari, Cinzel, Cormorant Garamond; saffron `#B85C1A`, gold `#A8861C`, parchment `#FDF8EE`, ink `#241507`) — do not change without explicit curator instruction, even from a super-project-level pass.
- Every technical Sanskrit term shown to the reader is tooltip-wrapped (`T('key')`) with a definition drawn **strictly from Rāghavendra's Vivṛtti itself** — no outside sources, no modern interpretive additions.
- **Bhāva clauses:** terse nirvacana/etymology lines get a short interpretive `(Bhāva: …)` note appended to the `tr` field — but strictly unpacking what the Vivṛtti itself says, never an outside or modern reading.
- **Two distinct footnote mechanisms** now exist: (1) chapter-heading-level footnotes (`footnotes` array on the `CHAPTERS[N]` object, superscript in `nameDev`, rendered in a dedicated `.ch-footnotes` block), and (2) ordinary verse-level footnotes (`.vr-foot-sup` inline superscript at the cited word, in either the mūla `dev` field or commentary `skt` field, paired with a matching superscript on an appended commentary line).

### Full Detail
Everything else — the exact data schema, the pratīka bold-formatting edge cases (mid-sandhi splits, etc.), footnote/citation handling, IAST transliteration rules, the navigation architecture, and the precise resume prompt — lives in `gItAvivRttiH_Claude/CLAUDE.md`. Treat that file as canonical for this sub-project; do not duplicate its details here beyond this summary, to avoid drift.

---

*Generated as a handoff snapshot from the Gītā Vivṛtti sub-project. Chapter X (all 42 śhlokas) complete and proofread; Chapter XI underway (11.1–11.4 done and proofread), next up is 11.5. Update the "Current Status" line above whenever this section is refreshed.*
