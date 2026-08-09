'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// ─── Content ────────────────────────────────────────────────────────────────

interface Section {
  heading: string
  body: string | string[]
  isSectionOverview?: boolean
}

interface SectionEntry {
  label: string
  summary: string
}

interface IntroContent {
  title: string
  subtitle: string
  sections: Section[]
  sectionOverview: SectionEntry[]
}

const INTRO_CONTENT: Record<'en' | 'sa', IntroContent> = {
  en: {
    title: 'Vādāvalī — An Introduction',
    subtitle: 'For the sincere seeker approaching Madhva Tattvavāda Siddhānta',
    sections: [
      {
        heading: 'Why Study the Vādāvalī?',
        body: 'The Vādāvalī is one of the finest specimens of Sanskrit philosophical reasoning in the entire Indian tradition. It is a masterclass in navya-nyāya applied to Vedānta — every argument is structured with the full precision of Indian logic: pakṣa (thesis), hetu (reason), dṛṣṭānta (example), and dūṣaṇa (refutation). Reading it trains the philosophical mind in a way few texts can.\n\nMore than that, the Vādāvalī addresses questions that are among the deepest in all of philosophy, East or West: Is the world real? Is consciousness one or many? What is ignorance? Can the very concept of illusion be coherently stated? Jayatīrtha pursues these with a rigor and elegance that rewards careful study at every level — from the first-time reader encountering Indian philosophy to the advanced scholar.',
      },
      {
        heading: 'What is Madhva Tattvavāda Siddhānta?',
        body: 'Vedānta is the philosophical tradition that interprets the three foundational texts of Indian philosophy — the Upaniṣads, the Brahmasūtras, and the Bhagavadgītā. Different schools interpret these texts differently.\n\nMadhvācārya (1238–1317 CE) founded the Tattvavāda school — the philosophy of reality as it truly is. His central insight is that difference (bheda) is real, irreducible, and eternal. There are five fundamental differences: between the Lord (Viṣṇu/Brahman) and individual souls (jīvas), between the Lord and matter (jaḍa), between soul and matter, between different souls, and between different material objects.\n\nThis stands in sharp contrast to Advaita Vedānta, associated with Śaṅkarācārya, which holds that the multiplicity of the world is ultimately illusory (māyā) and that only Brahman — undifferentiated pure consciousness — truly exists. The Vādāvalī is a sustained and rigorous refutation of Advaita\'s key positions from within the Tattvavāda framework.',
      },
      {
        heading: 'What is the Vādāvalī?',
        body: 'The Vādāvalī — meaning \'a garland of arguments\' — is a concise Sanskrit philosophical treatise by Jayatīrtha (14th century CE), the greatest logician and systematizer of the Tattvavāda tradition. Revered as Ṭīkācārya (the master commentator), Jayatīrtha was the direct intellectual successor to Madhvācārya. The Vādāvalī demonstrates with full logical force that the Advaita account of the world as illusion is philosophically untenable.',
      },
      {
        heading: 'The Two Commentaries',
        body: 'The Vādāvalī is studied here alongside two authoritative commentaries:\n\n**Bhāvadīpikā** by Rāghavendra Tīrtha (1595–1671 CE) — One of the greatest scholar-saints of the Tattvavāda tradition, Rāghavendra Tīrtha\'s commentary illuminates every argument with philosophical depth and precision, grounding each claim in authoritative sources.\n\n**Vādāvalīprakāśaḥ** by Śrīnivāsa Tīrtha — A scholarly commentary that expands on difficult passages and engages deeply with navya-nyāya, making the logical structure of Jayatīrtha\'s arguments accessible to the careful student.',
      },
      {
        heading: 'A Section-by-Section Overview',
        body: 'The Vādāvalī proceeds in 40 sections through a systematic dismantling of the Advaita account of mithyātva (the illusoriness of the world) and an establishment of the Tattvavāda position that the world is genuinely real and difference is irreducible. The summaries below are based exclusively on Rāghavendra Tīrtha\'s Bhāvadīpikā.',
        isSectionOverview: true,
      },
      {
        heading: 'How to Use This Platform',
        body: 'All 40 sections are available with the original Sanskrit mūla text alongside the commentaries of Rāghavendra Tīrtha and Śrīnivāsa Tīrtha. You may read passage by passage with togglable commentary, ask the AI Tutor questions in English or Sanskrit at any depth, practise in Parīkṣā mode, and track your progress across sessions.',
      },
    ],
    sectionOverview: [
      { label: '§1 — Maṅgalaślokaḥ', summary: 'Rāghavendra Tīrtha opens his Bhāvadīpikā with his own maṅgala verse saluting Viṣṇu, then announces his intention to expound the Vādāvalī \'to the best of his understanding, for the delight of the learned,\' after saluting his guru-lineage headed by Ānandatīrtha (Madhva). He gives the philosophical rationale for Jayatīrtha\'s entire work: the Brahmasūtra\'s first aphorism presupposes Brahman\'s infinite auspicious qualities, and the second sūtra characterizes Brahman as the real cause of the world — which holds only if the world is genuinely real. Therefore the entire Vādāvalī is composed in defense of jagatsatya (the world\'s reality) by refuting the Māyāvādin\'s alleged proofs of world-falsity.' },
      { label: '§2 — Mithyātvasādakānumānabhaṅgaḥ', summary: 'The Māyāvādin challenges world-reality by citing Ānandabodha\'s inference: \'the debated object is false, because it is perceptible, inert, and finite, like shell-silver.\' Rāghavendra explains how Jayatīrtha\'s response \'not so, because mithyātva cannot be defined\' attacks the very sādhya (property to be proved). Seven alternative definitions of mithyātva are listed — each will be shown unworkable in the sections that follow.' },
      { label: '§3 — Anirvacanīyatvabhaṅgaḥ', summary: 'The longest and technically most dense section. The Advaitin\'s primary characterization — mithyātva as anirvacanīyatva (inexpressibility: being expressible as neither real nor unreal) — is subjected to exhaustive logical examination. Two readings of \'anirvacanīya\' are explored and both are self-defeating. The mutual exhaustion argument is established: sat and asat are mutually exhaustive — both cannot simultaneously be absent from any locus. Every specification of ātmatva as the ground of reality is demolished. Citsukhācārya\'s inference for anirvacanīyatva is refuted on grounds of pratijñāvirodha, vyabhicāra, and sopādhikatva.' },
      { label: '§4 — Avidyālakṣaṇanirāsaḥ', summary: 'The arthāpatti underlying anirvacanīyatva rests on \'sacchenna bādhyeta\' — so Rāghavendra examines what \'sat\' means here. Three alternatives are proposed and each fails: sat as sattājātiyukta violates the vyāpti since sattā-bearing anātman is admitted to be sublatable; sat as abādhya is circular; sat as brahmasvarūpa is siddhasādhana. Similarly the \'asat\' limb is examined and shown self-defeating from multiple angles.' },
      { label: '§5 — Avidyāpramāṇanirāsaḥ', summary: 'Having demolished avidyā\'s definition, the text attacks its alleged pramāṇas. Perception cannot establish avidyā — its inexpressibility places it beyond any determinate perceptual grasp. Inference cannot establish it — any vyāpti relating the marks of avidyā to its nature is circular. Scripture does not establish it — śruti texts like \'satyaṃ khalvidaṃ brahma\' affirm jagatsatya. Arthāpatti fails — already shown in §4.' },
      { label: '§6 — Mithyātvaniruktirasopasaṃhāraḥ', summary: 'A summary consolidation: all seven definitions of mithyātva are unworkable and no pramāṇa can establish it. Since mithyātva cannot be coherently defined, the Advaita inference suffers from aprasiddha-viśeṣaṇa in the sādhya — the inferential charge fails at the level of the conclusion itself.' },
      { label: '§7 — Dṛśyatvavikalpa nirāsaḥ', summary: 'The refutation of hetu begins. Dṛśyatva (perceptibility) as the reason for mithyātva is examined in every specification — dṛg-vṛtti-viṣayatva, jñātatā, vyavahāra-rūpa-phala — either Brahman itself falls under the hetu or the hetu fails to reach the entire pakṣa.' },
      { label: '§8 — Dṛśyatvahetu nirāsaḥ', summary: 'Further examination of dṛśyatva: if sākṣi-viṣayatva, the sākṣī itself becomes dṛśya and hence mithyā — an unacceptable consequence. If indriya-janita-vṛtti-viṣayatva, Brahman known through vedānta-janita-vṛtti falls under the same mark — vyabhicāra.' },
      { label: '§9 — Jaḍatvahetu nirāsaḥ', summary: 'Jaḍatva (inertness) as the second hetu is examined. Three definitions are proposed — jñānaśūnyatva, ātmatva-anādhāratva, and ātmākāra-vṛtty-anāśrayatva — each either forces Brahman itself to be jaḍa or generates ātmāśraya, making the vyāpti \'jaḍa things are mithyā\' invalid.' },
      { label: '§10 — Paricchinnatvahetu nirāsaḥ', summary: 'Parichinnatva (finitude) as the third hetu. Proposed definitions — avacchinnatva, deśādiparicchinnatva — fail because ākāśa and kāla are admitted real yet finite in some sense, giving vyabhicāra. The hetu cannot be established without collateral damage to admitted reals.' },
      { label: '§11 — Mithyātvānumānasya pratyakṣabādhaḥ', summary: 'The mithyātva inference is directly contradicted by perception. The world is perceived as real — \'the pot exists,\' \'the cloth is here\' — these perceptions carry no internal mark of unreality. No sublating cognition of the form \'this is not real\' arises in ordinary experience. Direct perceptual evidence establishes jagatsatya and bādhes the inference.' },
      { label: '§12 — Mithyātvānumānasya śrutiviroddhaḥ', summary: 'The inference is contradicted by Vedic testimony. Key śruti passages — \'satyaṃ khalvidaṃ brahma,\' \'sarvaṃ khalvidaṃ brahma\' — affirm the reality of this world, not its illusoriness. Rāghavendra shows that Advaita misreads the \'unity\' texts as negating the world\'s reality, when they actually affirm Brahman as the real ground of a real world.' },
      { label: '§13 — Mithyātvānumānasya smṛtiviroddhaḥ', summary: 'The inference is contradicted by smṛti — the Bhagavadgītā and allied texts consistently affirm the reality of God, souls, and world as distinct entities. The Gītā\'s practical teaching of karma, jñāna, and bhakti presupposes real distinctions between agent, knowledge, and the Lord. An illusory world cannot ground genuine practice.' },
      { label: '§14 — Mithyātvānumānasya anumānaviroddhaḥ', summary: 'The inference is contradicted by independent inference. The world\'s reality can itself be inferred: Brahman is the real cause of a real effect — a non-existent effect cannot have a real cause. The causal relation presupposes the reality of both relata.' },
      { label: '§15 — Mithyātva hetu ekaliṃganirūpaṇam', summary: 'The logical mark (liṅga) used in the Advaita inference is a kevalānvayin mark (universally present), which means vyabhicāra cannot be established for it through negative instances. This vitiates the inference — the hetu cannot do the epistemological work required of it.' },
      { label: '§16 — Satayvahetu pratikūlatarkoddāraḥ', summary: 'The arguments for mithyātva are shown to be counterproductive — each reason proposed can equally serve as a reason for the opposite conclusion, jagatsatya. The logic of the Advaita inference turns against itself.' },
      { label: '§17 — Dṛśyatvādihetutrayabhaṅgaḥ', summary: 'A comprehensive refutation of all three hetus — dṛśyatva, jaḍatva, parichinnatva — taken together. Each singly and all together fail to establish mithyātva as a coherent sādhya.' },
      { label: '§18 — Aṃśatānumānasya bādhaḥ', summary: 'The Advaitin\'s inference from partial cognition (aṃśatā) — that the cognition of a part implies the unreality of the whole — is directly contradicted by cases where partial cognition is of real objects.' },
      { label: '§19 — Aṃśatānumānanirāsaḥ', summary: 'A complete logical refutation of the aṃśatā inference — the hetu is unestablished in the pakṣa and the vyāpti fails under examination.' },
      { label: '§20 — Mithyātvahetu aprayojakatam', summary: 'The definitive result: all proposed reasons for mithyātva are non-probative (aprayojaka). None establish the sādhya; each either collapses into vyabhicāra, sopādhikatva, or generates unacceptable consequences for the Advaitin\'s own admitted truths.' },
      { label: '§21 — Satyavahetu pratikūlatarkoddāraḥ', summary: 'The positive counterpart: the same logical structures proposed as reasons for mithyātva serve equally — or better — as reasons for jagatsatya. The inference for world-reality is logically stronger than any inference for world-falsity.' },
      { label: '§22 — Neha nānāsti śrutyarthavicāraḥ', summary: 'The Upaniṣadic passage \'neha nānāsti kiñcana\' (Bṛhadāraṇyaka 4.4.19) is examined. Rāghavendra shows it affirms that there is no multiplicity independent of Brahman — it does not deny that the world, grounded in Brahman, is real. The passage concerns the nature of dependence, not the unreality of the dependent.' },
      { label: '§23 — Ekameveti śrutyarthavicāraḥ', summary: '\'Ekamevādvitīyam\' (Chāndogya 6.2.1) is examined. Rāghavendra shows \'advitīya\' means Brahman has no equal or superior — it does not mean multiplicity is unreal. The passage speaks to Brahman\'s absolute supremacy, not to monism of being.' },
      { label: '§24 — Satyaṃ jñānam iti śrutyarthaḥ', summary: '\'Satyaṃ jñānam anantaṃ brahma\' (Taittirīya 2.1) — \'satyam\' means that which is not sublated in any of the three times; \'jñānam\' means self-luminous; \'anantam\' means unlimited by space, time, or entity. Rāghavendra shows this passage describes Brahman\'s nature as the real ground of the world, not a denial of the world\'s reality.' },
      { label: '§25 — Viśvasatyatva pratipādanopasaṃhāraḥ', summary: 'The first great movement of the Vādāvalī concludes: by perception, scripture, smṛti, and inference, jagatsatya is established. All Māyāvādin pramāṇas are shown to be ābhāsas (apparent, not genuine). Viṣṇu\'s world-creatorship is real. Rāghavendra summarizes with crisp finality.' },
      { label: '§26 — Bhedabādhakayā pratīyamānayuktinirāsaḥ', summary: 'The second movement begins: bheda (difference) must now be established as real. The Advaitin claims bheda is itself sublated — but what sublates it? Neither perception nor scripture bādhes bheda. The alleged sublating evidence is itself unfounded.' },
      { label: '§27 — Bhedamithyātvānumāne asiddhikathanam', summary: 'The Advaitin\'s inference \'bheda is mithyā\' suffers from asiddhi — the hetu is not established in the pakṣa. Whatever is proposed as the reason for bheda\'s falsity is itself either a form of bheda or an unestablished entity.' },
      { label: '§28 — Bhedamithyātvānumānasya sopādhikatvam', summary: 'The inference is shown to be sopādhika — it operates only under a vitiating condition. The proposed hetu (apramāṇagamyatva) is present only in prātibhāsika objects, not in bheda which is directly and veridically perceived.' },
      { label: '§29 — Bhedasya pratyakṣādyagrāhyatva pūrvapakṣaḥ', summary: 'The Advaitin\'s objections to bheda-pratyakṣa are presented in full as pūrvapakṣa: if bheda is known independently it requires prior knowledge of its terms; if known simultaneously with its terms the causal sequence is violated; if bheda itself has bheda an infinite regress results. Rāghavendra presents these objections with full rigor before answering them.' },
      { label: '§30 — Bhedasya dharmisvaro patvāsamarthanam', summary: 'The central thesis of the second movement: bheda is the svarūpa (very nature) of the dharmin, not an additional property. Hence the cognition of the dharmin and the cognition of its bheda are one unified act — no causal sequence, no mutual dependence, no regress. This single insight dissolves all the objections of §29.' },
      { label: '§31 — Kālādeḥ sākṣisiddhatva samarthanam', summary: 'Kāla (time), dik (direction), ākāśa (space), and ātman are established as known directly by the sākṣī (witness-consciousness). Bheda too is sākṣī-known: \'this pot differs from that cloth\' is immediate sākṣī-experience. Therefore bheda is real.' },
      { label: '§32 — Sākṣisamarthanam', summary: 'The sākṣī is defended as a genuine epistemological entity. The Advaitin uses the sākṣī to establish avidyā yet denies it reveals bheda. Rāghavendra shows this is inconsistent: if the sākṣī can reveal modifications of avidyā it can equally reveal bheda, which is equally immediate. To selectively deny the sākṣī\'s validity for bheda-experience is arbitrary.' },
      { label: '§33 — Prāmāṇyasya svatastvāsamarthanam', summary: 'Valid knowledge is self-validating (svataḥprāmāṇya): no cognition requires a further cognition to certify its validity. The Advaitin claims bheda-perception is bhrānti — but establishing any cognition as bhrānti requires a bādhaka pramāṇa. No bādhaka for bheda-pratyakṣa exists. In its absence, the bheda-cognition stands valid by svataḥprāmāṇya.' },
      { label: '§34 — Kālasya sākṣivedyatva samarthanopasaṃhāraḥ', summary: 'Kāla\'s sākṣī-vedyatva is confirmed and consolidated. Since kāla is real and sākṣī-vedya, and bheda is equally sākṣī-vedya by parallel reasoning, bheda is real. This section closes the sākṣī argument.' },
      { label: '§35 — Bhedapratyakṣasya anyonyāśrayādyuddhāraḥ', summary: 'The anyonyāśraya objection is formally answered: dharmin and pratiyogī are not cognized as featureless substrates prior to bheda-cognition. From the very first moment the cognitive act grasps \'this pot, distinct from that cloth.\' The cognition of the object and its bheda are one act — no mutual dependence.' },
      { label: '§36 — Dharmi-pratiyogi bhedapratyayānāṃ yaugapadyasamarthanam', summary: 'The causal-sequencing objection is answered: since bheda is the dharmin\'s svarūpa, the cognitions of dharmin, pratiyogī, and their bheda constitute one unified cognitive act. Simultaneity is not a violation of causal logic but an expression of the unitary structure of bheda-cognition.' },
      { label: '§37 — Viśeṣasamarthanam', summary: 'Ultimate differentiators (viśeṣas) in Vaiśeṣika ontology explain the distinctness of eternal, partless entities. Rāghavendra supports this: viśeṣas are dharmi-svarūpa for eternal entities, directly known through the cognition of those entities, and are self-differentiating — the regress stops here. Even among eternal entities, real bheda is coherently grounded.' },
      { label: '§38 — Bhedapratītyākṣepa nirāsopasaṃhāraḥ', summary: 'All objections to bheda-pratyakṣa — anyonyāśraya, causal-sequencing impossibility, viśeṣa incoherence, infinite regress — have been answered. Bheda-pratyakṣa is established as a legitimate, defect-free, self-valid pramāṇa.' },
      { label: '§39 — Bhedamithyātvānumānasya pratijñāvirodhaḥ', summary: 'The inference \'bheda is mithyā\' is self-defeating. If all bheda is mithyā, the distinction between \'mithyā\' and \'satya\' — which the Advaitin must make in formulating this very conclusion — is itself a bheda and hence mithyā. The entire inferential process relies on bheda at every step — an inference that concludes \'all bheda is false\' defeats itself.' },
      { label: '§40 — Bhedamithyātvānumānasya vyabhicārādikathanam', summary: 'The final and most comprehensive section surveys all logical defects of the bheda-mithyātva inference: asiddhi, anaikāntika/vyabhicāra, sopādhikatva, āśrayāsiddhi, pratijñāvirodha, and pratyakṣabādha. Each defect is argued with full nyāya-pramāṇa rigor. The Vādāvalī thus concludes: bheda is real, perceptible, self-validating, and constitutive of the nature of things. The Māyāvāda doctrine of world-falsity and difference-falsity has been defeated at every level.' },
    ],
  },
  sa: {
    title: 'वादावल्याः परिचयः',
    subtitle: 'तत्त्ववादसिद्धान्तजिज्ञासूनां कृते',
    sections: [
      {
        heading: 'वादावलीम् अधीयीत किमर्थम्?',
        body: 'वादावली सम्पूर्णे भारतीये दर्शनसाहित्ये संस्कृतभाषायां विरचितेषु दार्शनिकग्रन्थेषु अग्रगण्या। अत्र प्रत्येकं वादः नव्यन्यायशैल्या — पक्षः, हेतुः, दृष्टान्तः, दूषणञ्च — इत्येवंरूपेण सुनिश्चितरीत्या प्रतिपादितः। अस्य ग्रन्थस्य अध्ययनेन दार्शनिकचिन्तनस्य पटुता सहजतया जायते।\n\nकिञ्च, अस्मिन् ग्रन्थे प्रतिपादितानि प्रश्नानि प्राच्याः पाश्चात्याश्च समस्तदर्शनेषु अतिगहनानि सन्ति — जगत् किं सत्यम्? चेतना किम् एका बहुर्वा? अविद्या का? भ्रमस्य संकल्पः किं सुसंगतः? एतान् प्रश्नान् जयतीर्थः अत्यन्तं सूक्ष्मतया तीक्ष्णतया च विचारयति।',
      },
      {
        heading: 'मध्वतत्त्ववादसिद्धान्तः कः?',
        body: 'वेदान्तः उपनिषत्सु ब्रह्मसूत्रेषु भगवद्गीतायाञ्च — एतेषु प्रस्थानत्रये — स्थितस्य दर्शनस्य परम्परा। एतेषां ग्रन्थानां विविधाः व्याख्याः विविधैः आचार्यैः प्रतिपादिताः।\n\nमध्वाचार्यः (१२३८–१३१७ CE) तत्त्ववादसिद्धान्तस्य प्रवर्तकः। तस्य मूलसिद्धान्तः — भेदः सत्यः, नित्यः, अनपह्नवनीयश्च। पञ्चविधाः भेदाः प्रतिपाद्यन्ते — ईश्वरजीवयोः, ईश्वरजडयोः, जीवजडयोः, जीवजीवयोः, जडजडयोश्च।\n\nशङ्कराचार्यप्रणीतेन अद्वैतवेदान्तेन सह अस्य सिद्धान्तस्य मूलभूतं वैपरीत्यम् अस्ति। अद्वैतमते जगतः प्रपञ्चः मायामात्रः, केवलं निर्विशेषं ब्रह्मैव परमार्थसत्। तत्त्ववादे तु जगत् परमार्थसत्यम्, भेदश्च नित्यः।',
      },
      {
        heading: 'वादावली का?',
        body: 'वादावली — वादानां माला इत्यर्थः — जयतीर्थविरचितः संक्षिप्तः किन्तु गहनः संस्कृतदार्शनिकग्रन्थः। जयतीर्थः (चतुर्दशः शताब्दः) तत्त्ववादपरम्परायाः महानतमः तार्किकः टीकाचार्यश्च। मध्वाचार्यस्य प्रत्यक्षशिष्यपरम्परायां स्थितः सः मध्वाचार्यप्रतिपादितसिद्धान्तानां न्यायशास्त्रेण पूर्णबलेन समर्थनं करोति।',
      },
      {
        heading: 'द्वे टीके',
        body: 'अस्मिन् अध्ययनमञ्चे वादावली द्वाभ्यां प्रामाणिकटीकाभ्यां सह पठ्यते —\n\n**भावदीपिका** — राघवेन्द्रतीर्थविरचिता। राघवेन्द्रतीर्थाः (१५९५–१६७१ CE) तत्त्ववादपरम्परायाः महान् विद्वद्भक्तः। तेषां टीका प्रत्येकं वादं प्रमाणपूर्वकं दार्शनिकगाम्भीर्येण प्रकाशयति।\n\n**वादावलीप्रकाशः** — श्रीनिवासतीर्थविरचितः। अयं विद्वत्टीकाग्रन्थः दुर्बोधस्थलेषु विस्तारं करोति, नव्यन्यायशैल्या जयतीर्थस्य युक्तिक्रमं सुस्पष्टं करोति।',
      },
      {
        heading: 'विभागशः सारः',
        body: 'वादावली चत्वारिंशत्प्रकरणेषु अद्वैतस्य मिथ्यात्वमतं खण्डयति तत्त्ववादस्य जगत्सत्यत्वं भेदनित्यत्वञ्च स्थापयति। अधो निर्दिष्टाः सारा राघवेन्द्रतीर्थानां भावदीपिकामनुसृत्य एव विरचिताः।',
        isSectionOverview: true,
      },
      {
        heading: 'अस्मिन् मञ्चे कथम् अधीयीत?',
        body: 'चत्वारिंशत्प्रकरणानि मूलपाठेन सह राघवेन्द्रतीर्थानां श्रीनिवासतीर्थानाञ्च टीकाभ्यां सह अत्र उपलभ्यन्ते। अध्येता प्रकरणशः पठितुम्, एआई-गुरोः प्रश्नान् प्रष्टुम्, परीक्षामञ्चे अभ्यासं कर्तुम्, स्वप्रगतिञ्च अनुगन्तुं शक्नोति।',
      },
    ],
    sectionOverview: [
      { label: '§१ — मङ्गलश्लोकः', summary: 'राघवेन्द्रतीर्थः स्वीयेन मङ्गलश्लोकेन कंसद्विड् विष्णुं नत्वा, आनन्दतीर्थादिगुरुपरम्परामभिवन्द्य, \'यथाबुद्धि वादावलीं व्याख्यास्यामि सतां मुदे\' इत्युद्घोषयति। ततः जयतीर्थस्य प्रकरणप्रयोजनमुद्घाटयति — \'जन्माद्यस्य यतः\' इत्यनेन ब्रह्मणो जगज्जन्मादिकर्तृत्वं लक्षणम्, तच्च जगत्सत्यत्वमन्तरेण न सम्भवति — इत्यतः जगन्मिथ्यात्वसाधकप्रमाणखण्डनमेव वादावल्याः प्रयोजनम्।' },
      { label: '§२ — मिथ्यात्वसाधकानुमानभङ्गः', summary: 'मायावादी आनन्दबोधोक्तम् अनुमानमुपन्यस्यति — \'विमतं मिथ्या, दृश्यत्वाज्जडत्वात्परिच्छिन्नत्वाच्च, शुक्तिरजतवत्।\' जयतीर्थः \'मैवम्, मिथ्यात्वानिरुक्तेः\' इति प्रत्यवदत्। राघवेन्द्रः — मिथ्यात्वस्य सप्तकल्पा विकल्पिताः — अनिर्वचनीयत्वादयः — प्रत्येकः दूष्यते इत्युपक्रमं दर्शयति।' },
      { label: '§३ — अनिर्वाच्यत्वभङ्गः', summary: 'सर्वाधिकविस्तृतं तान्त्रिकदृष्ट्या दुरूहतमं च प्रकरणम्। अनिर्वचनीयत्वस्य नञ्तत्पुरुषबहुव्रीहिविकल्पौ उभावपि दूष्येते। सत्त्वासत्त्वयोः परस्परपरिसमाप्तिः — उभयविरहित्वं व्याहतमेव। आत्मत्वस्य अष्टकल्पखण्डनम्। चित्सुखोक्तानुमाने प्रतिज्ञाविरोधव्यभिचारोपाध्यप्रसिद्धविशेषणदोषाः।' },
      { label: '§४ — अविद्यालक्षणनिरासः', summary: '\'सच्चेन्न बाध्येत\' इत्यर्थापत्तौ \'सत्\' शब्दस्य त्रेधा विकल्पः — सत्तायुक्तत्वे व्याप्त्यसिद्धिः, अबाध्यत्वे साध्याविशिष्टत्वम्, ब्रह्मस्वरूपत्वे सिद्धसाधनम्। \'असच्चेन्न प्रतीयेत\' इत्यंशेऽपि असद्व्यवहारलोपः, भ्रान्तिव्यवहारलोपः, अनवस्था वा।' },
      { label: '§५ — अविद्याप्रमाणनिरासः', summary: 'अविद्यायाः सिद्ध्यर्थं प्रत्यक्षानुमानागमार्थापत्तीनां चतसृणाम् असामर्थ्यं प्रतिपाद्यते। अनिर्वचनीयत्वेन स्वीकृता अविद्या प्रत्यक्षाग्राह्या, व्याप्त्यग्राह्यत्वात् अनुमानाग्राह्या, \'सत्यमेव जगत्\' इति श्रुत्यर्थात् आगमाग्राह्या।' },
      { label: '§६ — मिथ्यात्वनिरुक्तिनिरासोपसंहारः', summary: 'उपसंहारः — मिथ्यात्वस्य सप्त कल्पाः सर्वे दुष्टाः, प्रमाणपन्थाश्च नास्ति। तस्मात् साध्ये अप्रसिद्धविशेषणतया सम्पूर्णम् अनुमानमेव दुष्टम्।' },
      { label: '§७ — दृश्यत्वविकल्पनिरासः', summary: 'दृश्यत्वहेतुः — दृग्विषयत्वम् अस्वप्रकाशत्वं वा? प्रत्येकस्मिन् कल्पे वृत्तिविषयत्वे ब्रह्मण्यनैकान्त्यम्, अस्वप्रकाशत्वे बुद्ध्यादौ मिथ्यात्वापत्तिः।' },
      { label: '§८ — दृश्यत्वहेतुनिरासः', summary: 'साक्षिविषयत्वकल्पे साक्ष्यपि मिथ्यः प्राप्नोति। इन्द्रियजन्यवृत्तिविषयत्वकल्पे वेदान्तजन्यवृत्त्या ब्रह्मणि व्यभिचारः।' },
      { label: '§९ — जडत्वहेतुनिरासः', summary: 'ज्ञानशून्यत्वकल्पे आत्मज्ञानस्य स्वाश्रयत्वापत्तिः। आत्मत्वानाधारत्वकल्पे निर्धर्मकब्रह्मण्यपि जडत्वापत्तिः। प्रत्येकं कल्पे व्यभिचारः।' },
      { label: '§१० — परिच्छिन्नत्वहेतुनिरासः', summary: 'अवच्छिन्नत्वकल्पे आकाशे अनैकान्त्यम्। देशादिपरिच्छिन्नत्वकल्पे कालाकाशयोर्व्यभिचारः। हेतुः सर्वथा असाधुः।' },
      { label: '§११ — मिथ्यात्वानुमानस्य प्रत्यक्षबाधः', summary: '\'घटोऽस्ति, पटोऽस्ति\' इत्यादि प्रत्यक्षं जगत्सत्यत्वं साक्षात् बोधयति। मिथ्यात्वबोधकं प्रत्यक्षं नास्ति। प्रत्यक्षबाधेन अनुमानं निरस्तम्।' },
      { label: '§१२ — मिथ्यात्वानुमानस्य श्रुतिविरोधः', summary: '\'सत्यं खल्विदं ब्रह्म\', \'सर्वं खल्विदं ब्रह्म\' इत्यादिश्रुतयः जगत्सत्यत्वं प्रतिपादयन्ति। एकत्ववाचिनः श्रुतयः मिथ्यात्वं न बोधयन्ति, किन्तु ब्रह्माधारतया जगत्सत्यत्वमेव।' },
      { label: '§१३ — मिथ्यात्वानुमानस्य स्मृतिविरोधः', summary: 'भगवद्गीतादिस्मृतिषु ईश्वरजीवजगतां भेदेन कर्मज्ञानभक्त्यादि व्यवहारः प्रतिपाद्यते। जगन्मिथ्यत्वे तस्य व्यावहारिकाभिप्रायस्यापि निरर्थकता।' },
      { label: '§१४ — मिथ्यात्वानुमानस्य अनुमानविरोधः', summary: 'ब्रह्म जगतः सत्यं कारणम् — असत्कार्यस्य सत्कारणं नास्ति इत्यनुमानेन जगत्सत्यत्वं सिद्ध्यति। इदमनुमानं मिथ्यात्वानुमानस्य विरोधि।' },
      { label: '§१५ — मिथ्यात्व हेतोः एकलिङ्गनिरूपणम्', summary: 'दृश्यत्वादिहेतुः केवलान्वयी — व्यतिरेकव्यभिचारासम्भवात् व्याप्तिग्रहो दुःसाधः। तस्मात् हेतुः स्वकार्यार्हो न।' },
      { label: '§१६ — सत्यवहेतूनां प्रतिकूलतर्कोद्धारः', summary: 'मिथ्यात्वहेतवः स्वयमेव जगत्सत्यत्वे प्रयोजकाः। युक्तिः आत्मघाती।' },
      { label: '§१७ — दृश्यत्वादिहेतुत्रयभङ्गः', summary: 'त्रयाणामपि हेतूनां — दृश्यत्वजडत्वपरिच्छिन्नत्वानाम् — समग्रनिरासः।' },
      { label: '§१८ — अंशातानुमानस्य बाधः', summary: 'अंशज्ञानात् समग्रस्य मिथ्यात्वसाधनं सत्यविषयकांशज्ञानदृष्टान्तेन बाध्यते।' },
      { label: '§१९ — अंशातानुमाननिरासः', summary: 'अंशातानुमाने हेतोरसिद्धिः व्याप्त्यसिद्धिश्च।' },
      { label: '§२० — मिथ्यात्वहेतूनामप्रयोजकतम्', summary: 'निगमनम् — सर्वे मिथ्यात्वहेतवः अप्रयोजकाः, व्यभिचारिणः, सोपाधिकाश्च।' },
      { label: '§२१ — सत्यवहेतूनां प्रतिकूलतर्कोद्धारः', summary: 'मिथ्यात्वाय प्रयुक्ता एव हेतवः जगत्सत्यत्वे बलवत्तराः प्रमाणाः।' },
      { label: '§२२ — नेह नानेति श्रुत्यर्थविचारः', summary: '\'नेह नानास्ति किञ्चन\' इति श्रुतिः स्वतन्त्रनानात्वनिषेधपरा, न तु जगन्मिथ्यात्वपरा। ब्रह्माधारतया जगत्सत्यत्वमेव बोधितम्।' },
      { label: '§२३ — एकमेवेति श्रुत्यर्थविचारः', summary: '\'एकमेवाद्वितीयम्\' इति ब्रह्मणः निरुपमत्वपरम्, न नानात्वनिषेधपरम्।' },
      { label: '§२४ — सत्यं ज्ञानमिति श्रुत्यर्थः', summary: '\'सत्यं ज्ञानमनन्तं ब्रह्म\' इत्यत्र सत्यपदेन त्रिकालाबाधितत्वम्, ज्ञानपदेन स्वप्रकाशत्वम्, अनन्तपदेन देशकालवस्तुपरिच्छेदाभावः — एतत् सर्वं जगत्सत्यत्वमेव साधयति।' },
      { label: '§२५ — विश्वसत्यत्वप्रतिपादनोपसंहारः', summary: 'प्रत्यक्षश्रुतिस्मृत्यनुमानैः जगत्सत्यत्वं सुसिद्धम्। मायावादिप्रमाणानि सर्वाण्याभासानि। विष्णोः जगत्कर्तृत्वं वास्तवम् इति प्रथमपर्वनिगमनम्।' },
      { label: '§२६ — भेदबाधकतया प्रतीयमानयुक्तिनिरासः', summary: 'भेदप्रकरणमारभ्यते। भेदबाधकं किं प्रत्यक्षविरुद्धम् आगमविरुद्धम् वा? भेदस्य प्रत्यक्षसिद्धत्वात् तद्बाधकप्रमाणमेव नास्ति।' },
      { label: '§२७ — भेदमिथ्यात्वानुमानेऽसिद्धिकथनम्', summary: 'भेदमिथ्यात्वसाधको हेतुः पक्षे असिद्धः — पूर्वनिरस्तमिथ्यात्वलक्षणस्यैव असिद्धेः।' },
      { label: '§२८ — भेदमिथ्यात्वानुमानस्य सोपाधिकत्वकथनम्', summary: '\'अप्रमाणगम्यत्वम्\' उपाधिः — भेदस्तु प्रत्यक्षगम्यः। उपाध्यभावान्न हेतुः प्रयोजकः।' },
      { label: '§२९ — भेदस्य प्रत्यक्षाद्यग्राह्यत्वपूर्वपक्षः', summary: 'पूर्वपक्षाः — धर्मिप्रतियोग्यज्ञाने भेदज्ञानाभावः, कार्यकारणक्रमविरोधः, अन्योन्याश्रयानवस्थे — सप्रमाणं प्रस्तूयन्ते।' },
      { label: '§३० — भेदस्य धर्मिस्वरूपत्वसमर्थनम्', summary: 'मुख्यसिद्धान्तः — भेदो धर्मिस्वरूपम्। अतः धर्मिज्ञानं भेदज्ञानञ्च अभिन्नम् — पूर्वोक्तपूर्वपक्षनिराकरणम्।' },
      { label: '§३१ — कालादेः साक्षिसिद्धत्वसमर्थनम्', summary: 'कालदिगाकाशात्मानः साक्षिसिद्धाः। भेदोऽपि \'अयं तस्माद् भिन्नः\' इत्यनुभवेन साक्षिसिद्धः। साक्षिसिद्धं वस्तु सत्यमेव।' },
      { label: '§३२ — साक्षिसमर्थनम्', summary: 'साक्षी मायावादिनाऽप्यङ्गीकृतः। किन्तु भेदेऽपि साक्षिव्यापारः समानः। भेदनिरासार्थं साक्षिव्यापारनिषेधस्य अनौचित्यम्।' },
      { label: '§३३ — प्रामाण्यस्य स्वतस्त्वसमर्थनम्', summary: 'ज्ञानं स्वतःप्रमाणम्। भेदप्रत्ये बाधकप्रमाणमेव नास्ति। अतः स्वतःप्रमाणत्वेन भेदप्रत्ययः सत्यः।' },
      { label: '§३४ — कालस्य साक्षिवेद्यत्वसमर्थनोपसंहारः', summary: 'कालस्य साक्षिवेद्यत्वे सिद्धे भेदस्यापि साक्षिवेद्यत्वम्, अतः सत्यत्वम् — इत्युपसंहारः।' },
      { label: '§३५ — भेदप्रत्यक्षस्यान्योन्याश्रयाद्युद्धारः', summary: 'भेदो धर्मिस्वरूपम् इत्यतः धर्मिज्ञाने भेदज्ञानमन्तर्भूतम् — अन्योन्याश्रयो नास्ति।' },
      { label: '§३६ — धर्मिप्रतियोगि भेदप्रत्ययानां यौगपद्यसमर्थनम्', summary: 'भेदो धर्मिस्वरूपम् इत्यतः धर्मिप्रतियोगिभेदप्रतीतयः एककालिन्यः — कार्यकारणक्रमाभावात्।' },
      { label: '§३७ — विशेषसमर्थनम्', summary: 'नित्यद्रव्याणां परमाणुपरमात्मादीनां विशेषः धर्मिस्वरूपम् — स्वयंग्राह्यः, अनवस्थारहितश्च।' },
      { label: '§३८ — भेदप्रतीत्याक्षेपनिरासोपसंहारः', summary: 'सर्वे आक्षेपाः निरस्ताः। भेदप्रत्यक्षं दोषरहितं स्वतःप्रमाणं च।' },
      { label: '§३९ — भेदमिथ्यात्वानुमानस्य प्रतिज्ञाविरोधः', summary: '\'भेदो मिथ्या\' इति प्रतिज्ञायाम् — मिथ्यात्वसत्त्वयोर्भेदोऽपि मिथ्यः प्राप्नोति। अनुमानव्यापारोऽपि भेदापेक्षी — स्वव्याघातः।' },
      { label: '§४० — भेदमिथ्यात्वानुमानस्य व्यभिचारादिकथनम्', summary: 'असिद्धिरनैकान्त्यं सोपाधिकत्वमाश्रयासिद्धिः प्रतिज्ञाविरोधः प्रत्यक्षबाधश्च — षड्विधदोषैः भेदमिथ्यात्वानुमानं सर्वथा दुष्टम्। भेदः नित्यः सत्यः परमार्थिकश्च। मायावादस्य जगन्मिथ्यात्वभेदमिथ्यात्वमतं सर्वथा खण्डितम् — इत्यनेन वादावली समाप्यते।' },
    ],
  },
}

