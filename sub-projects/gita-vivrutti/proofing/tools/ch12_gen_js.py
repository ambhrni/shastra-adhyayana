# -*- coding: utf-8 -*-
import re, json, sys
sys.path.insert(0,'.'); sys.path.insert(0,'../proof')
import tr as TR
exec(open('../proof/data.py',encoding='utf-8').read())   # V (mula)
final=json.load(open('/tmp/cx/final.json',encoding='utf-8'))
DEV='०१२३४५६७८९'
def dn(k): return ''.join(DEV[int(c)] for c in str(k))
SUP=lambda n:'<sup class="vr-foot-sup">%s</sup>'%n

def conv(t):
    t=re.sub(r'\*\*(.+?)\*\*', lambda m:'<b>'+m.group(1).strip()+'</b>'+(' ' if m.group(1).endswith(' ') else ''), t)
    t=re.sub(r'\{\^(.)\}', lambda m:SUP(m.group(1)), t)
    t=re.sub(r'</b>\s+<b>',' ',t)
    t=re.sub(r'\s{2,}',' ',t).strip()
    t=re.sub(r'\s+।$',' ।',t)
    return t
def q(s):
    if "'" in s: return '`'+s+'`'
    return "'"+s+"'"
def trq(s):
    s=re.sub(r'<FN\d>','',s)
    return '`'+s.replace('\\\'',"'")+'`'

out=[]
for n in range(6,21):
    sids=sorted([k for k in final if k.startswith('12.%d.s'%n)], key=lambda x:int(x.split('.s')[1]))
    sents=[]
    for sid in sids:
        k=sid.split('.')[2]
        sents.append((k,conv(final[sid])))
    colophon=None
    if n==20:
        colophon=sents.pop()   # s12
    # verse number at end of last sentence
    k,last=sents[-1]
    last=re.sub(r'\s*।$','',last)+' ॥%s॥'%dn(n)
    sents[-1]=(k,last)
    L=[]
    mula=V[n]['mula']
    for i,m in enumerate(mula):
        d=m
        if n==12: d=d.replace('{^1}','')   # sup placed below
        d=re.sub(r'\{\^\d\}',lambda mm:SUP(dn(mm.group(0)[2])),d)
        d=conv(d.replace('{^2}',SUP('२')) if False else d)
        L.append((d,TR.LINES[n][i][1]))
        assert re.sub(r'<[^>]+>','',TR.LINES[n][i][0]).replace(' ','')==re.sub(r'<[^>]+>','',d).replace(' ',''), (n,TR.LINES[n][i][0],d)
    o=[]
    o.append('      %d: {'%n)
    o.append('        lines:[')
    for i,(d,t) in enumerate(L):
        o.append('          { dev:%s,\n            tr:%s }%s'%(q(d),trq(t),',' if i<len(L)-1 else ''))
    o.append('        ],')
    o.append('        commentary:[')
    ents=[]
    for k,sk in sents:
        ents.append('          { skt:%s,\n            tr:%s }'%(q(sk),trq(TR.S['%d.%s'%(n,k)])))
    for num,sk,t in TR.FN.get(n,[]):
        ents.append('          { skt:%s,\n            tr:%s }'%(q(SUP(num)+' '+sk),trq(t)))
    if colophon:
        ents.append("          { skt:%s,\n            tr:%s }"%(q(conv(colophon[1])),trq(TR.S['20.s12'])))
    o.append(',\n'.join(ents))
    o.append('        ]')
    o.append('      }')
    out.append('\n'.join(o))
js=',\n'.join(out)
open('verses_6_20.js','w',encoding='utf-8').write(js)
print(len(js))
