# BJ kāśikā (mūla + Kāśikā only) — pages 2–137

## Project Overview

Source transcription of pages 2–137 of Bhedojjivanam (Vyāsarāja Tīrtha) with the Kāśikā
commentary (Kāśī Timmaṇṇācārya / "Kāśītirumalācārya"), for tattvasudha.org.

**Scope constraint (non-negotiable, copyright):** extract ONLY mūla and Kāśikā. The
printed source is a six-commentary (ṣaṭ-ṭippaṇī) edition — do not transcribe any of the
other four commentaries (Bhāvapradīpa, Bhedacintāratnam, Bhedacandrikā, Bhedasañjīvinī)
if traces of them are ever found in this range. None have been observed in 2–137 so far
(see Findings below) — the range appears to end exactly at the mūla+Kāśikā colophon on
page 137.

This project is the pages-2–137 counterpart to the sibling project
`BJ_kAshikAbhAvaprakAshikA_OCR` (pages 141–531, three-tier: mūla / Kāśikā / a modern
sub-commentary "bhāvaprakāśikā"). Tagging conventions below are kept consistent with
that project's `--मू.--` / `--का.--` scheme (we omit `--भा.--` since no third tier
exists in this range).

## Source Files

13 scanned PDFs in `BJ kAshikA source OCR/`, named `BJ <start>-<end>.pdf`. Validated:
all 13 tile with no gaps/overlaps, covering book pages 2–137 (136 pages total). Each
file's actual page count matches its filename range.

## Folder Structure

```
BJ_working/
├── CLAUDE.md                    ← this file
├── BJ_2-137_merged.pdf          ← 13 source PDFs concatenated, unrotated (raw)
├── BJ_2-137_corrected.pdf       ← merged PDF with rotation fixed (see below) — USE THIS as the working source
└── (sample/scratch renders — safe to delete)
```

Merged-PDF page N (1-based) = book page (N + 1), i.e. merged page 1 = book page 2.

## Rotation — MAJOR FINDING, already fixed in `BJ_2-137_corrected.pdf`

The scans are **not** a handful of isolated rotated pages. The book's pages 2–90 were
scanned almost entirely upside down (180°), because that portion is a lithograph/facsimile
reproduction (older cursive typeface) — apparently scanned as a batch, upside down.
A small number of individually-typeset "clean modern" pages within that stretch
(15, 36, 51, 52, 71) were scanned right-side up. Pages 91–137 (clean modern typeset
throughout) are all correctly oriented.

**Pages rotated 180° in `BJ_2-137_corrected.pdf`:** all of 2–90 EXCEPT {15, 36, 51, 52, 71}
— i.e. 84 pages total: 2–14, 16–35, 37–50, 53–70, 72–90.

**No 90°/270° rotations found anywhere in 2–137.**

Detection method: an initial low-res visual skim was unreliable (missed several
upside-down pages, including page 2 itself on first pass). Final method was a
self-relative structural heuristic (Devanagari shirorekha-position asymmetry, compared
against each page's own 180°-rotated version — avoids needing an absolute/font-specific
threshold), cross-validated against direct full-resolution visual zoom on ~19 spot-checked
pages (all matched). **The user should still page through `BJ_2-137_corrected.pdf` once
before transcription begins**, since this was a large correction.

Minor scan artifacts (ink blot / thumbprint at a page corner) noted on pages 65, 68, 80,
133 — cosmetic only, doesn't obscure text, no action needed.

## Layout Conventions Observed

