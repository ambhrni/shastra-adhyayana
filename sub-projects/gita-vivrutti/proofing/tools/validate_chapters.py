import re,subprocess,sys,json
p=sys.argv[1]
s=open(p,encoding='utf-8').read()
def grab(name):
    i=s.index('const '+name); i=s.index('{',i); d=0
    for j in range(i,len(s)):
        if s[j]=='{': d+=1
        elif s[j]=='}':
            d-=1
            if d==0: return s[i:j+1]
open('defs.js','w').write('global.DEFS='+grab('DEFS')+';')
open('chap.js','w').write('global.CHAPTERS='+grab('CHAPTERS')+';')
js="""
global.T=function(k){ if(!(k in global.DEFS)) (global.MISSING=global.MISSING||new Set()).add(k); return '['+k+']'; };
eval(require('fs').readFileSync('defs.js','utf8'));
eval(require('fs').readFileSync('chap.js','utf8'));
const c=global.CHAPTERS[12]; const vs=Object.keys(c.verses).map(Number);
console.log('verses',vs.join(','));
let n=0,empty=0; for(const k of vs){const v=c.verses[k]; for(const e of v.commentary){n++; if(!e.skt||!e.tr) empty++;} if(!v.lines||v.lines.length!=2) console.log('lines?',k);}
console.log('commentary entries',n,'empty',empty,'missingDEFS',[...(global.MISSING||[])].join('|'));
"""
open('v.js','w').write(js)
print(subprocess.run(['node','v.js'],capture_output=True,text=True))
