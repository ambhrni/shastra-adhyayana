# -*- coding: utf-8 -*-
"""Read a proofing .docx returned from Google Docs ('Suggesting' mode) or Word (Track Changes).
Usage: python3 -I diff_proofing_docx.py corrected.docx original_sidecar.json out_final.json
- Reconstructs ORIGINAL (rejecting all w:ins / w:del / rPrChange) and checks it equals the sidecar
  (proves there are no untracked edits).
- Reconstructs FINAL (accepting all) per sentence ID [N.M.sK], with **bold** and {^n} footnote marks.
- Prints every sentence whose text or bold changed; writes final.json {sentence_id: marked_text}.
Google Docs export uses w:ins / w:del for text and w:rPrChange for formatting (bold) suggestions."""
import sys, re, json, zipfile
from lxml import etree
W='http://schemas.openxmlformats.org/wordprocessingml/2006/main'
def q(n): return '{%s}%s'%(W,n)
docx, side, out = sys.argv[1:4]
root = etree.fromstring(zipfile.ZipFile(docx).read('word/document.xml'))
def isb(rpr):
    if rpr is None: return False
    b=rpr.find(q('b')); return b is not None and b.get(q('val')) not in ('0','false')
def issup(rpr):
    if rpr is None: return False
    v=rpr.find(q('vertAlign')); return v is not None and v.get(q('val'))=='superscript'
def paras(mode):
    res=[]
    for p in root.iter(q('p')):
        runs=[]
        for r in p.iter(q('r')):
            anc=[a.tag for a in r.iterancestors()]
            ins=q('ins') in anc; dele=q('del') in anc
            if mode=='orig' and ins: continue
            if mode=='final' and dele: continue
            txt=''.join((x.text or '') for x in r if x.tag in (q('t'),q('delText')))
            rpr=r.find(q('rPr')); ch=rpr.find(q('rPrChange')) if rpr is not None else None
            b = isb(ch.find(q('rPr'))) if (mode=='orig' and ch is not None) else isb(rpr)
            runs.append((txt,b,issup(rpr)))
        res.append(runs)
    return res
def mk(runs):
    s=''
    for txt,b,sup in runs:
        if sup: s+='{^'+txt+'}'; continue
        s+=('\0B'+txt+'\0E') if b else txt
    return s.replace('\0E\0B','').replace('\0B','**').replace('\0E','**')
def idmap(P):
    m={}
    for runs in P:
        s=mk(runs); g=re.match(r'\[(\d+\.\d+\.s\d+)\]\s?(.*)$',s)
        if g: m[g.group(1)]=g.group(2)
    return m
O,F=idmap(paras('orig')),idmap(paras('final'))
sc=json.load(open(side,encoding='utf-8'))
DEV='०१२३४५६७८९'
bad=0
for n,v in sc['verses'].items():
    for s in v['sentences']:
        sid=s['id'][1:-1]; exp=re.sub(r'\{\^(\d)\}',lambda m:'{^'+DEV[int(m.group(1))]+'}',s['text'])
        if sid not in O or O[sid].replace('**','')!=exp.replace('**',''):
            bad+=1; print('UNTRACKED/MISSING',sid)
print('untracked-edit check:', 'OK' if not bad else f'{bad} PROBLEMS')
chg=0
for sid in sorted(F,key=lambda x:[int(y) for y in re.findall(r'\d+',x)]):
    if F[sid]!=O.get(sid):
        chg+=1; print(sid,'\n  was:',O.get(sid),'\n  now:',F[sid])
print('changed sentences:',chg)
json.dump(F,open(out,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