// ─── Bhēdōjjīvanam intro content ────────────────────────────────────────────
// TODO: Curator to provide accurate intro text — current placeholder only.
// Do NOT populate with AI-generated content. Await curator input.

const BHEDOJJIVANAM_INTRO_CONTENT: Record<'en' | 'sa', IntroContent> = {
  en: {
    title: 'Bhēdōjjīvanam — An Introduction',
    subtitle: 'For the sincere seeker approaching Madhva Tattvavāda Siddhānta',
    sections: [
      {
        heading: 'Why Study the Bhēdōjjīvanam?',
        body: 'The Bhēdōjjīvanam holds a distinctive place in the corpus of Vyāsatīrtha (c. 1460–1539 CE), one of the three great ācāryas — the munitraya — of Tattvavāda, alongside Madhva and Jayatīrtha himself. Where his major doxographical works — the Nyāyāmṛta, Tātparyacandrikā, and Tarkatāṇḍava, together called the Vyāsa-traya — engage the entire landscape of rival systems at encyclopedic length, the Bhēdōjjīvanam is deliberately compact: composed, by tradition, as the last and shortest of his polemical writings, intended to train the beginning student before taking up the fuller works.\n\nThat brevity is exactly what makes it valuable to study. The text distills the central battleground between Tattvavāda and Māyāvāda — whether bheda, difference, is real, or an illusory appearance to be dissolved in an undifferentiated Brahman — into a single, tightly argued treatise a student can hold in view as a whole. Every technique of navya-nyāya that appears at length across Vyāsatīrtha\'s larger corpus — isolating a hetu\'s precise scope, testing a lakṣaṇa against every possible reading, pressing an opponent\'s own admissions into a dilemma — appears here too, in miniature, and is easier to trace for it.\n\nFor the student already working through the Vādāvalī, the Bhēdōjjīvanam offers a natural second encounter with the same terrain from a different dialectical hand: Jayatīrtha\'s sustained refutation of anirvacanīyatva reads differently from Vyāsatīrtha\'s own, later, more compressed treatment of the reality of bheda — and comparing the two is itself a valuable exercise in how Tattvavāda\'s argumentative tradition developed and consolidated across generations.',
      },
      {
        heading: 'What is Madhva Tattvavāda Siddhānta?',
        body: 'Vedānta is the philosophical tradition that interprets the three foundational texts of Indian philosophy — the Upaniṣads, the Brahmasūtras, and the Bhagavadgītā. Different schools interpret these texts differently.\n\nMadhvācārya (1238–1317 CE) founded the Tattvavāda school — the philosophy of reality as it truly is. His central insight is that difference (bheda) is real, irreducible, and eternal. There are five fundamental differences: between the Lord (Viṣṇu/Brahman) and individual souls (jīvas), between the Lord and matter (jaḍa), between soul and matter, between different souls, and between different material objects.\n\nThis stands in sharp contrast to Advaita Vedānta, associated with Śaṅkarācārya, which holds that the multiplicity of the world is ultimately illusory (māyā) and that only Brahman — undifferentiated pure consciousness — truly exists. The Bhēdōjjīvanam, like the Vādāvalī elsewhere on this platform, is a rigorous refutation of Advaita\'s key positions from within the Tattvavāda framework — composed a century and a half later, by one of Tattvavāda\'s own foundational ācāryas.',
      },
      {
        heading: 'What is Bhēdōjjīvanam?',
        body: 'Bhēdōjjīvanam — literally \'the revivification of difference\' — is a concise Sanskrit polemical treatise by Vyāsatīrtha (Yatirāja before his renunciation; c. 1460–1539 CE), one of Tattvavāda\'s three foundational ācāryas alongside Madhva and Jayatīrtha. Raised under the guardianship of Brahmaṇya Tīrtha and trained for twelve years in Dvaita philosophy under Śrīpādarāja at Mulbagal, Vyāsatīrtha succeeded his teacher to the pontifical seat and went on to serve as rājaguru to the Vijayanagara court — first to Sāḷuva Narasiṃha, and later, most notably, to Kṛṣṇadēvarāya. Among his disciples were the haridāsa poet-saints Purandara Dāsa and Kanaka Dāsa.\n\nVyāsatīrtha\'s reputation rests chiefly on the Vyāsa-traya — the Nyāyāmṛta, Tātparyacandrikā, and Tarkatāṇḍava — vast doxographical works that catalogue and refute the positions of Advaita, Viśiṣṭādvaita, Mīmāṃsā, Nyāya, and Buddhist schools with an exhaustiveness that provoked Madhusūdana Sarasvatī\'s celebrated Advaita Siddhi in direct response to the Nyāyāmṛta — one of the most consequential exchanges in the history of Vedāntic debate. Before these, he had also written ṭīkās on Jayatīrtha\'s shorter khaṇḍana tracts (the Upādhikhaṇḍana, Māyāvādakhaṇḍana, and Prapañcamithyātvānumānakhaṇḍana) and the Tattvavivekatīkā.\n\nThe Bhēdōjjīvanam comes last in this sequence — by tradition, the shortest of his polemical compositions, written as an accessible synthesis rather than an exhaustive survey. Its title states its purpose directly: bheda — the pañcabheda of Viṣṇu from jīva, Viṣṇu from jaḍa, jīva from jaḍa, jīva from jīva, and jaḍa from jaḍa that Madhva holds to be the very structure of reality — is here given ujjīvana, a revival, against the Māyāvādin\'s contention that all such difference is finally mithyā, an appearance to be sublated. In compressed form, the text carries forward the same defense of bheda\'s reality that occupies the second half of the Vādāvalī, now argued through Vyāsatīrtha\'s own mature dialectical voice.',
      },
      {
        heading: 'The Kāśikā Commentary',
        body: 'The Bhēdōjjīvanam is studied here alongside the Kāśikā, a commentary by Kāśītirumalācārya. Independent biographical documentation of the commentator is scarce, and this platform does not claim certainty about his dates or lineage where the sources do not support it. What can be said with confidence comes from direct engagement with the commentary itself: the Kāśikā proceeds as close explanatory prose on Vyāsatīrtha\'s terse mūla, unpacking each compressed argument into its full pūrvapakṣa-siddhānta structure, glossing technical nyāya terminology as it arises, and supplying the intermediate steps a student needs to follow the logic of a khaṇḍana that the root text itself often states in a single dense sentence. In this respect it serves the same essential function for the Bhēdōjjīvanam that Rāghavendra Tīrtha\'s Bhāvadīpikā and Śrīnivāsa Tīrtha\'s Vādāvalīprakāśaḥ serve for the Vādāvalī elsewhere on this platform — a guide that makes the root text\'s compressed reasoning legible step by step.',
      },
      {
        heading: 'How to Use This Platform',
        body: 'All 125 sections are available with the original Sanskrit mūla text alongside Kāśītirumalācārya\'s Kāśikā commentary. You may read passage by passage with togglable commentary, ask the AI Tutor questions in English or Sanskrit at any depth, practise in Parīkṣā mode, and track your progress across sessions.',
      },
    ],
    sectionOverview: [],
  },
  sa: {
    title: 'भेदोज्जीवनस्य परिचयः',
    subtitle: 'तत्त्ववादसिद्धान्तजिज्ञासूनां कृते',
    sections: [
      {
        heading: 'भेदोज्जीवनम् अधीयीत किमर्थम्?',
        body: 'भेदोज्जीवनं तत्त्ववादपरम्परायां मुनित्रयान्तर्गतस्य — मध्वाचार्यजयतीर्थाचार्ययोः सह — व्यासतीर्थानां (१४६०-१५३९ CE) कृतिषु विशिष्टं स्थानं भजते। तेषां प्रमुखानि सिद्धान्तग्रन्थानि — न्यायामृतं तात्पर्यचन्द्रिका तर्कताण्डवं च, यानि व्यासत्रयमिति प्रसिद्धानि — समग्रं प्रतिपक्षजगत् विस्तरेण व्याप्नुवन्ति। भेदोज्जीवनं तु सङ्क्षेपेणैव रचितम् — परम्परानुसारेण तेषां वादग्रन्थेषु अन्तिमं संक्षिप्ततमं च, नवशिष्याणां प्रशिक्षणार्थं विहितम्, यत् महाग्रन्थेभ्यः पूर्वमेव अध्येतव्यम्।\n\nएतादृशी संक्षिप्तता एव अस्य ग्रन्थस्य अध्ययने मूल्यं जनयति। तत्त्ववादमायावादयोः मुख्यं युद्धक्षेत्रम् — भेदः सत्यः किं वा निर्विशेषब्रह्मणि विलीयमानो भ्रमः — एकस्मिन् सुसंहते ग्रन्थे संगृह्य प्रस्तूयते, यं छात्रः समग्रतया दृष्ट्वा अवधारयितुं शक्नोति। व्यासतीर्थानां बृहत्कृतिषु विस्तरेण दृश्यमानाः नव्यन्यायप्रक्रियाः सर्वाः — हेतोः सम्यग् व्याप्तिनिर्धारणम्, लक्षणस्य प्रतिविकल्पं परीक्षणम्, प्रतिवादिनः स्वीकृतांशानामेव विकल्पजालेन बन्धनम् — अत्रापि संक्षेपेण दृश्यन्ते, अत एव सुगमतया अनुसर्तुं शक्याः।\n\nयः छात्रः वादावलीम् अधीत्य आगतः, तस्य कृते भेदोज्जीवनं तमेव भूमिं भिन्नेन तार्किकहस्तेन पुनरवलोकयितुं अवसरं ददाति। जयतीर्थानां अनिर्वचनीयत्वखण्डनं यथा विस्तरेण प्रवर्तते, तथा व्यासतीर्थानां भेदसत्यत्वप्रतिपादनं परवर्तिकाले संक्षिप्ततरं भवति — उभयोः तुलना तत्त्ववादपरम्परायाः आचार्यद्वयेन कथं युक्तिजालं दृढीभूतं संहतं च जातम् इत्यत्र सम्यग् अन्तर्दृष्टिं ददाति।',
      },
      {
        heading: 'मध्वतत्त्ववादसिद्धान्तः कः?',
        body: 'वेदान्तः उपनिषत्सु ब्रह्मसूत्रेषु भगवद्गीतायाञ्च — एतेषु प्रस्थानत्रये — स्थितस्य दर्शनस्य परम्परा। एतेषां ग्रन्थानां विविधाः व्याख्याः विविधैः आचार्यैः प्रतिपादिताः।\n\nमध्वाचार्यः (१२३८–१३१७ CE) तत्त्ववादसिद्धान्तस्य प्रवर्तकः। तस्य मूलसिद्धान्तः — भेदः सत्यः, नित्यः, अनपह्नवनीयश्च। पञ्चविधाः भेदाः प्रतिपाद्यन्ते — ईश्वरजीवयोः, ईश्वरजडयोः, जीवजडयोः, जीवजीवयोः, जडजडयोश्च।\n\nशङ्कराचार्यप्रणीतेन अद्वैतवेदान्तेन सह अस्य सिद्धान्तस्य मूलभूतं वैपरीत्यम् अस्ति। अद्वैतमते जगतः प्रपञ्चः मायामात्रः, केवलं निर्विशेषं ब्रह्मैव परमार्थसत्। तत्त्ववादे तु जगत् परमार्थसत्यम्, भेदश्च नित्यः।',
      },
      {
        heading: 'भेदोज्जीवनं किम्?',
        body: 'भेदोज्जीवनम् इति नाम्ना — भेदस्य पुनरुज्जीवनम् इत्यर्थेन — व्यासतीर्थैः (संन्यासात् पूर्वं यतिराजनाम्ना ज्ञातैः; १४६०-१५३९ CE) विरचितः संक्षिप्तः संस्कृतवादग्रन्थः। मध्वाचार्यजयतीर्थाचार्ययोः सह तत्त्ववादस्य मुनित्रयान्तर्गताः व्यासतीर्थाः, ब्रह्मण्यतीर्थैः पालिताः, मूलबागिले श्रीपादराजैः द्वादशवर्षाणि तत्त्ववादशास्त्रे शिक्षिताः, गुरोः पदं प्राप्य विजयनगरसाम्राज्ये राजगुरुत्वेन — प्रथमं साळुवनरसिंहस्य, पश्चात् प्रख्यातरूपेण कृष्णदेवरायस्य — सेवां चक्रुः। पुरन्दरदासाः कनकदासाश्च तेषां प्रमुखशिष्येषु गण्यन्ते।\n\nव्यासतीर्थानां कीर्तिः मुख्यतया व्यासत्रये प्रतिष्ठिता — न्यायामृतं तात्पर्यचन्द्रिका तर्कताण्डवं च — यत्र अद्वैतविशिष्टाद्वैतमीमांसान्यायबौद्धादिदर्शनानां समग्रं खण्डनं विस्तरेण प्रतिपाद्यते। न्यायामृतस्य प्रत्युत्तरत्वेन मधुसूदनसरस्वतीभिः अद्वैतसिद्धिः विरचिता — इदं वेदान्तवादपरम्परायां सर्वाधिकप्रसिद्धं संवादद्वयम्। एतत्पूर्वं जयतीर्थानां लघुखण्डनग्रन्थेषु — उपाधिखण्डने मायावादखण्डने प्रपञ्चमिथ्यात्वानुमानखण्डने च — टीकाः, तथा तत्त्वविवेकटीका अपि तैः विरचिताः।\n\nभेदोज्जीवनं तु एतत्क्रमे अन्तिमं स्थानं भजते — परम्परया तेषां वादग्रन्थेषु संक्षिप्ततमम्, समग्रसर्वेक्षणरूपेण नहि, अपि तु सुगमसंहृतिरूपेण विरचितम्। नामैव अस्य प्रयोजनं सूचयति — भेदः, पञ्चविधः (विष्णुजीवयोः विष्णुजडयोः जीवजडयोः जीवजीवयोः जडजडयोश्च भेदः), यं मध्वाचार्याः जगतः स्वरूपभूतमेव मन्यन्ते, अत्र उज्जीवनं पुनर्जीवनं लभते — मायावादिना तु सर्वः भेदः अन्ततो मिथ्या बाध्यश्च इत्यभ्युपगम्यते। संक्षिप्तरूपेण एष ग्रन्थः तमेव भेदसत्यत्वसमर्थनं वहति, यत् वादावल्याः द्वितीयार्धे प्रधानं वर्तते, इदानीं तु व्यासतीर्थानां स्वकीयेन परिपक्वेन तार्किकस्वरेण प्रतिपाद्यमानम्।',
      },
      {
        heading: 'काशिकाटीका',
        body: 'भेदोज्जीवनम् अत्र काशिकया सह अध्ययनार्थम् उपलभ्यते — काशीतिरुमलाचार्यविरचितया टीकया। टीकाकारस्य स्वतन्त्रं जीवनचरितं दुर्लभम्, अतः तेषां कालनिर्णये गुरुपरम्परायां वा निश्चयेन किमपि अत्र न प्रतिज्ञायते यत्र प्रमाणानि न सन्ति। किन्तु टीकायाः स्वरूपमेव सुनिश्चयेन वक्तुं शक्यते — काशिका व्यासतीर्थानां संक्षिप्तं मूलं विवृण्वती प्रत्येकं संहृतं युक्तिं पूर्वपक्षसिद्धान्तरूपेण सम्पूर्णतया विस्तारयति, नैयायिकपारिभाषिकशब्दान् यथावसरं व्याचष्टे, मूलग्रन्थे एकस्मिन् सुसंहते वाक्ये उक्तस्य खण्डनस्य मध्यमसोपानानि छात्रार्थं पूरयति। एतेन कार्येण काशिका भेदोज्जीवनस्य कृते तमेव सेवां करोति, यां राघवेन्द्रतीर्थानां भावदीपिका श्रीनिवासतीर्थानां वादावलीप्रकाशश्च वादावल्याः कृते अत्रैव मञ्चे कुरुतः — मूलग्रन्थस्य संहृतां युक्तिं सोपानशः सुबोधां कुर्वती मार्गदर्शिका।',
      },
      {
        heading: 'अस्मिन् मञ्चे कथम् अधीयीत?',
        body: 'पञ्चविंशत्यधिकशतं (१२५) प्रकरणानि मूलपाठेन सह काशीतिरुमलाचार्यविरचितया काशिकाटीकया सह अत्र उपलभ्यन्ते। अध्येता प्रकरणशः पठितुम्, एआई-गुरोः प्रश्नान् प्रष्टुम्, परीक्षामञ्चे अभ्यासं कर्तुम्, स्वप्रगतिञ्च अनुगन्तुं शक्नोति।',
      },
    ],
    sectionOverview: [],
  },
}