- **मूल (mūla):** short block (2–6 lines), entire block **bold**, set off as its own
  paragraph (blank line + slight indent, not flush with running text), normally ends in
  a verse-end danda `॥`. **IMPORTANT correction:** mūla in this work is not only the
  opening verse — short *prose* mūla blocks recur throughout, including dialectical
  "ननु..." (objection) passages. Content/genre ("this sounds like a commentary
  objection") is NOT a reliable signal for mūla vs. Kāśikā — **bold weight + paragraph
  separation is the only reliable test**. Always check actual stroke weight, don't infer
  from what the sentence sounds like.
- **काशिका (Kāśikā):** running prose, flush left, regular weight, with only the
  **pratīkas** (quoted mūla words being glossed) in **bold**.
- **Topic/section headings:** parenthetical Sanskrit compounds, e.g.
  `(अद्वैतस्य त्यागप्राप्तिस्वसमर्थनम्)`, centered, **bold** (corrected — these ARE
  bold in the print) — editorial argument-summary headers, NOT a third commentary
  layer. Recur throughout.
- **Bold-span boundaries are exact, not whole-word-sloppy:** e.g. in
  `स्वतन्त्रत्वप्रमुखैरिति`, the bold pratīka is `स्वतन्त्रत्वप्रमुखैरि` and only `ति`
  (the tail of the sandhi-joined `इति` quotation marker) is unbold. In
  `गुणैरसाधारणप्रमापकैः`, only `गुणैर` is bold. Check exactly where bold starts/stops,
  don't round up to the whole word/compound.
- **Textual-variant footnotes:** numbered footnotes at the foot of many pages
  (mostly in the "clean modern typeset" stretches), citing manuscript variant readings
  (`... इति पाठः`), separated from the main text by a horizontal rule in the print.
  Not mūla or Kāśikā content per se. **Decided:** render as standard markdown footnotes,
  using the SAME marker the source itself uses (`[^*]` for an asterisk-marked note,
  `[^1]` for a numbered one, etc — not an invented English slug), and reproduce a `---`
  rule before the footnote block on the page to mirror the source layout. Bold inside a
  footnote (e.g. quoted variant readings) must be preserved exactly like anywhere else.
- **No English glosses/translations anywhere in the transcription** — this is a pure
  transcription, not an annotated edition. Titles, headings, and footnotes stay 100%
  Sanskrit exactly as printed.
- **Accuracy bar is 100%** — when a glyph is genuinely ambiguous (cursive conjuncts like
  श् vs ञ् can look alike in the older lithograph font), zoom in tight before committing,
  and don't let plausible-sounding guesses stand in for verified reads.
- Two distinct typesetting styles recur through the book (older lithograph-style pages
  vs. clean modern typeset insertions becoming the norm from page 91 on) — cosmetic only,
  does not change the mūla/Kāśikā tagging logic.
- Running page headers alternate: mūla title on one side, "काशिकासहित" ("with Kāśikā")
  on the other — confirms the whole range is understood as a mūla+Kāśikā unit in the
  print itself. **These are excluded from the transcription** (see Markdown Tagging
  Scheme below) — useful as context, not content.
- Page 137 ends in a colophon for BOTH mūla and Kāśikā (`... समाप्तम् ॥`), consistent
  with this being a complete, self-contained extraction unit.
- **Never truncate a long footnote with "..." if more text was actually read from the
  page image.** Caught in batch 1: three sentences of footnote `[^p10-2]` were visible
  in the rendered crop but got dropped when compiling the final file. Transcribe
  everything that was actually read: only use "continues on page N" for content that
  is genuinely beyond what's been rendered/read yet, never as a shortcut.

## Markdown Tagging Scheme — CONFIRMED

Adopted as-is from the sibling `BJ_kAshikAbhAvaprakAshikA_OCR` project, minus the
`--भा.--` tier (not present in this range):

```
--मू.--
**[mūla root text block — entire text bold]**

--का.--
[kāśikā commentary — pratīkas in **bold** only, footnote markers as printed, e.g. [^*] or [^1]]

---

[^*]: [footnote text, bold preserved where printed bold]
```

- `(...)` topic/section headings kept as their own line, not wrapped in either tag,
  **bold** (see Layout Conventions above).
- Page boundaries: `---` rule + a heading with the bare Devanagari page number (e.g.
  `## २`), so each page is a clearly delimited, visually obvious section — not just an
  HTML comment (those are still used mid-page to mark "continues on page N" for
  sentences that run across a page break).
- **EXCLUDE running headers entirely** — the page-corner text (`काशिकासहित-` /
  `भेदोज्जीवनम्`) is just the repeating book/section title, not per-page content.
  Confirmed by user 2026-07-17: do not transcribe it at all, on any page. (The `##`
  page-number heading already gives full page traceability without it.)
- Footnotes: marker matches the source exactly (`[^*]`, `[^1]`, ...), a `---` rule
  precedes the footnote block (mirroring the printed page), footnote text preserves bold
  spans exactly as printed. Source footnote numbering restarts on every page, but
  markdown footnote keys must be unique document-wide — so keys are prefixed with the
  page number, e.g. `[^p3-1]`, `[^p3-*]`. This still mirrors the source's own marker,
  just disambiguated by page.
- No English anywhere — pure Sanskrit transcription only.
- When a sentence/word is cut off mid-word at a page boundary, leave it as printed and
  mark `<!-- continues on page N -->` rather than artificially completing it.

## Production Workflow — CONFIRMED (hybrid: Gemini first-pass + independent verification)

Pages 2–3 were transcribed fully by hand first (no automation) and then corrected against
user feedback — see git-free history in this file's earlier revisions / chat log for the
specific errors caught (mūla misclassified by content instead of bold weight, bold-span
boundaries rounded up to whole words, topic headers not bolded, one word substitution
error). Those corrections are captured in Layout Conventions above.

An empirical test then compared an independent Gemini OCR pass against the hand-verified
pages 2–3: Gemini correctly classified the "ननु..." block as mūla (thanks to an explicit
prompt instruction not to classify by content/genre), but made its own errors (a vowel-sign
typo, missed bolding गुणैर, and critically dropped a negation अ- in अविज्ञातः → विज्ञातः,
inverting the meaning — confirmed wrong by zooming into the source). Gemini and Claude also
shared blind spots (both over-extended bold across the sandhi-joined इति, both missed
bolding topic headers on the first unassisted pass) — meaning cross-checking alone does
not substitute for independent verification against the actual page image.

**Confirmed workflow per batch (batch = one source PDF's page range, e.g. 2–10, 11–20, ...):**
1. Run the Gemini OCR script (adapted prompt, see `scripts/gemini_ocr_test.py` pattern in
   scratch history) on the batch to get a fast structured first-pass draft.
2. Independently render and read every page from `BJ_2-137_corrected.pdf` (same rigor as
   pages 2–3: zoom on ambiguous glyphs, verify bold spans, don't infer mūla/Kāśikā from
   content).
3. Diff the independent reading against Gemini's draft. Where they agree, reasonably high
   confidence. Where they disagree, zoom in and resolve definitively before writing.
4. Run an adapted `check_tags.py`-style structural sanity check (flags overlong `--मू.--`
   blocks >8 lines, consecutive identical tags) on the finished batch as a mechanical net.
5. **Checkpoint with the user after every batch** (i.e. every ~10 pages / source-PDF
   boundary) before starting the next one — confirmed cadence, given demonstrated shared
   blind spots make full unattended runs through page 137 unwise.

**Gemini model:** the API does NOT auto-select the best available model — the model string
must be specified explicitly per call. The sibling project's script hardcodes
`gemini-2.5-pro`, which is now well behind current offerings (confirmed via
`client.models.list()` on 2026-07-17: Gemini 3, 3.1, and 3.5 series already exist).
**Use the `gemini-pro-latest` alias instead of a pinned version** — it always resolves to
Google's current best "pro"-tier model, avoiding the need to manually track version
numbers or risk pinning to a preview model that gets deprecated mid-project.

**Text formatting:** reflowable continuous paragraphs (not preserving the source's exact
line-wrap points, no text-justification/padding) — confirmed by user 2026-07-17, since
forced line breaks and justification padding would hurt the machine-parseable ingestion
pipeline without adding real value.

**Additional structural findings from batch 1 (pages 4–10):**
- **Footnotes can span a page break.** The continuation appears as unmarked text right
  after the next page's own `---` rule, BEFORE that page's own footnote(s) begin (seen:
  page 4's footnote 1 continues onto page 5). Keep the full footnote text together under
  its original key rather than splitting it, and note the crossing with a comment.
- **Footnote numbering does NOT reliably restart every page.** It resets at seemingly
  content-driven points (seen: page 7 ends at 2, page 8 restarts at 1, page 9 continues
  from page 8 as 4–5, page 10 restarts at 1 again). Always read the actual printed
  numeral per footnote — never assume "starts at 1 on a new page."
- **CORRECTION (see batch 2 findings below): footnote-quote boldness is NOT a reliable
  blanket rule.** Early batch-1 evidence (pages 2, 7, 8, 9, 10) looked consistent, but
  batch 2 falsified it with multiple counter-examples on the very same pages. Check
  every footnote's bold status individually — there is no shortcut here.
- A footnote can run long enough to cross a *batch* boundary too (page 10's footnote 2
  continues into page 11, which belongs to batch 2) — marked with a comment rather than
  guessed at.

**Additional structural findings from batch 2 (pages 11–20):**
- **A mūla-block footnote's definition can print on the FOLLOWING page even when the
  marker itself is mid-page, not just at a page-final cutoff.** Page 10's mūla had two
  inline footnote markers ([^p10-3], [^p10-4]) whose definitions only appear at the top
  of page 11, ahead of page 11's own footnotes — recognizable because their content
  (`चेष्टाकत्वदर्शनात्`, `दृष्टान्तासिद्धिः`) matches words in page 10's mūla, not
  anything on page 11. Always match footnote content back to the word it glosses,
  don't assume a footnote "belongs" to the page it's printed under.
- **Corrected own error:** inserted two footnote markers into page 11 text based on
  guesswork rather than a confirmed marker in the image — always verify the exact
  marker position by zooming, never infer "a footnote must go here."
- **MAJOR CORRECTION — misclassified an entire block as mūla on page 11.** The
  "चैत्रशरीरमिति..." passage was tagged `--मू.--` because it followed a `--मू.--` block
  on page 10 and looked topically continuous — but it is genuinely Kāśikā: only
  "चैत्रशरीरमि" (the pratīka, before the sandhi-joined "ति") is bold; the rest is
  regular commentary prose. The lesson: when the sanity-checker flags "two consecutive
  मू blocks," don't just check whether the topic is continuous — check whether the
  PRECEDING block ends with a hard terminator (`॥`, a finished sentence) and the
  following block is a genuinely fresh, entirely-bold, short passage. A `--मू.--` block
  that opens with "[word]मि**ति**" (pratīka + sandhi-iti) is almost certainly Kāśikā
  glossing that very word, not mūla — that pattern alone should trigger a recheck.
  The corresponding "two consecutive मू" checker flag IS a reliable signal — treat it
  as "verify carefully," not "probably fine because I've seen this before."
- **Bold is NOT applied to every quoted phrase — only pratīkas (of mūla/kāśikā) and
  SOME manuscript-variant citations.** Quotes of external authorities (e.g. "मणिकारः
  अत्र आह...") or the kāśikā author's own illustrative asides in his own words are NOT
  bold even when in quotation marks. There is no reliable shortcut rule here either —
  check each quote's actual weight in the image.
- Page 17 prints two DIFFERENT footnotes both numbered "१" (one in the कशिका text, one
  in the following मूल text) — a genuine source anomaly, disambiguated as `[^p17-1]`/
  `[^p17-2]` in document order. Flagged, not fully independently re-verified beyond
  Gemini's OCR read.

**Process calibration after batch 2:** batch 2 had a meaningfully higher error rate than
batch 1 (one full block misclassified as mūla, ~10 bold-span errors, one meaning-changing
word error, one dropped sentence) — likely because confidence from batch 1's clean review
led to faster, more pattern-matching-based verification instead of checking each bold span
and each mūla/kāśikā transition individually against the image. **Going forward: don't let
a clean prior batch lower the verification bar for the next one.** Re-check every bold
span and every block-boundary call directly against the image, every time, regardless of
how confident the established patterns feel.

**Process calibration after batch 3 — footnote-quote bold, corrected again:** applying the
batch-2 lesson ("don't assume footnote quotes are always bold") too literally, batch 3 left
footnote quotes unbold almost everywhere — and nearly ALL of them turned out to actually be
bold in the source. So neither "always bold" nor "never assume bold" is the rule. **The
actual rule: check every footnote's quoted text individually, every batch, with no prior
assumption in either direction — do not carry a "mostly yes" or "mostly no" prior forward
from the last batch.** Also caught this batch: a handful of individual letter/word-level
misreadings in dense compounds (e.g. रजना→रजता, दर्शिना→दर्शिता, तथेढं→तथेदं,
स्पर्शनेन→स्पार्शनेन, पश्चिमदेश→पक्षिमद्देश) — these are exactly the kind of error that
"reads plausibly" without close letter-by-letter zoom, another reminder that fluent-sounding
Sanskrit is not the same as verified-correct Sanskrit.

**Batch 4 process note — dedicated second pass added.** After three batches each catching a
different error category on user review, added an explicit second pass (before presenting
to the user, not instead of user review) targeting exactly those three categories: (1)
re-check every `--मू.--` boundary for the pratīka-tell, (2) re-zoom every footnote
specifically for bold (footnotes are small/localized, cheap to check exhaustively), (3) a
holistic re-read of the compiled kāśikā prose for anything that reads plausibly but doesn't
quite parse. Also found in batch 4: a **decorative section-divider symbol (—०—)** in the
print (seen on page 35, before a topic heading) that isn't text content — noted via HTML
comment rather than transcribed as if it were a footnote or heading. One footnote
(referenced in Gemini's raw OCR of page 32, re: `तथापि`/`अथापि` variant) could not be
confidently placed against a specific marker in the image and was omitted rather than
guessed — flagged for the user rather than silently dropped or invented.

**Batch 4 USER REVIEW still caught real errors despite the second pass — root cause found
and a more mechanical fix applied going forward.** User review of batch 4 found: a whole
missing 6th footnote on page 32, AND every other footnote marker on that same page
systematically shifted one word off from its true position (my "re-zoom every footnote for
bold" check was verifying the bold status of markers I'd already placed, not verifying
their POSITION or COUNT against the image — so a consistent off-by-one drift sailed through
undetected). Also still missed several pratīka bold spans on page 34 despite the "holistic
re-read." **Concrete fix, mandatory from batch 5 onward:** for every page with footnotes,
before writing anything, do an explicit two-step count-then-place pass: (1) count every
footnote marker visible in the page image (both the small inline marks in the running text
AND the numerals in the bottom footnote list) and confirm the two counts match before
transcribing; (2) for each marker, identify the EXACT syllable/word it touches (immediately
before or after — check which side) by reading the marker's pixel position relative to the
surrounding letters, not by "this footnote is about X so it must go near X." Position
verification and bold verification are separate steps — doing one does not imply the other
was done.

## Progress Tracker

| Stage                        | Status                                            |
| ----------------------------- | -------------------------------------------------- |
| Page range validated           | Done — 2–137, 136 pages, no gaps/overlaps         |
| PDFs merged                    | Done — `BJ_2-137_merged.pdf`                      |
| Rotation detected & corrected  | Done — `BJ_2-137_corrected.pdf` — user manually spot-checked and confirmed good 2026-07-17 |
| Markdown structure proposed    | Done — confirmed by user 2026-07-17               |
| Production workflow            | Done — hybrid Gemini+independent-verification+second-pass confirmed 2026-07-17, see above |
| Transcription                 | **ALL DONE — pages 2–137, the complete document, transcribed.** Batches 1–11 (pages 2–110) reviewed and corrected by the user. Batches 12–14 (pages 111–137) drafted, self-corrected, structural checker clean, run back-to-back per user's 2026-07-27 instruction — awaiting the user's single end-of-run review (see flagged items below) |
| Pages flagged for user review  | Page 17's double-"१" footnote anomaly (batch 2). Batch 3: pages-28/29 "consecutive मू" pair (moderate confidence). Batch 4: 35/36 and 39/40 "consecutive मू" pairs (structurally reasoned, not sandhi-verified). Batch 5: 48/49 pair (grammatically reasoned: mūla closes a quoted statement with "इति" right at the page break, response opens next page). Batch 8: 72/73 "consecutive मू" pair, directly zoom-confirmed against both page images as genuine (no Kāśikā prose between them in the source). Batch 10 (both items USER-CONFIRMED as real errors and fixed, see below — kept here only as a historical note, not open questions): page 95's `निरअनः`, page 98's `विरुध्यत`. Batch 12: page 115's mūla reads `परमात्मनोऽपरमार्थतो` (with negation अ) at high zoom — this is the literal, unambiguous printed reading, but it sits oddly next to the parallel citation of the same thesis on page 112 which reads `परमात्मनः परमार्थतो न भिद्यन्ते` (no अ) — transcribed exactly as printed rather than silently harmonized; worth a second look given the pattern of this project's other real negation-drop findings turning out to be genuine errors rather than source quirks. Batch 14 p.136's `रविद्याप्रपञ्चः` — RESOLVED by user 2026-07-28: confirmed correct as the pixel-literal reading (the initial र is a sandhi-transformed visarga from p.135's `गगनादिः`, not a misread — see process notes). |

## Next Session Resume Pointer

Batches 1–5 (pages 2–50) are DONE — reviewed by the user, all corrections applied
(2 more missed bold spans on pages 42/44, same recurring pattern: a pratīka bold span
that doesn't start at a clean word boundary — always check the OPENING of a bold span
as carefully as the closing, not just where it ends before a sandhi-joined इति).

**Data-integrity scare, resolved:** user flagged `[^p31-1]`/`[^p31-2]` as "seeming
extraneous" during batch 4 review. Investigated and found their *definitions* had been
silently deleted from the file during an earlier large multi-page Edit operation (the
inline references survived, but the paired `[^p31-1]:` / `[^p31-2]:` definition block
was lost) — the structural checker's "no matching definition" HIGH-severity flag would
have caught this immediately, but it didn't surface in review because a large edit had
just re-triggered a wave of *expected* MEDIUM "consecutive मू" flags and the HIGH one
wasn't specifically called out before reporting back. **Lesson: after every large Edit,
re-run the checker and explicitly check for HIGH-severity output — never let it get lost
among expected MEDIUM noise.** Restored and confirmed clean.

**Batch 6 (pages 51–60):** high footnote density (page 52 alone had 7 markers). Directly
zoom-verified marker positions on pages 51 and 52 against the images before compiling —
all matched Gemini's draft exactly. One self-caught error during compilation: a footnote
definition (`[^p58-1]`) written without its inline reference in the running text — caught
by the checker's MEDIUM "no inline reference" flag (the mirror-image of the batch-5
"no matching definition" bug) and fixed before reporting. Page 54 has three genuinely
separate, consecutive `--मू.--` statements (a "not-first / not-second / not-third"
enumeration) — directly zoom-confirmed each is independently bold, not a
misclassification.

**Process decision, confirmed by user after batch 6:** explicitly asked whether to
lighten verification or run all remaining OCR upfront before reviewing. User's answer:
**no — keep verification as rigorous as possible, keep the 10-page batch rhythm.**
Priority is 100% accuracy with minimal effort on the USER's side, which means the
verification workload stays on this side, not reduced. Do not water down the
independent-read + footnote count-then-place + bold-boundary-check discipline for
later batches just because earlier ones went well.

Batch 7 is pages 61–70, source file `BJ 61-70.pdf`. Update the Progress Tracker table's
Transcription row after each batch.

**Batch 7 process notes:**

- **Gemini OCR hang on the full 10-page call.** The single-shot OCR call for pages
  61–70 failed three times in a row (one dropped connection, one silent hang, one true
  5/10-minute timeout) despite the network path itself testing healthy and a tiny
  1-page/short-prompt test call returning in ~30s. Root cause not fully isolated, but
  **splitting the batch's OCR call into two 5-page sub-calls (61–65, 66–70) run in
  parallel resolved it immediately** — both completed normally. This doesn't change the
  10-page batch/review rhythm, only how the underlying OCR step is chunked. If a future
  batch's OCR call hangs repeatedly on the first attempt with a healthy network, try
  this split before assuming something is broken.
- **New recurring misreading pattern this batch: "सिद्ध्या" + "अर्थान्तर" losing its
  आ.** Gemini's OCR wrote `सिद्ध्य` + avagraha + `अर्थान्तर` (dropping the long आ of
  सिद्ध्या) at least 4 separate times across pages 66/68/69/70. Zoom confirmed the
  source always has the full सिद्ध्या. Worth specifically double-checking this exact
  bigram in future batches.
- **One sub-batch's raw Gemini output used backtick-wrapped tags** (`` `--का.--` ``
  instead of plain `--का.--`) — a formatting inconsistency between the two parallel
  OCR calls, caught and normalized during merge. Worth a quick visual check of tag
  formatting whenever an OCR call is split across multiple sub-calls.
- Batch 6→7 page boundary double-checked directly against the source images: page 60's
  Kāśikā sentence is genuinely cut off mid-sentence at the physical page edge (same
  pattern as the existing page-32→33 precedent in the file) — no missing मू block or
  lost content, just a normal cross-page prose continuation.

**Batch 7 USER REVIEW caught real errors this self-check missed — three distinct
failure modes, all now fixed:**

1. **A word I read as `दित्त्व` at 12–16x zoom (concluding it was a genuine non-standard
   term, distinct from द्वित्व/दिक्त्व) was actually `दिक्त्व` — the user's manual
   check caught this correctly.** Re-zoomed even tighter after the correction and could
   finally see the क् conjunct I'd been missing (it renders as a small compressed
   subscript in this typeface, easy to mistake for absent). **Lesson: when a reading
   would require a source to be using a term found nowhere else in Sanskrit
   philosophical literature, that itself is a signal to get MORE confident, not less
   — a plausible-but-unattested word is more likely a subtle ligature misread than a
   genuine hapax legomenon.** Don't stop at "I zoomed and confirmed" if the resulting
   word is linguistically anomalous; that anomaly is itself evidence to keep digging.
2. **A whole heading + paragraph at the very bottom of the page, right before the
   footnote rule, was missed entirely** — by Gemini's OCR *and* by this session's own
   verification pass (page 65's trailing content, and a block that belonged at the end
   of page 69 but got attached to the start of page 70 instead). Both cases: content
   sitting in the last few lines before a footnote block, easy to skip when attention
   is on the footnotes themselves. **Lesson: explicitly check the full page top-to-
   bottom, including the last paragraph before the footnote rule, as its own
   verification step — don't let "then check the footnotes" implicitly stand in for
   "then check everything after the last paragraph I already transcribed."**
3. **Footnote quote-bolding was systematically dropped across nearly every footnote
   in the batch** (pages 65, 66, 68, 69, 70) despite the established per-instance-check
   rule and despite the source consistently bolding quoted variant-reading text in
   footnotes. This wasn't a per-footnote judgment error — it was a wholesale omission,
   suggesting the footnote-bold check didn't actually get done this batch even though
   the process notes said it should. **Lesson: footnote bold-checking must be a
   literal, separate re-zoom of every footnote block, every batch — do not let
   "I already read this text once" substitute for the dedicated bold-check pass.**

Batch 8 is pages 71–80, source file `BJ 71-80.pdf`.

**Batch 8 process notes:**

- **OCR hang isolated to a specific 3-page sub-range (71–73), not the whole batch.**
  The 5-page chunk (71–75) failed 4 times with 4 different error signatures (dropped
  connection, timeout, connection reset, server-disconnect) despite a healthy network
  and other chunks (74–75, 76–80) succeeding immediately. Bisecting (5→3+2 pages, then
  3→3 single pages) showed all three individual pages succeeded in ~35–53s each with a
  short test prompt — so no single page's content was the cause. Re-running the
  3-page chunk with the FULL detailed prompt kept failing, but running those same 3
  pages individually with the full prompt succeeded every time. **Lesson: if a
  multi-page chunk keeps failing with varying error types while adjacent same-sized
  chunks succeed, don't keep retrying the same chunk size — bisect down to find the
  problem range, then drop to single-page calls with the full prompt for just that
  range** (this is more granular than batch 7's fixed 5+5 split and resolved a case
  that 5+5 alone wouldn't have caught).
- **Zoom calibration lesson: extremely high zoom (14–20x+) can make bold-weight
  judgment WORSE, not better.** On page 72, tight zooms at high magnification gave an
  ambiguous/inconsistent read on whether certain spans were bold, while re-checking
  the same spot on the standard ~4.5x pilot render (the same resolution used for the
  first read-through) showed the bold/regular distinction clearly. Likely cause:
  very high zoom exaggerates anti-aliasing artifacts in a way that obscures relative
  stroke weight. **Going forward: for bold-span verification, prefer the standard
  pilot-render zoom first; reserve high zoom (12–20x) for individual glyph/conjunct
  identification (word-level misreads), not for weight comparison.**
- **Two genuine negation/word-omission errors found this batch, both changing
  meaning materially**, caught by noticing a word didn't parse cleanly against
  context rather than by a formal check: `तथाप्यनुकूलतर्कस्फूर्तौ` should have been
  `तथाप्यनुकूलतर्कास्फूर्तौ` (page 77, missing negation), and
  `प्रयत्नानुसन्धात्रनुसंहित` should have been `...त्रननुसंहित` (page 79, missing
  a full negation syllable). Also found a **swapped sentence order** on page 80 that
  silently changed what a "तदभावात्" (its absence) was referring to — this class of
  error (right words, wrong order, changes an anaphoric reference) doesn't trip any
  mechanical check; only reading for whether the argument's logical flow actually
  holds together catches it.
- Also fixed this batch: `हेतुस्तु`→`हेतुरस्तु` (p71, missing the optative अस्तु in a
  "let X be so / let Y not be so" doubt-construction), `जातिवानुमिति`→`जातित्वानुमिति`
  (p73), `ननुक्त`→`ननूक्त` sandhi vowel-length (p76), `घातक`→`घातुक` agent-noun form
  (pp79–80, recurring), `भावाभावरूप`→`भावाभावत्वरूप` (p80), `ईशावृत्ति`→`ईशवृत्ति`
  spurious negation (p80). Over-bolded explanatory clauses on page 72 (Kāśikā's own
  reasoning wrongly bolded as if quoting मू) were un-bolded after the zoom recalibration
  above.

Batch 9 is pages 81–90, source file `BJ 81-90.pdf`.

**Batch 9 process notes:**

- **Both OCR sub-calls (81–85, 86–90) succeeded cleanly on the first try** — no hang,
  no split-down needed. The batch-7/8 hang issue appears to be intermittent/content-
  specific rather than a persistent problem with this pipeline.
- **Five more negation-drop errors found this batch**, continuing the pattern from
  batch 8 — this is now a clearly recurring OCR failure mode, not a one-off: page 88
  `यदि पुनर्बाध्यः`→`यदि पुनरबाध्यः` (flips which branch of the argument is being
  discussed), page 90 `प्राबल्यसिद्धेः`→`प्राबल्यासिद्धेः` and
  `भेदप्रतिपादकत्वात्`→`भेदाप्रतिपादकत्वात्`. All confirmed by zoom before fixing —
  in each case the negated reading was also the one that actually made the surrounding
  argument cohere, which is a useful tell: if a sentence only half-parses, check
  whether an अ-/अन्- prefix got silently dropped before assuming a different error.
- **A wrong-but-plausible heading word**: page 86's heading had `नोताद्वैतपरत्वं`
  (draft) where the source reads `वोताद्वैतपरत्वं` (वा+उत सन्धि — "भेदपरत्वं वा उत
  अद्वैतपरत्वं वा", a standard disjunctive "X or Y" question). `नो` and `वो` are easy
  to conflate at low zoom since both are two-akshara sequences with a similar overall
  shape; worth a specific check on headings phrased as alternatives.
- **A word substitution confirmed by checking the NEXT page's continuation**: page 86
  ended with `तथाप्युपपत्त्यादेः` (draft) but page 87 opens continuing that exact
  sentence with content about `उपक्रमादीनि` (the six tātparyaliṅgas already listed) —
  the source word must have been `तथाप्युपक्रमादेः`, confirmed by the fact that only
  this reading makes the cross-page sentence cohere. **General lesson: when a
  page-final word is ambiguous or dubious, check whether the immediately following
  page's opening content resolves it** — a cross-page sentence often disambiguates
  itself this way.
- One footnote-bold miss: 'सुस्थानीति' on page 77 (same category as batch 7/8's
  systematic under-bolding, but isolated here rather than wholesale).

**Batch 9 USER REVIEW caught a systematic proper-name misspelling going back to
batch 2.** `मुद्गलाचार्य` (a commentator's name, cited repeatedly in footnotes across
the whole document) had been consistently OCR'd as `मुद्रलाचार्य` (ग↔र confusion in
a conjunct) since the very first footnote citing him — invisible until page 83's
review caught one instance. Once flagged, searched the *entire* committed
transcript (not just the current batch) and found 8 total occurrences across
pages 10, 18, 21, 25, 39, 52, 54, 78, 81, and 86 — all fixed in one pass via
`replace_all` on the shared substring `मुद्गलाचार्य`. **Lesson: a recurring proper
noun (person/text name) is worth a whole-file grep the moment ANY instance of it
is flagged as wrong — these names appear dozens of times across the full 137-page
document, so a single OCR misreading of a name is almost never a one-off.** Add this
to the standing per-batch checklist: if a name/proper-noun correction comes back
from review, grep the whole file for it before moving on, not just the current
batch's pages.

Batch 10 is pages 91–100, source file `BJ 91-100.pdf`.

**Batch 10 process notes:**

- **Page 92 hit a genuinely reproducible, content-specific Gemini backend failure —
  5 consecutive failures across 2 different prompts and 2 different upload mechanisms**
  (File-API PDF upload and inline PNG bytes via `types.Part.from_bytes`), all aborting
  at a consistent ~66–68s with `RemoteProtocolError: Server disconnected without sending
  a response`. Every other single page in the batch (including its immediate neighbors
  91 and 93) succeeded normally. Visual inspection of page 92's content found nothing
  unusual (plain Vaiśeṣika/Vedānta prose, no images/tables/non-Sanskrit text) that would
  plausibly trigger a safety filter. **Resolution: after ~5 failed automated attempts on
  a single page with no content-based explanation, stop retrying and transcribe that
  page manually from the rendered image directly**, applying the same tagging/bold/
  footnote rigor as the verified pipeline — don't keep burning retries on a page that
  has already demonstrated a persistent, non-network-related failure.
- **Zoom-percentage guessing for a specific line/word is unreliable and expensive when
  done blind.** Repeatedly re-rendering the same page at different vertical-fraction
  guesses to locate one target line wasted many iterations this batch. **Better approach
  going forward: crop generously first (a wide vertical band), read it, and only THEN
  narrow the crop to the exact line/word** — cheaper than iterating tight crops by trial
  and error, and PIL-cropping an already-rendered PNG (rather than re-invoking
  `fitz.get_pixmap` at a new zoom every time) is much faster once the source render exists.
- **A new recurring OCR failure pattern this batch: dropped word-medial अ in sandhi
  compounds**, distinct from (but related to) the negation-drop pattern already
  tracked. Found 3 times on pages 99–100 alone: `व्यावहारिकधिकरणत्वे`→
  `व्यावहारिकाधिकरणत्वे`, `विशेषादाह`→`अविशेषादाह` (this one IS a negation drop —
  same family, confirmed by zoom), `पटनिष्ठत्यन्ताभाव`→`पटनिष्ठात्यन्ताभाव`. The
  `अविशेषात्`/`विशेषात्` case is the most serious: it inverts the claim (whether two
  technical terms differ or not) exactly like the previously-tracked negation drops.
  **Add "dropped sandhi-vowel in a long compound" to the same mental checklist as the
  negation-drop check** — if a long compound doesn't parse cleanly, check for a missing
  अ/आ at a sandhi joint, not just a missing अ-/अन्- negation prefix.
- **A systematic single-character substitution across four section-heading citations**:
  every `(...शङ्कापरिहार...)` heading in this batch's OCR draft came back as
  `...राङ्कापरिहार...` (श misread as र) — on pages 96, 98 (×2), and 100. Confirmed via
  whole-file grep that `शङ्कापरिहार` is the ONLY form used anywhere else in the already-
  committed 2–90 range (0 hits for `राङ्कापरिहार`), and राङ्का isn't a real Sanskrit
  word, giving high confidence this is a single OCR substitution error repeating across
  every instance of one specific heading template, not four independent misreadings.
  **Lesson, same shape as the batch-9 proper-noun finding: a recurring FORMULA (not just
  a proper noun) is also worth a whole-batch/whole-file grep the moment one instance
  looks wrong** — if a heading template repeats verbatim across a batch, one bad OCR
  read of it likely means all repetitions are bad the same way.
- Also fixed this batch: a wrong Unicode vowel-sign codepoint (ॊ U+094A "short o" used
  instead of the correct ो U+094B "o" in `प्रवाहतो(ऽ)नादित्वं`, page 93) — a codepoint-
  level error rather than a misreading, worth remembering that even a visually-correct-
  looking vowel sign can be the wrong Unicode character; a dropped word `रूप` in a long
  compound (page 96); a proper-noun/text-title misread `मन्दारमऋर्यामुक्तम्`→
  `मन्दारमञ्जर्यामुक्तम्` (citing the text *Mandāramañjarī*; ञ्ज misread as ऋ, resolved
  by recognizing the garbled reading wasn't a real word while a known citation pattern
  `[text-name in loc.] उक्तम्` was); a footnote-only negation drop `प्रवाहसङ्ग्रहः`→
  `प्रवाहासङ्ग्रहः` (page 93) where the footnote's whole point is contrasting two
  readings that differ by exactly that अ, so the OCR draft had accidentally erased the
  very distinction the footnote exists to document; three further सदजायत/सज्जायत
  confusions on page 94 (same shape as the negation-drop pattern: two visually-similar
  reading-variants losing their distinction); one printed-text quirk `रुक्मवर्णं`→
  `रुग्मवर्णं` in a quoted Śvetāśvatara verse (this is what the source actually prints,
  not a "correction" back to the canonical Vedic reading — see mūla-fidelity principle);
  raw Unicode superscript digits (¹²³⁴⁵⁶) in the OCR draft's footnote markers converted
  to the project's standard `[^p94-n]` markdown syntax; two stray `।।` (double single-
  daṇḍa) sequences on page 93 normalized to the project-standard `॥` (single double-
  daṇḍa character) — confirmed via whole-file grep that `॥` is the exclusive convention
  used everywhere else (222 hits vs. 0 for `।।` before this fix).

**Batch 10 USER REVIEW confirmed both flagged items were real errors, not source
quirks.** Both of the low-confidence items flagged for user judgment turned out to be
genuine OCR misreadings rather than print anomalies: p.95 `निरअनः`→`निरञ्जनः` (confirmed
by a whole-file grep turning up the exact same phrase, correctly spelled, already in a
footnote on p.47 — `निरञ्जनः परमं साम्यमुपैति` — proving the book's own citation of this
verse is unambiguous and the batch-10 page just misread the ञ्ज conjunct) and p.98
`विरुध्यत`→`विरुद्ध्यत`. **Lesson: don't assume a flagged low-confidence reading is more
likely to be a source-level quirk just because it looked ambiguous under zoom — the
whole-file-grep check (already standard practice for proper nouns) is equally worth
running for any word that recurs elsewhere in the document, even ordinary vocabulary,
before concluding "this is probably just how the book prints it."**

Batch 11 is pages 101–110, source file `BJ 101-110.pdf`.

**Batch 11 process notes:**

- **Page 108 hit the same kind of persistent, content-specific Gemini failure as batch
  10's page 92** — 5 consecutive failures (2 attempts as part of a 3-page chunk retry,
  2 further single-page retries, 1 attempt via the alternate inline-PNG-bytes upload
  method), all `RemoteProtocolError` at ~60–65s. Same resolution as before: stopped
  retrying and transcribed the page manually from the rendered images. This is now the
  second time this exact failure signature has appeared on an isolated single page
  within an otherwise-healthy batch — worth continuing to expect roughly one such page
  per batch rather than treating each occurrence as a surprise.
- **Efficiency lesson on zoom workflow**: blindly guessing a vertical-fraction crop to
  locate one specific line/word and iterating tight re-crops wasted significant time
  this batch. Cheaper approach that worked better once adopted: crop a generous band
  first (e.g. 10-15% of page height) at moderate zoom, read it to locate the target line
  precisely, THEN narrow to a tight high-zoom crop — and prefer cropping the already-
  rendered PNG further with PIL over re-invoking `fitz.get_pixmap` at a new zoom each
  time, since re-rendering from the PDF is much slower than cropping an existing image.
- **A dropped-word error changed a technical term's defining property**: p.107's mūla
  read `पटादिधर्मिकान्यभावान्यः` in the OCR draft — not a real compound — but the source
  clearly reads `पटादिधर्मिकानाद्यभावान्यः` (an "अादि" was silently dropped). This
  matters because प्रागभाव (prior absence) is being defined here via its अनादित्व
  (beginninglessness); the surrounding commentary's repeated use of "अनादि" confirmed the
  correction independently before the zoom check even ran. Same family as the tracked
  negation/dropped-vowel patterns, but a dropped syllable in the middle of a compound
  rather than at a sandhi boundary.
- **Page-number heading itself was misread once**: single-page OCR of p.103 output the
  heading as `## २०३` (203) instead of `## १०३` (103) — a reminder that even the page
  number line isn't immune to misreads and is worth a quick sanity glance against the
  expected sequence, not just assumed correct because it's a short/simple line.
- Also fixed this batch: p.101 `...अवच्छेदकानवच्छिन्नत्वस्य` → `...अवच्छेदकानवच्छिन्नेत्यस्य`
  (a quoted-expression marker "इत्यस्य" misread as an abstracted property-suffix "त्वस्य" —
  confirmed by zoom, changes what the phrase grammatically refers to). Footnote markers
  across the batch came back in several different raw styles from the OCR draft (Devanagari-
  numeral-in-brackets `[^१]`, plain-digit `[^1]`) and were normalized to the project's
  standard `[^p{page}-{n}]` syntax during compilation, same as batch 10's superscript-digit
  cleanup.
- Structurally this batch is a run of six back-to-back anumāna (syllogism) sections
  (घटात्यन्ताभावपक्षक, घटसंसर्गपक्षक, घटप्रागभावपक्षक, घटध्वंसपक्षक, etc.), each following
  the same "मू thesis-statement → parenthetical heading → का commentary" pattern — one
  genuine cross-page मू continuation (p.101→102, sentence literally cut mid-word at the
  page break) triggered the checker's expected "consecutive मू" MEDIUM flag, verified as
  the same non-issue pattern as the existing p.32→33 precedent.

**User instruction 2026-07-27: batches 12–14 (pages 111–137, the rest of the document)
run back-to-back without a per-batch checkpoint.** Same verification rigor per page as
every prior batch — independent read-through, footnote count-then-place, bold-span
check, negation/dropped-syllable check — just no pause for user review between batches.
Every hand-transcribed page (OCR failed repeatedly) and every low-confidence judgment
call gets flagged in this file's tracker for the user's eventual single end-of-run
review, in place of per-batch flagging.

Batch 12 is pages 111–120, source file `BJ 111-120.pdf`.

**Batch 12 process notes:**

- **Page 115 hit the same persistent single-page Gemini failure pattern as batch 10's
  p.92 and batch 11's p.108** — 5 consecutive failures (2 as part of the 114–115 sub-
  chunk, 2 single-page retries, 1 PNG-bytes attempt), all `RemoteProtocolError` at
  ~60–67s. Hand-transcribed from the rendered images per the established fallback.
  Three batches in a row now have hit exactly one such page — this looks like a stable
  background failure rate (roughly 1 in every 10 pages) rather than an anomaly worth
  further root-causing.
