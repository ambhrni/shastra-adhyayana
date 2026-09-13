# Tattvasudhā — Claude Code Context

## Project

- Live: https://tattvasudha.org
- Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL+pgvector+Auth+RLS, Anthropic Claude API, Gemini Embedding 2, Vercel
- Repo: github.com/ambhrni/shastra-adhyayana
- Local: C:\Projects\vadavali-app
- Contact: tattvasudhaa@gmail.com

## Multi-Machine Session Discipline (READ FIRST, EVERY SESSION)

This repo is worked on from more than one machine. Git is the *only* sync mechanism —
there is no live sync between machines, only what's committed and pushed. Every Claude
session working in this repo, on any machine, must:

1. **At the start of the session:** run `git pull` before making or reading any changes,
   so you're not working from a stale checkout another machine has already moved past.
2. **At the end of the session (or before switching machines):** `git add` / `git commit`
   / `git push` any changes worth keeping — including edits Claude made to this file or
   to a sub-project's own CLAUDE.md, not just application code. Uncommitted work sitting
   only on one machine's disk defeats the whole point of this setup.
3. **Never assume another machine's disk state** — if resuming a sub-project, trust what
   `git pull` just brought down over any memory/assumption of where things were left.

See `claude/MULTI_MACHINE_SETUP.md` (claude.ai Project doc) for full new-machine setup
steps. If a Claude session is working through a sandboxed/cloud connection to this
machine rather than a native Claude Code CLI session, it may be able to commit but not
`git push` (no GitHub credentials in that sandbox) — in that case it will say so, and a
plain `git push origin master` from a normal terminal on this machine finishes the job.

## Sub-Projects Index

Tattvasudhā is the super-project. Sub-projects below are independently developed
deliverables destined for tattvasudha.org, each with its own dedicated CLAUDE.md as
the canonical source of truth for that sub-project. **Before working on a sub-project,
read its own CLAUDE.md in full** — this index is a pointer + one-line status only,
not a substitute.

| Sub-Project | Location | Own CLAUDE.md | One-line status |
| --- | --- | --- | --- |
| Gītā Vivṛtti | `sub-projects/gita-vivrutti/` | `sub-projects/gita-vivrutti/CLAUDE.md` | (as of 2026-09-13) Ch. X complete (42 śhlokas); Ch. XI underway (11.1–11.27 done), next: 11.28 |
| bhēdōjjīvanam Source Transcription | `sub-projects/bhedojjivanam/BJ_working/` | `sub-projects/bhedojjivanam/BJ_working/CLAUDE.md` | (as of 2026-08-08) Pages 2–137 transcription COMPLETE (batches 1–14) — since ingested (176 passages), embedded, and LIVE on tattvasudha.org (see "✅ PHASE 1 COMPLETE" section below). Raw scan PDFs/page-render PNGs kept local-only per machine, not in git (see BJ_working/ .gitignore rules). |

## Sub-Project: Gītā Vivṛtti (श्रीराघवेन्द्रतीर्थस्य गीताविवृत्तिः)

**What it is:** A self-contained single-file HTML teaching aid for Śrī Rāghavendra
Tīrtha's *Gītā Vivṛtti* (also *Gītārthasaṅgraha*, 1623–1671 A.D.) — a direct commentary
on the Bhagavadgītā in the **Tattvavāda Vedānta** tradition (never call it "Dvaita").
Destined to be embedded/hosted at **tattvasudha.org**.

**Location:** `sub-projects/gita-vivrutti/` folder, with its own dedicated `CLAUDE.md` — that
file is the single source of truth for this sub-project and should be read in full
before any session touching it.

**Audience:** Sanskrit students proficient in the language but not yet in deep
commentary literature.

### Deliverable
- `gita_vivrutti.html` — single self-contained HTML file, no backend, all śhloka
  text / commentary / term glossary embedded in JS (`CHAPTERS`, `DEFS` objects).
  Ready to drop into tattvasudha.org.
