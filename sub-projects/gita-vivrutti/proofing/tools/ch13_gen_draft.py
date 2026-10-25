import sys,json,re
sys.path.insert(0,'.')
import tr13
d=json.load(open('final_norm.json'))
o=json.load(open('original.json'))['verses']
SUP=str.maketrans('0123456789','⁰¹²³⁴⁵⁶⁷⁸⁹')
def sup(s):
    s=re.sub(r'\{\^(\d+)\}',lambda m:(m.group(1).translate(SUP) if m.group(1).isascii() else '⁽'+m.group(1)+'⁾'),s)
    s=re.sub(r'<sup>(\d+)</sup>',lambda m:m.group(1).translate(SUP),s)
    return s
WHY={
'1.s3':"long; Gītā 7.4 'bhūmir āpaḥ' rendered as the Lord's abode termed kṣetra (as the Vivṛtti says), not as the eight-fold prakṛti.",
'2.s2':"objection-form; 'if so asked: no' – kept the Vivṛtti's own objection/answer movement.",
'2.s16':"'saṅghāta' as one part vs. whole kṣetra – please check the logic of the doubt.",
'3.s7':"uses your corrected 'kṣīyate ’tra īśvareṇa'; I render 'dwelt in here by the Lord' (kṣi = to dwell).",
'4.s3':"the compressed reason for the word 'śarīra' (harm to the jīva + impelled by the Lord) – please check the syntax of my rendering.",
'4.s12':"'dharmetara-sāmarthya' – rendered literally; sense is uncertain.",
'5.s8':"'anuṣajyate' – connect 'gītam' with each item.",
'6.s6':"'ten and one' read as eleven senses incl. manas.",
'7.s22':"deity of the tongue = Varuṇa (rūpāntara).",
'7.s35':"abhimāni-devatā reading of 'saṅghāta' – please confirm.",
'7.s36':"depends on 'earlier derivation' (13.3 kṣīyate 'tra īśvareṇa).",
'7.s37':"'atiśayena vikāritayā' – rendered literally.",
'8.s1':"very long sentence; the six announced topics and the 'pañcaka' (five verses 8–12).",
'8.s6':"'ārjava' definition – check 'avaipartya' wording.",
'11.s1':"'svātantrya-asambandha' – check sense.",
'12.s5':"karaṇa-derivation 'jñāyate ’nena' (as accepted) – check that 'the group' is the right subject.",
'12.s7':"bhāva-vyutpatti sense.",
'12.s13':"concluding resolution of 12.s5/12.s7.",
}
out=[]
A=out.append
A("# Gītā Vivṛtti — Chapter XIII, 13.1–13.12 — English draft for review\n")
A("Lines marked ⚑ are the ones I am least sure of. Sanskrit = your corrected text (all 22 tracked changes applied, bold exactly as you left it); bold shown as **bold**. Footnote marks shown as superscript numerals.\n")
A("## Chapter header (proposed)\n")
A("- number: `XIII` · romanNum: 13")
A("- nameDev: **क्षेत्रक्षेत्रज्ञविभागयोगः** with chapter footnote ¹ (on the title)")
A("- nameEn: *Kṣetra-kṣetrajña-vibhāga Yoga · The Yoga of the Distinction between the Field and the Knower of the Field*")
A("- desc (drawn only from the Vivṛtti, 13.1.s1–s3): *This chapter condenses the meanings taught across the two preceding sets of six chapters — the means of knowledge, the nature of the jīva, the nature of the Lord, and the kṣetra as the Lord's dwelling — and, at Arjuna's question, presents them together in a form easy for the intellect to grasp.*")
A("- Chapter footnote ¹ (Sanskrit): "+o['0']['footnotes'][0]['text'])
A("  → "+sup(tr13.FN[(0,1)])+"\n")
for n in range(1,13):
    A(f"\n## 13.{n}\n")
    if n in tr13.SPEAKER: A(f"*{tr13.SPEAKER[n]}*\n")
    for sk,en in tr13.LINES[n]:
        A(f"- **{sup(sk)}**  \n  {sup(en)}")
    A("")
    ids=[k for k in d if k.startswith(f'13.{n}.s')]
    ids.sort(key=lambda k:int(k.split('.s')[1]))
    for k in ids:
        short=k[3:]
        fl='⚑ ' if short in tr13.FLAG else ''
        A(f"{fl}**{short}** — {sup(d[k])}  \n→ {sup(tr13.S[short])}\n")
        if short in WHY: A(f"   *(⚑ why: {WHY[short]})*\n")
    for f in o[str(n)]['footnotes']:
        en=tr13.FN.get((n,f['n']))
        A(f"**Footnote {'०१२३४५६७८९'[f['n']] if False else f['n']}** (on {f['on']}) — {f['text']}  \n→ {sup(en)}\n")
A("\n## Proposed DEFS (hover glossary), strictly from the Vivṛtti\n")
A("- **kṣetra** — the field; the body, and the unmanifest etc. denoted by 'śarīra' (13.2); so called because the Lord dwells in it — 'kṣīyate ’tra īśvareṇa' (13.3).")
A("- **kṣetrajña** — the knower of the kṣetra (13.2); 13.3 shows the Lord is kṣetrajña in all kṣetras (footnote 6: the Lord, hidden from the jīva's sight, is called kṣetrajña).")
A("- **śarīra** — 'śar' (that which harms the jīva) + 'īra' (that which is impelled by the Lord) (13.2).")
A("- **abhimāni-devatā** — the presiding deity of each element/organ of the body (13.7).")
A("- **dambha** / **adambhitva** — hypocrisy; absence of it (13.8). *(wording to be taken from 13.8 sentences once you approve)*")
A("- **anabhiṣvaṅga** — absence of overripe affection (atipakva-sneha-abhāva) (13.10).\n")
A("\n## Decisions so far\n")
A("1. 13.7.s12 अबभिमानी — the space was unintended; normalised (resolved).")
A("2. 13.7 footnote 1 — kept, with the English redone more clearly (above) — **awaiting your OK on this revised rendering**.")
A("3. ⚑ lines — accepted. 4. Header, desc, nameEn, DEFS — accepted.\n")
A("On your OK of the revised 13.7 footnote, I will write CHAPTERS[13] and the XIII option into the HTML, validate, update both CLAUDE.md files, and give you the git commands. Block B (13.13 onward) is next.\n")
open('/mnt/user-data/outputs/ch13_1_12_English_draft.md','w').write('\n'.join(out))
print(len('\n'.join(out)))