- **Multiple genuine negation-drops and dropped syllables found this batch, more than
  any batch since 8–9** — this section of the text (refuting the pūrvapakṣin's anumānas
  for jīva-Brahman abheda) is dense with paired positive/negative technical terms
  (प्रकाशविषयत्व vs प्रकाशाविषयत्व, अनैकान्त्य vs अनेकान्त्य, सामान्याकार vs सामान्यकार)
  that differ by exactly one अ/आ syllable — precisely the shape of error this OCR
  pipeline struggles with. Confirmed via zoom: p.111 `त्रैकालिकत्वायोगात्` → `त्रैकालिक-
  त्वाद्ययोगात्` (dropped द्य); p.113 `प्रकाशविषयत्व` → `प्रकाशाविषयत्व`, **twice in the
  same paragraph** (dropped अ negation, changing "being an object of cognition" to its
  opposite — reused for both `स्वप्रकाशत्व`-definition clauses); p.114 `सन्दिग्धानेकान्त्यं`
  → `सन्दिग्धानैकान्त्यं` (the standard Nyāya term अनैकान्त्य, confirmed against its use
  elsewhere in this same document); p.120 `विशेषसामान्यकारबोधौपयिकं` →
  `विशेषसामान्याकारबोधौपयिकं` (dropped आ). **Lesson: when a passage is visibly built
  around a paired positive/negated technical vocabulary (X vs aX), budget extra zoom
  time — this is now a recognizable "hot zone" for the same class of error, not just a
  generic risk to keep in the back of the mind.**