- Source materials: an OCR markdown of the printed source book (both Vidyādhirāja
  and Rāghavendra commentaries — only Rāghavendra's 〔रा〕 portions are used) and
  the source PDF (ground truth for verifying/correcting the OCR).

### Current Status (update this line whenever picking work back up)
**Chapter X (Vibhūti Yoga) — ✅ COMPLETE.** All 42 śhlokas (1–11, 12–13 combined,
14–42) written and fully proofread.
**Chapter XI (Viśvarūpa-darśana Yoga) — underway.** Śhlokas 11.1–11.27 written and
proofread (includes a chapter-level footnote mechanism on the chapter heading
itself, plus two verse-level footnotes at 11.2 and 11.3). Speaker changed to
`श्रीभगवानुवाच` at 11.5 (Kṛṣṇa begins answering Arjuna's request from 11.1–4)
and continues through 11.8; 11.9 changes speaker to `सञ्जय उवाच` (first non-Kṛṣṇa/Arjuna speaker since 11.1), continuing through 11.14, then `अर्जुन उवाच` from 11.15 (Arjuna's own praise of the viśvarūpa begins). Verse-level footnotes also at 11.11 (मयट् grammar) and 11.15 (Pādma citation). 11.14 supplies `॥ १४ ॥` for a bare-`॥` print omission (same situation as 11.7). **Firm standing requirement (curator-confirmed):**
pratīkas are always bolded densely by matching every mūla word echoed in the
commentary, regardless of whether OCR or the print itself shows bold — a brief
session-internal deviation (gating bold on visible print-bold only) left 11.6/
11.7 under-bolded and was corrected; 11.8 applies the rule cleanly, including
bolding repeated occurrences of the same mūla word (e.g. `ददामि`, `पश्य`, and
again at 11.15's `सर्वान्`/`तव देहे`).
11.9 embeds a Mokṣadharma citation with its own verse-level footnote (citation
sits mid-commentary, footnote text appended last per convention) and adds two
new DEFS entries (`hariḥ`, `mahāyogeśvara`); 11.11 adds `sarvāścaryamaya`.
11.16 is the first verse with **two separate footnotes** on one verse (one on a
mūla word, one on राॕ's own citation), both appended in citation order with the
closing marker only on the last, and enriches the existing `viśvarūpa` DEFS
entry; 11.17 has no footnote. 11.18 has no footnote; 11.19's footnote belongs
only to राॕ's own citation (a second footnote on the same page belongs to the
always-ignored 〔वि〕 section and was correctly skipped). **Footnote numbering
resets per page** (confirmed at 11.20–11.21, where page 402's १/२ belong to
entirely different verses than page 401's १/२) — always trace a superscript to
its citation point rather than assuming by digit. 11.20 is the densest single
verse so far (15 commentary sentences, two alternative glosses of "lokatrayam").
11.14 and 11.23 both supply a missing `॥ N ॥` for a bare-`॥` print omission.

**Bolding exception — vigraha is not a citation (introduced 11.9, SHARPENED at
11.10–11.15 after a curator-caught over-bolding error):** when the commentary
analyzes a mūla compound word via vigraha (grammatical decomposition), the
analytical wording is not bolded — and this holds even when the vigraha reuses
the compound's own root words, just re-inflected into a different case/number
to make the analysis sentence work (e.g. 11.10's `अनेकानि वक्त्राणि नयनानि`
for mūla `अनेकवक्त्रनयनम्`, or 11.15's `कमलासने...स्थितम्` for mūla
`कमलासनस्थम्` — both initially bolded in error, corrected on curator review).
Bold now requires an **exact word-form match** to the mūla (same stem/case/
number; sandhi spelling changes are fine, grammatical re-inflection is not).
Two patterns stay valid: a bare word cited as a lemma before `इति`, and a
compound restated verbatim right after `इति` closing a vigraha. Full worked
examples in `sub-projects/gita-vivrutti/CLAUDE.md`. Next to add: **11.28**.
**Chapters I–IX and XII–XVIII:** not yet started.

*(Always check the "Current Status" / "Resume Pointer" table at the top of
`sub-projects/gita-vivrutti/CLAUDE.md` for the exact live number — this line will drift
out of date.)*

### Workflow in One Paragraph
Per śhloka: locate it in the OCR (Rāghavendra's 〔रा〕 section only), render and
verify the corresponding source-PDF page (PyMuPDF, ~4.5× zoom, top/bottom split
for legible Devanagari — the PDF is ground truth, the OCR drops passages,
scrambles word order across page breaks, and sometimes has no bold markers at
all), draft a proposed HTML entry (one commentary object per Sanskrit sentence —
not per paragraph — pratīkas bolded, technical terms wired to tooltip glossary
entries, terse etymologies given a short "Bhāva" clarifying clause), show the
curator for approval, then write to `gita_vivrutti.html` via the `Edit` tool and
update the sub-project's own `CLAUDE.md` status table (including its Resume
Pointer).

### Standing Rules Worth Knowing at the Super-Project Level
- Terminology: **Tattvavāda** (never "Dvaita"); **śhloka** (not "verse" in prose);
  **Vivṛtti** (not "commentary"); UI labels stay in Devanagari (अध्यायः, श्लोकः,
  पूर्वः/अग्रिमः).
- Fonts/colors are locked (Noto Sans Devanagari, Cinzel, Cormorant Garamond;
  saffron `#B85C1A`, gold `#A8861C`, parchment `#FDF8EE`, ink `#241507`) — do not
  change without explicit curator instruction, even from a super-project-level pass.
- Every technical Sanskrit term shown to the reader is tooltip-wrapped (`T('key')`)
  with a definition drawn **strictly from Rāghavendra's Vivṛtti itself** — no
  outside sources, no modern interpretive additions.
- **Bhāva clauses:** terse nirvacana/etymology lines get a short interpretive
  `(Bhāva: …)` note appended to the `tr` field — but strictly unpacking what the
  Vivṛtti itself says, never an outside or modern reading.
- **Two distinct footnote mechanisms** now exist: (1) chapter-heading-level
  footnotes (`footnotes` array on the `CHAPTERS[N]` object, superscript in
  `nameDev`, rendered in a dedicated `.ch-footnotes` block), and (2) ordinary
  verse-level footnotes (`.vr-foot-sup` inline superscript at the cited word, in
  either the mūla `dev` field or commentary `skt` field, paired with a matching
  superscript on an appended commentary line).

### Full Detail
Everything else — the exact data schema, the pratīka bold-formatting edge cases
(mid-sandhi splits, etc.), footnote/citation handling, IAST transliteration
rules, the navigation architecture, and the precise resume prompt — lives in
`sub-projects/gita-vivrutti/CLAUDE.md`. Treat that file as canonical for this
sub-project; do not duplicate its details here beyond this summary, to avoid drift.

## Critical Terminology — Never Get Wrong

- Always: "Madhva Tattvavāda Siddhānta", "Tattvavāda" — never "Madhva Dvaita Vedānta" or "Dvaita"
- Never mention maṭha affiliations
- Vēda (long ē), Stotra (no macron), Tattvavāda, Madhva (no macron)
- No Hindi in Sanskrit contexts; no mixed Devanāgarī/Latin within a single word

## Critical Commentator Identities — Never Confuse

| Author | Text | UUID |
| --- | --- | --- |
| Jayatīrtha | vādāvalī mūlam | —   |
| Rāghavendra Tīrtha | भावदीपिका (Bhāvadīpikā) | 98463977-b1ff-4f0e-a926-d7f6672c51b8 |
| Śrīnivāsa Tīrtha | वादावलीप्रकाशः (Vādāvalīprakāśaḥ) | 3b18249c-26a4-4ea8-9466-01ff18cb439b |
| Vyāsarāja Tīrtha | भेदोज्जीवनम् (Bhēdōjjīvanam) | —   |
| Kāśītirumalācārya | काशिका (Kāśikā) on Bhēdōjjīvanam | 576e423e-a9b7-4b5b-8f81-be7edea48845 |

## Key UUIDs

- vādāvalī text_id: `c0219559-a8a9-4ebb-be5b-eca29b921457`
- bhēdōjjīvanam text_id: `86257ca9-12ab-4a5e-83ff-4e4b2938b071`

## Tech Stack Details

- AI Tutor: claude-sonnet-4-6 (default) / claude-opus-4-6 (user toggle)
- Argument node generation: claude-opus-4-8 (curator-confirmed 2026-08-06 vs Sonnet 5 via
  side-by-side comparison on bhedojjivanam -- see bhēdōjjīvanam status section)
- Embeddings: models/gemini-embedding-2-preview (3072-dim, exact search — no HNSW/ivfflat, pgvector limit is 2000-dim)
- Argument node streams: mula | bhavadipika | vadavaliprakasha | kashika
- Section links stored in: section_links table

## PowerShell Conventions

- Use semicolons (;) not && for chaining
- Quote paths with parentheses: `git add "app/(app)/texts"`
- Never deploy without explicit curator confirmation

## Supabase SQL Conventions

- ALL SQL run manually in Supabase SQL Editor — never via `npx supabase`
- CRITICAL RLS BUG: ALL policies need both USING and WITH CHECK — missing USING causes silent write failures (data: [], error: null). Fix: DROP and recreate, never just ALTER.
- Always show SQL before running — curator approves first

## Workflow

```
npm run dev   # test locally first
git add -A
git commit -m "..."
git push
vercel --prod  # only after curator confirmation
```

## Scripts (all via: npx ts-node --project tsconfig.scripts.json scripts/<name>)

| Script | Purpose | Key flags |
| --- | --- | --- |
| seed-text-record.ts | Seed new text + link commentators | —   |
| ingest-text.ts | Ingest vādāvalī from .xlsx | --file, --text-id |
| ingest-bhedojjivanam.ts | Ingest bhēdōjjīvanam from .xlsx | --file, --text-id |
| embed-passages.ts | Generate Gemini embeddings | --text-id, --approved |
| generate-nyaya-concepts.ts | Generate nyāya concepts | --text-id |
| embed-nyaya-concepts.ts | Embed nyāya concepts | —   |
| generate-argument-maps.ts | Generate argument nodes (Opus) | --text-id, --passage-id, --force |
| test-argument-map-model-compare.ts | Compare Opus 4.8 vs Sonnet 5 output, no DB writes | --units, --file |
| generate-section-links.ts | Generate section cross-links (Opus) | --text-id, --force |
| ingest-nyaya-kosha.ts | Ingest Nyāyakośa reference | —   |
| ingest-pramana-paddhati.ts | Ingest Pramāṇapaddhati | —   |
| sync-youtube-channels.ts | Sync YouTube via API v3 | —   |

## Argument Map Details

- Node types: purva_paksha | shanka | khandana | samadhanam | siddhanta | upasamhara
- Logical flaws (khandana only): vyabhichara | asiddha | savyabhichara | badhita | viruddha | satpratipaksha | pratyakshabadhita | shrutivirodha | ashrayasiddha
- Refutation types (khandana only): lakshanam | pramanam | anumanam | siddhanta
- Commentary nodes: parent_node_id points to parent mūla node
- Generation: single Opus call per passage, all streams simultaneously, max_tokens: 16000
- Attribution guard: Rāghavendra Tīrtha = श्रीमद्राघवेन्द्रतीर्थाः ONLY — never रघूत्तमतीर्थाः
- Long passages (kāśikā > 12000 chars combined): truncated to 6000 chars per commentary

## RAG Pipeline

- Corpus: 126 vādāvalī passages + 36 bhēdōjjīvanam passages + 436→566 nyāya concepts + 2179 Nyāyakośa + 1096 Pramāṇapaddhati chunks
- Source labels in tutor: [मूलम्] [भावदीपिका] [वादावलीप्रकाशः] [न्यायकोशः] [प्रमाणपद्धतिः]
- pgvector exact search (no index) — fast at current scale

## Database: passage_embeddings

- Has text_id column (added April 2026) — always include in upserts

## Texts on Platform

| Text | Author | Passages | Sections | Commentary |
| --- | --- | --- | --- | --- |
| वादावली | Jayatīrtha | 126 | 40  | Bhāvadīpikā + Vādāvalīprakāśaḥ |
| भेदोज्जीवनम् | Vyāsarāja Tīrtha | 176 | 125 | Kāśikā (Kāśītirumalācārya) |

## bhēdōjjīvanam — Status (as of 2026-08-06 EOD — PAUSED, see Resume Pointer)

> **⏸ PAUSED HERE (2026-08-06 end of session).** Quick summary for tomorrow:
>
> **Done:** re-ingestion (176 passages + 173 commentaries, 3 legitimately bare),
> embeddings (176/176). Model choice for argument-map generation resolved (Opus 4.8).
> A batch of rendering bugs found via curator's own screenshots and fixed: Server/
> Client boundary crash, footnote-block extraction (was silently failing on some
> passages, leaking raw footnote text into the reading body), a hardcoded "Vādāvalī"
> header mislabel. All pushed to `lib/render-passage-text.tsx` + the 4 components/
> pages that use it.
>
> **RESOLVED (2026-08-07):** curator reviewed the live render -- header fix and bold
> rendering confirmed working. Footnote LIST styling wasn't landing visually, so per
> curator: footnotes (both inline markers and the bottom list) are now DISABLED at
> the render layer, for now -- `renderPassageText`/`stripPassageMarkup` strip
> `[^key]` refs and the trailing definitions block from display entirely.
> **Data itself is untouched** -- refs/definitions still exist in the DB, this is
> reversible whenever a better footnote design gets picked back up.
>
> Also fixed same session: a real data-content issue where source-transcription
> "..." continuation-markers (used to flag a word interrupted by a footnote/page
> break) were leaking into the reading text as literal "...  ..." gaps mid-word.
> Fixed at render time too (collapse the now-adjacent double-ellipsis once footnote
> refs are stripped) -- NOT a data edit, same reversibility reasoning.
>
> **To resume:** curator to verify the simplified render (no footnotes, no ellipsis
> artifacts) looks right on a few more passages, then proceed to curator approval
> → nyāya concepts → argument maps → section links (see "NEXT STEP" section below).

> **Rendering confirmed good (2026-08-07).** Curator reviewed the simplified render
> across multiple passages -- clean, no footnotes, no ellipsis artifacts. Ready to
> proceed with curator approval in the app, then nyāya concepts / argument maps /
> section links per the "NEXT STEP" sequence below.
>
> **All 176 passages approved (2026-08-07).** Curator Portal UX improvements (jump-nav
> + bulk approve, see below) made this practical. Next: nyāya concepts → argument
> maps (Opus 4.8) → section links, run one at a time -- start cheap, check results,
> THEN commit to the ~$85-90 argument-maps step. Exact commands in "NEXT STEP" below.
>
> **RLS + commentary-approval bugs found and fixed, verified end-to-end (2026-08-07).**
> See the two "Fixed:" entries below for full detail. Curator confirmed: Approve All
> now persists through a refresh, and the AI Tutor correctly sees kāśikā commentary.
> This was blocking real content review, not just cosmetic -- now genuinely resolved.
> Clear to proceed with nyāya concepts → argument maps → section links.
>
> **All three AI-generation steps done and verified (2026-08-07):** nyāya concepts
> (658/697 first pass + 39 retried after a transient network blip = all done),
> argument maps (174/176 + 2 individually retried after fixing a refutation_type
> validation bug and a --passage-id text_id bug, confirmed via node_count query:
> 11 and 7 nodes respectively), section links (124 spine + 21 cross-links, after
> fixing a token-budget truncation bug). Next: section colors in Curator Portal,
> then spot-check the Argument Map/Concepts tabs in the actual UI, then publish
> decision -- see "NEXT STEP" section below.

> **⏸ Detailed chronological fix log below (older → newer), kept for reference if
> anything needs to be traced back to why a specific change was made:**

> **⏸ RESUME POINTER:** Segmentation + curator review of the new 176-entry structure is
> DONE, and confirmed as of 2026-08-05 to contain ALL corrections through the final
> round (verified directly: 22.1/22.2, 31.2, 76/77 split, 65/66 merge all checked in
> the file). `scripts/data/bhedojjivanam-units.json` is now PLACED in the repo
> (curator confirmed, byte-size verified against the source) -- one stray artifact
> (a leftover "काशिका" print-label in unit 1's mula, missed when the pipeline was
> rebuilt for the root-cause page-boundary fix) was found and fixed directly in the
> placed file. Ingestion script (`ingest-bhedojjivanam-v2.ts`) and cleanup SQL
> (`bhedojjivanam-v2-cleanup.sql`) are written. **Nothing has been run against
> Supabase yet.** Curator has CONFIRMED: after ingestion, regenerate nyaya concepts /
> argument maps / section links for the new 176-passage structure -- do not reuse
> anything from the old 36-passage structure (deleted by the cleanup SQL first anyway).
>
> **Model decision: RESOLVED (2026-08-06).** Curator reviewed the side-by-side
> comparison (`scripts/data/model-compare-output.html`, grouped by argumentative role)
> and prefers Opus 4.8's output. `scripts/generate-argument-maps.ts`'s `DEFAULT_MODEL`
> updated from `claude-opus-4-6` to `claude-opus-4-8` accordingly -- the real run needs
> no `--model` flag. This reconfirms the older documented finding ("Sonnet quality is
> insufficient for rigorous nyaya-shastra") even across newer generations of both
> models, for this specific task.
>
> **Bug found+fixed while testing (2026-08-05):** both `test-argument-map-model-compare.ts`
> AND the real `lib/argument-map-generator.ts` assumed `content[0]` was always the text
> response. Sonnet 5's adaptive-thinking-by-default can put a `thinking` block first,
> breaking that assumption (`Cannot read properties of undefined (reading 'trim')`).
> Fixed in BOTH files to find the text block by `type`, not position -- this would have
> broken the real 176-passage run too, regardless of which model gets chosen, so this
> was worth fixing at the source rather than just in the test script.
>
> **Second bug found+fixed (2026-08-05):** Sonnet 5 defaults to adaptive thinking when
> `thinking` is omitted (opposite of Opus 4.x, where omitting means thinking OFF), and
> `max_tokens` caps thinking+text combined -- so it was spending the entire 16000-token
> budget on reasoning before ever writing the JSON answer (`stop_reason=max_tokens`,
> zero text blocks). Fixed in BOTH files: `thinking: {type:'disabled'}` for Sonnet-5-
> family models (fair vs Opus's default no-thinking behavior, and this is a structured-
> extraction task with no real need for visible reasoning), plus a larger max_tokens
> ceiling for Sonnet 5 specifically (its new tokenizer produces ~30% more tokens for
> the same text).
>
> **Third fix (2026-08-05):** the SDK refuses non-streaming calls estimated to run
> past 10 minutes -- max_tokens=24000 for Sonnet 5 tripped that guard even though
> actual generation is much faster. Switched to `anthropic.messages.stream(...)` +
> `.finalMessage()` in BOTH files -- same final Message shape as `.create()`, no other
> code changed.
>
> **Fourth fix (2026-08-06):** the cleanup SQL originally only deleted
> passages/commentaries/passage_embeddings -- but CLAUDE.md's own "Current State"
> record shows the old 36-passage structure ALSO has 532 argument_nodes, 63
> section_links, and 566 nyaya_concepts (130 bhedojjivanam-specific). Rewrote
> `bhedojjivanam-v2-cleanup.sql` to delete all of these in FK-safe order (nyaya
> concepts+embeddings -> argument flags/versions/nodes -> section_links ->
> commentaries/embeddings/passages), split into labeled sub-steps (2a-2d) so each
> can be run and confirmed individually rather than as one large block. Caught before
> Step 2 was run, not after -- worth knowing this file needed a real fix, not just a
> typo.
>
> **Fifth fix (2026-08-06):** introspected the REAL schema via information_schema
> (two of my assumptions were wrong). Corrected: (1) `nyaya_concepts` has NO
> `passage_id` -- it links via a separate `passage_nyaya_links` junction table,
> and concepts are SHARED across texts (confirms "436 reused from vadavali" from
> the docs) -- deleting `nyaya_concepts` rows directly would have corrupted
> vadavali's own references, so cleanup now deletes only the LINKS, never the
> concepts/embeddings. (2) Found via the real FK map that `argument_node_links`,
> `flagged_errors`, `pariksha_sessions`, `passage_notes`, `tutor_sessions`, and
> `user_progress` all reference `passages.id` directly and would have blocked
> the final passages DELETE with a foreign-key violation -- added defensively
> (expected empty, bhedojjivanam is unpublished, but Postgres would refuse the
> parent delete otherwise). Full corrected file now has 5 sub-steps (2a-2e).
>
> To resume: proceed straight to "NEXT STEP" action 1 onward -- the model comparison
> step is done, no need to re-run it. Cleanup SQL: re-run Step 1 (now checks more
> tables), then Steps 2a through 2e in order, then Step 3 to verify all zero.
>
> **Sixth fix (2026-08-06):** dry-run caught `ingest-bhedojjivanam-v2.ts` skipping
> 3 entire passages (27.1, 31.2, 32.1) because it required kashika_text to be
> non-empty or dropped the WHOLE passage -- including its mUla. These three are
> legitimately kAshikA-less (bare structural phrases like "iti pUrvapakShagranthaH"
> and "siddhAntaH", confirmed correct back when we fixed the unit 31/32 split) --
> the bug would have silently discarded real, curator-corrected mUla content.
> Fixed: only section_name/mula_text missing now skips a passage; missing
> kashika_text just skips creating that one commentaries row, passage still
> gets inserted. Cleanup SQL was also destructive if wrong -- this one is
> data-loss-by-omission, easy to miss since dry-run output doesn't shout about
> missing entries unless you check the total count against 176.

### Current State
bhēdōjjīvanam is UNPUBLISHED (is_published = false). Do not publish until all steps below are complete.

**Re-ingestion (2026-08-06): DONE.** 176 passages + 173 commentaries inserted
(3 passages legitimately have no kāśikā -- 27.1, 31.2, 32.1 -- bare structural mUla
phrases, expected). Old 36-passage structure + all dependents fully deleted first
(verified all-zero). **Embeddings (2026-08-06): DONE** -- 176/176, 0 errors.
Next: curator approval in /curator (visual check in the actual app UI, not just
terminal output -- first real look at this data rendered), then nyaya concepts /
argument maps (Opus 4.8, confirmed) / section links.

Data pipeline run so far (OLD structure, now DELETED as of 2026-08-06):
- ~~36 passages ingested~~ deleted
- ~~36 passage embeddings generated~~ deleted
- ~~532 argument nodes generated (mula + kashika streams)~~ deleted
- ~~63 section links generated~~ deleted
- ~~566 nyāya concepts embedded (130 new + 436 reused from vādāvalī)~~ links deleted
  (concepts themselves preserved -- shared with vādāvalī via passage_nyaya_links)

UI fixes completed this session:
- ArgumentStream widened to include 'kashika'
- PassageDAG, PassageChain, ArgumentMapAdmin updated for dynamic stream detection
- Map page metadata dynamic from DB
- AI tutor system prompt dynamic per text
- Navbar: Courses dropdown added
- is_published = true set then immediately reverted to false (do not republish yet)
- vādāvalī thumbnail restored (new image uploaded to Supabase Storage)
- vādāvalī description fixed: "Dvaita Vedānta" → "Tattvavāda perspective"

### Model Comparison Test — Opus 4.8 vs Sonnet 5 (RUN THIS FIRST)

`scripts/test-argument-map-model-compare.ts` -- reads sample passages directly from
`scripts/data/bhedojjivanam-units.json` (no DB involved at all) and calls both models
using the exact same prompt logic as the real generator (`lib/argument-map-generator.ts`
now exports `buildSystemPrompt`, `buildUserPrompt`, `COMMENTARY_DETECTORS` for this
purpose). Default sample: 8 passages chosen for a representative spread -- the opening
mangalacarana (unit 1), the most khandana/purva-paksha-dense passages by kashika length
(13, 45.3, 30.3, 90.2), one from the heavily-corrected 65/66 merge (65), and two short
ones for contrast (87.2, 52).

```
npx ts-node --project tsconfig.scripts.json scripts/test-argument-map-model-compare.ts
```

Writes two files: `scripts/data/model-compare-output.html` (READ THIS ONE -- side-by-
side, grouped by argumentative role like purva_paksha/khandana rather than raw array
order, since the two models don't necessarily emit nodes in the same order or count;
grouping by role lets you compare like-for-like) and `scripts/data/model-compare-
output.md` (raw JSON, fallback/debug reference only, hard to visually compare -- kept
for field-level detail the HTML view simplifies away). No automated scoring; curator
reads and judges on nyaya-shastra precision. Costs a few dollars total, not the full
~$85-90. Decide the model for the real run (step 6 below) based on this before running
`--force` on all 176 passages.

### NEXT STEP — Re-ingestion via direct-markdown pipeline (READY TO RUN)

Superseded the Excel-based plan below: curator produced a full manual transcription of
the patha pustakam (136 pages, mula+Kashika, no Bhavaprakashika) and it was segmented,
corrected, and curator-reviewed into **176 passage entries** (some upashirshikas split
into N.1/N.2 sub-units where multiple mula+kashika pairs were bundled under one heading).
Full reasoning/corrections trail lives in `corrections.json` from that session.

New scripts (replace the old Excel-based ones for this text):
- `scripts/bhedojjivanam-v2-cleanup.sql` — deletes the old 36-passage data (passages,
  commentaries, passage_embeddings) for this text_id. Run manually in Supabase SQL
  Editor, curator-approved, BEFORE re-ingesting.
- `scripts/ingest-bhedojjivanam-v2.ts` — reads a JSON array directly (no Excel),
  `--file scripts/data/bhedojjivanam-units.json` by default. Refuses to run if
  passages already exist for this text_id (safety check pointing at the cleanup SQL).

**Action needed from curator:** save the reviewed `bhedojjivanam_units.json` (176
entries, from the segmentation/review-tool session) to
`scripts/data/bhedojjivanam-units.json` in this repo — not yet placed there (file
was too large to write through chat tooling directly).

Then run in order:
```
# 1. In Supabase SQL Editor: run scripts/bhedojjivanam-v2-cleanup.sql (Steps 1-3)
# 2. Dry run first:
npx ts-node --project tsconfig.scripts.json scripts/ingest-bhedojjivanam-v2.ts --dry-run
# 3. Real run:
npx ts-node --project tsconfig.scripts.json scripts/ingest-bhedojjivanam-v2.ts
# 4. Embed:
npx ts-node --project tsconfig.scripts.json scripts/embed-passages.ts --text-id 86257ca9-12ab-4a5e-83ff-4e4b2938b071
# 5. Curator Portal: review and approve passages
# 6. CONFIRMED (2026-08-05): regenerate for the new 176-passage structure --
#    do NOT reuse anything tied to the old 36-passage structure (already deleted by step 1):
npx ts-node --project tsconfig.scripts.json scripts/generate-nyaya-concepts.ts --text-id 86257ca9-12ab-4a5e-83ff-4e4b2938b071
npx ts-node --project tsconfig.scripts.json scripts/embed-nyaya-concepts.ts
npx ts-node --project tsconfig.scripts.json scripts/generate-argument-maps.ts --text-id 86257ca9-12ab-4a5e-83ff-4e4b2938b071 --force
#    ^ ~176 passages x ~$0.50/passage on Opus = roughly $85-90 for this step alone -- confirmed acceptable, but real cost, not just time
npx ts-node --project tsconfig.scripts.json scripts/generate-section-links.ts --text-id 86257ca9-12ab-4a5e-83ff-4e4b2938b071 --force
# 7. Section colors in Curator Portal (needed for Argument Flow View regardless)
# 8. Only when curator confirms: set is_published = true
```

### Superseded — old Excel-based plan (kept for reference only, do not follow)

The original plan was for curator to hand-produce a 70+ row Excel from the
pathapustakam. That step is now done differently (full transcription → automated
segmentation → curator review tool → corrections.json), producing 176 entries via
JSON rather than an Excel intermediate. `scripts/ingest-bhedojjivanam.ts` (the old
.xlsx-based script) is superseded by `ingest-bhedojjivanam-v2.ts` above for this text.

### Pending — Intro text (AWAITING CURATOR)
- Intro page at /texts/86257ca9-12ab-4a5e-83ff-4e4b2938b071/intro is a blank placeholder
- Curator will provide accurate en and sa intro text — do NOT fill with AI-generated content

### Argument Flow View — Known UI Issue
- DAG starts at §9 instead of §1 — spine-only nodes (§1-8) not rendered in layout
- Section colors missing (section_argument_types empty for bhēdōjjīvanam)
- These will be fixed after re-ingestion

### Text rendering fix (2026-08-06) — footnote markers + bold, platform-wide
Curator reviewing /curator noticed raw `**bold**` and `[^p5-1]`-style footnote
markers showing as literal text instead of being rendered -- this affects ALL
text display, not just bhēdōjjīvanam, since bhēdōjjīvanam is the first text whose
pipeline actually emits these markers (vādāvalī's content has neither).

New shared utility: `lib/render-passage-text.tsx`
- `renderPassageText(text)` -- for real reading views. Strips the trailing
  "---\n**टिप्पण्यः (footnotes):**" block bhēdōjjīvanam's pipeline folds into
  kashika_text, parses it into a key->definition map, converts `**bold**` to
  `<strong>`, and converts inline `[^key]` refs to small superscript markers
  with a hover/tap tooltip (CSS: `.footnote-marker`/`.footnote-tip` in
  globals.css) showing the definition -- instead of raw bracket text sitting
  mid-word/mid-sentence.
- `stripPassageMarkup(text)` -- for compact truncated previews (curator list)
  where tooltips don't apply; strips ** and [^key] entirely for clean plain text.

Wired into:
- `MulaPanel.tsx` -- both curator (InlineEditor renderDisplay) and learner paths
- `CommentaryTabs.tsx` -- `renderWithHooks` now delegates to `renderPassageText`
  when text contains `**` (bhēdōjjīvanam), otherwise keeps the original
  hook-phrase regex bolding unchanged (vādāvalī, zero regression risk)
- `components/curator/PassageList.tsx` -- list preview uses `stripPassageMarkup`

Not yet checked: any other place mula_text/commentary_text might render (e.g.
AI tutor context injection, search results, parikSha mode) -- worth a sweep
if footnote markers show up raw somewhere else later.

**Runtime error caught+fixed (2026-08-06):** adding `renderDisplay={renderPassageText}`
to `MulaPanel.tsx` broke at runtime -- "Functions cannot be passed directly to
Client Components". Cause: `MulaPanel` had no `'use client'` (Server Component by
default), but `InlineEditor` does -- passing a plain function as a prop across that
Server->Client boundary isn't allowed (only `'use server'` Server Actions can cross
that way). `CommentaryTabs.tsx` already had `'use client'` so its identical
`renderDisplay` pattern worked fine; `MulaPanel` didn't. Fixed by adding
`'use client'` to `MulaPanel.tsx` -- safe since it does no data fetching itself,
just renders props handed down from the page.tsx Server Component above it.

**Footnote rendering redesigned + root cause fixed (2026-08-06):** curator screenshots
showed footnote DEFINITION TEXT leaking mid-paragraph into the reading body (e.g. an
editorial note about a footnote spanning pages 4-5 appearing as if it were philosophical
content), with only the `[^key]` marker converted to a bare number. Root cause: my
footnote-block extraction used an EXACT literal string match, which silently failed for
some passages (never diagnosed exactly why -- whitespace variation is the leading
suspect) -- when it fails, nothing gets stripped and the raw block (including `[^key]:`
definition LABELS, which look enough like in-prose reference markers) flows straight
through as ordinary body text.

Also a UX change per curator feedback: hover/tap tooltips aren't "like the books" and
don't work well on touch -- redesigned to a proper numbered footnote LIST at the bottom
of each panel, smaller font, matching a printed page's footnotes, rather than tooltips.

Rewrote `lib/render-passage-text.tsx`:
- Block-detection is now a whitespace-tolerant REGEX, not an exact string match
- `renderPassageText` returns body text (bold + numbered superscript refs) followed by
  a `.passage-footnotes` list block (numbered entries, smaller stone-colored text)
- Numbers assigned in order of first appearance; a key referenced twice reuses one number

This changed the return shape from inline-only to include block-level content (a `<div>`
footnote list), which meant three wrapper elements needed fixing too (a `<div>` can't
legally sit inside a `<p>` or `<span>`):
- `MulaPanel.tsx` -- learner-view wrapper `<p>` -> `<div>`
- `CommentaryTabs.tsx` -- learner-view wrapper `<p>` -> `<div>`; `renderWithHooks`
  return type `React.ReactNode[]` -> `React.ReactNode`
- `InlineEditor.tsx` -- curator-view display wrapper `<span>` -> `<div>` (shared by
  both panels' curator mode)

CSS in globals.css: removed `.footnote-marker`/`.footnote-tip` hover mechanism,
replaced with `.passage-footnote-ref` (small superscript number) and
`.passage-footnotes`/`.passage-footnote-entry` (the bottom list, bordered-top, smaller
muted text).

**Separate bug also fixed while investigating (2026-08-06):** `PassageSelector.tsx`
had "Vādāvalī" HARDCODED as a literal string in the course-title header, regardless of
which text was actually open -- so bhēdōjjīvanam pages showed "Vādāvalī" at the top.
Added a `textTitle` prop, fetched from `texts.title_transliterated` in page.tsx and
passed through -- now shows the actual open text's name for any text, not just
vādāvalī.

Not yet re-verified live (curator needs to refresh and check): does the footnote list
now render correctly for the specific passages shown in the screenshots (§1, §3's
kāśikā tab, §4)? The whitespace-tolerant regex SHOULD fix extraction, but wasn't
tested against the actual live-failing string, since I have no direct DB read access.

### bhēdōjjīvanam thumbnail
- Not yet uploaded — curator to provide 1280×720px image
- Upload to Supabase Storage → text-thumbnails bucket
- Then: UPDATE texts SET thumbnail_url = '<url>' WHERE id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071';

## Implementation Queue (April 2026)

1. Pramāṇapaddhati replacement — scrape dvaitavedanta.in (4438→4646), replace OCR chunks
2. bhēdōjjīvanam pārāyaṇa (recitation) tool — see below
3. Spaced repetition review mode
4. Personal annotations
5. TWA Android app
6. Sarvam AI TTS (lowest priority)

## bhēdōjjīvanam Pārāyaṇa (Recitation) Tool — Planned

Curator is building a recitation resource for bhēdōjjīvanam (Vyāsarāja Tīrtha), for
YouTube + a tattvasudha.org page. Goal: students listen repeatedly, follow text visually
while listening, and memorize for anuvāda/parīkṣā prep.

Curator's plan:
1. Verify mūla text against a reliable edition; identify units
2. Record recitation at two speeds per unit — fluent and slow/segmented
3. Publish to YouTube (per-unit or per-section videos, text overlay), playlist links back to site
4. Build a tattvasudha.org page: synced text+audio player — highlight + auto-scroll in sync
   with playback, adjustable speed, click-to-jump per unit

Open decisions (not yet finalized):
- Site IA: likely `/texts/[textId]/parayana` (sibling to existing `/texts/[textId]/intro`
  and `/texts/[textId]/map` routes) rather than a new top-level nav item — keeps the
  per-text page pattern consistent for future granthas
- Audio hosting: leaning Supabase Storage (already in use, simplest) or Cloudflare R2
  (cheaper egress at scale) for the self-hosted fluent/slow files that drive the
  interactive player; YouTube is the public-reach/backup channel, not the sync source
- Sync granularity: per-unit (reusing bhēdōjjīvanam's manually-segmented passage/unit
  boundaries) rather than word-level, to avoid a forced-alignment step
- Likely new tables: `parayana_recordings` (passage_id, speed enum, audio_url,
  storage_path, duration_seconds) and `parayana_segments` (passage_id, start_time,
  end_time) for highlight sync — details to be finalized when work starts

Blocked on: bhēdōjjīvanam re-ingestion (§ above) should land first, since unit
boundaries for pārāyaṇa should match the corrected 70+ passage structure, not the
current 36-passage one.

## Design Standards

- Color palette: saffron/stone — saffron-500 primary, stone-* backgrounds
- Sanskrit in Devanāgarī always — never IAST in UI
- All content decisions belong to the curator — Claude Code executes only

## Fixed: RLS silent-write-failure on passages/commentaries (2026-08-07)

After the commentaries-approval code fix above, curator reported BOTH symptoms
persisting: "Approve All" reverted to pending on refresh, AND individual passage
approval still didn't make kāśikā visible to the tutor. Root cause: NOT a code
bug this time -- `passages_curator_write` and `commentaries_curator_write` RLS
policies both had `qual` (USING) = NULL, only `with_check` set. This is the EXACT
failure mode already documented in this file's "RLS Policy Bug Pattern" section
from a past incident ("missing USING causes silent write failures, data: [],
error: null") -- confirmed via `pg_policies` introspection, not guessed. UPDATE
calls were returning success with ZERO rows actually written, for BOTH tables,
the whole time -- meaning individual approve was ALSO silently failing even
before today's bulk-approve button existed. Fixed by DROP + CREATE (never ALTER,
per the documented remedy) with both USING and WITH CHECK set to the same
condition. Given this was a genuine platform-level RLS gap (not bhedojjivanam-
specific), worth double-checking other _curator_write-style policies on other
tables for the same NULL-qual pattern if similar silent-failure symptoms show up
elsewhere.

## Fixed: argument-map generation could leave passages in a broken partial state (2026-08-07)

During the real 176-passage argument-maps run (Opus 4.8, the ~$85-90 step), 2 passages
(sequence_order 115 and 164) failed with `argument_nodes_refutation_type_check`
violations -- Opus produced a `refutation_type` value outside the allowed set
(`lakshanam | pramanam | anumanam | siddhanta`). Worse than just "2 nodes missing":
the old code deleted ALL existing nodes for a passage FIRST, then inserted new ones
one at a time, throwing immediately on any constraint violation -- so these 2
passages were left with ZERO or PARTIAL nodes (old gone, new aborted mid-way), not
a clean, safely-retriable failure.

Fixed in `lib/argument-map-generator.ts`: added upfront validation of the ENTIRE
generated node array BEFORE the delete step. `stream`/`node_type` (NOT NULL, no safe
default) abort the whole passage with nothing touched if invalid. `refutation_type`/
`logical_flaw` (nullable sub-classifications) get sanitized to null + a console
warning showing the actual invalid value if the model produced something outside
the allowed set -- keeps the node's real content (the actual explanation) rather
than losing it over a mis-categorized label. Delete-then-insert now only proceeds
once validation has passed.

174/176 passages succeeded in the original run; the 2 failures need re-running
individually via `--passage-id` (find UUIDs by `sequence_order` 115 and 164) once
this fix is in place -- NOT YET DONE, next action.

**Second bug found on retry (2026-08-07):** `--passage-id <uuid>` alone failed with
"Passage not found" even for a real, correct UUID. Cause: the script filtered by
`.eq('id', passageIdArg).eq('text_id', textId)`, and `textId` silently defaults to
`DEFAULT_TEXT_ID` (vadavali's) when `--text-id` isn't also passed -- so a
bhedojjivanam passage_id combined with vadavali's default text_id matched zero
rows. Since passage_id is already a globally-unique primary key, the text_id filter
was never actually necessary when passage-id is given -- fixed by dropping it, so
`--passage-id` alone now works regardless of which text the passage belongs to.
(The `UV_HANDLE_CLOSING` assertion crash seen alongside this is a known cosmetic
Node-on-Windows artifact from `process.exit()` during async cleanup -- appears
AFTER the real error, safe to ignore.)

## Fixed: generate-section-links.ts truncating mid-JSON for bhedojjivanam (2026-08-07)

Failed with a confusing "Unexpected token '`'" JSON parse error that LOOKED like a
markdown-fence-stripping bug but wasn't. `cleanJson()`'s fallback (`if (first === -1
|| last === -1) return raw`) fires when no closing `]` is found -- meaning the
response never actually finished. Root cause: `MAX_TOKENS = 16000` was sized for
vādāvalī's 40 sections; bhēdōjjīvanam has 125 (~3x the section-link output),
silently exceeding the budget before the JSON array ever closed. Also found: `MODEL`
was hardcoded to the stale `claude-opus-4-6` with no `--model` flag at all (a
separate script from the one already fixed for this).

Fixed: `MAX_TOKENS` raised to 48000, `DEFAULT_MODEL` updated to `claude-opus-4-8`
with a proper `--model` flag added, switched to `.stream()` + `.finalMessage()`
proactively (a 48000-token non-streaming call risks the same 10-minute-guard issue
already hit and fixed elsewhere), Sonnet-5 thinking-disable applied proactively too,
and `cleanJson()` now logs an explicit note pointing at truncation (checking
`stop_reason`) instead of just silently returning unusable raw text.

**Confirmed working (2026-08-07):** re-run succeeded cleanly -- 124 spine + 21
cross-links, 142 upserted, `claude-opus-4-8`, 20719 output tokens (well within the
new 48000 budget, confirming the token-budget diagnosis was correct).

## New feature: dedicated source_excerpt field on argument nodes (2026-08-07)

Curator feedback on the Argument Map view: the existing **bold** verbatim-quote
convention inside content_sanskrit was "almost not noticeable" mixed into the
interpretive prose. Built a genuinely separate field rather than just restyling
the existing bold spans:

- **Migration**: `20260807000000_argument_nodes_source_excerpt.sql` adds
  `source_excerpt TEXT` (nullable) to `argument_nodes`.
- **Free backfill for EXISTING nodes** (vādāvalī + bhēdōjjīvanam, both already
  generated): `scripts/backfill-source-excerpts.ts` extracts the existing **bold**
  spans out of `content_sanskrit` into the new field -- NO API calls, no cost.
  Multiple bold spans in one node join with " ... ". Nodes with no bold spans get
  left null, not an error.
- **Prompt updated for FUTURE generations**: `lib/argument-map-generator.ts`'s
  `buildUserPrompt` now asks for `source_excerpt` as an explicit, separate field --
  ONE clean verbatim quote, distinct from the informal bold-in-prose convention
  (which still exists in content_sanskrit for inline flow). This means newly-
  generated or regenerated nodes get a deliberately-chosen excerpt, not just
  whatever happened to get bolded.
- **UI**: distinct amber/gold quote block (bordered, labeled "Source quote"),
  separate from the interpretive Sanskrit/English text, in BOTH the public
  Argument Map (`components/map/PassageChain.tsx`) and the curator generation-
  review admin (`components/curator/ArgumentMapAdmin.tsx`) -- inline click-to-edit
  in both, plus the full edit modal in the admin panel.

**NOT YET RUN**: migration + backfill script -- next action, see below.

**Bug found+fixed (2026-08-07):** first attempt to add the `SourceExcerpt` component
to `components/map/PassageChain.tsx` failed silently (an ambiguous-match error on
the edit tool that should have been caught immediately) -- the retry only re-added
the component's USAGE (`<SourceExcerpt text={...} />`) in both NodeCard variants,
never the actual function DEFINITION. Result: `ReferenceError: SourceExcerpt is not
defined`, crashing the Argument Map tab entirely (curator saw a brief flash of the
passage page, then the error). Confirmed via the actual file content (definition
truly absent, not a caching issue) before fixing -- added the missing component
right after `parseBold`. This was scoped to ONLY this one file --
`ArgumentMapAdmin.tsx`'s source_excerpt UI was written as inline JSX, not a
separate component reference, so it was never at risk of the same failure mode.

**Serious accuracy bug found+fixed (2026-08-07):** curator caught a mūla-stream node
showing a source_excerpt that was actually kāśikā text (विश्वोत्कर्षेण अविज्ञातः
वर्तताम्, confirmed present in the kāśikā text, absent from the (short) mūla text).
Root cause: the **bold** convention was NEVER stream-restricted (a mūla node's
explanation can legitimately bold-quote a kāśikā phrase when discussing it) -- but
the v1 backfill script treated ANY bold span as a valid excerpt for whatever node
it appeared in, with zero cross-stream verification. This is a real, accuracy-
critical bug given the whole point of this feature is trustworthy source
verification.

Fixed at three layers:
1. **Prompt** (`buildUserPrompt` in `lib/argument-map-generator.ts`): explicit
   "STREAM DISCIPLINE IS MANDATORY" instruction -- a node's source_excerpt must
   come ONLY from that node's own stream's source text, never the other stream,
   even though the bold-in-prose convention still permits cross-stream references.
2. **Generator validation** (data-layer safety net, doesn't trust the prompt alone):
   before insert, source_excerpt is checked (whitespace-normalized) against the
   node's OWN stream's actual source text; if it doesn't match, it's dropped to
   null with a warning identifying whether it matched a DIFFERENT stream (the
   exact bug pattern) or matched nothing at all.
3. **Backfill script rewritten** (`scripts/backfill-source-excerpts.ts`): now
   REPROCESSES every node with bold spans (not just null ones -- needed to correct
   already-wrong values the v1 script wrote), fetches each passage's mūla text AND
   all its commentaries, and applies the same own-stream-only validation before
   keeping an excerpt. Reports exactly how many were dropped for cross-stream
   mixup vs. no match at all, so the scale of the original bug is visible.

**NOT YET RE-RUN**: corrected backfill needs to run again to fix the currently-live
wrong data -- next action.

**Second, deeper bug found (2026-08-07):** curator ran the v2 backfill (674 updated,
0 errors) and STILL saw the exact same wrong excerpt on the same node. Executed the
validation logic directly against the real stored strings (not just code review) --
confirmed both bold spans genuinely FAIL the own-stream check (False, False), so the
validation logic itself is correct. This means the affected node was likely never
processed at all. Root cause: the script's `allNodes` fetch (`argument_nodes` across
BOTH texts, no pagination) almost certainly exceeded Supabase/PostgREST's silent
1000-row default cap -- vādāvalī + bhēdōjjīvanam combined easily exceed that. Rows
beyond the cap are silently dropped, no error, no warning -- some unknown number of
nodes (apparently including this one) were never even looked at, so their OLD wrong
values from the v1 script were untouched. Fixed: added explicit `.range()`-based
pagination (`fetchAllRows` helper) to ALL THREE unbounded queries in the script
(argument_nodes, passages, commentaries) rather than trusting any single query to
return everything, regardless of current row counts.

**NOT YET RE-RUN with the pagination fix** -- next action. Curator should first run
the diagnostic COUNT query (see chat) to confirm the >1000-row theory before/after
re-running.

**RESOLVED and verified (2026-08-07):** count query confirmed 3179 total nodes
(3.2x the silent cap -- both prior backfill runs had only ever touched roughly the
first third). Paginated re-run: 3070 nodes with bold spans processed, 2130 kept,
199 dropped for genuine cross-stream mixup (the exact bug pattern), 741 dropped for
no match at all, 1605 total writes, 0 errors. Curator verified the specific
previously-broken node directly via SQL (`source_excerpt` -> null, not through the
UI/cache) -- confirmed correct this time. Closing this out on direct database
evidence, not UI appearance, after two earlier attempts that looked fixed but weren't.

## New, stricter rule found needed: stream purity in EXPLANATIONS, not just quotes (2026-08-07)

After the source_excerpt fix, curator found a DEEPER issue on the same node: the
UPASAṂHĀRA node's own `content_sanskrit`/`content_english` explanation (not just its
quote) explained "jayatāt is a prayer for recognition, per the commentary's specific
reading" -- genuine kāśikā-derived interpretation, blended into a node labeled mūla.
Unlike source_excerpt (a verbatim quote, mechanically checkable), content_sanskrit/
content_english are paraphrased explanations -- there's no reliable way to detect
"this paraphrase secretly relies on commentary insight" after generation. This has
to be fixed at the prompt level, not backfilled.

Added a new "STREAM PURITY" section to `buildUserPrompt` in
`lib/argument-map-generator.ts`: a mula-stream node's ENTIRE explanation (not just
its quote) must be derivable from the mūla text alone -- explicitly forbidding the
most common violation pattern (explaining WHY a mūla assertion holds by quietly
reaching for commentary-specific justification). Symmetric rule for commentary
nodes (center on THAT commentary, don't pull in a different one). Also walked back
the earlier "bold spans may reference the other stream" exception, since that's
exactly the loophole that let this happen.

**IMPORTANT COST IMPLICATION, NOT YET DECIDED:** fixing this for the 176 ALREADY-
GENERATED passages requires a full argument-maps REGENERATION (~$85-90 again, same
as the original run) -- no cheap backfill is possible here, unlike source_excerpt.
Curator has NOT yet decided whether/when to re-run this. New prompt is only live
for any FUTURE generation (a new text, or an individual --passage-id regeneration)
until that decision is made.

**Scope decision (2026-08-07):** curator confirmed the stream-purity issue is only
confirmed present in the भेदोज्जीवनमङ्गलपद्यव्याख्यानम् section (unit 1) so far. Decision:
targeted single-passage regeneration now, defer the full 176-passage regeneration
unless/until more instances are found during ongoing review. Cheap, reasonable
de-risking of the cost decision -- not yet run, see resume pointer.

**UI change (2026-08-07): removed the dedicated "Source quote" block entirely.**
Curator feedback: felt redundant since the same text is already bolded within
content_sanskrit, and the REAL problem was that bold font-weight alone (vs the
already-fairly-bold surrounding reading text) wasn't visually distinct enough to
notice. Reverted to a single bold treatment, now colored (saffron-700) as well as
bold, in `components/map/PassageChain.tsx`'s `parseBold` -- no separate block.
Also removed the prominent amber block from `components/curator/ArgumentMapAdmin.tsx`'s
card view (that panel doesn't render bold at all -- it's raw click-to-edit text, not
a reading view -- so the color fix doesn't apply there); kept source_excerpt
EDITABLE via a small unobtrusive text link, since the underlying data + validation
work is still useful for data management even though it's not displayed prominently.
The `source_excerpt` column, data, and generation-time validation are all UNTOUCHED --
only the dedicated display block is gone.

## Adding bhēdōjjīvanam as a home-page course (2026-08-08)

Examined every discovery surface for hardcoded vādāvalī references, per curator request
to check "any other links... just like we have for vādāvalī."

**Already dynamic, no code change needed:** home page course list, navbar Courses
dropdown (desktop + mobile), `/api/search` backend (no text_id scoping) -- all driven
by `texts WHERE is_published = true`.

**Fixed:**
- Ordering was `ORDER BY created_at` everywhere (home page, navbar, dashboard) --
  would put vādāvalī first regardless of intent, since it's older. Added
  `display_order` column via migration `20260808000000_texts_display_order.sql`
  (same pattern as `notebooks.display_order`, already used on this page), set
  bhēdōjjīvanam=1, vādāvalī=2. Updated all three ordering queries.
- `Navbar.tsx` search placeholder hardcoded "Search vādāvalī, reference texts..." --
  changed to generic "Search texts, reference works, and nyāya concepts" so it
  doesn't need updating for every future text either.

**Found but NOT fixed -- curator-owned, flagged clearly to curator:**
- `app/(app)/texts/[textId]/intro/page.tsx` has a literal EMPTY placeholder for
  bhēdōjjīvanam's intro page (`BHEDOJJIVANAM_INTRO_CONTENT`): `sections: []`,
  subtitle "Introduction coming soon". Pre-existing explicit comment: "Curator to
  provide accurate intro text... Do NOT populate with AI-generated content." Did
  NOT touch this -- the "Overview" button will lead to a near-empty page until
  curator provides real content (matches vādāvalī's INTRO_CONTENT structure/shape).
- No `thumbnail_url` set for bhēdōjjīvanam (Curator Portal showed "Add thumbnail",
  not "Edit") -- `TextCard` gracefully falls back to a gradient+title placeholder,
  not broken, just less polished than vādāvalī's card.
- `description`/`author` fields on the `texts` row not verified -- worth a check,
  shown on TextCard if present.

**Publish decision:** curator's request ("add to home page") functionally means
setting `is_published = true`, which the project has consistently treated as a
deliberate final step ("only when curator confirms"). NOT YET DONE -- flagged the
intro-page gap clearly before proceeding, since publishing now means the Overview
button leads to a near-empty page. Awaiting curator confirmation on whether to
proceed anyway (intro content can be added later) or wait.

**Scope agreed (2026-08-08): phased intro content.** Curator confirmed: proceed with
Tier 1 (home page card: description, author, optional thumbnail) + Tier 2 (core
intro page sections: Why Study / What Is / Commentary bio / How to Use, EN+SA each)
now. Tier 3 (125-section-by-section overview, matching vādāvalī's 40-section one)
EXPLICITLY DEFERRED to next phase of the bhēdōjjīvanam project -- the intro page
handles an empty `sectionOverview` gracefully (that block just doesn't render), so
this is a clean, non-blocking deferral. Curator does NOT need to provide this before
publishing.

Within Tier 2, curator agreed to two sub-recommendations: (1) reuse/adapt vādāvalī's
"What is Madhva Tattvavāda Siddhānta?" section largely as-is (general school
background, not vādāvalī-specific) rather than curator rewriting it fresh; (2) Claude
drafts "How to Use This Platform" by adapting vādāvalī's version (platform-generic
instructional text, not text-specific content, so doesn't fall under the "curator-
only, no AI content" rule the same way). Curator still writes the genuinely
text-specific sections: description, Why Study, What Is Bhēdōjjīvanam, Kaishikatirumalācārya
bio -- these require real scholarly knowledge Claude does not have and should not
fabricate.

**NOT YET PROVIDED by curator** -- waiting on: description, author confirmation
(guessed Vyāsarāja Tīrtha, unconfirmed), Why Study section (EN+SA), What Is section
(EN+SA), Kāśikā commentary/commentator bio (EN+SA), optional thumbnail decision.

**Tier 1+2 completed (2026-08-08).** Curator confirmed: description as previously
discussed is fine, author = Vyāsarāja Tīrtha confirmed, no thumbnail (gradient card
with title is fine). For Tier 2, curator explicitly authorized web-researched
AI-drafted content for the 3 text-specific sections (overriding the earlier
"do NOT populate with AI-generated content" note for THIS specific case, curator's
call to make) -- "do a good research on the web... keep it scholarly for the
audience is nyaya-shastra and Madhva Tattvavada Siddhanta pundits and students."

Researched via multiple web searches (New World Encyclopedia, Wikipedia/Dharmapedia
on Vyāsatīrtha, Vyasaraja Matha's own parampara page -- which directly describes
Bhēdōjjīvanam's place in his corpus and its accessible/elementary character --
IEP on Madhva's pañcabheda). Kāśītirumalācārya: no independent biographical
documentation found beyond his authorship of this commentary -- the drafted text
says so honestly ("independent biographical documentation... is scarce") rather
than inventing dates or lineage, and instead describes his commentary's actual
nature/method, verifiable through direct engagement with the ingested text itself.

Implemented directly in `app/(app)/texts/[textId]/intro/page.tsx`, replacing the
empty `BHEDOJJIVANAM_INTRO_CONTENT` placeholder: 5 sections (Why Study / What is
Madhva Tattvavāda Siddhānta [reused from vādāvalī's, last sentence adapted to
reference bhēdōjjīvanam] / What is Bhēdōjjīvanam / The Kāśikā Commentary / How to
Use This Platform [adapted from vādāvalī's, one commentary instead of two]),
EN+SA each. `sectionOverview: []` (Tier 3 deferred, block doesn't render).

**Bug caught+fixed in the same pass:** while typing Unicode escape sequences for
Sanskrit numerals (dates, section counts) by hand, mixed up the Bengali digit
range (U+09E6-09EF) with the Devanagari range (U+0966-096F) in several places --
produced garbled mixed-script numerals (e.g. "১२৫०" instead of १४६० for 1460).
Caught by inspecting the actual diff output after the edit, not assumed correct --
fixed all 4 occurrences plus one unrelated typo (श्र→श्च) found in the same pass.
Worth remembering for any future hand-typed Devanagari numeral escapes.

**Curator has NOT yet reviewed the actual rendered page or the Sanskrit prose
line-by-line** -- this is AI-drafted content, researched but not native-scholar-
reviewed; recommend an actual read-through, especially of the Sanskrit, before
considering this final. Still pending: verify/confirm `texts.description` and
`texts.author` fields in the DB match what was discussed (not verified by Claude,
no direct DB read access), and the actual publish step (`is_published = true`).

**Curator review caught real errors (2026-08-08):** flagged "सुमारु" (used before
date ranges, meaning "approximately") as Kannada, not Sanskrit. Did a full line-by-
line re-review of all drafted Sanskrit as requested, not just the one flagged word
-- found 4 total issues:
1. "सुमारु" (Kannada) -- appeared twice. Fixed by DROPPING the "approximately"
   qualifier entirely, matching vādāvalī's own existing Sanskrit intro convention
   (states date ranges directly, no qualifier) -- safer than guessing at the
   "correct" Sanskrit word, since precedent already exists in this exact project.
2. "पीढीद्वयेन" ("by two generations") -- "पीढी" is Hindi/Marathi, not Sanskrit.
   Fixed to "आचार्यद्वयेन" (by two ācāryas) -- more precise anyway, since the
   comparison is specifically Jayatīrtha vs Vyāsatīrtha by name.
3. Genuine grammatical inversion: "यत् महाग्रन्थानधीत्य पूर्वमेव अध्येतव्यम्" used the
   gerund अधीत्य ("having studied") in a way that literally said the OPPOSITE of
   the intended meaning (studying the great texts BEFORE this one, not after).
   Fixed to the correct ablative+पूर्वम् construction: "महाग्रन्थेभ्यः पूर्वमेव".
4. "मंचे" vs the correct "मञ्चे" (anusvāra before च should be the class nasal ञ्)
   -- inconsistent with correct usage elsewhere in the SAME document. Fixed for
   consistency.

Worth remembering: composing fresh Sanskrit prose (as opposed to reusing/adapting
vādāvalī's already-approved text) carries real risk of exactly this kind of
contamination/error, given Claude is not a native Sanskrit speaker -- a careful,
full re-read (not just fixing the one reported instance) was the right response
when asked, and surfaced 3 additional real issues beyond the one flagged.
**Still recommend curator read through the remaining sections once more** --
this was one careful pass, not a guarantee of zero remaining issues.

**"ख्रीष्टाब्दे" → "CE" (2026-08-08):** curator questioned whether ख्रीष्टाब्दे is genuine
Sanskrit -- it's a real modern-Sanskrit coinage (ख्रीष्ट + अब्द, used in contemporary
Sanskrit journalism/scholarship for CE dates) but not classical, and curator
preferred the plain English abbreviation instead, no Sanskritization. Fixed ALL 5
instances across BOTH texts' Sanskrit content for consistency (not just
bhēdōjjīvanam's new content) -- 2 in vādāvalī's own existing Sanskrit intro
(Madhva's dates, Rāghavendra Tīrtha's dates), 1 in the reused Madhva paragraph
copy inside bhēdōjjīvanam's section, 2 in bhēdōjjīvanam's own Vyāsatīrtha dates.
Note: the reused Madhva paragraph is byte-identical in both texts' files, which
required disambiguating each edit by including trailing context reaching into the
following (genuinely different) section heading, since the edit tool requires
unique matches.

**Second hand-typing digit error caught (2026-08-08):** while fixing Rāghavendra
Tīrtha's dates, mistyped the escape for ० (zero) instead of ६ (six) in "१६७१"
(1671) -- caught immediately via the tool's "no exact match" error (which echoed
back the wrong digits), not by a later curator catch. Same class of error as the
earlier Bengali/Devanagari mixup -- hand-typing Devanagari numeral escapes
remains a real, recurring risk worth double-checking each time.

**Description shortened (2026-08-08):** curator provided a draft closer to
vādāvalī's card length; fixed a grammatical fragment (no clear subject for
"re-establish") while keeping all their content. Final text given to curator as a
SQL UPDATE to run (Claude has no direct DB write access) -- NOT YET CONFIRMED RUN.

## Fixed: mobile home page clipping course card buttons (2026-08-08)

Curator screenshot (mobile/narrow viewport) showed both course cards' "Overview"/
"Begin studying" buttons missing and description text cut off. Confirmed via code
that `TextCard.tsx`'s buttons are unconditionally rendered (not a removed-code bug).
Root cause: `app/(app)/page.tsx`'s 4-column layout had `overflow-hidden` applied
UNCONDITIONALLY on the row and on column 1, but the row only switches to side-by-
side (`lg:flex-row`) on desktop -- below that breakpoint the 4 sections STACK
(`flex-col` default), yet were still squeezed into one bounded, clipped box sized
to a single viewport height. This is a pre-existing bug that had no chance to
surface with only 1 course card (barely fit); a 2nd card pushed it past the edge.

Fixed: scoped `overflow-hidden` (row + column 1) and column 1's inner
`flex-1 overflow-y-auto` (the independent-scroll mechanism) to `lg:` only. Mobile
now stacks naturally with no artificial height bound, relying on the page's own
scroll (`<main className="overflow-auto">` in the root layout) -- the correct
responsive pattern. Desktop behavior (bounded height, independent per-column
scroll) is unchanged -- only the `lg:` prefix was added, nothing removed.
Columns 2-4 (NotebookLMs, Vēda & Stotra, Dāsa Sāhitya) use a different
`max-h-[700px]` mechanism on their own inner lists, not the same flex-1 pattern,
and were not affected by this bug.

**NOT YET VERIFIED live** -- Claude cannot render/test this visually; curator to
confirm on their actual device before considering this closed.

**First fix insufficient (2026-08-08):** curator tested precisely -- page didn't
scroll AT ALL near the course cards, while notebooks/videos (their OWN separate
`max-h-[700px] overflow-y-auto` self-contained boxes) worked fine. This revealed
the first fix's actual assumption was wrong: removing `overflow-hidden` doesn't
automatically mean an ancestor's `overflow-auto` (root layout's `<main>`) has
something TO scroll -- in this nested `h-full`/`flex-1` chain, content wasn't
actually able to grow taller than the viewport to trigger page-level scroll in
the first place. Rather than keep reasoning through that fragile chain, switched
column 1 to the EXACT SAME self-contained `max-h-[700px] overflow-y-auto` pattern
already proven working in columns 2-4 (NotebookLMs uses this identical pattern) --
doesn't depend on any ancestor height computation at all, sidesteps the whole
problem class rather than trying to fix the flex-height chain precisely.

**NOT YET VERIFIED live (2nd attempt)** -- same caveat, needs curator confirmation
on actual device.

**Confirmed working (2026-08-08):** curator verified scrolling + buttons fixed with
the max-h approach. Follow-up: description text was truncated via `line-clamp-4`
in `TextCard.tsx` (applies to every course card equally, so vādāvalī's was also
truncated, just less noticeably before). Removed the clamp -- full description now
shows on both cards; cards grow taller to fit, acceptable tradeoff for completeness.

## Section colors: bug fix + new suggestion script (2026-08-07)

While prepping the "section colors" step (fixes the earlier Argument Flow DAG bug
where it started at §9 instead of §1), found `ArgumentMapAdmin.tsx`'s
`handleSectionColorChange` used `.update()`, not `.upsert()`. Harmless for vādāvalī
(its 40 rows already exist via a seed migration) but SILENTLY DESTRUCTIVE for any
newly-onboarded text like bhēdōjjīvanam (zero existing rows): an update against a
non-existent row succeeds with 0 rows changed and no error, so the UI would show
"✓ Saved" while nothing actually persisted. Fixed to upsert with
`onConflict: 'text_id,section_number'`, matching the migration's unique constraint.

Also built `scripts/suggest-section-colors.ts` -- derives a SUGGESTED
`argument_type` per section from the argument_nodes already generated (no new API
calls, no cost): opening/closing name-marker match -> `opening_closing`; most
common `refutation_type` among a section's khandana nodes -> that type; siddhanta
nodes with no khandana -> `siddhanta`; otherwise -> `anumanam` (matches the UI's
own default). This is a starting point for the 125 sections, not a final answer --
curator reviews/adjusts via Curator Portal → Argument Maps → Section Colors
afterward, same spirit as reviewing AI-generated nyaya concepts/argument nodes
rather than trusting them blindly.

## Fixed: passage approval didn't approve commentaries (2026-08-07)

After approving all 176 bhēdōjjīvanam passages, the AI Tutor STILL couldn't see
kāśikā -- traced to `commentaries` having its OWN separate `is_approved` flag,
completely independent of `passages.is_approved`. The Curator Portal's approve
buttons (individual + the bulk one added earlier this session) only ever touched
`passages`, never `commentaries`. Confirmed this isn't bhēdōjjīvanam-specific --
`ingest-text.ts` (vādāvalī's OWN script) has the identical `is_approved: false`
default for commentaries, so vādāvalī's tutor may have this same latent issue
unless someone fixed it manually via SQL in the past -- NOT YET VERIFIED, worth
checking.

Fixed in `components/curator/PassageList.tsx`: both `toggleApproval` (individual)
and `approveAllPending` (bulk) now update `commentaries.is_approved` alongside
`passages.is_approved` in the same action, going forward.

**One-time SQL run for bhēdōjjīvanam's already-approved-but-orphaned 173
commentaries** (the code fix doesn't retroactively fix already-approved passages):
```sql
UPDATE commentaries SET is_approved = true
WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071');
```

## Curator Portal UX improvements (2026-08-07)

Two curator-requested improvements to the Passages tab, since bhēdōjjīvanam's 176
passages made the existing single-long-scroll page impractical:

1. **Sticky "Jump to" nav** -- `app/(app)/curator/page.tsx`. A sticky bar at the top
   of the Passages tab with one pill per text (name, count, pending-count badge),
   anchor-linking to `#text-{id}` on each section. Pure HTML anchors, no client JS
   needed for the jump itself.
2. **"Approve All Pending" bulk button** -- `components/curator/PassageList.tsx`.
   Appears next to the filter tabs only when pending > 0, confirms via `window.confirm`
   before running (176 individual clicks was the actual complaint), single bulk
   Supabase UPDATE (`WHERE text_id = ? AND is_approved = false`), same RLS policy
   as the existing per-row approve (no new RLS concern -- policies apply per-row
   regardless of how many rows one UPDATE matches).

## Fixed: AI Tutor chat crash (2026-08-07)

`components/tutor/ChatMessage.tsx` passed `className` directly to `<ReactMarkdown>`,
which newer react-markdown versions (v9+) reject outright ("Unexpected `className`
prop, remove it" -- an intentional breaking change on their end, not something we
did; likely surfaced by a routine `npm install` picking up a newer compatible
version). Unrelated to bhedojjivanam work -- affects the AI Tutor chat platform-wide,
for any text. Fixed: moved the `className`/prose styling onto a wrapping `<div>`,
removed it from `<ReactMarkdown>` itself, kept `remarkGfm` + the custom
table/th/td components unchanged. Worth testing the AI Tutor again after this to
confirm the chat actually responds now, not just that the crash is gone.

**Confirmed working (2026-08-08):** curator ran the real (non-dry-run) command --
125 sections upserted successfully, 0 errors. Breakdown: opening_closing: 2,
anumanam: 71, siddhanta: 46, pramanam: 6. Curator reviewed and accepted as-is
("looks all good for now") -- no adjustments made in Curator Portal.

**This completes the full re-ingestion pipeline for bhēdōjjīvanam:** re-ingestion →
embeddings → curator approval → nyāya concepts → argument maps (Opus 4.8,
including 2 individually-regenerated passages for the stream-purity fix) → section
links → section colors. All done and verified. **Only remaining step is the
publish decision itself** (`is_published = true`) -- entirely curator's call, not
something to assume or rush, per this project's own consistent convention
throughout.

## Fixed: line breaks lost on display after editing (2026-08-08)

**This was a DIFFERENT bug than what I initially chased.** Curator's first report
("formatting lost, shows as running text") led me down a wrong path investigating
**bold** markdown rendering -- read through InlineEditor/CommentaryTabs/
render-passage-text.tsx carefully and found nothing wrong there, because there
WASN'T anything wrong there. Curator then clarified precisely: they were adding
BLANK LINES between paragraphs while editing Kāśikā text, and THOSE line breaks
disappeared on save -- not a bold-formatting issue at all.

Root cause, once correctly identified: plain HTML collapses newline characters by
default (`white-space: normal`) -- the line breaks WERE being saved correctly to
the database (proven by the curator reopening the edit textarea and seeing them
still there), but no display view was telling the browser to respect them.

Fixed by adding `whitespace-pre-line` to every place mula_text/commentary_text is
displayed (not just where it's edited) -- both curator AND learner-facing views,
for consistency:
- `MulaPanel.tsx` -- curator `displayClassName` AND the learner-facing `<div>`
- `CommentaryTabs.tsx` -- curator `displayClassName` AND the learner-facing `<div>`
- `ArgumentMapAdmin.tsx` -- the read-only mula/commentary reference panel (a third,
  separate display location that would have had the same latent bug)

**NOT YET VERIFIED live** -- curator to confirm after refresh.

## Fixed: metadataBase warning (2026-08-08)

`npm run build` showed repeated "metadataBase property in metadata export is not
set" warnings (falls back to `http://localhost:3000` for resolving relative
OG-image/social-preview URLs like `/og-image.png`) -- pre-existing, not from this
session's work, but curator wanted it fixed before going live. Added
`metadataBase: new URL('https://tattvasudha.org')` to the root `metadata` export
in `app/layout.tsx` -- inherited by every page's own metadata (including the
per-passage `generateMetadata` in the study page), so this one line fixes all
instances of the warning. NOT YET RE-VERIFIED via a fresh build.

## 🚀 DEPLOYED TO PRODUCTION (2026-08-08)

Clean `npm run build` (0 errors, metadataBase warnings resolved) →
`git push` (master @ 0b8f870) → `vercel --prod` → aliased to
**https://www.tattvasudha.org**. bhēdōjjīvanam is now publicly live, alongside
vādāvalī, as the platform's second full course.

**NOT YET VERIFIED against the actual production URL** -- everything up to this
point was tested against localhost only. Curator should do one pass on
www.tattvasudha.org itself before considering this fully closed: home page shows
both courses correctly ordered, a bhēdōjjīvanam passage loads with working
argument map + source-quote coloring + line breaks, the AI tutor responds, and
the intro page renders (EN + SA) with the corrected Sanskrit and CE dates.

**Production verified (2026-08-08):** curator confirmed everything looks good on
www.tattvasudha.org itself, not just localhost.

**WhatsApp link preview -- resolved:** curator initially saw no thumbnail/image
when pasting the bare domain into WhatsApp. Checked the live site's actual served
`<head>` directly (via fetch, not assumption) -- confirmed og:image, dimensions,
and twitter:card were all correctly present and absolute
(`https://tattvasudha.org/og-image.png`, 1200x630) -- the metadataBase fix had
worked correctly. Root cause was WhatsApp/Meta's own aggressive link-preview
caching (shared with Facebook's crawler), almost certainly from an earlier
test/share before the metadataBase fix went live. Curator resolved it simply by
using the full `https://tattvasudha.org` URL instead of the bare domain --
likely gave the crawler a fresh, uncached target. (Facebook Sharing Debugger --
developers.facebook.com/tools/debug/sharing/ -- "Scrape Again" is the fallback
if this resurfaces, since it forces a cache refresh WhatsApp also draws from.)

---

## ✅ PHASE 1 COMPLETE -- bhēdōjjīvanam Live on tattvasudha.org (2026-08-08)

This closes out the full bhēdōjjīvanam onboarding project. Consolidated summary for
whoever/whenever this resumes:

**What shipped:**
- Full re-ingestion (176 passages, 125 sections) with corrected passage boundaries
- Passage + nyāya-concept embeddings (Gemini Embedding 2, 3072-dim)
- Curator approval workflow for all passages + commentaries (RLS bug fixed along
  the way -- see "Fixed: passage approval didn't approve commentaries" above)
- 697 nyāya concepts generated + embedded
- Full argument maps for all 176 passages (Opus 4.8) -- mūla + kāśikā streams,
  with 2 passages individually regenerated after the stream-purity prompt fix
- 142 section links (124 spine + 21 cross-links)
- Section colors for all 125 sections (heuristic-derived, curator-reviewed)
- NEW platform feature: `source_excerpt` field on argument nodes, with real
  cross-stream validation (a genuine accuracy bug was found + fixed here --
  see the multi-round "source_excerpt" saga above, resolved via direct SQL
  verification after two insufficient fixes)
- NEW platform feature: stream-purity enforcement in argument-node generation
  prompts (a mūla node's explanation can no longer lean on commentary-only
  interpretation -- data-layer validated, not just prompt-requested)
- bhēdōjjīvanam added to the home page, navbar Courses dropdown, and search --
  found these were already dynamic, only ordering (`display_order` column,
  new migration) and a hardcoded search placeholder needed fixing
- Bilingual (EN+SA) intro page content for bhēdōjjīvanam -- curator-authorized,
  web-researched, with real errors caught on review (2 non-Sanskrit words, 1
  grammatical inversion, 1 spelling inconsistency, then a further "ख्रीष्टाब्दे
  → CE" style change applied consistently across BOTH texts)
- Platform-wide bug fixes surfaced during this work: AI Tutor chat crash
  (react-markdown className), mobile home-page layout clipping course cards,
  line-breaks not rendering in passage/commentary display text, metadataBase
  warning

**Explicitly deferred to the next phase:**
- Tier 3 intro content: full 125-section-by-section overview (matching
  vādāvalī's existing 40-section one) -- `sectionOverview: []` currently, the
  page handles this gracefully (that block just doesn't render)
- `texts.thumbnail_url` for bhēdōjjīvanam -- curator chose to skip for now,
  gradient+title card is fine
- General: keep an eye out for whether the stream-purity fix needs to be
  applied more broadly via full regeneration, or whether the single-passage
  fix + prompt-only-for-future approach (curator's chosen scope) proves
  sufficient as more of the text gets studied/reviewed in practice

**Deployment record:** `npm run build` clean → `git push` (master @ 0b8f870) →
`vercel --prod` → aliased to www.tattvasudha.org. Verified against production,
not just localhost.

Curator is moving to a different project for now and will return to this later --
this file should be a sufficient resume point. Nothing is in a half-finished
state; everything above is either shipped-and-verified or explicitly deferred.

---

## New feature: Argument Map Flags tab + curator-to-user response system (2026-08-08)

Curator found two real gaps while testing as a non-curator user:
1. Non-curator users saw NO argument maps at all for bhēdōjjīvanam. Root cause:
   RLS on `argument_nodes` requires `is_approved = true` for non-curator roles
   (confirmed via `pg_policies` -- `arg_nodes_auth_read`:
   `is_approved = true OR role IN (curator, admin)`), and all 1,055 bhēdōjjīvanam
   argument nodes were sitting at `is_approved = false` -- generated but never
   formally approved, a step I never called out explicitly in earlier guidance.
   Fixed via a bulk `UPDATE argument_nodes SET is_approved = true WHERE ...` --
   curator's informed choice, not a per-node review, given the site was already
   live and framed as "Phase 1, ongoing refinement." Curator verified with an
   actual non-curator login afterward, not just the row count changing.
2. `argument_map_flags` (submitted via the flag icon on the Argument Map view)
   had NO curator-facing display anywhere -- unlike `flagged_errors`, which has
   its own Curator Portal tab. Users could submit reports that just sat
   invisible in the database.

Built a full fix, all shipped:

**New tab:** Curator Portal → "Argument Map Flags", mirroring the existing
Flagged Errors tab -- `components/curator/ArgumentMapFlagsList.tsx` (new),
wired into `app/(app)/curator/page.tsx` (new tab entry, data fetch, open-count
badge). New route `app/api/argument-map-flags/route.ts` (PATCH-only, curator/
admin role-checked, matching `/api/flags`'s pattern).

**Curator → user communication (the deeper gap):** neither flags table had ANY
response field, and neither table was even readable by the submitting user --
marking something "Resolved" was purely internal, the reporter never found out.
Fixed with:
- Migration `20260808010000_flags_curator_response.sql`: `curator_response`
  TEXT column on both `flagged_errors` and `argument_map_flags`, plus new RLS
  SELECT policies letting a user read (only) their own submitted flags
  (`flagged_by = auth.uid()` / `user_id = auth.uid()` respectively -- note the
  two tables use different column names for the submitter).
- Both `/api/flags` and `/api/argument-map-flags` PATCH handlers now accept an
  optional `curator_response` independently of `status` -- a curator can save a
  clarifying question without closing the flag, not just a final resolution note.
- Both curator list components (`FlaggedErrorsList.tsx`, `ArgumentMapFlagsList.tsx`)
  got a small per-flag textarea + "Save response" button, decoupled from the
  Resolve/Dismiss actions.
- New page `app/(app)/my-reports/page.tsx` -- a logged-in user's own submitted
  flags (both types), status, and any curator response. Read-only, server
  component, relies on the new RLS policies rather than re-filtering defensively
  (though it does filter explicitly too, for clarity).
- New "My Reports" navbar link (desktop + mobile), shown whenever logged in.

**Type definitions updated** in `types/database.ts`: added `curator_response`
to `FlaggedError`, added a new `ArgumentMapFlag` interface (didn't exist before),
and fixed an unrelated pre-existing gap noticed along the way -- `ArgumentNode`
was missing `source_excerpt` (added earlier this session to the actual table,
never added to the TS type).

**Tooling note worth remembering:** `create_file` exhibited a real, reproducible
stale-cache bug this session -- twice, for brand-new paths
(`app/api/argument-map-flags/`, `app/(app)/my-reports/`), it reported "File
created successfully" while `read_text_file`/`edit_file` immediately
disagreed (ENOENT / "parent directory does not exist"). `filesystem:write_file`
(create-or-overwrite, no existence-check) worked reliably every time as a
workaround. If this recurs, try `write_file` before assuming the target code is
wrong.

**NOT YET DEPLOYED** -- this is all new code + a new migration, only tested
against localhost so far (implicitly, via the earlier RLS/is_approved diagnosis --
the NEW flag-response feature itself has not been exercised at all yet). Needs,
in order: run the migration → `npm run build` → verify locally (submit a test
flag, respond as curator, check it shows on `/my-reports`) → `git push` →
`vercel --prod` → verify on production. Curator was about to step away to
another project when this was built -- this is the next concrete action when
resuming.

## Fixed: navbar layout + reorganization (2026-08-08)

Curator found `॥ श्रीः ॥` (centered via `left-1/2 -translate-x-1/2`, absolute positioning on the
full navbar width) getting visually overwritten by "About" once inside a course,
because "Parīkṣā" adds to the left-side nav group, making it wider -- but the
centering had no awareness of that, since absolute-centering-on-full-width and
variable-width sibling content are fundamentally incompatible.

Root fix: restructured `Navbar.tsx` from `flex` + absolute positioning to a
proper 3-column CSS grid (`grid-cols-[1fr_auto_1fr]`). Left and right regions
get equal, symmetric `1fr` shares; the center region is `auto`-sized to exactly
fit `॥ श्रीः ॥` and can never be reached by either side's content, regardless of
how many items exist on either side -- structurally guaranteed, not just
patched for the current item count. Future-proof against more courses/links
being added later.

Alongside that, reorganized nav items per curator's request to simplify:
**stays directly visible** (left) -- Courses ▾, Dashboard, Curator (role-
conditional). **Moved into a new "More ▾" dropdown** (right, same pattern as
Courses) -- Parīkṣā (still only shown in-course), My Reports, NotebookLMs,
Videos, About. Mobile hamburger menu left as a flat list (already vertical,
not competing for horizontal space, so the primary/more split wasn't needed
there).

**NOT YET VERIFIED live** -- curator to confirm across both curator and
learner accounts, desktop and mobile.

**Follow-up fixes + reorganization (2026-08-08):** curator found the Courses
dropdown showed nothing. Root cause: the LEFT grid region had `overflow-hidden`
(added to stop horizontal bleed into the center column) -- but this ALSO clips
the Courses dropdown panel, which is absolutely positioned and needs to extend
BELOW the navbar to be visible. Fixed by scoping to `overflow-x-hidden` instead
(blocks horizontal overflow only, leaves vertical dropdowns free).

Also reorganized per curator's explicit direction: "More" (My Reports, About)
moved to the LEFT side, alongside Courses/Parīkṣā/Dashboard/Curator. New
"Resources" dropdown added on the RIGHT side (NotebookLMs, Vēda & Stotra, Dāsa
Sāhitya -- exact strings matched against the home page's own existing column
headers in `app/(app)/page.tsx`, not guessed: note "Stotra" has NO macron on
the home page, unlike "Vēda"). Both video items currently link generically to
`/videos` rather than deep-linking to a specific channel anchor (the home page's
"View all" links do this via `/videos#channel-${channel.id}`) -- would need
channel IDs threaded through `layout.tsx` into `Navbar`, intentionally not done
here to keep this fix scoped; worth doing as a follow-up if it matters.

Clarified for curator: Dashboard/Curator links are intentionally conditional on
being logged in (Curator additionally needs curator/admin role) -- their absence
in the screenshot matched a logged-out view (Login/Register buttons visible),
which is expected. Not yet confirmed whether this was also an issue while
actually logged in.

**NOT YET VERIFIED live** -- needs a full dev-server restart (not just browser
refresh) per the established pattern for structurally-different files this
session, then curator confirmation across logged-in/logged-out and both roles.

**Second round (2026-08-08):** curator reported NONE of the dropdowns working
after the previous fix, plus a stray up/down stepper-icon artifact in the bar.
Given this matches the SAME stale-build pattern hit twice already today (new/
restructured file, simple restart not always sufficient), and I could not find
an actual code defect on re-review, treated this as very likely a stale bundle
rather than chasing a phantom bug. Rewrote the file cleanly again via
`write_file` (verified landed via read-back), added explicit `type="button"` to
all dropdown trigger buttons (harmless defensive addition -- guards against any
implicit-form-submission edge case, though not confirmed as the actual cause).

Also reordered per curator's explicit spec: LEFT = Courses ▾, Parīkṣā (in-
course only, unchanged conditional), Dashboard, Resources ▾ (moved from right),
Curator (role-conditional), More ▾. RIGHT = search, auth only.

**Curator asked for a THOROUGH cache clear this time, not just restart** --
given repeated staleness issues, recommended: stop dev server, delete the
`.next` folder entirely, then `npm run dev` fresh, rather than a normal
restart. **NOT YET VERIFIED live.**

**Session paused here (2026-08-08), navbar dropdowns still broken -- this is
the next concrete action to resume with.** Full diagnostic trail so far, so
tomorrow doesn't restart from zero:

- `.next` cache clear did NOT fix it -- rules out staleness/Fast Refresh corruption.
- Tested in an InPrivate/Incognito window -- SAME problem persists -- rules out
  a browser extension.
- The stray "up/down icon" curator kept seeing was inspected directly via
  DevTools element-picker and confirmed to be my OWN chevron SVG
  (`svg.inline-block.ml-1.w-3.h-3.opacity-60`, matches the code exactly) --
  there is no foreign/mystery element. The "icon" curator was describing is
  most likely just that static chevron being the only thing visible, precisely
  BECAUSE the dropdown panel beneath it never appears.
- Browser console: confirmed CLEAN, zero errors, across multiple checks --
  rules out a JS crash/exception blocking execution.
- Tried switching the outside-click-to-close listener from `mousedown` to
  `click` (theory: event-ordering conflict with React's synthetic event
  batching) -- NOT YET CONFIRMED whether this helped, session ended before
  testing.
- **Critical, most recent finding**: clicking "Courses" produces ZERO visible
  change -- not even a brief flicker before closing again. This rules out the
  mousedown/click race-condition theory entirely (that would show a flash of
  the panel). Points toward either (a) the click event never reaching the
  button's onClick handler at all -- something intercepting/absorbing it
  first -- or (b) the state genuinely not updating despite the handler firing.

**Next diagnostic step, not yet done**: use React DevTools (⚛️ Components tab,
official extension) to watch the `Navbar` component's `coursesOpen` state
directly while clicking -- this cleanly separates "state never toggles" (click
not reaching the handler / handler not running) from "state toggles but nothing
renders" (a CSS/render-layer bug instead). Whichever it is dictates a
completely different next fix -- worth doing this BEFORE further code changes
rather than guessing again.

Other untried ideas worth considering next time: check for any overlay/portal
element with a z-index or pointer-events issue sitting on top of the nav
(inspect the exact click coordinates, not just the visible chevron); try an
entirely different browser (not just Incognito in the same one) to fully rule
out anything Chrome-specific; temporarily strip the Courses button down to a
bare minimal `<button onClick={() => alert('clicked')}>` to test whether ANY
click handler fires on that exact DOM position at all, isolating the problem
from the dropdown logic entirely.

**Second item queued for next session (2026-08-09):** curator separately
reports the navbar looks visibly "crunched" on smaller laptop screens (not
mobile -- the `md:` breakpoint's full desktop nav, just on a narrower desktop
viewport, e.g. ~1366px-class laptops). Ask: proportionally scale the SAME
desktop nav layout down on smaller screens (smaller font size, tighter
spacing/gaps) rather than switching to a different/collapsed layout --
preserve the full desktop-style experience, just more compact. Worth noting
the nav has grown to 6 left-side items (Courses/Parīkṣā/Dashboard/Curator/
More) + search + auth since the original design, likely contributing to why
this is only now visibly tight. Explicitly queued AFTER the Courses-dropdown
bug above -- fix that first, then this.

## Known Gotchas

- OG image: Satori cannot render Devanāgarī — static PNG at /public/og-image.png
- ts-node scripts must use --project tsconfig.scripts.json
- Claude Code bash_tool silent timeouts: add process.exit(0) and console.log('Done.') to scripts
- Re-embedding is idempotent (upsert) — safe to re-run
- argument_nodes.stream CHECK constraint: mula | bhavadipika | vadavaliprakasha | kashika