// ─── Per-text intro content lookup ───────────────────────────────────────────

const ALL_INTRO_CONTENT: Record<string, Record<'en' | 'sa', IntroContent>> = {
  'c0219559-a8a9-4ebb-be5b-eca29b921457': INTRO_CONTENT,
  '86257ca9-12ab-4a5e-83ff-4e4b2938b071': BHEDOJJIVANAM_INTRO_CONTENT,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderBody(body: string | string[]) {
  const text = Array.isArray(body) ? body.join('\n\n') : body
  return text.split('\n\n').map((para, i) => {
    // Render **bold** spans inline
    const parts = para.split(/\*\*(.+?)\*\*/g)
    return (
      <p key={i} className="text-base text-stone-700 leading-relaxed mb-4 last:mb-0">
        {parts.map((part, j) =>
          j % 2 === 1
            ? <span key={j} className="font-semibold text-stone-800">{part}</span>
            : part
        )}
      </p>
    )
  })
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

function SectionOverview({ entries, isSanskrit }: { entries: SectionEntry[]; isSanskrit: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? entries : entries.slice(0, 3)
  const toggleLabel = expanded
    ? (isSanskrit ? 'न्यूनं दर्शय ↑' : 'Show less ↑')
    : (isSanskrit ? 'सर्वाणि प्रकरणानि दर्शय ↓' : 'Show all sections ↓')

  return (
    <div className="mt-2">
      {visible.map((entry, i) => (
        <div key={i} className="mt-6">
          <p className={`text-sm font-semibold text-saffron-700 mb-1 ${isSanskrit ? 'font-devanagari' : ''}`}>
            {entry.label}
          </p>
          <p className={`text-sm text-stone-600 leading-relaxed ${isSanskrit ? 'font-devanagari' : ''}`}>
            {entry.summary}
          </p>
        </div>
      ))}
      <button
        onClick={() => setExpanded(v => !v)}
        className="mt-6 text-sm font-medium text-saffron-600 hover:text-saffron-700 transition-colors"
      >
        {toggleLabel}
      </button>
    </div>
  )
}

// ─── Main client component ───────────────────────────────────────────────────

interface IntroPageClientProps {
  textId: string
  firstPassageId: string | null
}

function IntroPageClient({ textId, firstPassageId }: IntroPageClientProps) {
  const [activeTab, setActiveTab] = useState<'en' | 'sa'>('en')
  const textIntro = ALL_INTRO_CONTENT[textId] ?? INTRO_CONTENT
  const content = textIntro[activeTab]
  const isSanskrit = activeTab === 'sa'

  const studyHref = firstPassageId
    ? `/study/${textId}/${firstPassageId}`
    : `/study/${textId}`

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="text-center mb-8">
        <p className="font-devanagari text-2xl text-saffron-600 mb-4">॥ श्रीः ॥</p>
        <h1 className={`text-3xl font-bold text-stone-900 mb-3 ${isSanskrit ? 'font-devanagari' : ''}`}>
          {content.title}
        </h1>
        <p className={`text-lg text-stone-500 italic ${isSanskrit ? 'font-devanagari not-italic' : ''}`}>
          {content.subtitle}
        </p>
      </div>

      {/* Saffron divider */}
      <div className="border-t border-saffron-600 mb-8" />

      {/* Language tabs */}
      <div className="flex gap-2 mb-10">
        {(['en', 'sa'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-saffron-600 text-white'
                : 'border border-stone-300 text-stone-600 hover:border-saffron-400 hover:text-saffron-700'
            }`}
          >
            {tab === 'en' ? 'English' : 'Sanskrit (संस्कृतम्)'}
          </button>
        ))}
      </div>

      {/* Body sections */}
      {content.sections.map((section, idx) => (
        <div key={idx}>
          <h2 className={`text-xl font-semibold text-stone-800 mt-10 mb-3 ${isSanskrit ? 'font-devanagari' : ''}`}>
            {section.heading}
          </h2>
          {section.isSectionOverview ? (
            <>
              {renderBody(section.body)}
              {content.sectionOverview.length > 0 && (
                <SectionOverview entries={content.sectionOverview} isSanskrit={isSanskrit} />
              )}
            </>
          ) : (
            renderBody(section.body)
          )}
        </div>
      ))}

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-4 mt-16 pt-8 border-t border-stone-200">
        <Link
          href={studyHref}
          className="inline-flex items-center justify-center bg-saffron-600 hover:bg-saffron-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          {isSanskrit ? 'अध्ययनम् आरभ्यताम् →' : 'Begin Studying →'}
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium px-6 py-3 rounded-lg transition-colors"
        >
          {isSanskrit ? '← ग्रन्थालयं प्रतिगम्यताम्' : '← Return to Library'}
        </Link>
        <Link
          href={`/texts/${textId}/map`}
          className="inline-flex items-center justify-center border border-saffron-600 text-saffron-700 hover:bg-saffron-50 font-medium px-6 py-3 rounded-lg transition-colors"
        >
          {isSanskrit ? 'युक्तिनकाशः →' : 'Argument Map →'}
        </Link>
      </div>
    </div>
  )
}

// ─── Page (client, fetches passage on mount) ─────────────────────────────────

export default function IntroPage({ params }: { params: { textId: string } }) {
  const { textId } = params
  const [firstPassageId, setFirstPassageId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('passages')
      .select('id')
      .eq('text_id', textId)
      .order('section_number', { ascending: true })
      .order('subsection_number', { ascending: true })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setFirstPassageId(data.id)
      })
  }, [textId])

  return <IntroPageClient textId={textId} firstPassageId={firstPassageId} />
}