- **A zoom check that resolved as a false alarm, worth noting for calibration**: p.112's
  मू `तदभेदेऽप्रमाणत्वात्` looked at first glance like it might be missing the अ-negation
  (misreading the avagraha), but a clean high-zoom crop showed the avagraha (ऽ) clearly
  and confirmed the draft was already correct. **Not every suspicious-looking spot is an
  error — the avagraha mark itself can be easy to miss at low zoom, so re-zoom before
  concluding a negation was dropped, not just when concluding a compound was mis-split.**
- **Efficiency note, reapplied from the batch-11 lesson**: several word-hunts this batch
  still took more iterations than necessary before switching to the "crop a generous
  band, read it, then narrow" approach — worth being more disciplined about defaulting
  to a generous first crop rather than guessing a tight one.
- One item transcribed exactly as printed despite looking anomalous rather than
  silently harmonized to a nearby parallel citation: p.115's `परमात्मनोऽपरमार्थतो` — see
  Progress Tracker "Pages flagged for user review" above.

Batch 13 is pages 121–130, source file `BJ 121-130.pdf`.

**Batch 13 process notes:**

- **Unusually heavy OCR attrition this batch** — of the original 10 pages, only 3
  succeeded on the first bisected attempt (121–123, 129–130 as a pair, and one more);
  the rest (124, 125, 126, 128) each needed individual single-page retries, and p.127
  hit the now-familiar 5-consecutive-failure wall and was hand-transcribed. This is the
  worst attrition rate of any batch so far (roughly half the pages needed at least one
  single-page retry) — still resolved with the same bisect-then-retry-then-hand-
  transcribe ladder, just more iterations of it. No new failure mode, just more of the
  same one.
