import sys,json,re
sys.path.insert(0,'.')
import tr13
d=json.load(open('final_norm.json'))
o=json.load(open('original.json'))['verses']
DEV='०१२३४५६७८९'
def dv(n): return ''.join(DEV[int(c)] for c in str(n))
def supm(n): return '<sup class="vr-foot-sup">%s</sup>'%dv(n)
def conv_mark(s):
    # {^n} (ascii or devanagari) -> sup
    def r(m):
        g=m.group(1)
        n=int(g) if g.isascii() else int(''.join(str(DEV.index(c)) for c in g))
        return supm(n)
    return re.sub(r'\{\^([0-9०-९]+)\}',r,s)
def skt(s):
    s=conv_mark(s)
    parts=s.split('**'); out=''
    for i,p in enumerate(parts): out+=('<b>%s</b>'%p if i%2 and p else p)
    return out.replace("\\","\\\\").replace("'","\\'")
def ensk(s): return s.replace("\\","\\\\").replace("'","\\'")
def tr(s):
    s=re.sub(r'<sup>(\d+)</sup>',lambda m:supm(int(m.group(1))),s)
    s=s.replace('\\','\\\\').replace('`','\\`').replace('${','\\${')
    return re.sub(r'@@T:([^@]+)@@',lambda m:"${T('%s')}"%m.group(1),s)
def tsub(s,old,key):
    assert s.count(old)>=1,(old,s[:50])
    return s.replace(old,old.replace(key,"@@T:%s@@"%key,1),1)
S=dict(tr13.S)
S['1.s3']=tsub(S['1.s3'],'“kṣetra,”','kṣetra')
S['2.s11']=tsub(S['2.s11'],"‘kṣetrajña’",'kṣetrajña')
S['2.s12']=tsub(S['2.s12'],'“śarīra”','śarīra')
S['7.s7']=S['7.s7'].replace('presiding deities',"presiding deities (@@T:abhimāni-devatā@@)",1)
S['8.s3']=tsub(S['8.s3'],'“dambha.”','dambha')
S['10.s2']=tsub(S['10.s2'],'“Anabhiṣvaṅga”','Anabhiṣvaṅga')
def dtr(s): return tr(s).replace('\\${','${') if False else None
out=[]
A=out.append
A("  13: {")
A("    number:'XIII', romanNum:13,")
A("    nameDev:'क्षेत्रक्षेत्रज्ञविभागयोगः<sup class=\"ch-foot-sup\">१</sup>',")
A("    nameEn:'Kṣetra-kṣetrajña-vibhāga Yoga · The Yoga of the Distinction between the Field and the Knower of the Field',")
A("    desc:'This chapter condenses the meanings taught across the two preceding sets of six chapters — the means of knowledge, the nature of the jīva, the nature of the Lord, and the kṣetra as the Lord\\'s dwelling — and, at Arjuna\\'s question, presents them together in a form easy for the intellect to grasp.',")
f0=o['0']['footnotes'][0]
A("    footnotes:[")
A("      { num:1, skt:'%s',"%ensk(f0['text']))
A("        tr:`%s` }"%tr(tr13.FN[(0,1)]))
A("    ],")
A("    verses: {")
for n in range(1,13):
    A("      %d: {"%n)
    if n in tr13.SPEAKER: A("        speaker:'%s',"%tr13.SPEAKER[n])
    mula=[m for m in o[str(n)]['mula'] if m not in tr13.SPEAKER.values()]
    L=tr13.LINES[n]; assert len(mula)==len(L),(n,mula)
    A("        lines:[")
    for i,(m,(sk,en)) in enumerate(zip(mula,L)):
        assert m.replace('{^','{^')==sk or conv_mark(m)==conv_mark(sk),(m,sk)
        A("          { dev:'%s',"%skt(m))
        e=tr(en)
        if n==2 and i==1: e=tsub(e,'“kṣetrajña.”','kṣetrajña') if False else e
        A("            tr:`%s` }%s"%(e,',' if i<len(L)-1 else ''))
    A("        ],")
    A("        commentary:[")
    ids=sorted([k for k in d if k.startswith('13.%d.s'%n)],key=lambda k:int(k.split('.s')[1]))
    ents=[]
    for k in ids:
        sh=k[3:]
        ents.append((skt(d[k]),tr(S[sh])))
    for f in o[str(n)]['footnotes']:
        en=tr13.FN[(n,f['n'])]
        ents.append((supm(f['n'])+' '+ensk(f['text']),tr(en)))
    for i,(a,b) in enumerate(ents):
        A("          { skt:'%s',"%a)
        A("            tr:`%s` }%s"%(b,',' if i<len(ents)-1 else ''))
    A("        ]")
    A("      }%s"%(',' if n<12 else ''))
A("    }")
A("  }")
block='\r\n'.join(out)
defs=[
"  /* śhloka 13.1–13.12 terms */",
"  'kṣetra':               'Kṣetra — \"the field\": the body, and the unmanifest (avyakta) etc. denoted by the word śarīra; so called, per Rāghavendra, because the Lord dwells in it — kṣīyate \\'tra īśvareṇa (13.3).',",
"  'kṣetrajña':            'Kṣetrajña — \"knower of the kṣetra\": one who knows this body-field (13.2). The Lord is also the kṣetrajña in all kṣetras (13.3).',",
"  'śarīra':               'Śarīra — \"body\": per Rāghavendra, from śar (that which brings harm to the jīva) + īra (that which is impelled by the Lord).',",
"  'abhimāni-devatā':      'Abhimāni-devatā — the presiding deity of an element, organ or faculty of the kṣetra; Rāghavendra names these deities one by one (13.7).',",
"  'dambha':               'Dambha — hypocrisy: displaying greatness even after knowing one\\'s own smallness (13.8). Adambhitva is its absence.',",
"  'Anabhiṣvaṅga':        'Anabhiṣvaṅga — absence of overripe affection (atipakva-sneha-abhāva) toward son, wife, home and the like (13.10).',",
]
open('block13.txt','w',encoding='utf-8',newline='').write(block)
open('defs13.txt','w',encoding='utf-8',newline='').write('\r\n'.join(defs))
print(len(block))
