# Gītā Vivṛtti — CLAUDE.md

This is the single project reference file. It gives Claude everything needed to resume in a new session and to maintain consistency across the entire HTML deliverable.

---

## ⚠️ THE ONE RULE THAT MUST NEVER BE BROKEN: DRAFT → CURATOR APPROVAL → WRITE

**Never write a śhloka (or any correction to an already-written śhloka) to `gita_vivrutti.html` without the curator's explicit, in-chat approval of that specific draft, given AFTER seeing it.** This applies to every single śhloka, every footnote, every correction — no exceptions, and no implicit approval carried over from a previous verse or a previous session.

- "Continue with N and M" is **not** approval to write — it is approval to *research and draft* N and M. Draft first, present in full human-readable form (mūla + translation, every commentary sentence with bolded pratīkas explained, every footnote, every judgment call flagged), then **stop and wait**.
- Only an explicit go-ahead in the curator's own words ("go ahead," "write it in," "all good," "yes," etc.) said in response to a draft actually shown counts as approval. A general instruction to "proceed" with upcoming śhlokas does not pre-approve their content.
- This holds even when a previous batch was just approved and the workflow feels established — approval is per-draft, not a standing grant.
- **Violated once, on 2026-09-13:** 11.33–11.34 were drafted, verified against the PDF, and written directly to `gita_vivrutti.html` and both `CLAUDE.md` files without being shown first — the curator caught it immediately and had to ask for the draft after the fact. See history item (20) below for the full account and the retroactive fix. Do not repeat this.
- If there is ever ambiguity about whether a message constitutes approval of specific content already shown, **stop and ask**, rather than assuming and writing.

This rule sits above every other instruction in this file. When in doubt, draft and wait.

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

**Chapter XI (Viśvarūpa-darśana Yoga) — ✅ COMPLETE (all 55 śhlokas, 11.1–11.55; chapter colophon included at end of 11.55).**

**Chapter XII (Bhakti-Yogaḥ) — ✅ COMPLETE (all 20 śhlokas, 12.1–12.20; chapter colophon included at end of 12.20). 12.1–12.5 written 2026-10-17; 12.6–12.20 written 2026-10-18 via the new Sanskrit-first proofreading cycle (see "Sanskrit-first Proofreading Cycle" below).**