- **A second single-page-heading misread**, same shape as batch 11's p.103→"२०३": p.125's
  OCR draft output the page heading as `## १२०` instead of `## १२५`. Corrected during
  compilation. Two independent occurrences of this now — worth remembering that single-
  page OCR calls seem slightly more prone to page-number misreads than multi-page batch
  calls (plausible cause: with only one page in context, the model has no adjacent-page
  numbering context to sanity-check against).
- **A formatting deviation, not a content error**: the batch12b/13b2 draft style, when a
  bolded pratika-style lead-in phrase opens a fresh `--का.--` paragraph right after a
  parenthetical heading, occasionally wrapped the heading in `<div align="center">...
  </div>` instead of the plain bold heading line used everywhere else in this project.
  Stripped during compilation to match convention. Also confirmed (by checking whether
  the bold lead-in phrase was followed immediately by continuing regular-weight prose in
  the same paragraph, vs. sitting alone in its own short block) that these bold lead-ins
  are pratika-in-कमू commentary, not fresh `--मू.--` blocks — the same "would-be मू is
  actually a bolded quotation being refuted in the same breath" pattern already
  documented for batch 2's `चैत्रशरीरमिति`.
- Also fixed this batch: p.113 `प्रकाशविषयत्वरूपस्य` → `प्रकाशाविषयत्वरूपस्य`, twice in
  the same sentence (dropped negation — describing two candidate definitions of
  स्वप्रकाशत्व, "self-luminosity," as forms of NOT being an object of cognition; the
  drafted reading without अ contradicts the very idea being defined); p.128
  `तदुःखाननुसन्धातृत्वात्` → `तद्दुःखाननुसन्धातृत्वात्` (dropped consonant-doubling from
  तत्+दुःख sandhi). Both confirmed against source images.

Batch 14 is pages 131–137 (final batch, only 7 pages), source file `BJ 131-137.pdf`.

**Batch 14 process notes — final batch, project complete (pages 2–137 fully transcribed):**

- **Cleanest OCR pass of the whole project**: both sub-calls (131–134, 135–137) succeeded
  on the very first attempt — no retries, no bisection, no hand-transcription needed.
  Likely the cumulative effect of the prompt refinements added across batches 10–13
  (explicit negation-drop/dropped-syllable/page-number-misread warnings). Only a
  handful of minor corrections surfaced on independent verification, all confirmed by
  zoom: two instances of a dropped consonant in the term "घटाद्यर्थक्रिया" (causal
  efficacy of a pot etc., a technical epistemological term) misread as "घटायर्थक्रिया"
  (pp.135, 136 footnotes); the benedictory verse's "बळित्थेत्यादि" (a genuine Vedic
  epithet, Ṛgveda 8.93.16) misread as "बलिष्ठेत्यादि" (p.137).
- **The book's colophon structure, confirmed exactly as CLAUDE.md predicted long ago**:
  page 136 contains the MŪLA text's own colophon ("इति...व्यासयतिना कृतं भेदोज्जीवनं
  समाप्तम् ॥", preceded by the mūla's own closing verse) — genuinely bold in print,
  confirmed by direct zoom comparison against adjacent regular-weight text. Kāśikā
  commentary continues past this point (correctly tagged `--का.--`, resuming with
  "नन्वेवमीश्वरस्य परब्रह्मत्वानुपपत्तिः...") through page 137, which closes with the
  Kāśikā author's own regular-weight benedictory verse (explicitly headed "अन्तिम-
  मङ्गलाचरणम्", NOT bold — confirmed by zoom, a meaningful contrast against the
  colophon statement immediately below it) followed by the Kāśikā's OWN colophon
  ("इति श्रीमद्व्यासराजतीर्थश्रीपादकृतभेदोज्जीवनव्याख्यानं (श्रीमहामहोपाध्यायकाशी-
  तिरुमलाचार्यकृतं) समाप्तम् ॥ श्रीरस्तु ॥") — also genuinely bold, confirmed by the
  same zoom-comparison method. **Lesson generalized from this: at a structurally
  unusual point (a colophon, a mixed verse+prose block, anything that isn't ordinary
  running argument), don't assume the bold/regular pattern from the surrounding pages
  continues — re-verify bold weight by direct zoom comparison against a known-bold and
  known-regular span on the SAME page, since these final pages had three different
  weight transitions in quick succession that a content-based guess would likely have
  gotten wrong** (e.g. assuming the closing verse must be regular because it's "just" a
  benediction, or assuming the mūla-colophon must be regular because it's prose not verse).
- **One word left genuinely unresolved despite best effort** — see Progress Tracker
  "Pages flagged for user review" above: the first word of page 136 (right at the
  p.135→136 mūla continuation) was illegible even at 20x zoom; transcribed via sandhi-
  based reconstruction (`अविद्याप्रपञ्चः`) rather than the pixel-literal but nonsensical
  `रविद्य-`, and explicitly flagged as the single lowest-confidence call in the entire
  136-page transcription.

**Batches 12–14 USER REVIEW (pages 111–137) — corrections applied:**

- p.113: reverted an over-applied negation fix — `स्वात्मकप्रकाशाविषयत्वरूपस्वप्रकाशत्वस्य`
  → `स्वात्मकप्रकाशविषयत्वरूपस्वप्रकाशत्वस्य` (no अ here). **Important lesson**: the
  earlier zoom-confirmed fix of `प्रकाशविषयत्वरूपस्य`→`प्रकाशाविषयत्वरूपस्य` earlier in
  the very same sentence was correct, but I then mechanically applied the same फिक्स a
  third time to a *different* candidate-definition clause in the same paragraph without
  re-checking whether the philosophical content called for it there too — it didn't (this
  clause states the POSITIVE competing definition, "being an object of one's own
  cognition," not the negated one). **Finding one instance of a pattern confirmed by zoom
  does not mean every syntactically-similar instance nearby needs the same fix — check
  each occurrence against what it is actually saying, even within one sentence.**
- p.113: bold-span corrected — `**पक्षतुल्यं प**्रकृतधर्मितुल्यं` (bold ends mid-conjunct,
  same "bold stops where the ink stops, not at a word boundary" pattern documented
  since batch 1).
- p.127: `पृथत्त्वादिरूपत्वे`/`पृथत्त्वरूपगुणान्तरानङ्गीकाराच्च` → `पृथक्त्व-` (both
  instances — a dropped क् in the same technical term, पृथक्त्व "separateness/
  distinctness," appearing twice in one paragraph).
- pp.129–130: **three bold-spans removed that should never have been bold** —
  `यच्चोक्तं भावोऽभावो वेति...तत्स्वरूप इति ।` (p.129), `यत्त्वभावत्वावच्छेदेन...
  घटभेदानुपपत्तिरिति ।` (p.130), `यदपि भेदस्याभेदाभावत्वान्न...तदपि न ।` (p.130). These
  were the "bold pratika-style lead-in opening a fresh का paragraph" pattern documented
  in batch 13's process notes — but that documented pattern was **built on an inference
  from paragraph structure, not a direct zoom check of the actual ink weight** for these
  three specific spans. It was wrong for all three. **Lesson: a structural/contextual
  argument for why something is "probably" bold (or probably मू vs का) is not a
  substitute for checking the actual stroke weight — this is the same lesson as batch
  2's `चैत्रशरीरमिति` finding, now confirmed a second time from the opposite direction
  (false positive for bold, not false negative).**
- p.132: `अत्यनश्नन्` → `अत्त्यनश्नन्` (dropped consonant-doubling); `मिथ्येवेति चेत् तर्हि`
  → `मिथ्यैवेति चेत् तर्हि` (मिथ्या+एव sandhi gives ऐ, not ए — a vowel-sandhi slip distinct
  from the usual dropped-अ pattern, worth adding to the mental checklist as its own
  sub-case: check ऐ/ओ sandhi outcomes, not just अ/आ drops).
- **p.136, resolved — the flagged low-confidence word.** User confirmed the pixel-literal
  reading `रविद्याप्रपञ्चः` (not the sandhi-reconstructed `अविद्याप्रपञ्चः` I substituted)
  IS correct, with the missing piece of the puzzle being that p.135's `गगनादि-` ends in a
  **visarga** (गगनादिः), and इः + अ (vowel) sandhis to इर् + vowel — i.e. the visarga
  itself surfaces as र at the start of the next word, giving गगनादिः + अविद्याप्रपञ्चः →
  गगनादिरविद्याप्रपञ्चः. **Lesson: when a word split across a page boundary looks like it
  starts with a "wrong" consonant, check whether that consonant is a sandhi-transformed
  visarga (विसर्ग → र् before vowels, for इ/उ-ending words) before assuming a misread or
  reaching for a from-scratch reconstruction** — the literal pixel reading was right, my
  attempted "philologically sound" correction was the actual error here.
- **Footnote-quote bolding was systematically missing across the ENTIRE p.116–137 range**
  (53 footnote definitions affected) — every quoted variant-reading span (`'...'`) in
  every footnote from batch 12 onward had been left unbolded, despite the established
  per-footnote bold-check discipline. This is the same failure mode as batch 7's
  "footnote quote-bolding systematically dropped across nearly every footnote" — now
  recurring at batch-12-scale (three batches' worth) rather than being caught batch-by-
  batch. Fixed in one pass via a script that wraps every `'...'` span in footnote
  definition lines `[^p116-*]` through `[^p137-*]` in `**bold**`; one footnote (`p120-2`)
  had a genuinely missing opening quote mark from an earlier compilation pass, causing
  the automated quote-pairing to garble — fixed by hand after checking the surrounding
  sentence structure. **Lesson, now the third confirmed occurrence of this exact
  failure mode (batches 7, 9, and now 12–14): footnote bold-checking is apparently the
  single easiest verification step to silently skip under time pressure, precisely
  because footnotes are numerous, small, and visually easy to deprioritize compared to
  the main running text. Going forward, treat "did I actually re-zoom every footnote for
  bold, not just read its text" as a mandatory, explicitly-logged step per batch — not
  an assumed side-effect of reading the footnote once.**

**Whole-document consistency pass (2026-07-28), after the batch 12–14 review round —
results, all clean:**

- **Page-number sequence**: all 136 `##` headings (pages 2–137) run strictly
  sequentially with no gaps or duplicates. Confirms the two page-number misreads caught
  during batches (p.103→"२०३", p.125→"१२०") were the only ones, and both are fixed.
- **Footnote keys**: zero duplicate definition keys; footnote references and
  definitions are a perfect 1:1 match across the whole document (328 unique keys each
  side) — no orphaned refs, no orphaned defs, anywhere in 2–137.
- **Formatting artifacts**: zero stray `।।` (double single-daṇḍa), zero instances of the
  wrong vowel-sign codepoint ॊ (U+094A), zero leftover HTML tags, zero empty bold
  markers, and the total `**` count is even (balanced) document-wide.
- **Structural (मू/का)**: 131 `--मू.--` blocks, 275 `--का.--` blocks, 23 consecutive-मू
  instances (all previously reviewed and accepted case-by-case across batches), and
  only the single known false-positive HIGH flag remains (the p.99→100 footnote-dense
  block miscount, already verified benign multiple times).
- **Proper-noun consistency, checked whole-file**: `मुद्गलाचार्य` (no `मुद्रल` variants
  remain anywhere), `भगवन्तराय`, `कुम्भारीय`, `शर्करा`, `अन्नम्भट्ट`, `मन्दारमञ्जरी`,
  `काशीतिरुमलाचार्य`, `व्यासराजतीर्थ`/`व्यासयति`, `ब्रह्मण्यतीर्थ` — all consistently
  spelled everywhere they occur. One genuine finding: `हुलगी` (32 occurrences) vs
  `हुलगि` (2 occurrences, pp.86 & 120) — **zoom-verified both short-i instances are
  printed that way in the source**, not an OCR error; left as-is rather than
  "normalized" to the majority spelling, since the majority-spelling assumption would
  have been wrong here. This is the same lesson as the हुलगी/हुलगि question always
  is in this kind of proofreading: check before normalizing, don't assume the rare
  spelling is the wrong one.
- No leftover raw superscript-digit footnote markers or Devanagari-numeral-in-bracket
  keys (`[^१]` style) anywhere — the batch-10 and batch-11 cleanups were complete.

**PROJECT STATUS: pages 2–137 (the complete book range) are now fully transcribed,
self-verified, and structurally checked.** Batches 1–11 (pages 2–110) have already been
reviewed and corrected by the user. Batches 12–14 (pages 111–137) were drafted and self-
verified in one continuous run per the user's 2026-07-27 instruction to proceed without
per-batch checkpoints, and are now awaiting the user's single end-of-run review. The
"Pages flagged for user review" row above lists every hand-transcribed page and every
low-confidence judgment call across batches 12–14 — that list is the efficient starting
point for review, rather than re-checking all ~27 pages line by line.