| Śhlokas added | Proofread | Notes |
|--------------|-----------|-------|
| Ch. X: 1–11, 12–13 (combined), 14–42 — ALL DONE | ✅ 1–42 ALL proofread | 12–13 combined; chapter colophon included at end of 10.42 |
| Ch. XI: 1–55 — ALL DONE | ✅ proofread | `CHAPTERS[11]` created; chapter-level footnote feature added (see Footnotes section); 11.2 carries a verse-level footnote (२, गी. ७-३) on a commentary word; 11.3 carries a verse-level footnote (१, विष्णुसहस्रनाम citation) keyed to a **mūla** word (पुरुषोत्तम) instead; 11.4 has no footnote; 11.5 has no footnote — speaker changes to `श्रीभगवानुवाच` (Kṛṣṇa begins speaking); 11.6, 11.7, 11.8 have no footnotes; 11.9 carries a verse-level footnote (१, Mokṣadharma citation, Bhārata-śānti-parva ३४२-६८); speaker stays `सञ्जय उवाच` through 11.10–11.14 (Sañjaya narrating what was shown), then changes to `अर्जुन उवाच` at 11.15 and continues unchanged through 11.31 (confirmed via राॕ's self-reference "अर्जुनोऽहमिव" at 11.20), then changes back to `श्रीभगवानुवाच` at 11.32 (Kṛṣṇa resumes speaking, "कालोऽस्मि..."); 11.11 carries a verse-level footnote (१, मयट् suffix grammar, शब्दनिर्णय citation); 11.15 carries a verse-level footnote (१, पाद्मवचनम् — placement uncertain, see Resume Pointer below); 11.14 supplies `॥ १४ ॥` and 11.23 supplies `॥ २३ ॥` for bare-`॥` print omissions (same situation as 11.7); 11.16 is the first verse with **two separate footnotes** (२ on मूल word विश्वरूप, ३ on राॕ's own citation "पूर्णमेव च"), both appended in citation order with ॥ १६ ॥ only on the last; 11.17, 11.18, 11.22, 11.24, 11.25, 11.26, 11.28, 11.29, 11.30, 11.31 have no footnote in राॕ's own portion; 11.27 has one footnote (१, Viṣṇudharma ch. 19 citation, Purūravas/Aśvins story — superscript position inferred, not visually confirmed, see Resume Pointer history); 11.19 has one footnote (२, ऋग्वेदे पुरुषसूक्ते) — a second footnote on that page (१, नारदीयवचनम्) belongs to the always-ignored 〔वि॑ section and was correctly skipped; 11.20 has one footnote (१, दुर्योधनादिषु... तात्पर्यनिर्णय २४/८१) and 11.21 has one footnote (२, ब्रह्माण्डवचनम्) — **footnote numbering resets per page**, confirmed this batch: page 401's १/२ belong to the ignored 〔वि॑ portion of 11.20, while page 402's १/२ (same digits) belong to राॕ's own citations in 11.20 and 11.21 respectively; 11.32 has one footnote (२, Mahābhārata Sauptika-parva ११९/४९ citation on the war's ten survivors, plus a Gītā Prakāśikā note — kept, since it directly backs राॕ's own exclusion-list sentence) — a sibling footnote on the same page (१, ऐतरेय ११/२/३ citation, on 11.31's मूल word "को") sits under the (वि) block only and was skipped, same precedent as 11.19/11.26; all pratīkas across 1–32 are densely bolded by matching every mūla word echoed in the commentary, refined at 11.10–11.15 to require an **exact word-form match** (see standing rule below); bolding bare exact-form particles/pronouns (न, मे, हि, तथा, अहम्) is now a recurring pattern since 11.16, not yet settled as a blanket policy; 11.8 enriches the existing `aiśvara` DEFS entry; 11.9 adds `hariḥ`/`mahāyogeśvara`; 11.11 adds `sarvāścaryamaya`; 11.16 enriches the existing `viśvarūpa` DEFS entry with the विश्व=पूर्ण equivalence material; 11.25 has no new DEFS terms — straightforward vocabulary (दंष्ट्राकरालानि, काल, न जाने, शर्म, जगन्निवास), and one judgment call: its commentary's "न विन्दामि" gloss is *not* bolded, since this verse's मूल has "न लभे," not "न विन्दामि" (that exact phrase IS मूल in 11.24, so it's the commentator reusing his own gloss-word, a paraphrase here, not a citation); 11.26 also has no new DEFS terms, caught an OCR misread ("(ग)" corrected to "(रा)" against the PDF), and resolved the resume-pointer's outstanding footnote flag — the Karṇa-सूतपुत्रत्व footnote sits entirely inside the always-ignored 〔वि॑ block and राॕ's own commentary never references it, so it's correctly skipped (same precedent as 11.19); 11.27 has no new DEFS terms, is the densest verse since 11.20 (13 राॕ commentary sentences + 1 footnote), and carries three flagged judgment calls, curator-approved as drafted: (a) राॕ glosses मूल's single word "ते" with two back-to-back clauses — read as two alternative parses (subject "they"/warriors vs. short for "tava"/your), no explicit यद्वा connector visible in print to confirm; (b) राॕ's gloss "दृश्यन्ते" drops the सम्- prefix present in मूल's "सन्दृश्यन्ते" — left unbolded as not an exact word-form match, a new edge case; (c) the footnote's own superscript position is garbled in the OCR (a stray `-->` artifact), placed after "एकोनविंशेऽध्याये" by inference only; 11.28 has no new DEFS terms, single-sentence commentary — मूल's "अभिविज्वलन्ति" glossed with the अभि- prefix dropped ("विज्वलन्ति" alone), left unbolded as not an exact word-form match (same treatment as 11.27's दृश्यन्ते); 11.29 has no new DEFS terms, single-sentence commentary quoting the मूल's own "तवापि वक्त्राणि समृद्धवेगाः" verbatim as an उपचार (figurative-expression) explanation; 11.30 has no new DEFS terms, 7 commentary sentences (OCR twice silently dropped an अक्षर against the PDF — "समन्ताद्ग**स**मानः"→"समन्ताद्ग्**र**समानः" and "पदार्थे**प**ूष्माणं"→"पदार्थे**ष**ूष्माणं" — corrected by PDF render), and confirmed the long "king and the Aśvins" story following it in the OCR (ending "इत्यधिकः पाठः") sits entirely under an explicit (वि) heading in the print and was correctly excluded; 11.31 has no new DEFS terms, 3 commentary sentences, and one open flag — footnote "१" (on मूल word "को") judged 〔वि॑-only and skipped, see Resume Pointer; **11.32 — major correction caught only by PDF rendering:** an earlier OCR-only pass had misattributed a long passage ("पूर्णोऽनादिर्वा । लोकान् समाहर्तुं विशेषेण प्रवृत्तः...न भविष्यन्ति ॥३२॥") to राॕ; the rendered page shows this is actually the tail of the **(वि)** block carried over from the previous page (page 406's "(वि) स्वकीयान् गुणकर्मविशेषान् भगवानुवाच..."), with no visual cue in the OCR that a (वि) block was continuing across the page break — राॕ's real commentary for 11.32 begins only after that, with "एवमर्थितो भगवान् स्वगुणादीनाह कालोऽस्मीति..."; 11.32 is now the densest verse in the chapter (17 राॕ commentary sentences + 2 footnotes, surpassing 11.20 and 11.27), no new DEFS terms added (a `kāla` DEFS entry was proposed to the curator but not requested, so skipped for now — revisit if wanted later); **11.32 correction (found while drafting 11.33, same session):** a second footnote on 11.32 had been missed entirely — page 407's own footnote "१" (a set of Kāla/Janārdana-epithet citations from Bhāratatātparya, Bhāratatātparya 11.3.8, and the Mahāvārāha per Gītā Tātparya) sits within राॕ's own commentary, right where he first cites "कालोऽस्मि" — its superscript is easy to mistake for a stray quotation mark in the print (looks like a raised apostrophe, not an obviously distinct numeral) and was missed on first drafting. Caught only when checking page 407 again while locating 11.33's own footnotes. Added retroactively: 11.32 now carries **two** footnotes (२ from page 406's list, on मूल word येऽवस्थिताः; १ from page 407's own separate list, within राॕ's commentary); 11.33 has no new DEFS terms, and is now the most footnote-dense verse in the chapter — **four separate footnotes**: page 407's २ (Bhāgavata 1.9.35, chariot-positioning verse, on मूल word निहताः) and ३ (Bhāgavata 4.44.19, सव्यसाचिन् etymology, on मूल word सव्यसाचिन्), plus page 408's १ and २ (bare citation pointers — गी. २-६ and गी. २-३७ — marking राॕ's own direct quotations of those two earlier Gītā verses within his commentary); this is the first verse where the **same digit ("२") appears twice within one verse's footnote set**, referring to two entirely different citations (page 407's २ vs. page 408's २) — flagged as a new pattern, trace-by-position remains essential; 11.34 has no new DEFS terms, 6 commentary sentences (sparse — mostly a pūrvapakṣa/rhetorical-objection frame rather than word glosses, so bolding is light: only the closing lemma-citation "द्रोणं" before "इति" is bolded, per the standard lemma-citation exception; the nominative name-introductions "द्रोणः," "भीष्मः," "कर्णः" earlier in the same commentary are NOT bolded since they don't exact-match मूल's accusative "द्रोणं," "भीष्मं," "कर्णं"), and one footnote (३, Mahābhārata Droṇa-parva १३६/११२ — the boon behind Jayadratha's father's curse, explaining "पितुर्वरेण," shared from page 408's list with 11.33's १ and २); **11.35** — speaker changes to `सञ्जय उवाच` (Sañjaya resumes narrating after Kṛṣṇa's speech, confirming the resume-pointer's watch-flag), 3 commentary sentences + 1 footnote (१, Bhāgavata ४/४४/१७ — Arjuna's own words explaining the name किरीटी, on मूल word किरीटी), no new DEFS terms; **11.36** — speaker changes to `अर्जुन उवाच` (Arjuna begins his hymn of praise, continuing unchanged through 11.43), 7 commentary sentences + 1 footnote (२, Śabdanirṇaya citation via भा.ता. ३/३२/१२, on मूल word हृषीकेश), new DEFS term `hṛṣīkeśa`; **11.37** — no speaker change, 15 commentary sentences (dense — a महात्मन्/ब्रह्मन् vigraha analysis plus several etymological glosses) + 1 footnote (३, विष्णुसहस्रनाम "अनन्तो हुतभुग्भोक्ता," on मूल word अनन्त), reuses the existing `ananta` DEFS entry, one sandhi-split bold edge case flagged (ब्रह्मणश्चतुर्मुखस्याप्यादिकर्त्रे, where राॕ's inserted gloss "चतुर्मुखस्य" splits the मूल citation into two non-adjacent bolded spans); **11.38** — 11 commentary sentences (a पौनरुक्त्य/redundancy objection-and-answer re: 11.16's "नान्तं पश्यामि," with a Bhāva note added) + 1 footnote (१, विष्णुसहस्रनाम "आदिदेवः पुरन्दरः," on मूल word आदिदेवः), new DEFS term `ādideva`; **11.39** — 7 commentary sentences + 1 footnote (१, विष्णुसहस्रनाम "नियमो यमः," tentatively attached to राॕ's word "यमः" — **placement not visually confirmed**, see Resume Pointer flag), an OCR error caught and corrected (मूल "अशिः" → "अग्निः," confirmed via PDF render), no new DEFS terms; **11.40** — 9 commentary sentences + **three** footnotes spanning two pages (२ and ३ from page 411's list, on मूल words अमितविक्रम and सर्वः respectively; १ from page 412's own reset list, on राॕ's own citation "सर्वं खल्विदं ब्रह्म" mid-commentary), with a Bhāva note on the doctrinal सर्व-शब्द point (Hari as indweller/controller, not literal identity with the world), new DEFS term `amitavikrama` — **one footnote on page 412 (२, "सर्वः शर्वः शिवः स्थाणुः") could not be located anywhere in राॕ's own text despite thorough zooming and was left out, flagged for curator spot-check** (see Resume Pointer); **11.41** — no speaker change (अर्जुन उवाच continues), 9 राॕ commentary sentences + 1 footnote (३, शब्दनिर्णय + बृ.भा.(६) citation glossing मूल word अजानता — OCR/transcription error corrected: 'कचित्' → 'क्वचित्' throughout, per curator), no new DEFS terms; राॕ's commentary closes with a bare `॥` (no ४१), confirmed against the PDF as a genuine print omission, same pattern as 11.14/11.23; **11.42** — 12 commentary sentences (a grammatical excursus deriving एक from ए + क) + 3 footnotes (१ on मूल विहारशय्यासनभोजनेषु, २ on मूल एकः, ३ on मूल अप्रमेयम्, all sharing page 413's footnote list), reuses existing DEFS `hṛṣīkeśa`; **11.43** — 6 commentary sentences + 1 footnote (४, विष्णुसहस्रनाम 'गुरुर्गुरुतमो धामः', on राॕ's citation of गुरुः), new DEFS term `guru`; मूल words **गरीयान्** and **गुरुः** both bolded together — curator confirmed राॕ is showing अन्वयः (grammatical construal linking the two मूल words), not one glossing the other as a synonym; **11.44 — confirmed to have NO 〔वि॑ commentary at all in the print** (verified directly against the PDF, not an extraction gap) — 8 राॕ commentary sentences, no footnote, no new DEFS terms; commentary opens 'यस्मादुक्तमहामहिमा तस्मात्' ("because [Your] great glory has already been stated") — corrected from an initial misreading 'यस्मादुत्तमहामहिमा' ("of supreme great glory"), a single-akṣara उत्त/उक्त confusion, per curator; **11.45** — 8 commentary sentences + 1 footnote (१, भा.ता.(४/८/३८), on मूल प्रसीद, explaining why Arjuna still asks grace though already dear to the Lord), no new DEFS terms. **Drafting-stage error caught and corrected before writing (2026-09-20): a first draft of 41–45 mistakenly included 〔वि॑ (Vidyādhirāja Tīrtha's) commentary lines alongside 〔रा॑, in direct contradiction of this file's own always-रा-only rule — caught by the curator before anything was written to HTML; verses 1–40 were confirmed clean (zero 〔वि॑ occurrences) and the redrafted 41–45 batch is रा-only, as committed. See History items (23)–(24).** **11.46** — no speaker change (अर्जुन उवाच), 5 राॕ commentary sentences, no footnote, no new DEFS; one Bhāva (विश्व read as पूर्ण in "विश्वमूर्ते गुणपूर्णविग्रह"); **11.47** — speaker changes to `श्रीभगवानुवाच` (Kṛṣṇa resumes), 16 commentary sentences + 1 footnote (२, विष्णुसहस्रनाम "विश्वं विष्णुर्वषट्कारः", on मूल word विश्वम् — OCR's "वपट्कारः" corrected to वषट्कारः against the PDF; mark confirmed a digit at 14× zoom), reuses `ananta`; OCR's "आयम्" corrected to आद्यम्; closing sentence (परत्वधीसत्वात्) re-translated more clearly at curator request, with a Bhāva; **11.48** — no speaker change, 10 commentary sentences + 1 footnote (२, Kaṭha citation 'नायमात्मा प्रवचनेन…' as numbered in print "कठ. (२/६/९)", on the मूल line's opening word न — mark confirmed a digit at 14×, not the apostrophe the OCR shows; kept per the मूल-line precedent but flagged, same situation as the skipped 11.31 footnote); **11.49** — 11 commentary sentences, no footnote; sandhi-bolding edge cases (ईदृग्|ईदृशम् split at the boundary; प्रीतमनाश्च bolded whole, following 11.45's हृषितोऽस्मि); bare particle मा bolded at both occurrences under open flag (4); **11.50** — speaker changes to `सञ्जय उवाच`, 10 commentary sentences spanning the PDF page 416→417 break (verified on 417 top), Bhāvas at sentences 2, 3, 6; the page-415 footnote १ (ब्रह्माण्डवचनम्, on a quotation inside the 〔वि॑ block of 11.47) and page-416 footnote १ (गी.ता. उदाहृतप्रमाणवचनम्, on a 〔वि॑ quotation under 11.50) were correctly skipped as 〔वि॑-only; **11.51** — speaker changes to `अर्जुन उवाच`, 11 commentary sentences, no footnote; **11.52** — speaker changes to `श्रीभगवानुवाच`, 8 commentary sentences, no footnote, closing Bhāva (देवानामप्यपेक्षितत्वात्…); **11.53** — no speaker change, 3 commentary sentences, no footnote; **11.54** — 2 footnotes (१ on the मूल word त्वनन्यया, भा.ता. ३/२६/२२; ३ on रा's "भक्त्येति", म.भा.ता.नि. १/८५, followed by an unnumbered न्यायसुधा continuation line) — the print's footnote २ is 〔वि॑-only (तैत्तिरीय) and skipped, so numerals run १, ३ as printed; new DEFS `sāyujya`; **11.55** — 6 commentary sentences + the chapter colophon entry "॥ इति श्रीमद्गीतार्थसङ्ग्रहे श्रीराघवेन्द्रयतिकृते एकादशोऽध्यायः ॥" (Ch. X precedent); the Gītā's own colophon ("इति श्रीमद्भगवद्गीतायामेकादशोऽध्यायः") is not included. |
| Ch. XII: 1–5 | ✅ proofread | `CHAPTERS[12]` created (nameDev `भक्तियोगः` + chapter footnote १ citing गी.भा. and गी.ता. on the heading; chapter-selector option added); **12.1** — speaker `अर्जुन उवाच`, 15 commentary sentences + 1 verse footnote (१, तै.आ. ३-१२-७, on रा's quotation 'तमेवं विद्वान्'; mark confirmed a digit at 12×); **12.2** — speaker `श्रीभगवानुवाच`, 8 sentences, no footnote; **12.3** — 16 sentences, no footnote (page-422 footnotes १–३ are 〔वि॑-only); **12.4** — 10 sentences with a Bhāva (verse 3's verb carried over), no footnote; **12.5** — 11 sentences + 1 footnote (१, प्रवृत्तसंहिता verse via भा.ता. ११/५/१०) sitting on the मूल line after अव्यक्तासक्तचेतसाम्, kept on the 11.3/11.42/11.48 precedent; new DEFS `avyakta`, `kūṭastha`. Page-420 footnotes २–५ and page-424 footnote १ are 〔वि॑-only and were skipped. |
| Ch. XII: 6–20 | ✅ proofread (Sanskrit by curator, English approved) | **First chapter done with the Sanskrit-first cycle.** The curator proofread a Sanskrit-only Word sheet (`proofing/ch12_blockA_proofing.docx`, one block of 15 verses / 131 रा sentences) in Google Docs *Suggesting* mode (returned as `proofing/ch12_blockA_proofing_corrected.docx`); the only wording change was 12.6's `समर्प्येति` (my OCR-based `समर्प्यैति` was replaced — curator: "final"), plus the curator's own addition to the 12.13 footnote (first line of the Gāyatrī/maitra verse, closing `॥`), plus **~29 bold changes** (e.g. all 12.7 pratīkas bolded; `दक्षः`/`उदासीनः` at 12.16; `समः`/`सङ्गविवर्जितः` at 12.18; `तुल्यनिन्दास्तुतिः` at 12.19; bold inside sandhi-fused words like `अथे|त्यर्थान्तरे`, `भवामी|त्यर्थः`, `कुर्वि|त्यर्थः`, `स चे|त्यत्र`). **The curator's bold = the print's bold, reproduced exactly (he confirmed with page images that the print does bold these; my zoom-based readings were wrong where the page is dark/heavy).** English drafted by Claude, reviewed (full Sanskrit+English review file with ⚑ flags), approved as presented ("all good"). Footnotes (printed numerals kept): 12.6 ² (ब्र.सू. ३-३-५७, on रा's `ॐ…ॐ` quote); 12.12 ² (व्योमसंहिता via भा.ता. ३/१०/१५, on मूल word ज्ञानाद्ध्यानं); 12.13 ² (Gāyatrī-japa/maitra, on मूल word मैत्रः); 12.16 ¹ (पदरत्नावली १/२०/१, on रा's `अनपेक्षो`); 12.17 ³ (पा.सू. ३-३-१३५, on the `नानद्यतनवत्…` quote); 12.20 ² (भक्तिविवेक via भा.ता. ११/२४/२४, on `स च मे प्रियः`). 〔वि〕-only footnotes skipped (p.378 १, p.379 १, p.380 १, p.382 १, p.383 १, p.384 १, p.385 २, p.386 १, p.387 १). New DEFS: `abhyāsa-yoga`, `pratyāhāra`, `harṣa`, `amarṣa`, `udvega`. Curator-approved readings of hard रा lines are listed in History (29). |

**Last completed:** 12.20 (Chapter XII complete)  
**Next to add:** 13.1 (Chapter XIII, Kṣetrakṣetrajñavibhāga-Yogaḥ)

### Resume Pointer (update every session)

| Field | Value |
|-------|-------|
| Next śhloka | **13.1** (Chapter XIII opens with the Arjuna-uvāca verse "प्रकृतिं पुरुषं चैव क्षेत्रं क्षेत्रज्ञमेव च" — check in the print whether it carries its own `॥१॥`/number and whether the standard numbering shifts; speaker `अर्जुन उवाच`, then `श्रीभगवानुवाच` later) |
| Chapter XII status | **COMPLETE** — `CHAPTERS[12]` has verses 1–20; 12.20's last commentary entries are the footnote entry then the chapter colophon. Chapter XIII must start a new `CHAPTERS[13]` (number 'XIII', romanNum 13, nameDev `क्षेत्रक्षेत्रज्ञविभागयोगः`, nameEn `Kṣetrakṣetrajña-vibhāga Yoga · …` from the Authentic Chapter Names table only), and add the chapter-selector option `<option value="13">XIII</option>`. Use the **Sanskrit-first Proofreading Cycle** below. |
| PDF page for 13.1 | PDF page 434 (Sanskrit ३८८) — Chapter XIII heading `त्रयोदशोऽध्यायः` then `अर्जुन उवाच`, right after 12.20's colophon on PDF 433. Page-offset formula: Sanskrit page + 46. |
| OCR anchor | 13.1 opens "प्रकृतिं पुरुषं चैव क्षेत्रं क्षेत्रज्ञमेव च । एतद्वेदितुमिच्छामि ज्ञानं ज्ञेयं च केशव" — grep "प्रकृतिं पुरुषं चैव"; OCR marker `*[p. 434]*`. |
| Outstanding | **Two open flags carried from 11.15, still not resolved by curator — don't block resuming:** (1) footnote "१. पाद्मवचनम् — गी.ता." placement uncertainty at PDF page 399. (2) Judgment call on bolding `अर्जुन उवाच` as a speaker-heading citation at 11.15. **Flags from 11.16–11.24 (open, non-blocking):** (3) 11.16's two-footnote-on-one-verse structure. (4) Bolding bare exact-form particles/pronouns (न, मे, हि, तथा, अहम्) — a recurring pattern since 11.16, not resolved as a blanket policy either way. (5) 11.20's sentence 4 is the densest single bolded sentence yet (4 bold spans). (6) 11.20's "उग्रमिव"/"तूग्रमेव" left unbolded — sandhi merges the मूल word into a following particle with no clean akṣara boundary for a bold span, a new edge case. (7) 11.20's "लोकत्रयपदेन"/"लोकत्रयस्थ" left unbolded under the current strict rule, though 11.9's `महायोगेश्वरत्वं` was bolded in an analogous-looking situation before the rule was sharpened — flagged rather than resolved unilaterally. (8) 11.27's three open judgment calls (ते double-gloss reading, dropped-उपसर्ग non-bolding of दृश्यन्ते, footnote superscript position) — curator approved the draft as presented without further resolving these; revisit if they recur or a cleaner precedent emerges. (9) 11.31's footnote "१" (ऐतरेय ११/२/३ citation, on मूल word "को") was judged 〔वि॑-only and skipped — it sits on the मूल line itself rather than inside either commentary block, unlike prior skipped footnotes which sat inside an explicit (वि) block; curator flagged for a possible spot-check, not yet revisited. (10) 11.32's footnote "२" transcription (the Mahābhārata Sauptika-parva verse naming the war's ten survivors) is a best-effort reading of a dense block of proper names from the rendered PDF page — curator asked to spot-check it against the print when convenient; not yet confirmed. **(11) 11.32's footnote "१"** (added retroactively this session, the Kāla/Janārdana-epithet citation set) — best-effort transcription and translation of three bundled sub-citations (Bhāratatātparya, Bhāratatātparya 11.3.8, Mahāvārāha per Gītā Tātparya); curator spot-check requested, same as (10). **(12) 11.33's footnotes १ and २ (page 408 list)** are bare citation pointers ("गी. २-६," "गी. २-३७") with almost no content of their own — included as footnotes for consistency with the project's always-footnote convention, but flagged as a judgment call: these could arguably be inlined into the translation instead of given full footnote treatment, since they're just chapter-verse references, not independent explanatory citations like every other footnote so far. Revisit if a cleaner pattern is wanted. **(13) 11.33 is the first verse where the same digit ("२") appears twice** in one verse's footnote set (page 407's २ and page 408's २ are unrelated citations) — handled per the standing "trace by position, not digit" rule, but flagged as a new, more visually confusable case than the previous cross-verse resets. **(14) 11.39's footnote "१"** ("नियमो यमः," विष्णुसहस्रनाम) — **RESOLVED, curator-confirmed correct (2026-09-20):** attached to राॕ's commentary word "यमः" in "<b>यमः</b> दोषोपरतिमान्," exactly as tentatively drafted. No longer an open flag. **(15) 11.40's footnote "सर्वः शर्वः शिवः स्थाणुः"** (page 412's own footnote "२") — **RESOLVED, curator-corrected (2026-09-20):** the mark Claude read as a stray opening quotation mark before "सर्वोऽसि" (in राॕ's sentence "यतः ततः सर्वोऽसि") was in fact this footnote's own superscript "२," not punctuation — Claude's zoom-based judgment was wrong, and the footnote had been left out of the HTML entirely on the mistaken assumption it was वि-only. Fixed: the apostrophe is removed, the genuine `<sup>२</sup>` is now attached right after "सर्वोऽसि," and the footnote text is included as the last entry of 11.40 (now carrying the ॥४०॥ marker). Separately, page 412's footnote "१" (छां ३-१४-१) also needed its own in-text marker added — it had been appended as a footnote entry but the corresponding `<sup>१</sup>` was missing from its actual citation point (राॕ's own quote "सर्वं खल्विदं ब्रह्म" in commentary sentence 4); this is now fixed too. 11.40 keeps all four footnotes (page 411's २/३ on the मूल line, page 412's १/२ in the commentary), citation-ordered dev-before-skt as usual. **Standing lesson: when a zoomed image is ambiguous between a footnote digit and a punctuation mark, and the curator has the physical book or clearer photos on hand, ask for a spot-check rather than defaulting to exclusion — excluding a real footnote is exactly as much an error as fabricating one.** **(16) 11.39's मूल OCR error** — "अशिः" should read "अग्निः" (अशिः is not a real word; अग्निर्वरुणः confirmed clearly in the PDF render) — corrected before writing, noted here only as a reminder that this book's OCR keeps producing this kind of single-akṣara corruption. **(17) Confirmed at 11.44: not every verse necessarily carries a 〔वि॑ commentary in the print** — 11.44 has 〔रा॑ only, verified directly against the PDF (not an extraction gap). Worth remembering when auditing for missing content — absence of 〔वि॑ on a given verse is normal, not a sign something was dropped. **(18) RESOLVED — process lapse, 11.41–11.45 drafting (2026-09-20):** a first draft briefly included 〔वि॑ (Vidyādhirāja Tīrtha's) commentary in violation of this file's own always-रा-only rule (see "Session Workflow" step 1 and "Key source note"); caught by the curator before any write, corrected to रा-only. See History (23)–(24) for the full account, including three further curator corrections (11.41 footnote ३'s कचित्→क्वचित्; 11.43's गुणान्तरोत्त्या→गुणान्तरोक्त्या and the गरीयान्/गुरुः dual-bolding call; 11.44's यस्मादुत्तमहामहिमा→यस्मादुक्तमहामहिमा). No longer open — flagged here only so a future session doesn't need to dig through the History log to find why this rule is emphasized. **(19) 11.48's footnote २** (Kaṭha citation) sits on the मूल line and राॕ never cites it — kept on the 11.3/11.42 precedent; same situation as 11.31's footnote (9), which was skipped. Curator may wish to settle one policy for मूल-line footnotes that राॕ doesn't reference. **(20) Validation found two pre-existing missing DEFS keys** — `T('yogin')` (Ch. X–XI early verses) and `T('kirīṭin')` (11.35) are called but have no entries in `DEFS`; not introduced by the 11.46–11.50 batch; add entries or remove the wrappers when convenient (curator decision). **(21) 11.51–11.55 (written 2026-10-11, draft approved first):** judgment calls to revisit if the curator wishes — (a) 11.52 sentences 5–7: translation of "तेऽपि यद्दृष्टवन्तस्तदिदं सुदुर्दर्शम्" and "सुखेन / सुखेन दुःखेन च" is literal and uncertain (reads su-/dur- of सुदुर्दर्शम् as "easy"/"difficult"); (b) 11.54 footnote ३ "सृदृढः" is kept as printed (verified at 10–12× zoom; probably a misprint for सुदृढः); (c) 11.54 footnote ३ is followed by an unnumbered continuation (परमेश्वरभक्तिर्नाम… - न्यायसुधा) kept as a separate entry; footnote numerals run १, ३ as printed because २ is 〔वि॑-only; (d) 11.54 `तु`शब्दः bolded `<b>तु</b>शब्दः` under open flag (4); (e) the Gītā's own chapter colophon omitted (Ch. X precedent); (f) DEFS `sāyujya` added. The two pre-existing missing DEFS keys in (20) (`yogin`, `kirīṭin`) are still missing. Ch. XI 1–55 fully written and proofread; Chapter XI is complete. **(22) 12.1–12.5 curator decisions (2026-10-17) — now standing rules:** (a) **Repeated words are bolded only where the print bolds them** — bold a मूल word the first time the commentary cites it; later explanatory repeats (a second एवं, a second नित्ययुक्ताः, a later restatement in a gloss or an अन्वयः sentence) stay plain unless the print bolds that occurrence. Where the print does not bold a repeat, do not bold it. (b) **Sandhi-fused runs: bold the whole fused run** (the print does the same) when a मूल word cannot be split off cleanly — e.g. अक्षरमविनाशि, गुणबाहुल्यादचिन्त्यम्, स्वपदादभ्रष्टत्वादचलम्, जगदुपादानप्रकृत्यभिमानित्वाच्चाव्यक्तनामकं, येऽपि चाक्षरनामकमव्यक्तं, गतिशब्दो. This supersedes the earlier "leave unbolded" handling (11.20 etc. are not retro-edited unless the curator asks). (c) Print misprints are **corrected** where the curator says so: 12.1 "भत्त्यादि"→भक्त्यादि; but "सुष्ट्वाचारं" (12.5) stays as printed. (d) **मूल-line footnotes that रा does not cite are kept** (12.5's १ on अव्यक्तासक्तचेतसाम्) — this settles flag (19) in favour of keeping them, per the 11.3/11.42/11.48 precedent. (e) 12.1 sentences 4–6 ("न च … शङ्क्यम्") translated as one thought across three sentences; साप्तमिकन्याय read as 7.23 "अन्तवत् तु फलं तेषाम्". (f) 12.4's Bhāva (verse 3's verb "paryupāsate" carried over, "te" picking it up) was approved. (g) **Chapter titles come only from the Authentic Chapter Names table** — never invent or infer a title. (h) Footnote १ at 12.5 translated with याज्याः left as "yājyas". Chapter XII 12.1–12.5 written and proofread. |

**Correction found at 11.5 (worth knowing going forward):** the previous resume pointer guessed 11.5 "spans four mūla lines" based on the commentary's word `चतुष्टयेन`. On reading the source directly, this was wrong — 11.5 is a normal 2-line verse like 1–4. `चतुष्टयेन` ("by the group of four") refers to verses 5–8 collectively (each contains an imperative "paśya"), not extra lines within verse 5. Don't assume a verse has a non-standard line count from a stray commentary word like this without checking the actual mūla in the OCR/PDF first.

**Correction found at the 11.25 resume pointer itself (2026-09-13):** the pointer written at the end of the 11.24 session had a skipped-verse error — it labeled `अमी च त्वा धृतराष्ट्रस्य पुत्राः...` (PDF pages 403–404) as "11.25," but that text is actually **11.26** (it carries the print's own `॥ २६ ॥` marker, matching standard BG numbering). The real 11.25 — `दंष्ट्राकरालानि च ते मुखानि... दिशो न जाने न लभे च शर्म...` (PDF page 403, right before the mislabeled anchor) — had never actually been written; confirmed by checking `gita_vivrutti.html` directly, which stopped at verse 24. Caught before drafting anything, by cross-checking the OCR's own verse-number markers and the standard Gītā numbering rather than trusting the prior pointer's anchor text at face value. Going forward: always confirm a resume pointer's stated anchor actually carries the expected verse number in the source, don't just locate matching words nearby. **11.25 itself has since been drafted, curator-approved, and written to `gita_vivrutti.html`** — this correction note is kept for the record, not as an open item.

**Pratīka-bolding — firm standing requirement (reconfirmed by curator at 11.7):** always bold every mūla word that is echoed or glossed in the 〔रा〕 commentary, densely and consistently, matching the style already established at 10.21 and 11.3/11.4 — this is the ORIGINAL rule from the "Session Workflow" section above ("infer pratīkas by matching the mūla words being glossed"), and it stands regardless of whether the OCR carries `**bold**` markers or whether the print itself visibly shows bold at a given zoom level. A brief deviation happened at 11.5/11.6/11.7 during this session, where actual print-bold was visually verified from the PDF and used as the sole basis for bolding — this produced 11.6 and 11.7 with little-to-no bold, and a sparser 11.5 than 11.3/11.4. The curator caught this and asked for it to be corrected and made an explicit going-forward requirement: 11.6 and 11.7 have been re-bolded densely (every mūla word matched, following the sandhi-split conventions in "Strict Rules — Never Violate" below) and the HTML/CLAUDE.md updated accordingly. **Do not repeat the print-verification-only approach** — PDF rendering is still mandatory for verifying the Sanskrit text itself and catching OCR errors, but pratīka bolding should be inferred by matching mūla words, not gated on visually spotting bold ink.

**Exception — vigraha (compound analysis) is not a citation (confirmed at 11.9, sharpened at 11.10–11.15):** when the commentary analyzes a mūla *compound* word by breaking it into separate case-inflected constituents (a vigraha), the individual analytical words are the commentator's own grammar, not a verbatim quote of the mūla — do not bold them even though they relate to a mūla word. Example: mūla has the single compound `महायोगेश्वरः`; the commentary's vigraha reads `महतां योगानाम्...अनन्तशक्तीनां वेश्वरः` — only `वेश्वरः` (which directly corresponds to the compound's own `ईश्वरः` member, a real mūla constituent) is bolded; `महतां` and `योगानाम्` (genitive-plural forms found nowhere as such in the mūla) are left unbolded. This follows the same logic as the 11.8 "त्वनेन" case (an unbolded commentary connective that doesn't cleanly match a मूल word).

**REFINED at 11.10–11.15 — the exception is broader than "genitive analysis," it's "any re-inflection":** the curator caught that a *standard* bahuvrīhi/samāsa vigraha — one that reuses the compound's own roots, not different words — was still being bolded in error (11.10: `अनेकानि वक्त्राणि नयनानि यस्य तत्` for मूल `अनेकवक्त्रनयनम्`; 11.15: `कमलासने...स्थितम्` for मूल `कमलासनस्थम्`). The corrected, general rule: **bold marks an exact word-form match to the मूल — same stem, same case, same number** (sandhi-driven spelling changes are fine; grammatical re-inflection to make a vigraha sentence work is not), regardless of whether the vigraha reuses the compound's own roots or introduces different ones. Two bolding patterns remain valid and are NOT vigraha:
1. **Lemma-citation** — a bare word or the verse's opening word cited before "इति" to mark which मूल word/verse is being glossed (e.g. `<b>अनेक</b>शब्दः अनन्तवाची` — "the word aneka means..."; `<b>एवम्</b>इति` at 11.9; `<b>अनेके</b>ति` at 11.10). This is citing the word itself, not analyzing it.
2. **Compound restated verbatim after "इति," closing a vigraha** — e.g. 11.10's `यस्मिन्नि<b>त्यनेकाद्भुतदर्शनं</b>` and 11.11's `तद्<b>विश्वतोमुखम्</b>`: the vigraha's middle portion (the analytical decomposition) stays unbolded, but where it concludes by naming the compound itself again (in the same neuter nom=acc spelling as मूल, a genuine exact-form match, not a re-inflection), that closing restatement is bolded.
When two exact-form मूल words simply sit adjacent in the commentary (not vigraha-transformed, just repositioned near each other for clarity — e.g. 11.13's जगत्+एकस्थम् → `<b>जगदेकस्थम्</b>`, or तदा+अपश्यत् → `<b>तदाऽपश्यत्</b>`), bold the whole sandhi-joined span as one citation, matching the existing चक्षुर्ददामि-style convention (see "Strict Rules" below).

**Page-offset formula:** PDF page = Sanskrit page + 46 (e.g. Sanskrit ३४१ = PDF 387; Sanskrit ३४७ = PDF 393; Sanskrit ३४८ = PDF 394; Sanskrit ३४९ = PDF 395). Render with PyMuPDF (see workflow below).

**Chapters I–IX and XIII–XVIII:** pending.

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
5. **Drafts the full proposed entry** (mūla table + commentary lines with Bhāva + new DEFS) in chat and **waits for approval** ("write to HTML" / "go ahead"). Revise-and-reshow on any correction. **This is the single most important step in this whole workflow — see the "⚠️ THE ONE RULE THAT MUST NEVER BE BROKEN" section at the very top of this file.** An instruction like "continue with N and M" authorizes this step only (research + draft), never step 6 — approval must be given in response to a draft actually shown, every single time, with no exception for an established rhythm or a prior "continue."
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

**Key source note:** The OCR file contains both Vidyādhirāja Tīrtha's (〔वि〕) and Rāghavendra Tīrtha's (〔रा〕) commentaries — two distinct commentators whose texts are printed interleaved on the same pages (never confuse 〔वि〕 with Madhvācārya's separate Gītā Bhāṣya, which is not in this source at all). **This project transcribes ONLY 〔रा〕 into the HTML — Śrī Rāghavendra Tīrtha's गीता विवृत्तिः is the entire point of this deliverable.** The 〔वि〕 sections are ignored entirely, in every field, always — including when rendering a PDF page for verification purposes shows both (वि) and (रा) labeled blocks together: reading 〔वि〕 text during verification is normal and expected, but no 〔वि〕 material — no lines, no sentences, no footnotes — may appear in a draft or in the HTML, ever. **This rule was briefly violated at the 11.41–11.45 drafting stage (2026-09-20) despite already being stated here — see History item (23) — so treat this note as more than boilerplate: actively re-check every draft against it before presenting.**

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

## Sanskrit-first Proofreading Cycle (standing workflow from 12.6 onward; agreed 2026-10-17, first used for 12.6–12.20)

**Why:** the curator's real bottleneck is checking the Sanskrit; the English translation has been consistently accepted. So the Sanskrit is proofread first, in bulk, by the curator; the English is built afterwards from his corrected Sanskrit. Per chapter:

1. **Extract + verify (Claude).** Take the मूल + 〔रा〕 text + footnotes from the OCR; render and read EVERY page against the PDF image (4.5× top/bottom split; zoom only contested spellings). Skip 〔वि〕 entirely (including footnotes that sit on 〔वि〕 text). Mark every OCR-vs-print disagreement and every uncertain bold in the sheet's per-verse "Notes".
2. **Proofing sheet (Claude → curator).** One Word `.docx` per block of 10–15 verses (a whole short chapter may be one block), saved in `sub-projects/gita-vivrutti/proofing/` as `chNN_blockX_proofing.docx` with a JSON sidecar `chNN_blockX_proofing_original.json` (my original text with `**bold**` and `{^n}` footnote marks). Layout: verse heading + print pages; मूल lines (bold); रा sentences, ONE per daṇḍa-delimited sentence, each prefixed by a grey ID `[12.6.s3]` (the curator must not delete IDs); bold runs = print bold; raised Devanagari numerals = footnote marks; footnotes listed with the word they attach to; English "Notes" under each verse. Font Nirmala UI. Verse numbers (॥N॥) are not part of the sentences. Reference scripts: `proofing/tools/ch12_build_proofing_docx.py` (+ `ch12_proofing_data.py`, `ch12_proofing_notes_en.py`).
3. **Curator proofreads** in Google Docs (*Suggesting* mode) or Word (Track Changes) and saves e.g. `chNN_blockX_proofing_corrected.docx` beside the original. Comments from him inside the sheet are for reference only — never copied into the data (e.g. 12.13's "dont include this anywhere").
4. **Read the corrections (Claude).** Stage the corrected `.docx` and run `proofing/tools/diff_proofing_docx.py corrected.docx original.json final.json`. Google Docs exports text suggestions as `w:ins`/`w:del` and bold suggestions as `w:rPrChange`. The script rebuilds the ORIGINAL by rejecting all changes and checks it equals the sidecar (this proves there are no untracked edits), then rebuilds the FINAL per sentence ID and prints every changed sentence. Confirm to the curator that all changes were visible, listing text changes, footnote edits and counts of bold changes. Normalise stray spaces; a typed ASCII `|` before `।` means `॥`.
5. **English draft (Claude).** Generate `CHAPTERS[N]` verse entries from the FINAL Sanskrit + English translations (reference: `ch12_english_tr.py` holds the English, `ch12_gen_js.py` builds the JS, `validate_chapters.py` checks it). Splice into a **draft copy** of the HTML with a distinct file name (never over the repo file), add DEFS, validate (Node eval of `DEFS`/`CHAPTERS` with a `global.T` stub and key check; headless Chromium load of every verse). Present for approval via a Sanskrit+English review file (`chNN_a_b_English_draft.md`) with ⚑ on the lines Claude is least sure of, plus a short list of judgement calls. **Only uncertain English lines need his review** (he has said the English is good); in the first chapter a ~1-in-10 spot-check was also offered.
6. **Approve → write → record.** On his explicit approval: copy the draft to the final name, verified-write to the repo (new distinct name in `/mnt/user-data/outputs/`, `device_commit_files` force:true, re-stage, `cmp`), update both CLAUDE.md files, and give the git commands (add → commit → `git pull --rebase` → push).

**Rules that this workflow settled:**
- **Bold = exactly what the print shows, as established by the curator's proofread sheet.** Where a proofread sheet exists it overrides my own pratīka inference and my own zoom readings (heavy/dark pages such as PDF 427 hide the bold contrast). This includes partial-word bold inside a sandhi-fused word (`<b>भवामी</b>त्यर्थः`, `<b>कुर्वि</b>त्यर्थः`, `<b>अथे</b>त्यर्थान्तरे`, `<b>स चे</b>त्यत्र`) and bold on sandhi syllables only (`लोका<b>…</b>`). Adjacent bold words separated by a plain space are merged into one `<b>`; a trailing space inside a bold run is moved outside.
- **Footnote numerals are kept as printed** (they reset per page; 12.12/12.13/12.20 use ², 12.16 ¹, 12.17 ³), placed on the attachment word exactly as before; footnote text goes last (dev-line citations first); the chapter colophon is the final entry of the chapter's last verse.
- Last sentence of a verse ends `॥N॥` instead of `।`; sentences otherwise end with `।`.
- OCR habits seen in 12.6–12.20: damaged print type makes `ष` look like `प` (तेपामहं, हर्पामर्ष, विपयेभ्य, रोपः, वैपयिक) — read as `ष`; `क्त्य` can print like `त्त्य` — read from the sense; OCR colons for visargas (`निर्मम:`); line-break splits (`अविद्य / मानात्म`, `अ / वैष्णव`) — join and flag for the curator; stray quotation marks and digits next to citations; closing quotes dropped.
- Everything the curator corrected stays authoritative; do not re-open his corrections later.

---

## How to Resume (New Session)

**Paste this exact prompt to start the next session (continuing Chapter XI):**

```
Resume the Gītā Vivṛtti project. Read CLAUDE.md fully, then read gita_vivrutti.html
to see the current DEFS dictionary and verse-data structure. Chapters X and XI are complete
and proofread, and Chapter XII is complete (12.1–12.20). Continue at Chapter XIII (śhloka 13.1)
using the Sanskrit-first Proofreading Cycle (see that section of CLAUDE.md): extract the mūla + 〔रा॑ commentary + footnotes from
BG_Vyakhyas_Vidyadhiraja_Raghavendra_OCR.md, render and verify against the source PDF
page, build the Sanskrit-only proofing sheet for me to proofread in blocks of 10–15 verses, then draft the English for my approval (one commentary object per Sanskrit sentence,
matching Ch. X granularity, with every mūla word echoed in the commentary densely
bolded as a pratīka — bold only an exact word-form match to the mūla, never a vigraha
re-inflection, per the refined standing rule under "Current Status"), then write to
HTML on my go-ahead. IMPORTANT — reconfirmed 2026-09-20 after a real lapse: transcribe
〔रा॑ (Rāghavendra Tīrtha's गीता विवृत्तिः) ONLY — never 〔वि॑ (Vidyādhirāja Tīrtha's
separate commentary, printed interleaved in the same source). Seeing both labeled
blocks while rendering a PDF page for verification is normal; including any 〔वि॑
material in the draft or HTML is not — see "Key source note" and History (23)-(24).
Note: at 11.32 a (वि) block was found to silently continue across a page break with no
OCR cue — always confirm which side of a page break a (वि)/(रा) heading's scope
actually ends, don't assume a block ends at the page image's edge. Also: a footnote
superscript can look like a stray quotation mark in this print — this has happened at
11.32, 11.39/11.40, and note 11.44 has NO 〔वि॑ commentary at all (confirmed genuine,
not a gap) — always zoom in close on every raised mark near a citation and compare its
shape against a confirmed digit nearby before deciding; don't assume it's punctuation,
but don't force a footnote onto a mark that turns out to be a quote either. 13.1 opens Chapter XIII (title only from the Authentic Chapter Names table): PDF page 434 (Sanskrit ३८८), OCR anchor "प्रकृतिं पुरुषं चैव क्षेत्रं क्षेत्रज्ञमेव च"; speaker अर्जुन उवाच. Standing curator rules: my proofread Sanskrit sheet's bold IS the print's bold — reproduce exactly (including bold inside sandhi-fused words); chapter titles only from the Authentic Chapter Names table; keep printed footnote numerals; skip 〔वि〕-only footnotes. See History (27)-(29). Note 11.55's footnote-numbering and unnumbered-continuation case (History (26)) in case it recurs.
```

Claude should then:
1. Read this file for full context (workflow, strict rules, HTML architecture, Resume Pointer), especially the refined pratīka-bolding rule (exact word-form match, not just root reuse), the always-रा-only scope rule (see "Key source note" — briefly violated once, see History (23)), and the open flags noted in the Resume Pointer table (including the footnote-attribution and footnote-transcription flags from 11.31–11.45).
2. Read `gita_vivrutti.html` to see the exact current DEFS dictionary and verse-data structure, and the existing `CHAPTERS[12]` object (verses 1–5 so far) and `CHAPTERS[11]` as models.
3. Locate 13.1 in the OCR (PDF page 434; it follows Chapter XII's colophon), render and verify every page against the PDF (page-offset formula: Sanskrit page + 46), and run the Sanskrit-first Proofreading Cycle — रा-only. Watch for (वि) blocks continuing silently across a page break, as happened at 11.32, and for footnote superscripts that look like stray quotation marks, as happened at 11.32, 11.39, and 11.40. Watch for speaker changes.

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
- **Repeats:** bold a मूल word the first time the commentary cites it; later repeats in explanatory/gloss/अन्वयः text stay plain unless the print bolds that occurrence (curator rule, 12.1–12.5).
- **Sandhi-fused runs:** when a मूल word is fused by sandhi with a non-मूल word and cannot be split cleanly, bold the whole fused run, as the print does (curator rule, 12.1–12.5).

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

## Authentic Chapter Names (curator-supplied — use these, nothing else)

The curator supplied this list on 2026-10-17 as the **authentic chapter names, verified against Madhva / Dvaita texts**. The Gītā-Vivṛtti edition itself prints no chapter titles (only "द्वादशोऽध्यायः" etc. and colophons without yoga names), so **never invent or infer a chapter title** — take `nameDev` and `nameEn` from this table. Reproduced exactly as supplied (including its spelling variants):

| Ch. | Name (IAST, as supplied) | Name (Devanāgarī, as supplied) |
|-----|------|------|
| 1 | Arjunaviṣāda yōgaḥ | अर्जुनविषाद योगः |
| 2 | Sāṅkhya yōgaḥ | साङ्ख्य योगः |
| 3 | Karma yōgaḥ | कर्म योगः |
| 4 | Jñāna yōgaḥ | ज्ञान योगः |
| 5 | Karma-Saṁnyāsa yōgaḥ | कर्मसन्न्यास योगः |
| 6 | Samādhi yōgaḥ | समाधि योगः |
| 7 | Jñānavijñāna Yōga | ज्ञानविज्ञान योगः |
| 8 | Akṣarabrahma Yōga | अक्षरब्रह्म योगः |
| 9 | Rājavidyārājaguhya Yōga | राजविद्याराजगुह्य योगः |
| 10 | Vibhūti Yōga | विभूति योगः |
| 11 | Viśvarūpa-darśana Yogaḥ | विश्वरूपदर्शन योगः |
| 12 | Bhakti-Yogaḥ | भक्तियोगः |
| 13 | Kṣetrakṣetrajñavibhāga-Yogaḥ | क्षेत्रक्षेत्रज्ञविभागयोगः |
| 14 | Guṇatrayavibhāga-Yogaḥ | गुणत्रयविभागयोगः |
| 15 | Puruṣottama-Yogaḥ | पुरुषोत्तमयोगः |
| 16 | Daivāsurasampadvibhāga-Yogaḥ | दैवासुरसम्पद्विभागयोगः |
| 17 | Shraddhātrayavibhāga-Yogaḥ | श्रद्धात्रयविभागयोगः |
| 18 | Mokṣasannyāsa-Yogaḥ | मोक्षसन्न्यासयोगः |

**Usage notes:** In the HTML, `nameDev` is written joined, e.g. `भक्तियोगः` (the list prints some names with a space before योगः, e.g. `विभूति योगः`; the already-written X and XI headers `विभूतियोगः` and `विश्वरूपदर्शनयोगः` match the list apart from that spacing and are left as they are). `nameEn` follows the existing pattern "X Yoga · The Yoga of …" using the list's English name, e.g. `Bhakti Yoga · The Yoga of Devotion` for XII. Chapter-selector option text: `XII — Bhakti Yoga`. **When creating a new chapter, also add its `<option value="N">` to `#chapSel`** (the page does not build the chapter list dynamically).

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

- **Chapters I–IX and XIII–XVIII** — to be added (Chapters X, XI and XII are complete)
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

*Last updated: Session through śhloka 12.20 (2026-10-18) — Chapter XI COMPLETE; Chapter XII (Bhakti-Yogaḥ) COMPLETE (12.1–12.20; 12.6–12.20 via the Sanskrit-first Proofreading Cycle). Process refinements, now standing rules (see "Session Workflow" and "Footnotes and Image Citations" sections above):*
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
*(15) At the start of the next session (2026-09-13), caught that this file's own resume pointer had skipped a verse: it labeled 11.26's text ("अमी च त्वा धृतराष्ट्रस्य पुत्राः...") as "11.25." The real 11.25 ("दंष्ट्राकरालानि च ते मुखानि... दिशो न जाने न लभे च शर्म...", PDF page 403 bottom) had never been written. See the "Correction found at the 11.25 resume pointer itself" note under "Current Status" above. Caught before drafting, by checking the OCR's own verse-number markers against the anchor rather than trusting it at face value. 11.25 has since been drafted, approved, and written (no footnote, no new DEFS, one flagged non-bolding judgment call on "न विन्दामि" — see the Ch. XI table row above).*
*(16) 11.26 written (2026-09-13): caught a second OCR error the same session — the commentator marker was printed "(ग)" in the OCR but is clearly "(रा)" on the actual PDF page 404 top. Also resolved the outstanding footnote flag carried in the resume pointer: the Karṇa-सूतपुत्रत्व footnote sits entirely inside the 〔वि〕 block; राॕ's own commentary never references it, so — per the always-skip-〔वि〕 rule and the 11.19 precedent — it does not appear in the HTML.*
*(17) IMPORTANT TOOLING GOTCHA, worth remembering for any session working through a sandboxed/cloud connection to this machine: after writing 11.26, a `device_commit_files`-equivalent write call reported success ("written") but the curator later found 11.26 genuinely absent from `gita_vivrutti.html` on disk — confirmed directly by re-fetching the file fresh from the machine, not by trusting the write tool's own response. The same apparently happened to part of THIS file's own previous update (an earlier version of this very item (16) and the "Next session" line below were written, reported success, but did not actually land — this paragraph is being re-applied for at least the second time as a result). Root cause not confirmed (possibly a caching/staleness issue in the bridge, similar in spirit to the `create_file` stale-cache bug documented in the super-project's own root `CLAUDE.md`). **Standing rule going forward: after any write to a file on this machine via a sandboxed session, re-fetch the file fresh and grep/diff for the actual change before reporting success to the curator or moving on** — a "written" response alone is not sufficient confirmation. 11.26 itself was re-written and this time confirmed present via a fresh re-fetch before proceeding. **Likely root cause identified (2026-09-13), while fixing this same issue on the super-project's root `CLAUDE.md`:** re-committing from the SAME source path in the sandbox's own output area, after editing that path's content in place, can serve stale/cached bytes to the write — a byte-count match is not proof either, since two versions differing only in single digits (e.g. "11.27"→"11.28") can coincidentally have identical total length. The reliable fix: write each revision to a NEW, distinct filename in the sandbox output area before committing (not the same path reused across edits), then diff the re-fetched file against the intended content byte-for-byte, not just compare sizes.*
*(18) IMPORTANT WORKFLOW GOTCHA, 11.28–11.32 batch (2026-09-13): rendering the PDF pages for this batch caught something the OCR gave no cue for — the (वि) commentary block starting on page 406 ("(वि) स्वकीयान् गुणकर्मविशेषान् भगवानुवाच - काल इति...") does not end at the page image's edge; it silently continues onto page 407 ("पूर्णोऽनादिर्वा । लोकान् समाहर्तुं विशेषेण प्रवृत्तः...न भविष्यन्ति ॥३२॥") before राॕ's own commentary begins. An initial OCR-only read of this material had misattributed that carried-over passage to राॕ. Caught only by rendering and reading page 407 top directly and noticing there was no "(रा)" heading introducing it — the "(रा)" heading appears only after the passage ends. **Standing rule going forward: never assume a (वि) or (रा) block's scope ends at a page-image boundary — always render the following page and check whether the heading actually changes before attributing a passage to either commentator.** This is a new, distinct failure mode from the previously-documented OCR letter-drop and word-order-scramble issues (see (13)/(16)) — this one is a structural/attribution error, not a transcription error, and OCR-only drafting would not have caught it. Also this batch: two footnote-attribution judgment calls, one skipped (11.31's "१," ऐतरेय citation, sits under the (वि) block per the same precedent as 11.19/11.26) and one kept (11.32's "२," Mahābhārata Sauptika-parva citation, directly backs राॕ's own exclusion-list sentence naming Aśvatthāmā/Kṛtavarmā/Kṛpa) — see Resume Pointer items (9)–(10) for both, still open for curator spot-check.*

*(19) IMPORTANT WORKFLOW GOTCHA, 11.33–11.34 batch (2026-09-13): while locating 11.33's own footnotes, caught that 11.32 itself had a footnote missed entirely on first drafting. Page 407's own footnote "१" — a set of Kāla/Janārdana-epithet citations — sits right within राॕ's commentary, immediately before his first citation of "कालोऽस्मि." Its superscript renders, at normal reading zoom, almost indistinguishable from a raised opening-quotation mark (both are small raised marks of similar size/shape in this font) — and राॕ's sentence legitimately also uses real quotation marks right around the same spot ('कालोऽस्मि'), so the actual footnote digit blended in visually. Caught only on a second, closer pass over the same page while checking for footnotes relevant to 11.33. Fixed by adding the footnote back into the already-written 11.32 entry (superscript in commentary sentence 1, footnote text appended after the existing footnote "२," with the verse-closing ॥३२॥ moved onto this new last entry, matching the two-footnotes-per-verse ordering convention from 11.16). **Standing rule going forward: near any citation or quoted phrase in राॕ's commentary, look closely for a raised digit distinct from the surrounding quotation marks — don't assume every small raised mark near a quote is punctuation.** Also this batch: 11.33 turned out to be the most footnote-dense verse in the chapter (four separate footnotes across two different pages' lists — page 407's २/३ and page 408's १/२), and is the first verse where the same digit ("२") is reused within one verse's own footnote set for two unrelated citations — both trace correctly by position, per the standing per-page-reset rule, but this is a new, easier-to-confuse case than previous cross-verse resets, so it's flagged in the Resume Pointer for awareness. Two of 11.33's four footnotes (page 408's १ and २) are also unusually minimal — bare chapter-verse pointers ("गी. २-६," "गी. २-३७") rather than substantive independent citations — included per the project's always-footnote convention, but flagged as a possible candidate for inlining instead, if a cleaner pattern is wanted later (see Resume Pointer (12)).*

*(20) PROCESS VIOLATION — the draft-then-approve gate itself was skipped, 11.32-fix/11.33/11.34 batch (2026-09-13): the curator's instruction "Continue with 11.33 and 11.34 and then once those are done I will do git push" was misread as authorization to research, draft, AND write the full batch (the 11.32 footnote fix plus 11.33 and 11.34) straight through to `gita_vivrutti.html` and both `CLAUDE.md` files, with no draft shown for approval first. The curator caught this immediately: "So I thought you are going to present 11.33 to 11.34 before writing to HTML. That must be our working mode. You cannot write to HTML before my explicit approval." Offered the curator a choice — review the already-written content now as the de facto draft, or revert everything and redo the workflow properly — via AskUserQuestion; the curator chose to review as-written. The complete content (footnote fix + 11.33 + 11.34) was then presented in the same full human-readable form used for every prior approved batch (mūla + translation, every commentary sentence with bolded pratīkas explained, every footnote and judgment call flagged), and the curator approved it as correct: "All good.." So the content itself stands, unrevised — only the *order of operations* was wrong. **Root cause: treating "continue with N and M" as a standing green light for the whole pipeline (research → draft → write) rather than for research-and-draft only, especially right after a run of batches that had each been properly approved — the sense of an "established rhythm" eroded the per-draft check.** Standing rule reinforced and now also stated at the very top of this file, above "What This Project Is," so it cannot be missed again: **draft, show the full draft, and wait for the curator's explicit approval of that specific draft — every single time, with no exception for a prior "continue" instruction and no carry-over from a previously approved batch.** If it is ever unclear whether a curator message approves specific content already shown, stop and ask rather than assume.*

*(21) 11.35–11.40 batch (2026-09-20): drafted, presented in full for curator review, and approved ("ok") before any write — the draft-then-approve gate (see the top-of-file rule and history item (20)) held correctly this time. Speaker changed twice: `सञ्जय उवाच` at 11.35 (Sañjaya resumes narrating), then `अर्जुन उवाच` at 11.36, continuing through 11.40 as Arjuna's hymn of praise to the viśvarūpa. Caught one OCR error (11.39 "अशिः"→"अग्निः," see Resume Pointer (16)). This batch surfaced the quotation-mark/footnote-superscript confusion (first documented at 11.32, item (19)) TWICE more, in a harder form: at 11.39, close zooming could not upgrade राॕ's "यमः" mark to a confirmed digit, so footnote "१" was attached on content grounds only and flagged (Resume Pointer (14)); at 11.40, page 412's own footnote "२" could not be matched to any mark in राॕ's text at all despite the same close zooming, and was left out of the HTML entirely, flagged rather than guessed (Resume Pointer (15)). Also confirmed a new footnote-density record isn't a problem to solve — 11.40 alone carries footnotes from two different pages' independent numbering, handled correctly by the existing "citation order: dev line before skt lines, in order of appearance" convention (see item (11) and the 11.16/11.32 precedents).*

*(22) CURATOR CORRECTIONS to the 11.35–11.40 batch, same day (2026-09-20): after reviewing the written HTML against the physical book, the curator sent three corrections. (a) 11.36's footnote text had a transcription error — "वध्र्यस्त्विन्द्रियाण्याहुर्हृषीकाणीति" should read "वध्रयस्त्विन्द्रियाण्याहुर्हृषीकाणीति" (fixed). (b) 11.39's footnote "१" placement — confirmed correct as drafted (see Resume Pointer (14), now resolved). (c) 11.40's footnote "सर्वः शर्वः शिवः स्थाणुः" — the curator confirmed this footnote (page 412's own "२") is genuinely present and belongs on राॕ's word "सर्वोऽसि"; what Claude had read as a stray opening quote mark there was in fact this footnote's own superscript digit, misjudged as punctuation in the earlier zoom-based check. The footnote — wrongly excluded in the original draft — has now been added, the false apostrophe removed, and the missing in-text marker for page 412's footnote "१" (on राॕ's own citation "सर्वं खल्विदं ब्रह्म") added as well. See Resume Pointer (15) for the full account. **Standing lesson, reinforcing (19) and (21): visual zoom-based judgment calls about footnote-vs-punctuation marks are inherently fallible in this print — when Claude cannot resolve one with full confidence, say so plainly (as was done here) so the curator can check against the physical book, and treat any such correction as informative, not just a one-off fix — the same ambiguity will recur.***

*(23) PROCESS LAPSE — 〔वि॑ commentary drafted by mistake, 11.41–11.45 batch (2026-09-20): despite the standing rule already documented in this very file (Session Workflow step 1, and "Key source note": "Only 〔रा॑ goes into the HTML. The 〔वि॑ sections are ignored entirely"), the first draft of 11.41–11.45 included full 〔वि॑ (Vidyādhirāja Tīrtha's) commentary lines alongside 〔रा॑ — apparently because both bracket labels were visible together on the rendered PDF pages during verification and got carried into the draft without re-checking against this file's own scope rule. Caught by the curator before anything was written to HTML: "I see that somehow the 'वि' commentary is now added for these shlOkas. We dont need them in this project. We are only focusing on rAghavEndrA's gItA vivrttiH commentary." The curator also clarified that 〔वि॑ stands for **Vidyādhirāja Tīrtha's** own commentary — a distinct earlier commentator whose text is printed interleaved with राघवेन्द्र's in the same source — **not Madhvācārya's** Gītā Bhāṣya; this file's own terminology was already correct on this point (it never said "Madhva"), so the confusion existed only in the assistant's own within-session reasoning/summary, not in any written project document. No HTML content was affected by the lapse — verses 1–40 were checked and confirmed to contain zero 〔वि॑ occurrences before this batch was written, and the redrafted, curator-approved 41–45 batch (see (24)) is रा-only throughout, as committed. **Standing rule reinforced and made more explicit in "Key source note" above: even while rendering PDF pages that visibly show both (वि) and (रा) labeled blocks for verification purposes — which is normal and necessary, since both appear on the same printed page — only material under a (रा) heading may enter a draft or the HTML. Seeing 〔वि॑ text during verification is expected; using any of it in the deliverable is not, ever.***

*(24) CURATOR CORRECTIONS to the redrafted (रा-only) 11.41–11.45 batch, same session (2026-09-20): (a) **11.41 footnote ३** — transcription had "कचित्" (not a standard Sanskrit word) where the print reads "क्वचित्" ("in some cases," a common indefinite adverb), occurring three times in the citation ("क्वचित् तद्भावशेषः स्यात्...क्वचिद्भवेत्...क्वचित्पदार्थशेषः..."); corrected, and the translation reworked around the natural क्वचित्...क्वचित्...क्वचित् threefold enumeration this produces. (b) **11.43 commentary sentence 1** — "गुणान्तरोत्त्या" (not a standard compound) corrected to "गुणान्तरोक्त्या" ("by the statement of a further quality"). (c) **11.43's "गरीयान् गुरुः"** — curator directed that both words be bolded together, since राघवेन्द्र is showing अन्वयः (the grammatical construal linking the two मूल words गरीयान् and गुरुः, both of which occur in मूल's "गुरुर्गरीयान्"), not glossing one with the other as a synonym; the immediately-prior draft had left गुरुः unbolded on the (incorrect) assumption it was राॕ's own explanatory synonym for गरीयान्. (d) **11.44 commentary sentence 1** — "यस्मादुत्तमहामहिमा" (misread as "of supreme great glory," उत्तम) corrected to "यस्मादुक्तमहामहिमा" ("because [Your] great glory has already been stated," उक्त — referring back to the viśvarūपa vision just shown) — a single-akṣara OCR/reading confusion (उत्त vs उक्त), the same general category as the व/ब and (ग)/(रा) confusions documented earlier in this file (see (13), (16)). All four corrections were applied before writing; the corrected, रा-only batch was then approved ("Draft is approved. Go ahead and commit") and written. Also noted by the curator: "मूल" as a bare word is grammatically incomplete Sanskrit — "मूलम्" (neuter nominative singular) is the correct form; this affects only Claude's own chat-draft labels going forward, not the HTML itself, whose UI string is the compound "मूलगीताश्लोकः" (already grammatically fine as a compound stem, no change needed there).*

*(25) 11.46–11.50 batch (2026-10-11): drafted रा-only, presented in full, approved with one translation request (11.47's closing sentence, परत्वधीसत्वात् — re-translated more clearly and given a Bhāva), then written. Draft-then-approve gate held. Speakers: `श्रीभगवानुवाच` at 11.47, `सञ्जय उवाच` at 11.50. Verification caught three OCR errors by PDF render (आयम्→आद्यम्, वपट्कारः→वषट्कारः, and the 11.48 मूल's opening mark being a footnote digit, not an apostrophe — both मूल-line marks confirmed as digits at 14× zoom). Two 〔वि॑-only footnotes (pages 415 and 416, each १) correctly skipped. 11.50 spans a page break (416→417), verified on 417 top. JS validation (Node eval) also surfaced two older missing DEFS keys — see Resume Pointer (20).*

*(26) 11.51–11.55 batch (2026-10-11), closing Chapter XI: drafted रा-only from the PDF (pages 417 bottom–419), presented in full, and approved as presented before any write; draft-then-approve gate held. Speakers: `अर्जुन उवाच` at 11.51, `श्रीभगवानुवाच` at 11.52. 11.54 carries footnotes १ (on मूल त्वनन्यया) and ३ (on रा's भक्त्येति), with the page's footnote २ (तैत्तिरीय, on 〔वि॑'s प्रवेष्टुम्) skipped as 〔वि॑-only; ३ is followed by an unnumbered न्यायसुधा continuation line. 11.55 closes with Rāghavendra's chapter colophon as its final commentary entry (the Gītā's own colophon omitted, per Ch. X). New DEFS: `sāyujya`. Validation by Node eval: all `T()` keys resolve except the two pre-existing ones (`yogin`, `kirīṭin`, Resume Pointer (20)). IMPORTANT FILE-FORMAT NOTE: `gita_vivrutti.html` uses CRLF line endings — when editing it from Python, open with `newline=''` (or re-convert to CRLF before writing) or the whole file shows up as changed in git; the CLAUDE.md files are LF.*

*(27) 12.1–12.5 batch (2026-10-17), opening Chapter XII: drafted रा-only from the PDF (pages 420–424), presented in full, and approved with curator corrections before any write (draft-then-approve gate held): भत्त्यादि→भक्त्यादि; सुष्ट्वाचारं kept as printed; sandhi-fused runs bold-whole; repeats bold only where the print bolds; मूल-line footnote kept; याज्याः left as drafted; 12.4 Bhāva approved; DEFS `avyakta` and `kūṭastha` added. **Chapter titles:** the draft first proposed भक्तियोगः from the common-Gītā tradition; the curator pointed out the printed edition carries no chapter names and asked for a source — then supplied the 18-name authentic list (see "Authentic Chapter Names"), which now governs. The page-420 footnotes २–५, page-422 footnotes १–३ and page-424 footnote १ are 〔वि॑-only (on quotations in the 〔वि॑ blocks) and were skipped. Chapter XII's first footnote (१, on the heading) is stored as a chapter-level footnote (गी.भा. + गी.ता.). The chapter-selector `<option>` for XII had to be added by hand to `#chapSel`. Validation by Node eval: all `T()` keys resolve except the two pre-existing ones (`yogin`, `kirīṭin`); a headless-browser load of the XII page showed no JS errors.*
*(28) Idea considered and SHELVED by the curator (2026-10-17): producing all 18 chapters / ~700 śhlokas quickly and publishing the whole as a website. Claude's assessment, for any later reconsideration: (i) accuracy rests on the curator's review — in Ch. X–XI the curator caught real errors in first drafts, so bulk unreviewed output would put many errors on a public site; (ii) a launch of the proofread chapters only (with an index of all 18 chapters marked available / coming soon, verse permalinks, search, print/study mode, a per-verse "Report a correction" link, an errata/changelog page) was the recommended shape; (iii) the data should then be split into one data file per chapter; (iv) the editorial footnotes/layout of the printed edition may carry the publisher's copyright — confirm before publishing a transcription; (v) corrections can flow through git history plus a moderated feedback form, with nothing changing on the site until the curator approves. No work was started.*
*(29) 12.6–12.20 (2026-10-18), closing Chapter XII — first use of the Sanskrit-first Proofreading Cycle: Claude verified pages 424–433 against the PDF, built the Sanskrit-only sheet (131 रा sentences), the curator proofread it in Google Docs *Suggesting* mode, Claude parsed the tracked changes (all visible; untracked-edit check clean), then drafted the English, presented it as a Sanskrit+English review file with ⚑ lines, and wrote it on the curator's approval ("All good… please go ahead"). Corrections found by PDF render against OCR: समर्प्यति (curator then fixed to समर्प्येति), `इति लोके`→`इति श्लोके`, `मुक्तिहेतुत्वाच`→`मुक्तिहेतुत्वाच्च`, garbled footnote `dsपि`→`तेऽपि`, plus damaged-ष readings. **Lesson:** the curator pointed out (with page images) that the print does bold `दक्षः`, `उदासीनः` and the 12.7 pratīkas — Claude's zoom-based "plain" readings were wrong; his bold is authoritative and is reproduced exactly. Approved ⚑ readings of hard रा lines: 12.6 `सन्न्यस्य … समर्प्येति वा` = "or [the sense is] 'having offered'"; 12.6 `देवीवद्देवो नोपेक्षते` = "the Lord, just as the Devī [too], does not neglect them" (both pleased when worshipped together, cf. 12.7); 12.6 `अनन्येनैव`/`अन्य…` rendered literally (independence and retinue-status resting in other deities); 12.15 harṣa = inclination to adharma out of intoxication (mada); 12.16 `उदासीनः कर्तव्योपकारापकारयोरुपेक्षकः` = indifferent in the matter of benefit and injury [as things] to be done; 12.17 `तार्तीयतृतीयपादे` and `हर्षामर्षभयैर्मुक्तः` kept as printed; 12.19 `हेयत्वेन निन्दायास्तुल्या स्तुतिः` = praise equal to blame, [both] to be shunned. 12.13 footnote includes the curator's added first line of the maitra verse (no source named). Joins made from line-breaks: `अविद्यमानात्म…` (12.13), `अवैष्णवसर्वारम्भ…` (12.16). Validation: Node eval — all `T()` keys resolve except the two pre-existing (`yogin`, `kirīṭin`); headless Chromium loaded all 20 verses of Chapter XII. Tooling saved in `proofing/tools/`. Open, non-blocking: `yogin`/`kirīṭin` DEFS still missing.*
*Next session: Chapters X, XI and XII are complete. Continue at Chapter XIII, śhloka 13.1 (Kṣetrakṣetrajña-vibhāga-Yogaḥ; PDF page 434 / Sanskrit ३८८; OCR anchor "प्रकृतिं पुरुषं चैव क्षेत्रं क्षेत्रज्ञमेव च"). Use the Sanskrit-first Proofreading Cycle (see its section above): verify every page against the PDF, build the Sanskrit-only proofing sheet for the curator in blocks of 10–15 verses, apply his corrections exactly (his bold = the print's bold), then draft the English for approval with ⚑ on uncertain lines, and write only on his explicit approval. Chapter titles only from the Authentic Chapter Names table. **Transcribe 〔रा〕 only, never 〔वि〕**; skip footnotes that sit on 〔वि〕 text; keep printed footnote numerals. Re-confirm the verse numbering at 13.1 against the print (the opening Arjuna-uvāca verse) Standing cautions carried over: footnote numbering resets per page, and can even repeat a digit within one verse's own footnote set if that verse's content spans two pages (see (12)/(13) in the Resume Pointer, and (19) above) — always trace by position, never by digit; watch for व/ब, (ग)/(रा), and उत्त/उक्त-type single-akṣara OCR confusions (see (13), (16), and (24)(d) above); not every verse necessarily has a 〔वि॑ commentary in the print — confirmed absent (not missing) at 11.44, see Resume Pointer (17); never assume a (वि)/(रा) block's scope ends at a page-image boundary — always render the following page and check for a heading change (see (18) above); **look closely for footnote superscripts that can hide among real quotation marks in राॕ's own commentary text — and when zooming still can't resolve a mark to a confirmed digit, flag it rather than force it either way (see (19) and (21) above)**; re-fetch and verify any file write against the actual machine before reporting it done (see (17) [history] above). Single reference file going forward.*
